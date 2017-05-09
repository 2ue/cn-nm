//阿拉伯数字转换为中文 

// 如数值过大，建议以字符串的形式传入

;
//设置一些默认参数
var UNIT_ARRAY = ['千','百','十'];
var POINT = '点';
var NUM_ARRAY = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
var NUM_UNIT_ARRAY = ['万', '亿', '兆', '京', '垓', '秭', '穰', '沟', '涧', '正', '载', '极', '恒河沙', '阿僧祗', '那由他', '不可思议', '无量', '大数'];
//匹配连续重复字符
var REG_DEL_REPEAT = /(.)\1+/g;
//正向四位分割字符串
var REG_SPLIT_LEN = /(\d{4}(?=\d)(?!\d+\.|$))/g;
//反向四位分割字符串
var REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

//转换成汉字
//分割整数和小数部分
function dealNum(_NUM){
    if(!_NUM || isNaN(_NUM)) return [];
    return _NUM.split('.');
};

//每四位分割成一组
function splitNum(_NUM,_len,_type){
    if(!_NUM || isNaN(_NUM)) return [];
    return _NUM.replace(REG_SPLIT_LEN_R,'$1,').split(',');

};

//转化四位数为汉字，加上单位
function switchNum(_NUM,_index){
    // num 需要转换的数字
    //_isFirst 是否为首位
    
    var _isFirst = !!_index;
    //最终返回结果的数组
    var res = [];
    if(!_NUM) return '';
    //不足四位的补足四位，以便补零
    var num = _NUM.split('').reverse().concat([0,0,0,0]).splice(0,4).reverse();
    num.map(function(n,i){
        if(!n || n == 0){
            res.push((num[i+1] == 0 || !num[i+1] || _isFirst) ? '' : NUM_ARRAY[n]);
        }else{
            res.push(NUM_ARRAY[n] + (n > 0 && i < 3 ? UNIT_ARRAY[i] : ''));
        }
        
    });
    return res.join('').replace(REG_DEL_REPEAT,'$1');

};
//转换小数部分
function switchDecimal(_NUM){
    if(!_NUM) return;
    var res = [];
    var num = _NUM.split('');
    num.map(function(n,i){
        if(!n || n == 0){
            res.push((num[i+1] == 0 || !num[i+1]) ? '' : NUM_ARRAY[n]);
        }else{
            res.push(NUM_ARRAY[n]);
        }
        
    });
    return res.join('');
};

//拼接
function jionNum (_NUM) {
    var numArray = dealNum(_NUM);
    var num = splitNum(numArray[0]);
    var len = num.length;
    var reslt = '';
    num.map(function(n,i){
        var temp = switchNum(n,i == 0);
        if(!temp) temp = NUM_ARRAY[0];
        if(len - 1 == i || temp == NUM_ARRAY[0]){
            reslt += temp;
        }else{
            reslt += (temp + NUM_UNIT_ARRAY[len - i - 2]);
        }
    });

    return reslt.replace(REG_DEL_REPEAT,'$1') + (!numArray[1] ? '' : (POINT + switchDecimal(numArray[1])));
};

// console.log(jionNum('300000000056747740230023050789.889909000'));
//三十穰零五千六百七十四京七千七百四十兆二千三百亿二千三百零五万零七百八十九点八八九九零九

//转换成数字
//分割整数和小数部分
function dealHz(_HZ){
    if(!_HZ) return [];
    return _HZ.split(POINT);
};
//分割成组
function splitHz(_HZ){
    if(!_HZ) return [0];
    //去掉整数部分所有的'零'，然后分割
    _HZ = _HZ.replace(/零/g,'').split('');
    var res = [];
    var temp = '';
    var location = -10000;//设置一个超大数
    _HZ.map(function(n,i){
        var thisLocation = NUM_UNIT_ARRAY.indexOf(n);
        if(thisLocation >= 0){
            
            if(thisLocation - location < -1){
                for(let loc = 1; loc < location - thisLocation; loc ++){
                    res.push(NUM_ARRAY[0]);
                }  
            };
            res.push(temp);
            temp = '';
            location = thisLocation;
            
        }else{
            temp += n;
            if(i == _HZ.length - 1) res.push(temp);
        }
    });
    return res;
};

function switchHz(_HZ){
    if(!_HZ) return '';
    if(_HZ == NUM_ARRAY[0]) return '0000';
    _HZ = _HZ.split('');
    var res = 0;
    var temp = 0;
    _HZ.map(function(n,i){
        if(i % 2 == 0){
            temp = NUM_ARRAY.indexOf(n);
            if(i == _HZ.length - 1) res += temp;
        }else{
            var z = 3 - UNIT_ARRAY.indexOf(n);
            res += (temp * Math.pow(10,z));
        }
    });
    return res;

};
//转换小数部分
function switchDecimalHz(_HZ){
    if(!_HZ) return '';
    _HZ = _HZ.split('');
    var res = ['.'];
    _HZ.map(function(n){
        res.push(NUM_ARRAY.indexOf(n));
    });
    return res.join('');
};

function jionHz(_HZ){
    if(!_HZ || _HZ == NUM_ARRAY[0]) return 0;
    _HZ = dealHz(_HZ);
    var HZ_ARRY = splitHz(_HZ[0]);
    var decimalPart = switchDecimalHz(_HZ[1]);
    var res = '';
    HZ_ARRY.map(function(n){
        var temp = switchHz(n);
        res = res + '' + temp;
    });
    return res + decimalPart;
};
// console.log(jionHz('三十穰零五千六百七十四京七千七百四十兆二千三百亿二千三百零五万零七百八十九点八八九九零九'))
//期望：300000000056747740230023050789.889909
//实际：30000000005674774023002305789.889909

//向外提供接口
module.exports = {
    toHz: jionNum,
    toNum: jionHz
};