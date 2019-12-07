/**
 * 数字转换成中文
 * */


/**
 * 处理异常，格式化数字，分割为整数和小数两部分的数组
 * */
const formatNum = (num) => {
    // isNaN会识别''为false
    if (isNaN(num) || num === '') return '';
    return String(num).split('.');
};


/**
 * 整数部分每四位分割成一组
 * */
const formatNumInteger = (num) => {
    return
}