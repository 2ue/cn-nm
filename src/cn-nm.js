'use strict'
/**
 * @function: 阿拉伯数字与中文互相转换
 * 如数值过大，建议以字符串的形式传入
 * */
;
//设置一些默认参数
var UNIT_ARRAY = ['仟','佰','拾'];
var POINT = '点';
var NUM_ARRAY = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
var NUM_UNIT_ARRAY = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];

//转换成汉字

/**
* 格式化数字，方便后续处理
* */
function formatNum(_NUM) {
    // 过滤掉不是数字的字符，特殊处理0
    if (_NUM === 0) return '0'
    if (!_NUM || isNaN(_NUM)) return ''
    // 负数返回空
    if (Number(_NUM) < 0) return ''
    // 处理Infinity
    if (!isFinite(_NUM)) return ''
    // 把类1.0，1.00格式的数字处理成1
    if (+_NUM === parseInt(_NUM)) return String(parseInt(_NUM))
    return String(_NUM)
}

//分割整数和小数部分
function dealNum(_NUM){
    var originalNum = _NUM; // 保存原始输入
    _NUM = formatNum(_NUM)
    if (!_NUM) return ['', '']
    var parts = _NUM.split('.');
    // 对于0.5这样的小数，整数部分应该是'0' 
    if (!parts[0] && parts[1]) {
        parts[0] = '0';
    }
    return parts;
}

//每四位分割成一组
function splitNum(_NUM){
    if(!_NUM || isNaN(_NUM)) return [];
    // 使用正则表达式进行四位分割
    var REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;
    return _NUM.replace(REG_SPLIT_LEN_R,'$1,').split(',');
}

//转化四位数为汉字，加上单位
function switchNum(_NUM, _isFirst, _isLast){
    if(!_NUM) return '';
    if(_NUM === '0000' || _NUM === '0') return NUM_ARRAY[0];
    
    var res = [];
    // 补足四位，左侧填充0
    var num = ('0000' + _NUM).slice(-4).split('').map(n => parseInt(n));
    // 只有在非第一段且原始长度不足4位且有前导0时才需要特殊处理
    var needLeadingZero = !_isFirst && _NUM.length < 4 && _NUM.charAt(0) === '0';
    
    for(var i = 0; i < 4; i++){
        var digit = num[i];
        
        if(digit === 0) {
            // 需要加零的条件：后面有非零数字，且前面有非零数字
            var hasNonZeroAfter = false;
            for(var j = i + 1; j < 4; j++) {
                if(num[j] !== 0) {
                    hasNonZeroAfter = true;
                    break;
                }
            }
            
            var hasNonZeroBefore = false;
            for(var k = 0; k < i; k++) {
                if(num[k] !== 0) {
                    hasNonZeroBefore = true;
                    break;
                }
            }
            
            // 特殊处理：如果是跨段的前导零（如10001中的0001），需要在开头加零
            if(hasNonZeroAfter && (hasNonZeroBefore || (i === 0 && needLeadingZero))) {
                if(res.length === 0 || res[res.length - 1] !== NUM_ARRAY[0]) {
                    res.push(NUM_ARRAY[0]);
                }
            }
        } else {
            res.push(NUM_ARRAY[digit] + (i < 3 ? UNIT_ARRAY[i] : ''));
        }
    }
    
    return res.join('');
}

//转换小数部分
function switchDecimal(_NUM){
    if(!_NUM) return '';
    var res = [];
    var num = _NUM.split('');
    for(var i = 0; i < num.length; i++){
        var digit = num[i];
        if(digit === '0') {
            // 小数部分的零直接转换
            res.push(NUM_ARRAY[0]);
        } else {
            res.push(NUM_ARRAY[parseInt(digit)]);
        }
    }
    return res.join('');
}

//拼接
function joinNum (_NUM) {
    var numArray = dealNum(_NUM);
    if(!numArray[0] && !numArray[1]) return '';
    
    // 特殊处理0
    if(numArray[0] === '0' && !numArray[1]) return NUM_ARRAY[0];
    if(numArray[0] === '0' && numArray[1]) return NUM_ARRAY[0] + POINT + switchDecimal(numArray[1]); // 0.5 -> 零点伍
    
    var num = splitNum(numArray[0]);
    var len = num.length;
    var reslt = '';
    
    num.map(function(n, i){
        var temp = switchNum(n, i === 0, i === len - 1);
        if(!temp && i === len - 1) return; // 最后一个空的不处理
        
        // 检查是否需要跨段零
        var needCrossZero = false;
        if(i < len - 1 && n && temp && temp !== NUM_ARRAY[0]) {
            var currentValue = parseInt(n);
            // 当后面一段的值小于1000时，需要加零
            if(currentValue < 1000 && i > 0) {
                needCrossZero = true;
            }
        }
        
        if(i < len - 1 && temp && temp !== NUM_ARRAY[0]) {
            // 添加单位
            if(needCrossZero && !temp.startsWith(NUM_ARRAY[0])) {
                reslt += NUM_ARRAY[0] + temp + NUM_UNIT_ARRAY[len - i - 2];
            } else {
                reslt += temp + NUM_UNIT_ARRAY[len - i - 2];
            }
        } else {
            // 最后一段，检查是否需要加前导零
            if(i === len - 1 && len > 1 && parseInt(n) < 1000 && reslt && !temp.startsWith(NUM_ARRAY[0])) {
                reslt += NUM_ARRAY[0] + temp;
            } else {
                reslt += temp;
            }
        }
    });
    
    // 清理重复的零
    reslt = reslt.replace(/零+/g, '零');
    // 清理末尾的零
    reslt = reslt.replace(/零$/, '');
    
    // 添加小数部分
    if(numArray[1]) {
        reslt += POINT + switchDecimal(numArray[1]);
    }
    
    return reslt;
}

//转换成数字

//分割整数和小数部分
function dealHz(_HZ){
    if(!_HZ || typeof _HZ !== 'string') return ['', ''];
    return _HZ.split(POINT);
}

//处理中文数字转阿拉伯数字
function parseChineseNumber(_HZ) {
    if(!_HZ || typeof _HZ !== 'string') return 0;
    if(_HZ === NUM_ARRAY[0]) return 0; // "零"
    
    // 检查是否包含无效字符
    var validChars = NUM_ARRAY.concat(UNIT_ARRAY).concat(NUM_UNIT_ARRAY);
    for(var i = 0; i < _HZ.length; i++) {
        if(validChars.indexOf(_HZ[i]) === -1) {
            return 0; // 包含无效字符返回0
        }
    }
    
    // 检查单独的单位字符
    if(UNIT_ARRAY.indexOf(_HZ) >= 0 || NUM_UNIT_ARRAY.indexOf(_HZ) >= 0) {
        return 0;
    }
    
    // 新增：检查无效格式
    // 1. 零开头后面跟数字+单位的情况（如"零壹万"）
    if(_HZ.indexOf('零') === 0 && _HZ.length > 1) {
        var afterZero = _HZ.substring(1);
        // 如果零后面直接跟着数字+大单位，这是无效格式
        for(var j = 0; j < NUM_UNIT_ARRAY.length; j++) {
            if(afterZero.indexOf(NUM_UNIT_ARRAY[j]) >= 0) {
                return 0;
            }
        }
    }
    
    // 2. 检查单位前是否缺少数字（如"万零壹"、"拾万壹"）
    for(var k = 0; k < NUM_UNIT_ARRAY.length; k++) {
        var unit = NUM_UNIT_ARRAY[k];
        var unitPos = _HZ.indexOf(unit);
        if(unitPos === 0) { // 单位在开头
            return 0;
        }
    }
    
    // 2.5 检查小单位在开头的情况（如"拾万壹"）
    for(var m = 0; m < UNIT_ARRAY.length; m++) {
        var smallUnit = UNIT_ARRAY[m];
        if(_HZ.indexOf(smallUnit) === 0) { // 小单位在开头且后面跟大单位
            for(var n = 0; n < NUM_UNIT_ARRAY.length; n++) {
                if(_HZ.indexOf(NUM_UNIT_ARRAY[n]) > 0) {
                    return 0; // 如"拾万壹"
                }
            }
        }
    }
    
    // 3. 检查单位顺序错误（如"壹万拾"、"壹亿万"）
    var hasWan = _HZ.indexOf('万') >= 0;
    var hasYi = _HZ.indexOf('亿') >= 0;
    
    if(hasYi && hasWan) {
        var wanPos = _HZ.indexOf('万');
        var yiPos = _HZ.indexOf('亿');
        if(wanPos > yiPos) { // 万在亿之后是正确的，但需要检查亿万之间有无数字
            var betweenYiWan = _HZ.substring(yiPos + 1, wanPos);
            // 如果亿和万之间没有任何数字字符，这是错误的（如"壹亿万"）
            var hasNumberBetween = false;
            for(var p = 1; p < NUM_ARRAY.length; p++) { // 跳过零
                if(betweenYiWan.indexOf(NUM_ARRAY[p]) >= 0) {
                    hasNumberBetween = true;
                    break;
                }
            }
            if(!hasNumberBetween) {
                return 0; // "壹亿万" 这样的格式无效
            }
        } else if(wanPos < yiPos) {
            return 0; // 万在亿之前是错误的
        }
    }
    
    // 4. 检查小单位在大单位后面（如"壹万拾"）
    if(hasWan) {
        var wanPos = _HZ.indexOf('万');
        var afterWan = _HZ.substring(wanPos + 1);
        // 如果万后面直接跟小单位且没有数字，这是无效的
        for(var m = 0; m < UNIT_ARRAY.length; m++) {
            if(afterWan === UNIT_ARRAY[m]) {
                return 0; // 如"壹万拾"
            }
        }
    }
    
    var result = 0;
    var temp = 0;
    var billion = 0;
    var million = 0;
    
    // 处理亿
    if(_HZ.indexOf('亿') >= 0) {
        var parts = _HZ.split('亿');
        if(parts[0]) {
            billion = parseSmallNumber(parts[0]) * 100000000;
        }
        _HZ = parts[1] || '';
    }
    
    // 处理万
    if(_HZ.indexOf('万') >= 0) {
        var parts = _HZ.split('万');
        if(parts[0]) {
            million = parseSmallNumber(parts[0]) * 10000;
        }
        _HZ = parts[1] || '';
    }
    
    // 处理剩余部分（千以下）
    if(_HZ) {
        temp = parseSmallNumber(_HZ);
    }
    
    return billion + million + temp;
}

// 解析千以下的中文数字
function parseSmallNumber(_HZ) {
    if(!_HZ) return 0;
    if(_HZ === NUM_ARRAY[0]) return 0;
    
    var result = 0;
    var temp = 0;
    
    for(var i = 0; i < _HZ.length; i++) {
        var char = _HZ[i];
        var numIndex = NUM_ARRAY.indexOf(char);
        var unitIndex = UNIT_ARRAY.indexOf(char);
        
        if(numIndex > 0) {
            // 是数字（跳过零）
            temp = numIndex;
        } else if(unitIndex >= 0) {
            // 是单位
            var unitValue = Math.pow(10, 3 - unitIndex);
            if(temp === 0) temp = 1; // 处理"拾"、"佰"等前面没有数字的情况
            result += temp * unitValue;
            temp = 0;
        }
    }
    
    result += temp; // 加上个位数
    return result;
}

//转换小数部分
function switchDecimalHz(_HZ){
    if(!_HZ) return '';
    var result = '.';
    for(var i = 0; i < _HZ.length; i++) {
        var char = _HZ[i];
        var numIndex = NUM_ARRAY.indexOf(char);
        if(numIndex >= 0) {
            result += numIndex;
        }
    }
    return result === '.' ? '' : result;
}

function joinHz(_HZ){
    if(!_HZ || typeof _HZ !== 'string') return 0;
    if(_HZ === NUM_ARRAY[0]) return 0; // "零"
    
    var parts = dealHz(_HZ);
    
    // 检查小数格式的有效性
    if(parts.length > 1) {
        // 1. 检查是否有多个点（如"壹点点贰"）
        if(_HZ.split(POINT).length > 2) {
            return 0;
        }
        
        // 2. 检查"壹点"这样缺少小数部分的情况
        if(parts[1] === '') {
            return 0;
        }
    }
    
    var integerPart = parseChineseNumber(parts[0]);
    var decimalPart = switchDecimalHz(parts[1]);
    
    if(decimalPart) {
        return parseFloat(integerPart + decimalPart);
    }
    
    return integerPart;
}

export const toCn = joinNum;
export const toNm = joinHz;