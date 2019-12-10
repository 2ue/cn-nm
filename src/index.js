/**
 * 数字转换成中文
 * */

// 单位对照表
const NUMBER_UNIT_MAP = ['拾', '佰', '仟', '万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

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
const utils = {
  isNull: (param) => {
    return ['', undefined, NaN, null].includes(param);
  },
  forMap: (arr, cb) => {
    if (Array.map) {
      arr.map(cb);
    } else {
      const len = arr.length;
      for (let i = 0; i < len; i++) {
        cb(arr[i], i);
      }
    }
  },
};

/**
 * 处理异常，格式化数字，分割为整数和小数两部分的数组
 * */
const formatNum = (num) => {
  if (utils.isNull(num)) return '';
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
 * type = 0 获取四位整数的单位
 * type = 1 获取四位整数整体的单位
 * */
const getUnit = (index, startIndex = -1) => {
  const unit = NUMBER_UNIT_MAP[index + startIndex];
  return unit || '';
};

/**
 * 转成小数部分为汉字
 * 逐字转换
 * */
const convertDecimal = (numStr) => {
  const numArr = numStr.split('');
  // TODO：是否去除末位零？做成可配置？

  utils.forMap(numArr, (arr, i) => {
    numArr[i] = NUM_MAP[arr];
  });

  return [POINT, ...numArr].join('');
};

/**
 * 转化四位整数为汉字
 * 0001=>零一：可能会造成首位零
 * 0101=>零一百零一
 * 1001=>一千零一
 * 1000=>一千零：可能会造成末位零
 * */
const convertSection = (numStr) => {
  // 补全四位
  const sectionArr = [0, 0, 0, 0].concat(numStr.split('')).splice(-4).reverse();

  utils.forMap(sectionArr, (arr, i) => {
    // 对照阿拉伯数字表
    const numHz = NUM_MAP[arr];
    // 对照单位表：当前位为0，则不给单位
    const unit = arr > 0 ? getUnit(i) : '';
    console.log('unit===>', arr, i, unit);
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
  utils.forMap(reverseNumArr, (arr, i) => {
    const str = convertSection(arr);
    reverseNumArr[i] = str ? [str, getUnit(i - 1, 3)].join('') : '';
  });

  return reverseNumArr
    .reverse()
    .join('')
    .replace(REG_SEQUENCE_ZERO, NUM_MAP[0])
    .replace(REG_FIRST_ZERO, '')
    .replace(REG_LAST_ZERO, '');
};

/**
 * 把数字转换成整数
 * TODO:
 * 1、大数处理：科学计数转换/超过常规单位转换
 * */
const convertCn = (num) => {
  // 分割成整数和小数部分
  const numArr = formatNum(num);
  // 转化小数部分
  const decimalPart = utils.isNull(numArr[1]) ? '' : convertDecimal(numArr[1]);
  // 转化整数部分
  const integerPart = convertInteger(splitNumInteger(numArr[0]));

  return [integerPart, decimalPart].join('');
};
