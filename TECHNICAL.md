# cn-nm 技术说明文档

## 🏗️ 项目架构

### 目录结构
```
cn-nm/
├── src/                    # TypeScript 源码
│   └── cn-nm.ts           # TypeScript 源文件
├── dist/                  # 编译输出
│   ├── cn-nm.cjs.js       # CommonJS 格式
│   ├── cn-nm.es.js        # ES Modules 格式
│   ├── cn-nm.umd.js       # UMD 格式
│   └── cn-nm.d.ts         # TypeScript 类型定义
├── test/                  # 测试文件
├── doc/                   # 文档
├── coverage/              # 测试覆盖率报告
├── eslint.config.js       # ESLint 配置 (v9 flat config)
├── tsconfig.json          # TypeScript 配置
├── rollup.config.js       # 构建配置
└── package.json           # 项目配置
```

## 🔧 技术栈

### 核心技术
- **TypeScript 5.9+** - 主要开发语言，提供类型安全
- **Rollup 4.14+** - 现代化构建工具，支持多格式输出
- **Jest 29+** - 测试框架，配合 ts-jest
- **ESLint 9+** - 代码质量检查（flat config 格式）
- **Prettier 3+** - 代码格式化

### 开发工具
- **TypeScript Compiler** - 类型检查和编译
- **Rimraf** - 清理构建目录
- **ts-jest** - Jest 的 TypeScript 支持

## 📦 构建系统

### Rollup 配置
```javascript
// 支持多种模块格式输出
export default {
  input: 'src/cn-nm.ts',
  output: [
    { 
      file: 'dist/cn-nm.cjs.js', 
      format: 'cjs',        // CommonJS
      exports: 'named'
    },
    { 
      file: 'dist/cn-nm.es.js', 
      format: 'es'          // ES Modules
    },
    { 
      file: 'dist/cn-nm.umd.js', 
      format: 'umd',        // UMD (浏览器兼容)
      name: 'cn-nm'
    }
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,    // 生成 .d.ts 文件
      declarationDir: './dist'
    })
  ]
};
```

### TypeScript 配置
```json
{
  "compilerOptions": {
    "target": "ES2018",         // 现代浏览器支持
    "module": "ESNext",         // 现代模块系统
    "strict": true,             // 严格模式
    "declaration": true,        // 生成类型定义
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## 🧪 测试体系

### 测试覆盖率
- **100% 通过率** - 50/50 测试用例通过
- **全面测试** - 包括正常场景、边界情况、异常处理
- **性能测试** - 大量数据转换性能验证
- **双向转换一致性** - 确保 toCn 和 toNm 的正确性
- **生活化逻辑验证** - 符合实际使用习惯的验证机制

### Jest 配置
```json
{
  "testEnvironment": "node",
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.ts",
    "!src/**/*.test.*"
  ]
}
```

## 🏛️ 核心算法

### 数字转中文 (toCn)
1. **数字格式化** - 处理各种输入格式
2. **数字分割** - 按四位一组分割
3. **单位转换** - 添加对应的中文单位
4. **零的处理** - 智能处理各种零的情况
5. **结果拼接** - 组合成完整的中文数字

### 中文转数字 (toNm)
1. **严格输入验证** - 检查中文数字格式的有效性和生活实际逻辑
2. **连续字符检测** - 智能区分合理重复(如"壹拾壹")和不合理重复(如"壹壹")
3. **单位层级验证** - 检查单位顺序和重复使用的合理性
4. **小数格式验证** - 确保小数点前后都有有效内容
5. **大单位处理** - 正确处理亿、万等大单位的层次关系
6. **小数字解析** - 解析千位以下的中文数字
7. **结果合并** - 合并各部分得到最终数字

### 关键算法优化
- **正则表达式** - 高效的数字分割
- **智能验证逻辑** - 区分代码实现逻辑和生活实际逻辑
- **连续字符检测** - 高效的重复字符识别算法
- **层级单位处理** - 智能的单位重复检测和验证

## 🛡️ 类型定义

### 核心类型
```typescript
// 输入数字类型
type NumberInput = number | string;

// 字符串元组类型
type StringTuple = [string, string];

// 主要API
export function toCn(num: NumberInput): string;
export function toNm(chineseStr: string): number;
```

### 常量定义
```typescript
const UNIT_ARRAY: readonly string[] = ['仟', '佰', '拾'];
const POINT = '点';
const NUM_ARRAY: readonly string[] = [
  '零', '壹', '贰', '叁', '肆', 
  '伍', '陆', '柒', '捌', '玖'
];
const NUM_UNIT_ARRAY: readonly string[] = [
  '万', '亿', '兆', '京', '垓', '秭', 
  '穰', '沟', '涧', '正', '载', '极',
  '恒河沙', '阿僧祗', '那由他', 
  '不可思议', '无量', '大数'
];
```

## 🔍 代码质量

### ESLint 规则 (v9 Flat Config)
```javascript
module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'prettier': prettierPlugin
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'prettier/prettier': 'error'
    }
  }
];
```

### 代码质量指标
- ✅ **零 ESLint 错误**
- ✅ **零 TypeScript 类型错误** 
- ✅ **一致的代码风格** (Prettier)
- ✅ **完整的函数返回类型注解**
- ✅ **严格的类型检查**

## 🚀 性能优化

### 算法优化
1. **预编译常量** - 所有数组和字符串常量都是 readonly
2. **高效正则** - 使用优化的正则表达式进行数字分割
3. **早期返回** - 在验证阶段尽早返回错误结果
4. **内存管理** - 避免不必要的字符串创建

### 构建优化
1. **Tree Shaking** - 支持按需导入
2. **多格式支持** - ESM、CommonJS、UMD 全支持
3. **TypeScript 编译** - 编译到 ES2018，平衡兼容性和性能
4. **压缩优化** - Rollup 自动压缩和优化

## 🐛 Bug 修复记录

### 关键修复 v0.0.24 (生活实际逻辑)
**问题**: 测试用例不符合生活实际情况，代码逻辑过于宽松

**核心改进**:
1. **连续字符检测** - 拒绝"壹壹"、"万万"等不合理重复
2. **单位层级验证** - 确保"万亿"、"壹万拾"等错误格式被拒绝  
3. **小数格式严格性** - 拒绝"点壹"、"壹点"等不完整格式
4. **生活逻辑优先** - 区分代码可以处理和生活中合理的差异

**实现算法**:
```typescript
// 连续字符检测
for (let i = 0; i < chineseStr.length - 1; i++) {
  if (chineseStr[i] === chineseStr[i + 1]) {
    return 0; // 连续相同字符，生活中不合理
  }
}

// 大单位重复检测
for (let i = 0; i < NUM_UNIT_ARRAY.length; i++) {
  const unit = NUM_UNIT_ARRAY[i];
  const firstIndex = chineseStr.indexOf(unit);
  const lastIndex = chineseStr.lastIndexOf(unit);
  if (firstIndex !== -1 && firstIndex !== lastIndex) {
    return 0; // 大单位重复
  }
}
```

**结果**: 测试通过率达到 100% (50/50)

### 历史修复 v0.0.23 (验证逻辑)
**问题**: `toNm` 函数对有效的中文数字返回 0

**根本原因**: `joinHz` 函数中的小数验证逻辑错误
- 对于不含小数点的输入如 "壹"，`dealHz` 返回 `["壹", ""]`
- 错误的逻辑 `if (parts.length > 1 && parts[1] === '')` 将其视为无效

**解决方案**: 修改验证逻辑
```typescript
// 修复前 (错误)
if (parts.length > 1) {
  if (parts[1] === '') return 0;
}

// 修复后 (正确) 
if (chineseStr.indexOf(POINT) >= 0) {
  if (parts[1] === '') return 0;
}
```

**结果**: 测试通过率从 70% 提升至 98%

## 📋 项目清单

### 已完成任务 ✅
- [x] 完整 TypeScript 重构
- [x] ESLint v9 flat config 配置
- [x] Prettier 代码格式化
- [x] 现代构建系统 (Rollup)
- [x] 完整测试覆盖 (50/50 通过)
- [x] 修复关键 bug (验证逻辑)
- [x] 实现生活化逻辑验证
- [x] 类型安全保证
- [x] 多模块格式支持
- [x] 智能连续字符检测
- [x] 完善项目文档

### 项目质量指标
- ✅ **100% 测试通过率** (50/50)
- ✅ **零技术债务** 
- ✅ **完整类型覆盖**
- ✅ **生产就绪状态**

## 🔮 未来规划

### 潜在改进
1. **更多数字系统支持** - 繁体中文数字
2. **国际化** - 多语言错误信息
3. **性能基准测试** - 建立性能回归测试
4. **插件系统** - 支持自定义数字格式

---

*本文档记录了 cn-nm 项目的完整技术实现和架构决策*