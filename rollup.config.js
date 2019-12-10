import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  // sourceMap: 'inline',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 只编译我们的源代码,
      runtimeHelpers: true,
    }),
    eslint({
      exclude: 'node_modules/**',
    }),
    uglify(),
  ],
};
