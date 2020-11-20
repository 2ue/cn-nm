/**
 * 工具包
 */

export function isNull(param) {
  return ['', undefined, NaN, null].includes(param);
}

export function isEmpty(param) {
  if (isNull(param)) return true;
  if (Array.isArray(param) && param.length === 0) return true;
  if (typeof param === 'object' && Object.keys(param).length === 0) return true;
  return false;
}
