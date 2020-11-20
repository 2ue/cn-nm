/* eslint-disable */
/**
 * @function: 阿拉伯数字与中文互相转换
 * 如数值过大，建议以字符串的形式传入
 * */
import {
  UNIT_ARRAY,
  POINT,
  NUM_ARRAY,
  NUM_UNIT_ARRAY,
  MONEY_UINT_1,
  MONEY_UINT_2,
} from './lang/zh-cn';

// 匹配连续重复字符
const REG_DEL_REPEAT = /(.)\1+/g;
// 匹配首位零
const REG_FIRST_ZERO = new RegExp(`^${NUM_ARRAY[0]}`);
// 匹配末位零
const REG_LAST_ZERO = new RegExp(`${NUM_ARRAY[0]}$`);
// 正向四位分割字符串
// var REG_SPLIT_LEN = /(\d{4}(?=\d)(?!\d+\.|$))/g;
// 反向四位分割字符串
const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;

// 转换成汉字

/**
 * 格式化数字，方便后续处理
 * */
function formatNum(_NUM) {
  // 过滤掉不是数字的字符
  if (!_NUM || isNaN(_NUM)) return '';
  // 把类1.0，1.00格式的数字处理成1
  // 统一转成字符串
  if (+_NUM === parseInt(_NUM)) return String(parseInt(_NUM));
  return String(_NUM);
}

// 分割整数和小数部分
function dealNum(_NUM) {
  _NUM = formatNum(_NUM);
  return _NUM.split('.');
}

// 每四位分割成一组
function splitNum(_NUM) {
  if (!_NUM || isNaN(_NUM)) return [];
  return _NUM.replace(REG_SPLIT_LEN_R, '$1,').split(',');
}

// 转化四位数为汉字，加上单位
function switchNum(_NUM, _index) {
  // num 需要转换的数字
  // _isFirst 是否为首位
  const _isFirst = !!_index;
  // 最终返回结果的数组
  const res = [];
  if (!_NUM) return '';
  // 不足四位的补足四位，以便补零
  const num = _NUM.split('').reverse().concat([0, 0, 0, 0]).splice(0, 4)
    .reverse();
  // console.log('switchNum==>', num);
  num.map((n, i) => {
    // console.log(`nnn==>${n}`, `iii==>${i}`)
    if (!n || n == 0) {
      const aaa = (num[i + 1] == 0 || !num[i + 1] || (_isFirst && res.length === 0)) ? '' : NUM_ARRAY[n];
      console.log(`nnn==>${n}`, `iii==>${i}`, `aaa==>${aaa}`, num[i + 1]);
      res.push(aaa);
    } else {
      res.push(NUM_ARRAY[n] + (n > 0 && i < 3 ? UNIT_ARRAY[i] : ''));
    }
  });
  // console.log('xxxxxxxxxxxxxxxx===>', res);
  return res.join('').replace(REG_DEL_REPEAT, '$1');
}
// 转化所有整数部分为汉字
function switchAllNum(_NUM) {
  const num = splitNum(_NUM);
  const len = num.length;
  let result = '';
  num.map((n, i) => {
    let temp = switchNum(n, i == 0);
    // console.log('temp', n, temp);
    if (!temp && num.length - 1 !== 1) temp = NUM_ARRAY[0];
    if (len - 1 == i || temp == NUM_ARRAY[0]) {
      result += temp;
    } else {
      result += (temp + NUM_UNIT_ARRAY[len - i - 2]);
    }
    // console.log('xxx===>temp', temp);
  });
  // console.log('result ==>', result);
  result = result.replace(REG_DEL_REPEAT, '$1').replace(REG_FIRST_ZERO, '').replace(REG_LAST_ZERO, '');
  return result;
}

// 转换小数部分
function switchDecimal(_NUM) {
  if (!_NUM) return '';
  const res = [];
  const num = _NUM.split('');
  num.map((n, i) => {
    if (!n || n == 0) {
      res.push((num[i + 1] == 0 || !num[i + 1]) ? '' : NUM_ARRAY[n]);
    } else {
      res.push(NUM_ARRAY[n]);
    }
  });
  return res.join('');
}

// 小数位转换成圆角分
function switchDecimalToMoney(_NUM) {
  const num = switchDecimal(_NUM).split('');
  const res = [];
  MONEY_UINT_2.map((unit, i) => {
    if (unit && num[i] && NUM_ARRAY.indexOf(num[i]) > 0) res.push(num[i] + unit);
  });
  return res.join('');
}

// 拼接
function joinNum(_NUM) {
  const numArray = dealNum(_NUM);
  // console.log('numArray===>',numArray);
  const result = switchAllNum(numArray[0]) + (!numArray[1] ? '' : (POINT + switchDecimal(numArray[1])));
  // result = result.replace(new RegExp(`${NUM_ARRAY[1]}${UNIT_ARRAY[2]}`, 'g'), UNIT_ARRAY[2])
  // .replace(new RegExp(`${UNIT_ARRAY[2]}`, 'g'), UNIT_ARRAY_OlD[0])
  return result;
}

// 两位数money
function joinMoney(_NUM) {
  const numArray = dealNum(_NUM);
  const integerPart = switchAllNum(numArray[0]);
  const decimalPart = switchDecimalToMoney(numArray[1]);
  const result = decimalPart ? integerPart + MONEY_UINT_1[0] + decimalPart : integerPart + MONEY_UINT_1[1];
  // result = result.replace(new RegExp(`${NUM_ARRAY[1]}${UNIT_ARRAY[2]}`, 'g'), UNIT_ARRAY[2])
  // .replace(new RegExp(`${UNIT_ARRAY[2]}`, 'g'), UNIT_ARRAY_OlD[0])
  return result;
}

// 转换成数字
// 分割整数和小数部分
function dealHz(_HZ) {
  if (!_HZ) return [];
  return _HZ.split(POINT);
}
// 分割成组
function splitHz(_HZ) {
  if (!_HZ) return [0];
  // 去掉整数部分所有的'零'，然后分割
  _HZ = _HZ.replace(/零/g, '').split('');
  const res = [];
  let temp = '';
  let location = -10000; // 设置一个超大数
  _HZ.map((n, i) => {
    const thisLocation = NUM_UNIT_ARRAY.indexOf(n);
    if (thisLocation >= 0) {
      if (thisLocation - location < -1) {
        for (let loc = 1; loc < location - thisLocation; loc++) {
          res.push(NUM_ARRAY[0]);
        }
      }
      res.push(temp);
      temp = '';
      location = thisLocation;
    } else {
      temp += n;
      if (i == _HZ.length - 1) res.push(temp);
    }
  });
  return res;
}

function switchHz(_HZ) {
  if (!_HZ) return '';
  if (_HZ == NUM_ARRAY[0]) return '0000';
  _HZ = _HZ.split('');
  let res = 0;
  let temp = 0;
  _HZ.map((n, i) => {
    if (i % 2 === 0) {
      temp = NUM_ARRAY.indexOf(n);
      if (i === _HZ.length - 1) res += temp;
    } else {
      const z = 3 - UNIT_ARRAY.indexOf(n);
      res += (temp * Math.pow(10, z));
    }
  });
  return res;
}
// 转换小数部分
function switchDecimalHz(_HZ) {
  if (!_HZ) return '';
  _HZ = _HZ.split('');
  if (_HZ.length === 0) return '';
  const res = ['.'];
  _HZ.map((n) => {
    res.push(NUM_ARRAY.indexOf(n));
  });
  return res.join('');
}

function joinHz(_HZ) {
  if (!_HZ || _HZ == NUM_ARRAY[0]) return 0;
  _HZ = dealHz(_HZ);
  const HZ_ARRAY = splitHz(_HZ[0]);
  const decimalPart = switchDecimalHz(_HZ[1]);
  let res = '';
  HZ_ARRAY.map((n) => {
    const temp = switchHz(n);
    res = `${res}${temp}`;
  });
  return res + decimalPart;
}

console.log('cnm==>', joinNum(100050000));

console.log('cnm==>', joinNum(100500000));

console.log('cnm==>', joinNum(105000000));

console.log('cnm==>', joinNum(150050000));

console.log('cnm==>', joinNum(150050050));

console.log('cnm==>', joinNum(105050005));

console.log('cnm==>', joinNum(1050000));

// 向外提供接口
export default {
  toCn: joinNum,
  toMoney: joinMoney,
  toNm: joinHz,
};
