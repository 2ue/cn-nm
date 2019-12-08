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
const MONEY_UINT_MAP = ['元', '元整', '角', '分'];

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
const getUnit = (index, startIndex = -1) => {
    const i = index + startIndex;
    if (i < 0) return '';
    return NUMBER_UNIT_MAP[i];
}

/**
 * 转成小数部分为汉字
 * */
const conversionDecimal = (numStr) => {
    const numArr = numStr.split('');
    const len = numArr.length;
    for(let i = 0; i < len; i++) {
        numArr[i] = NUM_MAP[numArr[i]];
    }
    return numArr
};

/**
 * 转化四位整数
 * 0001=>零一：可能会造成首位零
 * 0101=>零一百零一
 * 1001=>一千零一
 * 1000=>一千零：可能会造成末位零
 * */
const conversionSectionInteger = (numStr) => {
    const numArr = numStr.split('').reverse().concat([0, 0, 0, 0]).splice(0, 4);
    const len = numArr.length;
    for(let i = 0; i < len; i++) {
        const num = numStr[i];
        numArr[i] = `${NUM_MAP[numArr[i]]}${getUnit(i)}`;
    }
};

/**
 * 转化整数部分
 *
 * 去掉整个string的首位`零`
 * 多个相邻的`零`处理成一个`零`
 * */
const conversionInteger = (numArr) => {

};