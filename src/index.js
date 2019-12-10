/**
 * 数字转换成中文
 * */

// 单位对照表
const NUMBER_UNIT_MAP = [
  ['仟', '佰', '拾'],
  ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'],
];

// 阿拉伯汉字对照表
const NUM_MAP = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];

// 反向四位分割字符串
const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

// 符号
const POINT = ['点'];

// 度量单位对照表
// const MONEY_UINT_MAP = ['元', '元整', '角', '分'];

// 首位零正则
const REG_FIRST_ZERO = new RegExp(`^${NUM_MAP[0]}`);

// 末位零正则
const REG_LAST_ZERO = new RegExp(`${NUM_MAP[0]}$`);

// 连续零
const REG_SEQUENCE_ZERO = new RegExp(`${NUM_MAP[0]}{2,}`, 'g');

// 基础工具
/**
 * 判断是否为空
 * */
const isNull = (param) => {
  return ['', undefined, NaN, null].includes(param);
};

/**
 * 处理异常，格式化数字，分割为整数和小数两部分的数组
 * */
const formatNum = (num) => {
  if (isNull(num)) return '';
  return String(num).split('.');
};


/**
 * 整数部分从右每四位分割成一组
 * */
const splitNumInteger = (numStr) => {
  return numStr.replace(REG_SPLIT_LEN_R, '$1,').split(',');
};

/**
 * 获取单位
 * */
const getUnit = (index, type = 0) => {
  const unit = NUMBER_UNIT_MAP[type][index];
  return unit || '';
};

/**
 * 转成小数部分为汉字
 * */
const conversionDecimal = (numStr) => {
  const numArr = numStr.split('');
  const len = numArr.length;
  for (let i = 0; i < len; i++) {
    numArr[i] = NUM_MAP[numArr[i]];
  }
  return [POINT, ...numArr];
};

const clearZero = (numStr = '') => {
  return numStr
    .replace(REG_SEQUENCE_ZERO, NUM_MAP[0])
    .replace(REG_FIRST_ZERO, '')
    .replace(REG_LAST_ZERO, '');
};

/**
 * 转化四位整数
 * 0001=>零一：可能会造成首位零
 * 0101=>零一百零一
 * 1001=>一千零一
 * 1000=>一千零：可能会造成末位零
 * */
const conversionSectionInteger = (numStr) => {
  const numArr = numStr.split('').reverse().concat([0, 0, 0, 0]).splice(0, 4)
    .reverse();
  console.log('numArr==>', numArr);
  const len = numArr.length;
  for (let i = 0; i < len; i++) {
    const num = numArr[i];
    // 对照阿拉伯数字表
    const numHz = NUM_MAP[numArr[i]];
    // 对照单位表：当前位为0则，不给单位
    const unit = num > 0 ? getUnit(i) : '';
    console.log('unit===>', num, i, unit);
    numArr[i] = numHz + unit;
  }
  return numArr
    .join('')
    .replace(REG_SEQUENCE_ZERO, NUM_MAP[0])
    .replace(REG_LAST_ZERO, '');
};

/**
 * 转化整数部分
 * 循环转换每一部分，从右开始，每四位为一部分
 * 去掉整个string的首位`零`
 * 多个相邻的`零`处理成一个`零`
 * */
const conversionInteger = (numArr) => {
  const len = numArr.length;
  const reverseNumArr = numArr.reverse();
  for (let i = 0; i < len; i++) {
    const str = conversionSectionInteger(reverseNumArr[i]);
    reverseNumArr[i] = str ? [str, getUnit(i - 1, 1)].join('') : '';
  }
  return clearZero(reverseNumArr.reverse().join(''));
};

const getHz = (num) => {
  // 分割成整数和小数部分
  const numArr = formatNum(num);
  // 从右按四位分割整数部分
  const numIntegerArr = splitNumInteger(numArr[0]);
  const decimalPart = isNull(numArr[1]) ? '' : conversionDecimal(numArr[1]);
  const integerPart = conversionInteger(numIntegerArr);

  return [integerPart, decimalPart].join('');
};

console.log(getHz(4000230021));
console.log(getHz('401010030021'));
