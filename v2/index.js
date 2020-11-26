/**
 * 数字转换成中文
 * 思路：
 * 0.处理数字
 *    1.异常判断(空，非数字等)
 *    2.超大/超小数处理=>转换成字符串
 *    3.科学计数处理
 *    4.统一转换成字符串
 * 1.分割数字：分割数字为整数，小数部分，符号(正/负)
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
* */

// 阿拉伯汉字对照表
const NUMBER_MAP = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
// 单位对照表
const NUMBER_UNIT_MAP = ['仟', '佰', '拾'];
const UNIT_MAP = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
// 符号
const POINT = '点';
const NEGATIVE = '负';


// 匹配连续重复字符
const REG_DEL_REPEAT = /(.)\1+/g;
// 匹配首位零
const REG_FIRST_ZERO = new RegExp(`^${NUMBER_MAP[0]}`);
// 匹配末位零
const REG_LAST_ZERO = new RegExp(`${NUMBER_MAP[0]}$`);
// 反向四位分割字符串
const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

/**
 * @function 处理‘类空数据类型’
 * @param {*} param 需要判断的参数
 */
function isNull(param) {
  return [undefined, '', NaN, null].includes(param);
}

/**
 * @function 判断是否是'数字'
 * @param {*} param 需要判断的参数
 */
function isNumberLike(param) {
  if (isNaN(Number(param))) {
    console.error('传入的参数不是数字!');
    // TODO这里应该throw
    return false;
  }
  return true;
}

/**
 * @function 连续零变成一个零
 */
function toOneZero(str) {
  return str.replace(REG_DEL_REPEAT, NUMBER_MAP[0]);
}

/**
 * @function 清除首位零
 */
function clearFirstZero(str) {
  return str.replace(REG_FIRST_ZERO, '');
}

/**
 * @function 清除末位零
 */
function clearLastZero(str) {
  return str.replace(REG_LAST_ZERO, '');
}

/**
 * @function 格式化数字为字符串，方便处理:
 * 1.异常数字返回空字符串
 * TODO:
 * 2.超大超小数处理
 * 3.科学计数处理
 * @param {Number|String} num 需要判断的数字
 * @returns String
 */
function formatNumber(num) {
  if (isNumberLike(num)) {
    return String(num);
  }
  return '';
}

/**
 * @function 分割数字字符: 整数部分，小数部分，符号
 * @param {String} str 需要分割的数字(字符串)
 * @returns {Object} {整数部分，小数部分，符号}
 */
function splitNumber(str) {
  const arr = str.replace('-', '').split('.');
  return {
    isNegative: str < 0,
    isDecimal: !isNull(arr[1]),
    integer: arr[0],
    decimal: arr[1],
  };
}

/**
 * @function 小数转换
 * @param {String} str 小数部分
 * @returns {String} 转换好的汉字
 */
function convertDecimalToCN(str) {
  if (isNull(str)) return '';
  return str.replace(/\d/g, s => NUMBER_MAP[s]);
}

/**
 * @function 4位反向分割数字，分割整数部分
 * @returns {Array}
 */
function splitIntegerIn4Digt(str) {
  if (isNull(str)) return [];
  if (!isNumberLike(str)) return [];
  return str.replace(REG_SPLIT_LEN_R, '$1,').split(',');
}

/**
 * @function 用0从首位补全，直到4位数
 * @returns {Array}
*/
function completion4DigtNumber(str) {
  const newStr = `0000${str}`;
  return newStr.substr(newStr.length - 4, 4).split('');
}

/**
 * @function 转换四位数为汉字：几千几百几十几
 * @param {Array} 分割好的数组
 * @returns {String}
 */
function convert4DigtToCN(arr) {
  const arrCN = arr.map((num, i) => {
    if (num === '0') return NUMBER_MAP[0];
    return `${NUMBER_MAP[num]}${NUMBER_UNIT_MAP[i] || ''}`;
  });
  return toOneZero(arrCN.join(''));
}

/**
 * @function 连接四位数单元
 */
function join4DigtNumberUnit(str, i) {
  if (str === NUMBER_MAP[0] || i === 0) return str;
  return `${str}${UNIT_MAP[i - 1]}`;
}

/**
 * @function 拼接整数部分
 */
function join4DigtToIntegerCN(str) {
  const arr = splitIntegerIn4Digt(str);
  const integerStr = arr.reverse().map((n, i) => {
    const numberCN = convert4DigtToCN(completion4DigtNumber(n));
    return join4DigtNumberUnit(numberCN, i);
  }).reverse().join('');
  return clearFirstZero(clearLastZero(toOneZero(integerStr)));
}

/**
 * @function 转换最终结果
 * @returns {Object} 以对象形式返回
 * {
 *  sign（正负号）: 正数为空，负数返回’负‘
 *  point（小数点）: 整数为空，小数返回'点'
 *  integer（整数部分）: 为空或者0返回'零'
 *  decimal（小数部分）: 为空返回’‘
 * }
 */
function toCN(param) {
  const str = formatNumber(param);
  const obj = splitNumber(str);
  // 正负号
  const sign = obj.isNegative ? NEGATIVE : '';
  // 小数点
  const point = obj.isDecimal ? POINT : '';
  // 小数部分
  const decimal = convertDecimalToCN(obj.decimal);
  // 整数部分, 对于0或者空返回’零‘
  const integer = join4DigtToIntegerCN(obj.integer) || NUMBER_MAP[0];
  return {
    sign,
    point,
    integer,
    decimal,
  };
}

// console.log(toCN(0.1234));
// console.log(toCN(0));
// console.log(toCN(67851234.55));
// console.log(toCN(7851234.55));
// console.log(toCN(-7851234.5504));
