/**
 * 工具包
 */

// 阿拉伯汉字对照表
export const NUMBER_MAP = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
// 单位对照表
export const NUMBER_UNIT_MAP = ['仟', '佰', '拾'];
export const UNIT_MAP = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
// 符号
export const POINT = '点';
export const NEGATIVE = '负';

// 匹配连续重复字符
export const REG_DEL_REPEAT = /(.)\1+/g;
// 匹配首位零
export const REG_FIRST_ZERO = new RegExp(`^${NUMBER_MAP[0]}`);
// 匹配末位零
export const REG_LAST_ZERO = new RegExp(`${NUMBER_MAP[0]}$`);
// 反向四位分割字符串
export const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

/**
 * @export function 处理‘类空数据类型’
 * @param {*} param 需要判断的参数
 */
export function isNull(param) {
  return [undefined, '', NaN, null].includes(param);
}

/**
 * @export function 判断是否是'数字'
 * @param {*} param 需要判断的参数
 */
export function isNumberLike(param) {
  if (isNaN(Number(param))) {
    console.error('传入的参数不是数字!');
    // TODO这里应该throw
    return false;
  }
  return true;
}

/**
 * @export function 连续零变成一个零
 */
export function toOneZero(str) {
  return str.replace(REG_DEL_REPEAT, NUMBER_MAP[0]);
}

/**
 * @export function 清除首位零
 */
export function clearFirstZero(str) {
  return str.replace(REG_FIRST_ZERO, '');
}

/**
 * @export function 清除末位零
 */
export function clearLastZero(str) {
  return str.replace(REG_LAST_ZERO, '');
}

/**
 * @export function 4位反向分割数字，分割整数部分
 * @returns {Array}
 */
export function splitStringIn4Digt(str) {
  if (isNull(str)) return [];
  if (!isNumberLike(str)) return [];
  return str.replace(REG_SPLIT_LEN_R, '$1,').split(',');
}

/**
 * @export function 用指定值补全指定长度的str
 * @returns {Array}
*/
export function completionStringWithValue(str, len, value, options = {}) {
  const tempStr = Array(len).fill(value).join('');
  const newStr = `${tempStr}${str}`;
  return newStr.substr(newStr.length - len, len).split('');
}
