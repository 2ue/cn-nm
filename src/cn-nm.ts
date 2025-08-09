/**
 * @fileoverview 阿拉伯数字与中文数字互相转换库
 * @description 如数值过大，建议以字符串的形式传入
 * @version 0.0.23
 * @author 2ue
 */

// 类型定义
type NumberInput = number | string;
type StringTuple = [string, string];

// 常量定义
const UNIT_ARRAY: readonly string[] = ['仟', '佰', '拾'];
const POINT = '点';
const NUM_ARRAY: readonly string[] = [
  '零',
  '壹',
  '贰',
  '叁',
  '肆',
  '伍',
  '陆',
  '柒',
  '捌',
  '玖',
];
const NUM_UNIT_ARRAY: readonly string[] = [
  '万',
  '亿',
  '兆',
  '京',
  '垓',
  '秭',
  '穰',
  '沟',
  '涧',
  '正',
  '载',
  '极',
  '恒河沙',
  '阿僧祗',
  '那由他',
  '不可思议',
  '无量',
  '大数',
];

/**
 * 格式化数字，方便后续处理
 * @param num 输入的数字
 * @returns 格式化后的字符串
 */
function formatNum(num: NumberInput): string {
  // 过滤掉不是数字的字符，特殊处理0
  if (num === 0) return '0';
  // 特殊处理数组和对象等非数字类型
  if (typeof num === 'object' || Array.isArray(num)) return '';
  if (!num || isNaN(Number(num))) return '';
  // 负数返回空
  if (Number(num) < 0) return '';
  // 处理Infinity
  if (!isFinite(Number(num))) return '';

  // 标准化数字字符串，处理00.5、.0等格式
  const numValue = Number(num);

  // 把类1.0，1.00格式的数字处理成1
  if (numValue === parseInt(String(numValue)))
    return String(parseInt(String(numValue)));
  return String(numValue);
}

/**
 * 分割整数和小数部分
 * @param num 输入数字
 * @returns 包含整数和小数部分的数组
 */
function dealNum(num: NumberInput): StringTuple {
  const formattedNum = formatNum(num);
  if (!formattedNum) return ['', ''];
  const parts = formattedNum.split('.');
  // 对于0.5这样的小数，整数部分应该是'0'
  if (!parts[0] && parts[1]) {
    parts[0] = '0';
  }
  return [parts[0] || '', parts[1] || ''];
}

/**
 * 每四位分割成一组
 * @param numStr 数字字符串
 * @returns 分割后的数组
 */
function splitNum(numStr: string): string[] {
  if (!numStr || isNaN(Number(numStr))) return [];
  // 使用正则表达式进行四位分割
  const REG_SPLIT_LEN_R = /(\d{1,4})(?=(?:\d{4})+(?!\d))/g;
  return numStr.replace(REG_SPLIT_LEN_R, '$1,').split(',');
}

/**
 * 转化四位数为汉字，加上单位
 * @param numStr 四位数字字符串
 * @param isFirst 是否为第一段
 * @returns 转换后的中文字符串
 */
function switchNum(numStr: string, isFirst: boolean): string {
  if (!numStr) return '';
  if (numStr === '0000' || numStr === '0') return NUM_ARRAY[0];

  const res: string[] = [];
  // 补足四位，左侧填充0
  const num = ('0000' + numStr)
    .slice(-4)
    .split('')
    .map((n) => parseInt(n));
  // 只有在非第一段且原始长度不足4位且有前导0时才需要特殊处理
  const needLeadingZero =
    !isFirst && numStr.length < 4 && numStr.charAt(0) === '0';

  for (let i = 0; i < 4; i++) {
    const digit = num[i];

    if (digit === 0) {
      // 需要加零的条件：后面有非零数字，且前面有非零数字
      let hasNonZeroAfter = false;
      for (let j = i + 1; j < 4; j++) {
        if (num[j] !== 0) {
          hasNonZeroAfter = true;
          break;
        }
      }

      let hasNonZeroBefore = false;
      for (let k = 0; k < i; k++) {
        if (num[k] !== 0) {
          hasNonZeroBefore = true;
          break;
        }
      }

      // 特殊处理：如果是跨段的前导零（如10001中的0001），需要在开头加零
      if (
        hasNonZeroAfter &&
        (hasNonZeroBefore || (i === 0 && needLeadingZero))
      ) {
        if (res.length === 0 || res[res.length - 1] !== NUM_ARRAY[0]) {
          res.push(NUM_ARRAY[0]);
        }
      }
    } else {
      res.push(NUM_ARRAY[digit] + (i < 3 ? UNIT_ARRAY[i] : ''));
    }
  }

  return res.join('');
}

/**
 * 转换小数部分
 * @param decimalStr 小数部分字符串
 * @returns 转换后的中文字符串
 */
function switchDecimal(decimalStr: string): string {
  if (!decimalStr) return '';
  const res: string[] = [];
  const digits = decimalStr.split('');
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    if (digit === '0') {
      // 小数部分的零直接转换
      res.push(NUM_ARRAY[0]);
    } else {
      res.push(NUM_ARRAY[parseInt(digit)]);
    }
  }
  return res.join('');
}

/**
 * 拼接最终结果
 * @param num 输入数字
 * @returns 转换后的中文数字字符串
 */
function joinNum(num: NumberInput): string {
  const numArray = dealNum(num);
  if (!numArray[0] && !numArray[1]) return '';

  // 特殊处理0
  if (numArray[0] === '0' && !numArray[1]) return NUM_ARRAY[0];
  if (numArray[0] === '0' && numArray[1]) {
    return NUM_ARRAY[0] + POINT + switchDecimal(numArray[1]); // 0.5 -> 零点伍
  }

  const numParts = splitNum(numArray[0]);
  const len = numParts.length;
  let result = '';

  numParts.forEach((n, i) => {
    const temp = switchNum(n, i === 0);
    if (!temp && i === len - 1) return; // 最后一个空的不处理

    // 检查是否需要跨段零
    let needCrossZero = false;
    if (i < len - 1 && n && temp && temp !== NUM_ARRAY[0]) {
      const currentValue = parseInt(n);
      // 当后面一段的值小于1000时，需要加零
      if (currentValue < 1000 && i > 0) {
        needCrossZero = true;
      }
    }

    if (i < len - 1 && temp && temp !== NUM_ARRAY[0]) {
      // 添加单位
      if (needCrossZero && !temp.startsWith(NUM_ARRAY[0])) {
        result += NUM_ARRAY[0] + temp + NUM_UNIT_ARRAY[len - i - 2];
      } else {
        result += temp + NUM_UNIT_ARRAY[len - i - 2];
      }
    } else {
      // 最后一段，检查是否需要加前导零
      if (
        i === len - 1 &&
        len > 1 &&
        parseInt(n) < 1000 &&
        result &&
        !temp.startsWith(NUM_ARRAY[0])
      ) {
        result += NUM_ARRAY[0] + temp;
      } else {
        result += temp;
      }
    }
  });

  // 清理重复的零
  result = result.replace(/零+/g, '零');
  // 清理末尾的零
  result = result.replace(/零$/, '');

  // 添加小数部分
  if (numArray[1]) {
    result += POINT + switchDecimal(numArray[1]);
  }

  return result;
}

/**
 * 分割中文数字的整数和小数部分
 * @param chineseStr 中文数字字符串
 * @returns 包含整数和小数部分的数组
 */
function dealHz(chineseStr: string): StringTuple {
  if (!chineseStr || typeof chineseStr !== 'string') return ['', ''];
  const parts = chineseStr.split(POINT);
  return [parts[0] || '', parts[1] || ''];
}

/**
 * 处理中文数字转阿拉伯数字
 * @param chineseStr 中文数字字符串
 * @returns 转换后的数字
 */
function parseChineseNumber(chineseStr: string): number {
  if (!chineseStr || typeof chineseStr !== 'string') return 0;
  if (chineseStr === NUM_ARRAY[0]) return 0; // "零"

  // 检查是否包含无效字符
  const validChars = [...NUM_ARRAY, ...UNIT_ARRAY, ...NUM_UNIT_ARRAY];
  for (let i = 0; i < chineseStr.length; i++) {
    if (validChars.indexOf(chineseStr[i]) === -1) {
      return 0; // 包含无效字符返回0
    }
  }

  // 检查明显不合理的重复字符（如"壹壹"、"万万"等连续重复）
  // 但允许正常的重复使用（如"壹拾壹"中的壹重复使用是合理的）
  for (let i = 0; i < chineseStr.length - 1; i++) {
    if (chineseStr[i] === chineseStr[i + 1]) {
      // 连续相同字符，生活中不合理
      return 0;
    }
  }

  // 检查大单位重复出现（如"万万"、"亿亿"）- 大单位不应该重复
  for (let i = 0; i < NUM_UNIT_ARRAY.length; i++) {
    const unit = NUM_UNIT_ARRAY[i];
    const firstIndex = chineseStr.indexOf(unit);
    const lastIndex = chineseStr.lastIndexOf(unit);
    if (firstIndex !== -1 && firstIndex !== lastIndex) {
      return 0; // 大单位重复
    }
  }

  // 注意：小单位（拾、佰、仟）可以在不同级别重复，如"壹拾万伍拾"是合理的

  // 检查单独的大单位字符（万、亿等不能单独存在）
  if (NUM_UNIT_ARRAY.indexOf(chineseStr) >= 0) {
    return 0;
  }
  // 注意：拾、佰、仟可以单独存在，分别表示10、100、1000

  // 检查无效格式
  // 1. 零开头后面跟数字+单位的情况（如"零壹万"）
  if (chineseStr.indexOf('零') === 0 && chineseStr.length > 1) {
    const afterZero = chineseStr.substring(1);
    // 如果零后面直接跟着数字+大单位，这是无效格式
    for (let j = 0; j < NUM_UNIT_ARRAY.length; j++) {
      if (afterZero.indexOf(NUM_UNIT_ARRAY[j]) >= 0) {
        return 0;
      }
    }
  }

  // 2. 检查单位前是否缺少数字（如"万零壹"）
  for (let k = 0; k < NUM_UNIT_ARRAY.length; k++) {
    const unit = NUM_UNIT_ARRAY[k];
    const unitPos = chineseStr.indexOf(unit);
    if (unitPos === 0) {
      // 单位在开头
      return 0;
    }
  }

  // 2.5 检查小单位在开头但后面跟大单位的情况（如"拾万壹"）
  for (let m = 0; m < UNIT_ARRAY.length; m++) {
    const smallUnit = UNIT_ARRAY[m];
    if (chineseStr.indexOf(smallUnit) === 0) {
      // 只有当小单位在开头且后面跟大单位时才是无效的
      // 但像"拾"、"佰"、"仟"这样的单独单位是有效的
      for (let n = 0; n < NUM_UNIT_ARRAY.length; n++) {
        if (chineseStr.indexOf(NUM_UNIT_ARRAY[n]) > 0) {
          return 0; // 如"拾万壹"
        }
      }
    }
  }

  // 3. 检查单位顺序错误（如"壹万拾"、"壹亿万"）
  const hasWan = chineseStr.indexOf('万') >= 0;
  const hasYi = chineseStr.indexOf('亿') >= 0;

  if (hasYi && hasWan) {
    const wanPos = chineseStr.indexOf('万');
    const yiPos = chineseStr.indexOf('亿');
    if (wanPos > yiPos) {
      // 万在亿之后是正确的，但需要检查亿万之间有无数字
      const betweenYiWan = chineseStr.substring(yiPos + 1, wanPos);
      // 如果亿和万之间没有任何数字字符，这是错误的（如"壹亿万"）
      let hasNumberBetween = false;
      for (let p = 1; p < NUM_ARRAY.length; p++) {
        // 跳过零
        if (betweenYiWan.indexOf(NUM_ARRAY[p]) >= 0) {
          hasNumberBetween = true;
          break;
        }
      }
      if (!hasNumberBetween) {
        return 0; // "壹亿万" 这样的格式无效
      }
    } else if (wanPos < yiPos) {
      return 0; // 万在亿之前是错误的
    }
  }

  // 4. 检查小单位在大单位后面（如"壹万拾"）
  if (hasWan) {
    const wanPos = chineseStr.indexOf('万');
    const afterWan = chineseStr.substring(wanPos + 1);
    // 如果万后面直接跟小单位且没有数字，这是无效的
    for (let m = 0; m < UNIT_ARRAY.length; m++) {
      if (afterWan === UNIT_ARRAY[m]) {
        return 0; // 如"壹万拾"
      }
    }
  }

  let billion = 0;
  let million = 0;
  let temp = 0;

  let workingStr = chineseStr;

  // 处理亿
  if (workingStr.indexOf('亿') >= 0) {
    const parts = workingStr.split('亿');
    if (parts[0]) {
      billion = parseSmallNumber(parts[0]) * 100000000;
    }
    workingStr = parts[1] || '';
  }

  // 处理万
  if (workingStr.indexOf('万') >= 0) {
    const parts = workingStr.split('万');
    if (parts[0]) {
      million = parseSmallNumber(parts[0]) * 10000;
    }
    workingStr = parts[1] || '';
  }

  // 处理剩余部分（千以下）
  if (workingStr) {
    temp = parseSmallNumber(workingStr);
  }

  return billion + million + temp;
}

/**
 * 解析千以下的中文数字
 * @param chineseStr 中文数字字符串
 * @returns 转换后的数字
 */
function parseSmallNumber(chineseStr: string): number {
  if (!chineseStr) return 0;
  if (chineseStr === NUM_ARRAY[0]) return 0;

  let result = 0;
  let temp = 0;

  for (let i = 0; i < chineseStr.length; i++) {
    const char = chineseStr[i];
    const numIndex = NUM_ARRAY.indexOf(char);
    const unitIndex = UNIT_ARRAY.indexOf(char);

    if (numIndex > 0) {
      // 是数字（跳过零）
      temp = numIndex;
    } else if (unitIndex >= 0) {
      // 是单位
      const unitValue = Math.pow(10, 3 - unitIndex);
      if (temp === 0) temp = 1; // 处理"拾"、"佰"等前面没有数字的情况
      result += temp * unitValue;
      temp = 0;
    }
    // 忽略零字符，不做任何处理
  }

  result += temp; // 加上个位数
  return result;
}

/**
 * 转换小数部分中文数字
 * @param chineseStr 中文小数字符串
 * @returns 转换后的小数字符串
 */
function switchDecimalHz(chineseStr: string): string {
  if (!chineseStr) return '';
  let result = '.';
  for (let i = 0; i < chineseStr.length; i++) {
    const char = chineseStr[i];
    const numIndex = NUM_ARRAY.indexOf(char);
    if (numIndex >= 0) {
      result += numIndex;
    }
  }
  return result === '.' ? '' : result;
}

/**
 * 中文数字转阿拉伯数字主函数
 * @param chineseStr 中文数字字符串
 * @returns 转换后的数字
 */
function joinHz(chineseStr: string): number {
  if (!chineseStr || typeof chineseStr !== 'string') return 0;
  if (chineseStr === NUM_ARRAY[0]) return 0; // "零"

  const parts = dealHz(chineseStr);

  // 检查小数格式的有效性
  if (chineseStr.indexOf(POINT) >= 0) {
    // Only check decimal validation if there's actually a decimal point
    // 1. 检查是否有多个点（如"壹点点贰"）
    if (chineseStr.split(POINT).length > 2) {
      return 0;
    }

    // 2. 检查"壹点"这样缺少小数部分的情况
    if (parts[1] === '') {
      return 0;
    }

    // 3. 检查"点壹"这样缺少整数部分的情况 - 生活中不合理
    if (parts[0] === '') {
      return 0;
    }
  }

  const integerPart = parseChineseNumber(parts[0]);
  
  // 如果整数部分解析为0，需要验证是否是有效的"零"还是无效输入
  if (integerPart === 0 && parts[0] !== '' && parts[0] !== NUM_ARRAY[0]) {
    return 0; // 整数部分无效
  }
  
  const decimalPart = switchDecimalHz(parts[1]);

  if (decimalPart) {
    return parseFloat(integerPart + decimalPart);
  }

  return integerPart;
}

/**
 * 将阿拉伯数字转换为中文数字
 * @param num 输入的数字（数字或字符串）
 * @returns 转换后的中文数字字符串
 */
export const toCn = joinNum;

/**
 * 将中文数字转换为阿拉伯数字
 * @param chineseStr 中文数字字符串
 * @returns 转换后的数字
 */
export const toNm = joinHz;
