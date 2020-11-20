/**
 * 数字转换成中文
 * 思路：
 * 0.处理数字
 *    1.异常判断(空，非数字等)
 *    2.超大/超小数处理=>转换成字符串
 *    3.负数处理
 * 1.分割数字：分割数字为整数，小数部分
 * 2.小数转换：小数部分逐字转换
 * 3.分割整数：整数部分，从个位开始按四位分割成若干段
 * 4.四位整数转换并整理：
 *    1.转换成【xx千xx百xx十xx】等，并遵循以下规则
 *    2.遇到【0】转换成【零】，不带单位
 *    3.遇到遇到【连续零】转换成【零】
 *    4.去掉【末位零】？
 * 5.四位整数加单位：
 *    1.给若干段四位数加上单位：形如【(xx千xx百xx十xx)亿】、【(xx千xx百xx十xx)万】等，并遵循以下规则
 *    2.遇【空】转换【零】
 *    3.非空正常加单位
 * 6.整理整数：
 *    1.去掉连续【零】
 *    2.去掉【首位零】
 *    3.去掉【末位零】
 * 7.拼接小数据和整数
 * TODO:
 * 1、大数处理：科学计数转换/超过常规单位转换
 * 2.配置参数
 * OPTIONS: {
 *     integer: {
 *       largeNumber: false, // 是否支持大数(在js的Number范围内)，科学计数法兼容等，会把科学技术法的数字转换成对应字符串
 *       onlyUseCommonUnit: false, // 为true，则只使用常见的单位，且截止到亿
 *     },
 *     decimal: {
 *        allowLastZero: false,
 *        toFixed: undefined,
 *        format: 'round' // round四舍五入， floor向下舍入, ceil向上舍入
 *     },
 *     ch: {
 *         simplify: true, // 把壹拾简写成拾
 *     }
 *
 * }
 * */

import {
  NUMBER_UNIT_MAP,
  NUM_MAP,
  POINT,
  MONEY_UINT_MAP,
} from './lang/zh-cn';
import { isNull } from './utils';

// 一些默认配置，可以被自定义配置覆盖
// const OPTIONS = {
//   integer: {
//     largeNumber: false,
//     onlyUseCommonUnit: false,
//   },
//   decimal: {
//     allowLastZero: false,
//     toFixed: undefined,
//     format: 'round', // round四舍五入， floor向下舍入, ceil向上舍入
//   },
//   ch: {
//     simplify: true, // 把首位壹拾简写成拾
//   },
// };

// 反向四位分割字符串
const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

// 匹配首位零
const REG_FIRST_ZERO = new RegExp(`^${NUM_MAP[0]}`);

// 匹配末位零
const REG_LAST_ZERO = new RegExp(`${NUM_MAP[0]}$`);

// 匹配连续零
const REG_SEQUENCE_ZERO = new RegExp(`${NUM_MAP[0]}{2,}`, 'g');

// 匹配首位壹拾: 把壹拾简写成拾
// const REG_FIRST_TEN = new RegExp(`${NUM_MAP[1]}${NUMBER_UNIT_MAP[0]}`, 'g');

/**
 * 分割为整数和小数两部分的数组
 * 处理异常，格式化数字，
 * */
const splitNumber = (num) => {
  if (isNull(num)) return '';
  if (isNaN(num)) {
    console.error('转换的值不是数字！');
    return '';
  }
  return String(num).split('.');
};

/**
 * 整数部分从右每四位分割成一组
 * */
const splitInteger = (numStr) => {
  return numStr.replace(REG_SPLIT_LEN_R, '$1,').split(',');
};

/**
 * 获取单位
 * */
const getUnit = (index, startIndex = -1) => {
  const unit = NUMBER_UNIT_MAP[index + startIndex];
  return unit || '';
};

/**
 * 转成小数部分为汉字：逐字转换
 * */
const convertDecimalToCN = (numStr) => {
  if (isNull(numStr)) return '';
  const numArr = numStr.split('');

  numArr.map((arr, i) => {
    numArr[i] = NUM_MAP[arr];
  });

  return [POINT, ...numArr].join('');
};

/**
 * 转成小数部分为汉字:逐字转换
 * */
const convertDecimalToMoney = (numStr) => {
  if (isNull(numStr)) return MONEY_UINT_MAP[0];
  const numArr = numStr.substr(0, 2).split('');

  numArr.map((arr, i) => {
    numArr[i] = `${NUM_MAP[arr]}${MONEY_UINT_MAP[i + 2]}`;
  });

  return [MONEY_UINT_MAP[1], ...numArr].join('');
};

/**
 * 把四位整数数字转化为汉字
 * 以下几种特殊情况：
 * 0001=>零一：可能会造成首位零
 * 0101=>零一百零一
 * 1001=>一千零一
 * 1000=>一千零：可能会造成末位零
 *
 * 去除连续零
 * 然后去掉末位零
 * */
const convertSection = (numStr) => {
  // 补全四位
  const sectionArr = [0, 0, 0, 0].concat(numStr.split('')).splice(-4).reverse();

  sectionArr.map((arr, i) => {
    // 对照阿拉伯数字表
    const numCN = NUM_MAP[arr];
    // 对照单位表：当前位为0，则不给单位
    const unit = arr > 0 ? getUnit(i) : '';
    // console.log('unit===>', arr, i, unit);
    sectionArr[i] = numCN + unit;
  });

  return sectionArr
    .reverse()
    .join('')
    .replace(REG_SEQUENCE_ZERO, NUM_MAP[0])
    .replace(REG_LAST_ZERO, '');
};

/**
 * 转化整个整数部分
 * 循环转换每一部分，从右开始，每四位为一部分
 * 去掉整个string的首位`零`
 * 多个相邻的`零`处理成一个`零`
 * */
const convertInteger = (numArr) => {
  const reverseNumArr = numArr.reverse();
  reverseNumArr.map((arr, i) => {
    const str = convertSection(arr);
    // 倒数第一组不添加单位
    console.log('arr===>', arr, str);
    const unit = i && !isNull(str) ? getUnit(i - 1, 3) : '';
    reverseNumArr[i] = [str, unit].join('');
  });

  return reverseNumArr
    .reverse()
    .join('')
    .replace(REG_SEQUENCE_ZERO, NUM_MAP[0])
    .replace(REG_FIRST_ZERO, '')
    .replace(REG_LAST_ZERO, '');
};

/* --------对外暴露方法-----------*/
/**
 * 把数字转换成整数
 * */
const convertCn = (num) => {
  // 分割成整数和小数部分
  const numArr = splitNumber(num);
  // 转化小数部分
  const decimalPart = convertDecimalToCN(numArr[1]);
  // 转化整数部分
  const integerPart = convertInteger(splitInteger(numArr[0]));

  return [integerPart, decimalPart].join('');
};

/**
 * 把数字转换成金额
 * TODO: 带上单位，圆角分整
 * */
const convertMoney = (num) => {
  // 分割成整数和小数部分
  const numArr = splitNumber(num);
  // 转化小数部分
  const decimalPart = convertDecimalToMoney(numArr[1]);
  // 转化整数部分
  const integerPart = convertInteger(splitInteger(numArr[0]));

  return [integerPart, decimalPart].join('');
};

module.exports = {
  convertCn,
  convertMoney,
};
