/**
 * 数字转换成中文
 * TODO：
 * 配置参数
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

// 一些默认配置，可以被自定义配置覆盖
const OPTIONS = {
  integer: {
    largeNumber: false,
    onlyUseCommonUnit: false,
  },
  decimal: {
    allowLastZero: false,
    toFixed: undefined,
    format: 'round', // round四舍五入， floor向下舍入, ceil向上舍入
  },
  ch: {
    simplify: true, // 把首位壹拾简写成拾
  },
};

// 单位对照表
const NUMBER_UNIT_MAP = ['拾', '佰', '仟', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

// 阿拉伯汉字对照表
const NUM_MAP = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

// 反向四位分割字符串
const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

// 符号
const POINT = ['点'];

// 度量单位对照表
const MONEY_UINT_MAP = ['元整', '元', '角', '分'];

// 匹配首位零
const REG_FIRST_ZERO = new RegExp(`^${NUM_MAP[0]}`);

// 匹配末位零
const REG_LAST_ZERO = new RegExp(`${NUM_MAP[0]}$`);

// 匹配连续零
const REG_SEQUENCE_ZERO = new RegExp(`${NUM_MAP[0]}{2,}`, 'g');

// 匹配首位壹拾: 把壹拾简写成拾
const REG_FIRST_TEN = new RegExp(`${NUM_MAP[1]}${NUMBER_UNIT_MAP[0]}`, 'g');

/**
 * 基础工具
 * */
const utils = {
  isNull: (param) => {
    return ['', undefined, NaN, null].includes(param);
  },
};

/**
 * 分割为整数和小数两部分的数组
 * 处理异常，格式化数字，
 * */
const splitNumber = (num) => {
  if (utils.isNull(num)) return '';
  if (isNaN(num)) {
    console.error('转换的值不是数字！');
    return '';
  }
  return String(num).split('.');
};

/**
 * 整数部分从右每四位分割成一组
 * */
const splitIntegerGroup = (numStr) => {
  return numStr.replace(REG_SPLIT_LEN_R, '$1,').split(',');
};

/**
 * 获取单位
 * type = 0 获取四位整数的单位
 * type = 1 获取四位整数整体的单位
 * */
const getUnit = (index, startIndex = -1) => {
  const unit = NUMBER_UNIT_MAP[index + startIndex];
  return unit || '';
};

/**
 * 转成小数部分为汉字：逐字转换
 * */
const convertDecimal = (numStr) => {
  if (utils.isNull(numStr)) return '';
  const numArr = numStr.split('');

  numArr.map((arr, i) => {
    numArr[i] = NUM_MAP[arr];
  });

  return [POINT, ...numArr].join('');
};

/**
 * 转成小数部分为汉字:逐字转换
 * */
const convertDecimalMoney = (numStr) => {
  if (utils.isNull(numStr)) return MONEY_UINT_MAP[0];
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
    const numHz = NUM_MAP[arr];
    // 对照单位表：当前位为0，则不给单位
    const unit = arr > 0 ? getUnit(i) : '';
    // console.log('unit===>', arr, i, unit);
    sectionArr[i] = numHz + unit;
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
    const unit = i && !utils.isNull(str) ? getUnit(i - 1, 3) : '';
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
 * TODO:
 * 1、大数处理：科学计数转换/超过常规单位转换
 * */
const convertCn = (num) => {
  // 分割成整数和小数部分
  const numArr = splitNumber(num);
  // 转化小数部分
  const decimalPart = convertDecimal(numArr[1]);
  // 转化整数部分
  const integerPart = convertInteger(splitIntegerGroup(numArr[0]));

  return [integerPart, decimalPart].join('');
};

/**
 * 把数字转换成整数
 * TODO:
 * 1、大数处理：科学计数转换/超过常规单位转换
 * */
const convertMoney = (num) => {
  // 分割成整数和小数部分
  const numArr = splitNumber(num);
  // 转化小数部分
  const decimalPart = convertDecimalMoney(numArr[1]);
  // 转化整数部分
  const integerPart = convertInteger(splitIntegerGroup(numArr[0]));

  return [integerPart, decimalPart].join('');
};

module.exports = {
  convertCn,
  convertMoney,
};
