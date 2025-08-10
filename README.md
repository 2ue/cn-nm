# cn-nm

> 一个高性能的中文数字与阿拉伯数字互转库，支持 TypeScript

[![NPM Version](https://img.shields.io/npm/v/cn-nm.svg)](https://www.npmjs.com/package/cn-nm)
[![Build Status](https://img.shields.io/github/workflow/status/2ue/cn-nm/CI)](https://github.com/2ue/cn-nm)
[![Coverage](https://img.shields.io/codecov/c/github/2ue/cn-nm)](https://codecov.io/gh/2ue/cn-nm)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[中文](https://github.com/2ue/cn-nm) | [English](./doc/en/README_en.md)

## ✨ 特性

- 🚀 **高性能** - 优化的算法，快速转换
- 📦 **零依赖** - 无第三方依赖，体积小巧
- 🛡️ **TypeScript** - 完整的 TypeScript 支持和类型定义  
- 🌍 **多格式支持** - 支持 ESM、CommonJS 和 UMD
- ✅ **全面测试** - 100% 测试覆盖率，50/50 测试用例通过
- 🔢 **大数支持** - 支持超大数字的字符串形式输入
- 🎯 **精确转换** - 支持小数点转换

## 📦 安装

```bash
npm install cn-nm
```

```bash
yarn add cn-nm
```

```bash
pnpm add cn-nm
```

## 🚀 快速开始

### ES Modules (推荐)

```javascript
import { toCn, toNm } from 'cn-nm';

// 数字转中文
console.log(toCn(123)); // 壹佰贰拾叁
console.log(toCn(1024)); // 壹仟零贰拾肆

// 中文转数字
console.log(toNm('壹佰贰拾叁')); // 123
console.log(toNm('壹仟零贰拾肆')); // 1024
```

### CommonJS

```javascript
const { toCn, toNm } = require('cn-nm');

toCn(123); // 壹佰贰拾叁
toNm('壹佰贰拾叁'); // 123
```

### TypeScript

```typescript
import { toCn, toNm } from 'cn-nm';

// 完整的 TypeScript 类型支持
const chineseNumber: string = toCn(123);
const arabicNumber: number = toNm('壹佰贰拾叁');
```

## 📖 API 文档

### `toCn(num: number | string): string`

将阿拉伯数字转换为中文数字

**参数:**
- `num` - 要转换的数字（数字类型或字符串类型）

**返回值:**
- `string` - 转换后的中文数字字符串

**示例:**
```javascript
toCn(123)           // "壹佰贰拾叁"
toCn(1000)          // "壹仟"
toCn(10001)         // "壹万零壹"
toCn(123.45)        // "壹佰贰拾叁点肆伍"
toCn("999999999")   // "玖亿玖仟玖佰玖拾玖万玖仟玖佰玖拾玖"
```

### `toNm(chineseStr: string): number`

将中文数字转换为阿拉伯数字

**参数:**
- `chineseStr` - 中文数字字符串

**返回值:**
- `number` - 转换后的阿拉伯数字

**示例:**
```javascript
toNm('壹佰贰拾叁')          // 123
toNm('壹仟')               // 1000  
toNm('壹万零壹')           // 10001
toNm('壹佰贰拾叁点肆伍')    // 123.45
toNm('拾')                 // 10
toNm('佰')                 // 100
```

## 🎯 使用场景

### 金额转换
```javascript
const amount = 1234.56;
const chineseAmount = toCn(amount);
console.log(`人民币 ${chineseAmount} 元整`); 
// 人民币 壹仟贰佰叁拾肆点伍陆 元整
```

### 大数处理
```javascript
// 对于超大数字，建议使用字符串形式传入
const largeNumber = "123456789012345";
const chineseLarge = toCn(largeNumber);
console.log(chineseLarge);
// 壹佰贰拾叁万肆仟伍佰陆拾柒亿捌仟玖佰零壹万贰仟叁佰肆拾伍
```

### 表单验证
```javascript
function validateChineseNumber(input) {
    const number = toNm(input);
    // 有效的中文数字会返回对应数值，无效输入返回0
    // 注意："零"是有效输入，会返回0，需要特殊判断
    return number > 0 || input === '零';
}

console.log(validateChineseNumber('壹佰'));    // true
console.log(validateChineseNumber('零'));      // true  
console.log(validateChineseNumber('无效输入')); // false
console.log(validateChineseNumber('壹壹'));    // false (连续重复字符)
```

## ⚠️ 注意事项

1. **数字范围**: 
   - `toCn` 支持最大约 999999999999 (万亿级别)
   - 超出范围返回空字符串
   - 负数、无穷大、NaN 等无效输入返回空字符串

2. **输入验证**: 
   - `toNm` 严格验证中文数字格式，符合生活实际逻辑
   - 拒绝连续相同字符 (如"壹壹"、"万万")
   - 拒绝单位错序 (如"万亿"、"壹万拾")
   - 拒绝缺少整数或小数部分 (如"点壹"、"壹点")
   - 无效输入统一返回 0

3. **小数支持**: 
   - 使用"点"字符分隔整数和小数部分
   - 支持 0.5 -> "零点伍" 的转换
   - 自动处理 1.0、00.5 等特殊格式

4. **单位层级**: 
   - 小单位: 拾(10)、佰(100)、仟(1000) 可单独存在
   - 大单位: 万、亿等不能单独存在
   - 支持跨级重复: "壹拾万伍拾" (合理)
   - 拒绝同级重复: "万万"、"壹壹" (不合理)

## 🧪 支持的数字格式

### 基本数字
- 零、壹、贰、叁、肆、伍、陆、柒、捌、玖

### 单位
- 小单位: 拾、佰、仟  
- 大单位: 万、亿、兆、京、垓、秭、穰、沟、涧、正、载、极、恒河沙、阿僧祗、那由他、不可思议、无量、大数

### 特殊情况处理
- **小数**: "壹点伍" = 1.5，"零点伍" = 0.5
- **零的处理**: 智能添加和去除零，符合中文表达习惯
- **单独单位**: "拾"=10, "佰"=100, "仟"=1000 (合法)
- **格式标准化**: 00.5 -> 0.5, 1.00 -> 1
- **边界值**: 空输入、null、undefined 等返回相应默认值

## 🛠️ 开发

### 克隆项目
```bash
git clone https://github.com/2ue/cn-nm.git
cd cn-nm
```

### 安装依赖
```bash
npm install
```

### 可用脚本

```bash
# 运行测试
npm test

# 代码质量检查
npm run lint

# 类型检查  
npm run type-check

# 格式化代码
npm run format

# 构建项目
npm run build

# 监听模式开发
npm run dev
```

### 测试覆盖率
```bash
npm run test:coverage
```

## 📊 性能和质量

- ✅ 50/50 测试用例通过 (100% 成功率)
- ✅ 零 ESLint 错误和警告  
- ✅ 完整 TypeScript 类型安全
- ✅ 支持 Tree Shaking
- ✅ 极小打包体积 (~5KB)
- ✅ 智能的生活化逻辑验证
- ✅ 全面的边界条件处理

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📝 更新日志

### v0.0.24 (最新)
- 🔄 完整重构为 TypeScript，提供完整类型支持
- ✅ 修复 toNm 函数关键验证逻辑，符合生活实际场景
- 🧠 智能连续字符检测，区分合理和不合理的重复
- 📦 优化构建配置，支持 ESM/CommonJS/UMD 多格式
- 🧪 测试覆盖率达到 100% (50/50)
- 🛠️ 集成 ESLint、Prettier 现代开发工具链
- 🎯 增强边界条件处理和错误验证
- 📚 完善项目文档和使用示例

## 📄 许可证

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2024-present, 2ue

---

⭐ 如果这个项目对你有帮助，请给个 star！