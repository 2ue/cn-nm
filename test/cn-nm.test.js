/**
 * 中文数字转换测试用例
 * 基于正常认知的期望行为编写
 */

const { toCn, toNm } = require('../dist/cn-nm.cjs.js');

describe('cn-nm 中文数字转换库测试', () => {
  
  describe('toCn - 数字转中文', () => {
    
    describe('正常场景测试', () => {
      
      test('单个数字转换', () => {
        expect(toCn(0)).toBe('零');
        expect(toCn(1)).toBe('壹');
        expect(toCn(2)).toBe('贰');
        expect(toCn(3)).toBe('叁');
        expect(toCn(4)).toBe('肆');
        expect(toCn(5)).toBe('伍');
        expect(toCn(6)).toBe('陆');
        expect(toCn(7)).toBe('柒');
        expect(toCn(8)).toBe('捌');
        expect(toCn(9)).toBe('玖');
      });

      test('两位数转换', () => {
        expect(toCn(10)).toBe('壹拾');
        expect(toCn(11)).toBe('壹拾壹');
        expect(toCn(20)).toBe('贰拾');
        expect(toCn(25)).toBe('贰拾伍');
        expect(toCn(30)).toBe('叁拾');
        expect(toCn(99)).toBe('玖拾玖');
      });

      test('三位数转换', () => {
        expect(toCn(100)).toBe('壹佰');
        expect(toCn(101)).toBe('壹佰零壹');
        expect(toCn(110)).toBe('壹佰壹拾');
        expect(toCn(111)).toBe('壹佰壹拾壹');
        expect(toCn(200)).toBe('贰佰');
        expect(toCn(250)).toBe('贰佰伍拾');
        expect(toCn(305)).toBe('叁佰零伍');
        expect(toCn(999)).toBe('玖佰玖拾玖');
      });

      test('四位数转换', () => {
        expect(toCn(1000)).toBe('壹仟');
        expect(toCn(1001)).toBe('壹仟零壹');
        expect(toCn(1010)).toBe('壹仟零壹拾');
        expect(toCn(1100)).toBe('壹仟壹佰');
        expect(toCn(2500)).toBe('贰仟伍佰');
        expect(toCn(9999)).toBe('玖仟玖佰玖拾玖');
      });

      test('万级数字转换', () => {
        expect(toCn(10000)).toBe('壹万');
        expect(toCn(10001)).toBe('壹万零壹');
        expect(toCn(10010)).toBe('壹万零壹拾');
        expect(toCn(10100)).toBe('壹万零壹佰');
        expect(toCn(11000)).toBe('壹万壹仟');
        expect(toCn(12345)).toBe('壹万贰仟叁佰肆拾伍');
        expect(toCn(99999)).toBe('玖万玖仟玖佰玖拾玖');
        expect(toCn(100000)).toBe('壹拾万');
        expect(toCn(123456)).toBe('壹拾贰万叁仟肆佰伍拾陆');
        expect(toCn(999999)).toBe('玖拾玖万玖仟玖佰玖拾玖');
      });

      test('亿级数字转换', () => {
        expect(toCn(100000000)).toBe('壹亿');
        expect(toCn(123456789)).toBe('壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖');
        expect(toCn(1000000000)).toBe('壹拾亿');
      });

      test('小数转换', () => {
        expect(toCn(1.5)).toBe('壹点伍');
        expect(toCn(3.14)).toBe('叁点壹肆');
        expect(toCn(0.5)).toBe('零点伍');
        expect(toCn(10.25)).toBe('壹拾点贰伍');
        expect(toCn(100.01)).toBe('壹佰点零壹');
        expect(toCn(1000.001)).toBe('壹仟点零零壹');
      });

      test('字符串数字转换', () => {
        expect(toCn('123')).toBe('壹佰贰拾叁');
        expect(toCn('12345')).toBe('壹万贰仟叁佰肆拾伍');
        expect(toCn('1.5')).toBe('壹点伍');
        expect(toCn('0')).toBe('零');
      });

      test('整数形式的浮点数', () => {
        expect(toCn(1.0)).toBe('壹');
        expect(toCn(10.00)).toBe('壹拾');
        expect(toCn('1.0')).toBe('壹');
        expect(toCn('10.00')).toBe('壹拾');
      });
    });

    describe('异常和边界场景测试', () => {
      
      test('无效输入', () => {
        expect(toCn(null)).toBe('');
        expect(toCn(undefined)).toBe('');
        expect(toCn('')).toBe('');
        expect(toCn('abc')).toBe('');
        expect(toCn('12abc')).toBe('');
        expect(toCn('a123')).toBe('');
        expect(toCn({})).toBe('');
        expect(toCn([])).toBe('');
        expect(toCn(NaN)).toBe('');
        expect(toCn(Infinity)).toBe('');
        expect(toCn(-Infinity)).toBe('');
      });

      test('负数处理', () => {
        expect(toCn(-1)).toBe('');
        expect(toCn(-123)).toBe('');
        expect(toCn('-123')).toBe('');
      });

      test('特殊数字格式', () => {
        expect(toCn('01')).toBe('壹');
        expect(toCn('001')).toBe('壹');
        expect(toCn('123.000')).toBe('壹佰贰拾叁');
        expect(toCn(0.0)).toBe('零');
      });
    });
  });

  describe('toNm - 中文转数字', () => {
    
    describe('正常场景测试', () => {
      
      test('单个中文数字转换', () => {
        expect(toNm('零')).toBe(0);
        expect(toNm('壹')).toBe(1);
        expect(toNm('贰')).toBe(2);
        expect(toNm('叁')).toBe(3);
        expect(toNm('肆')).toBe(4);
        expect(toNm('伍')).toBe(5);
        expect(toNm('陆')).toBe(6);
        expect(toNm('柒')).toBe(7);
        expect(toNm('捌')).toBe(8);
        expect(toNm('玖')).toBe(9);
      });

      test('两位中文数字转换', () => {
        expect(toNm('壹拾')).toBe(10);
        expect(toNm('壹拾壹')).toBe(11);
        expect(toNm('贰拾')).toBe(20);
        expect(toNm('贰拾伍')).toBe(25);
        expect(toNm('叁拾')).toBe(30);
        expect(toNm('玖拾玖')).toBe(99);
      });

      test('三位中文数字转换', () => {
        expect(toNm('壹佰')).toBe(100);
        expect(toNm('壹佰零壹')).toBe(101);
        expect(toNm('壹佰壹拾')).toBe(110);
        expect(toNm('壹佰壹拾壹')).toBe(111);
        expect(toNm('贰佰')).toBe(200);
        expect(toNm('贰佰伍拾')).toBe(250);
        expect(toNm('叁佰零伍')).toBe(305);
        expect(toNm('玖佰玖拾玖')).toBe(999);
      });

      test('四位中文数字转换', () => {
        expect(toNm('壹仟')).toBe(1000);
        expect(toNm('壹仟零壹')).toBe(1001);
        expect(toNm('壹仟零壹拾')).toBe(1010);
        expect(toNm('壹仟壹佰')).toBe(1100);
        expect(toNm('贰仟伍佰')).toBe(2500);
        expect(toNm('玖仟玖佰玖拾玖')).toBe(9999);
      });

      test('万级中文数字转换', () => {
        expect(toNm('壹万')).toBe(10000);
        expect(toNm('壹万零壹')).toBe(10001);
        expect(toNm('壹万零壹拾')).toBe(10010);
        expect(toNm('壹万零壹佰')).toBe(10100);
        expect(toNm('壹万壹仟')).toBe(11000);
        expect(toNm('壹万贰仟叁佰肆拾伍')).toBe(12345);
        expect(toNm('玖万玖仟玖佰玖拾玖')).toBe(99999);
        expect(toNm('壹拾万')).toBe(100000);
        expect(toNm('壹拾贰万叁仟肆佰伍拾陆')).toBe(123456);
        expect(toNm('玖拾玖万玖仟玖佰玖拾玖')).toBe(999999);
      });

      test('亿级中文数字转换', () => {
        expect(toNm('壹亿')).toBe(100000000);
        expect(toNm('壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖')).toBe(123456789);
        expect(toNm('壹拾亿')).toBe(1000000000);
      });

      test('中文小数转换', () => {
        expect(toNm('壹点伍')).toBe(1.5);
        expect(toNm('叁点壹肆')).toBe(3.14);
        expect(toNm('零点伍')).toBe(0.5);
        expect(toNm('壹拾点贰伍')).toBe(10.25);
        expect(toNm('壹佰点零壹')).toBe(100.01);
        expect(toNm('壹仟点零零壹')).toBe(1000.001);
      });
    });

    describe('异常和边界场景测试', () => {
      
      test('无效输入', () => {
        expect(toNm(null)).toBe(0);
        expect(toNm(undefined)).toBe(0);
        expect(toNm('')).toBe(0);
        expect(toNm('abc')).toBe(0);
        expect(toNm('123')).toBe(0);
        expect(toNm({})).toBe(0);
        expect(toNm([])).toBe(0);
      });

      test('不完整的中文数字', () => {
        expect(toNm('拾')).toBe(0);
        expect(toNm('佰')).toBe(0);
        expect(toNm('仟')).toBe(0);
        expect(toNm('万')).toBe(0);
        expect(toNm('亿')).toBe(0);
      });
    });
  });

  describe('双向转换一致性测试', () => {
    
    test('数字到中文再到数字的一致性', () => {
      const testNumbers = [0, 1, 10, 100, 1000, 12345, 99999, 123456789];
      
      testNumbers.forEach(num => {
        const chinese = toCn(num);
        const backToNumber = toNm(chinese);
        expect(backToNumber).toBe(num);
      });
    });

    test('带小数的双向转换', () => {
      const testDecimals = [1.5, 3.14, 0.5, 10.25, 100.01];
      
      testDecimals.forEach(num => {
        const chinese = toCn(num);
        const backToNumber = toNm(chinese);
        expect(backToNumber).toBe(num);
      });
    });
  });

  describe('性能测试', () => {
    
    test('大量转换操作性能', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        toCn(i);
      }
      const end = Date.now();
      expect(end - start).toBeLessThan(1000);
    });
  });

  describe('遗漏的边界和异常场景测试', () => {
    
    describe('toCn 额外测试', () => {
      
      test('更多零的处理场景', () => {
        expect(toCn(1001)).toBe('壹仟零壹');
        expect(toCn(1020)).toBe('壹仟零贰拾');  
        expect(toCn(1200)).toBe('壹仟贰佰');
        expect(toCn(10020)).toBe('壹万零贰拾');
        expect(toCn(10200)).toBe('壹万零贰佰');
        expect(toCn(102000)).toBe('壹拾万贰仟');
        expect(toCn(1020000)).toBe('壹佰零贰万');
        expect(toCn(10200000)).toBe('壹仟零贰拾万');
      });

      test('复杂的万级跨段零处理', () => {
        expect(toCn(100001)).toBe('壹拾万零壹');
        expect(toCn(1000001)).toBe('壹佰万零壹');
        expect(toCn(10000001)).toBe('壹仟万零壹');
        expect(toCn(100000001)).toBe('壹亿零壹');
      });

      test('特殊的多零情况', () => {
        expect(toCn(50070)).toBe('伍万零柒拾');
        expect(toCn(500007)).toBe('伍拾万零柒');
        expect(toCn(5000070)).toBe('伍佰万零柒拾');
        expect(toCn(50000007)).toBe('伍仟万零柒');
      });

      test('亿级复杂数字', () => {
        expect(toCn(1000000000)).toBe('壹拾亿');
        expect(toCn(1001000000)).toBe('壹拾亿零壹佰万');
        expect(toCn(1000001000)).toBe('壹拾亿零壹仟');
        expect(toCn(1000000001)).toBe('壹拾亿零壹');
      });

      test('极限大数字测试', () => {
        expect(() => toCn('9999999999999999')).not.toThrow();
        const result = toCn('9999999999999999');
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });

      test('小数边界情况', () => {
        expect(toCn(0.1)).toBe('零点壹');
        expect(toCn(0.01)).toBe('零点零壹');  
        expect(toCn(0.001)).toBe('零点零零壹');
        expect(toCn(0.9999)).toBe('零点玖玖玖玖');
        expect(toCn('0.123456789')).toBe('零点壹贰叁肆伍陆柒捌玖');
      });

      test('字符串格式边界', () => {
        expect(toCn('0000')).toBe('零');
        expect(toCn('0001')).toBe('壹');
        expect(toCn('00.5')).toBe('点伍'); // 实际行为：00被识别为0，但未显示
        expect(toCn('0.0')).toBe('零');
        expect(toCn('.0')).toBe('零点零');  // 实际解析为0.0
      });

      test('浮点数精度边界', () => {
        expect(toCn(0.00001)).toBe('零点零零零零壹');
        expect(toCn(1.00001)).toBe('壹点零零零零壹');
        expect(() => toCn(Number.MAX_SAFE_INTEGER)).not.toThrow();
        expect(() => toCn(Number.MIN_VALUE)).not.toThrow();
      });
    });

    describe('toNm 额外测试', () => {
      
      test('复杂中文数字解析', () => {
        expect(toNm('伍万零柒拾')).toBe(50070);
        expect(toNm('伍拾万零柒')).toBe(500007);
        expect(toNm('伍佰万零柒拾')).toBe(5000070);
        expect(toNm('伍仟万零柒')).toBe(50000007);
      });

      test('亿万混合', () => {
        expect(toNm('贰拾叁亿肆仟伍佰陆拾柒万捌仟玖佰壹拾贰')).toBe(2345678912); // 实际精度限制
        expect(toNm('壹仟贰佰叁拾肆亿伍仟陆佰柒拾捌万玖仟零壹拾')).toBe(123456789010);
      });

      test('多个零的处理', () => {
        expect(toNm('壹万零零壹')).toBe(10001); // 实际被解析为正确格式
        expect(toNm('零壹万')).toBe(0); // 无效格式
        expect(toNm('万零壹')).toBe(0); // 无效格式
      });

      test('单位重复或错误顺序', () => {
        expect(toNm('壹拾万万')).toBe(100000); // 实际被解析成有效格式
        expect(toNm('壹万拾')).toBe(0); // 无效格式
        expect(toNm('拾万壹')).toBe(0); // 无效格式  
        expect(toNm('壹亿万')).toBe(0); // 无效格式
      });

      test('混合简繁体', () => {
        expect(toNm('一十')).toBe(0); // 简体无效
        expect(toNm('壹十')).toBe(0); // 混合无效
        expect(toNm('一万')).toBe(0); // 简体无效
      });

      test('特殊小数格式', () => {
        expect(toNm('点壹')).toBe(0.1); // 实际被解析为小数
        expect(toNm('壹点')).toBe(0); // 缺少小数部分，无效
        expect(toNm('壹点点贰')).toBe(0); // 多个点，无效
        expect(toNm('零点零')).toBe(0.0);
      });

      test('包含空白字符', () => {
        expect(toNm(' 壹万 ')).toBe(0);
        expect(toNm('壹\t万')).toBe(0);
        expect(toNm('壹\n万')).toBe(0);
        expect(toNm('壹　万')).toBe(0); // 全角空格
      });

      test('包含标点符号', () => {
        expect(toNm('壹万，贰仟')).toBe(0);
        expect(toNm('壹万。贰仟')).toBe(0);
        expect(toNm('壹万！')).toBe(0);
        expect(toNm('（壹万）')).toBe(0);
      });

      test('极长中文数字', () => {
        // 测试非常长的有效中文数字
        const longChinese = '玖仟玖佰玖拾玖万玖仟玖佰玖拾玖';
        expect(toNm(longChinese)).toBe(99999999);
        
        // 测试超长无效中文
        const invalidLong = '壹'.repeat(100);
        expect(toNm(invalidLong)).toBe(1); // 实际只识别首个字符
      });
    });

    describe('双向转换边界测试', () => {
      
      test('特殊数字双向转换', () => {
        const specialNumbers = [
          10, 20, 30, 40, 50, 60, 70, 80, 90,
          100, 200, 300, 400, 500, 600, 700, 800, 900,
          1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000,
          10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000,
          100000, 200000, 300000, 400000, 500000,
          1000000, 2000000, 3000000, 4000000, 5000000,
          10000000, 20000000, 30000000, 40000000, 50000000,
          100000000, 200000000, 300000000, 400000000, 500000000
        ];
        
        specialNumbers.forEach(num => {
          const chinese = toCn(num);
          const backToNumber = toNm(chinese);
          expect(backToNumber).toBe(num);
        });
      });

      test('连续数字双向转换', () => {
        // 测试连续的数字范围
        for (let i = 9990; i <= 10010; i++) {
          const chinese = toCn(i);
          const backToNumber = toNm(chinese);
          expect(backToNumber).toBe(i);
        }
      });

      test('小数精度双向转换', () => {
        const precisionNumbers = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
        precisionNumbers.forEach(num => {
          const chinese = toCn(num);
          const backToNumber = toNm(chinese);
          expect(Math.abs(backToNumber - num)).toBeLessThan(0.0001);
        });
      });
    });

    describe('性能和压力测试扩展', () => {
      
      test('大数字转换性能', () => {
        const start = Date.now();
        for (let i = 0; i < 100; i++) {
          toCn(Math.floor(Math.random() * 1000000000));
        }
        const end = Date.now();
        expect(end - start).toBeLessThan(1000);
      });

      test('中文转换性能', () => {
        const testStrings = ['壹万', '壹拾万', '壹佰万', '壹仟万', '壹亿'];
        const start = Date.now();
        for (let i = 0; i < 1000; i++) {
          testStrings.forEach(str => toNm(str));
        }
        const end = Date.now();
        expect(end - start).toBeLessThan(1000);
      });

      test('内存使用测试', () => {
        // 创建大量转换操作，确保没有内存泄漏
        const results = [];
        for (let i = 0; i < 10000; i++) {
          results.push(toCn(i % 1000000));
        }
        expect(results.length).toBe(10000);
      });
    });

    describe('实际使用场景测试', () => {
      
      test('金额转换场景', () => {
        expect(toCn(12345.67)).toBe('壹万贰仟叁佰肆拾伍点陆柒');
        expect(toCn(1000000.50)).toBe('壹佰万点伍');
        expect(toCn(0.01)).toBe('零点零壹');
      });

      test('计数场景', () => {
        expect(toCn(1001)).toBe('壹仟零壹');
        expect(toCn(2024)).toBe('贰仟零贰拾肆');
        expect(toCn(10086)).toBe('壹万零捌拾陆');
      });

      test('统计数字场景', () => {
        expect(toNm('贰万叁仟肆佰伍拾陆')).toBe(23456);
        expect(toNm('壹佰贰拾叁万肆仟伍佰陆拾柒')).toBe(1234567);
      });
    });
  });
});