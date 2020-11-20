'use strict';

require('core-js/modules/es.array.concat');
require('core-js/modules/es.array.join');
require('core-js/modules/es.array.map');
require('core-js/modules/es.array.reverse');
require('core-js/modules/es.array.splice');
require('core-js/modules/es.regexp.constructor');
require('core-js/modules/es.regexp.exec');
require('core-js/modules/es.regexp.to-string');
require('core-js/modules/es.string.replace');
require('core-js/modules/es.string.split');
require('core-js/modules/es.array.includes');
require('core-js/modules/es.array.is-array');
require('core-js/modules/es.object.keys');

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

var arrayLikeToArray = _arrayLikeToArray;

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}

var arrayWithoutHoles = _arrayWithoutHoles;

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

var iterableToArray = _iterableToArray;

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

var unsupportedIterableToArray = _unsupportedIterableToArray;

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var nonIterableSpread = _nonIterableSpread;

function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}

var toConsumableArray = _toConsumableArray;

// 单位对照表
var NUMBER_UNIT_MAP = ['拾', '佰', '仟', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数']; // 阿拉伯汉字对照表

var NUM_MAP = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']; // 符号

var POINT = ['点']; // 金额度量单位对照表

var MONEY_UINT_MAP = ['元整', '元', '角', '分'];

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
});

/**
 * 工具包
 */
function isNull(param) {
  return ['', undefined, NaN, null].includes(param);
}

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

var REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g; // 匹配首位零

var REG_FIRST_ZERO = new RegExp("^".concat(NUM_MAP[0])); // 匹配末位零

var REG_LAST_ZERO = new RegExp("".concat(NUM_MAP[0], "$")); // 匹配连续零

var REG_SEQUENCE_ZERO = new RegExp("".concat(NUM_MAP[0], "{2,}"), 'g'); // 匹配首位壹拾: 把壹拾简写成拾
// const REG_FIRST_TEN = new RegExp(`${NUM_MAP[1]}${NUMBER_UNIT_MAP[0]}`, 'g');

/**
 * 分割为整数和小数两部分的数组
 * 处理异常，格式化数字，
 * */

var splitNumber = function splitNumber(num) {
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


var splitInteger = function splitInteger(numStr) {
  return numStr.replace(REG_SPLIT_LEN_R, '$1,').split(',');
};
/**
 * 获取单位
 * */


var getUnit = function getUnit(index) {
  var startIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;
  var unit = NUMBER_UNIT_MAP[index + startIndex];
  return unit || '';
};
/**
 * 转成小数部分为汉字：逐字转换
 * */


var convertDecimalToCN = function convertDecimalToCN(numStr) {
  if (isNull(numStr)) return '';
  var numArr = numStr.split('');
  numArr.map(function (arr, i) {
    numArr[i] = NUM_MAP[arr];
  });
  return [POINT].concat(toConsumableArray(numArr)).join('');
};
/**
 * 转成小数部分为汉字:逐字转换
 * */


var convertDecimalToMoney = function convertDecimalToMoney(numStr) {
  if (isNull(numStr)) return MONEY_UINT_MAP[0];
  var numArr = numStr.substr(0, 2).split('');
  numArr.map(function (arr, i) {
    numArr[i] = "".concat(NUM_MAP[arr]).concat(MONEY_UINT_MAP[i + 2]);
  });
  return [MONEY_UINT_MAP[1]].concat(toConsumableArray(numArr)).join('');
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


var convertSection = function convertSection(numStr) {
  // 补全四位
  var sectionArr = [0, 0, 0, 0].concat(numStr.split('')).splice(-4).reverse();
  sectionArr.map(function (arr, i) {
    // 对照阿拉伯数字表
    var numCN = NUM_MAP[arr]; // 对照单位表：当前位为0，则不给单位

    var unit = arr > 0 ? getUnit(i) : ''; // console.log('unit===>', arr, i, unit);

    sectionArr[i] = numCN + unit;
  });
  return sectionArr.reverse().join('').replace(REG_SEQUENCE_ZERO, NUM_MAP[0]).replace(REG_LAST_ZERO, '');
};
/**
 * 转化整个整数部分
 * 循环转换每一部分，从右开始，每四位为一部分
 * 去掉整个string的首位`零`
 * 多个相邻的`零`处理成一个`零`
 * */


var convertInteger = function convertInteger(numArr) {
  var reverseNumArr = numArr.reverse();
  reverseNumArr.map(function (arr, i) {
    var str = convertSection(arr); // 倒数第一组不添加单位

    console.log('arr===>', arr, str);
    var unit = i && !isNull(str) ? getUnit(i - 1, 3) : '';
    reverseNumArr[i] = [str, unit].join('');
  });
  return reverseNumArr.reverse().join('').replace(REG_SEQUENCE_ZERO, NUM_MAP[0]).replace(REG_FIRST_ZERO, '').replace(REG_LAST_ZERO, '');
};
/* --------对外暴露方法-----------*/

/**
 * 把数字转换成整数
 * */


var convertCn = function convertCn(num) {
  // 分割成整数和小数部分
  var numArr = splitNumber(num); // 转化小数部分

  var decimalPart = convertDecimalToCN(numArr[1]); // 转化整数部分

  var integerPart = convertInteger(splitInteger(numArr[0]));
  return [integerPart, decimalPart].join('');
};
/**
 * 把数字转换成金额
 * TODO: 带上单位，圆角分整
 * */


var convertMoney = function convertMoney(num) {
  // 分割成整数和小数部分
  var numArr = splitNumber(num); // 转化小数部分

  var decimalPart = convertDecimalToMoney(numArr[1]); // 转化整数部分

  var integerPart = convertInteger(splitInteger(numArr[0]));
  return [integerPart, decimalPart].join('');
};

module.exports = {
  convertCn: convertCn,
  convertMoney: convertMoney
};
