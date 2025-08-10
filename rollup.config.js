const { defineConfig } = require('rollup');
const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package.json');

// 环境变量
const isProduction = process.env.NODE_ENV === 'production';
const isWatch = process.env.ROLLUP_WATCH === 'true';

// 动态配置
const libName = pkg.name;
const globalName = 'CnNm'; // 更符合规范的全局变量名

// Banner 模板
const createBanner = () => `/*!
 * ${libName}
 * ${pkg.description}
 * Author: ${pkg.author.name}
 * Email: ${pkg.author.email}
 * Repository: ${pkg.homepage}
 * Version: ${pkg.version}
 * License: ${pkg.license}
 */`;

// TypeScript 基础配置
const createTypeScriptPlugin = (target = 'es2018') => typescript({
  tsconfig: './tsconfig.json',
  declaration: true,
  declarationDir: './dist',
  rootDir: './src',
  // 编译优化
  exclude: ['**/*.test.ts', '**/*.spec.ts', 'test/**/*'],
  noEmitOnError: !isWatch, // watch 模式允许错误
  removeComments: isProduction,
  // 根据目标调整编译选项
  ...(target !== 'es2018' && {
    compilerOptions: {
      target: target
    }
  })
});

// Terser 优化配置
const createTerserPlugin = (options = {}) => terser({
  compress: {
    drop_console: options.dropConsole || false,
    drop_debugger: true,
    pure_funcs: options.dropConsole ? ['console.log', 'console.debug', 'console.info'] : ['console.debug'],
    passes: isProduction ? 2 : 1,
    // 数学优化
    unsafe_math: true,
    // 保持函数名（对调试友好）
    keep_fnames: !isProduction,
    ...options.compress
  },
  mangle: isProduction ? {
    // 压缩私有属性名
    properties: {
      regex: /^_/
    }
  } : false,
  format: {
    comments: /^!/, // 保留 banner
    beautify: !isProduction
  }
});

// 基础插件配置
const basePlugins = [
  resolve({
    preferBuiltins: true,
    browser: false
  }),
  commonjs({
    // 优化 CommonJS 转换
    ignoreTryCatch: false
  })
];

module.exports = defineConfig([
  // CommonJS 构建
  {
    input: 'src/cn-nm.ts',
    external: [], // 目前无外部依赖
    output: {
      file: `dist/${libName}.cjs.js`,
      format: 'cjs',
      banner: createBanner(),
      sourcemap: true,
      exports: 'named',
      interop: 'auto',
      strict: true,
      // 性能优化
      hoistTransitiveImports: false
    },
    plugins: [
      ...basePlugins,
      createTypeScriptPlugin(),
      // 只在生产环境或明确指定时压缩
      (isProduction && createTerserPlugin())
    ].filter(Boolean),
    // 构建优化
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },

  // ES Modules 构建
  {
    input: 'src/cn-nm.ts',
    external: [],
    output: {
      file: `dist/${libName}.es.js`,
      format: 'es',
      banner: createBanner(),
      sourcemap: true,
      // ES 模块特定优化
      generatedCode: {
        constBindings: true,
        arrowFunctions: true
      }
    },
    plugins: [
      ...basePlugins,
      createTypeScriptPlugin(),
      // ES 模块通常保持未压缩以便于调试
      (isProduction && createTerserPlugin({ dropConsole: false }))
    ].filter(Boolean),
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  },

  // UMD 构建（浏览器友好）
  {
    input: 'src/cn-nm.ts',
    external: [],
    output: {
      file: `dist/${libName}.umd.js`,
      format: 'umd',
      name: globalName,
      banner: createBanner(),
      sourcemap: true,
      exports: 'named',
      // UMD 特定配置
      globals: {},
      // 兼容性优化
      generatedCode: {
        constBindings: false, // UMD 需要更好的兼容性
        arrowFunctions: false
      }
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        ignoreTryCatch: false
      }),
      createTypeScriptPlugin('es5'), // 更好的浏览器兼容性
      // UMD 通常需要压缩
      createTerserPlugin({ 
        dropConsole: true,
        compress: {
          // 针对浏览器的额外优化
          inline: 2,
          reduce_vars: true,
          collapse_vars: true
        }
      })
    ],
    treeshake: {
      moduleSideEffects: false,
      propertyReadSideEffects: false,
      unknownGlobalSideEffects: false
    }
  }
]);

// 生产环境信息输出
if (isProduction) {
  console.log('🚀 Production build mode enabled');
  console.log('📦 Building optimized bundles...');
}