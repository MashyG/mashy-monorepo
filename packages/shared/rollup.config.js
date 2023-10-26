import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

/**
 * @type { import('rollup').RollupOptions }
 */
const buildOptions = {
  // 产物入口
  input: ['src/index.ts'],
  // 产物输出目录
  output: [
    {
      dir: 'dist/es',
      format: 'esm',
    },
    {
      dir: 'dist/cjs',
      // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
      format: 'cjs',
      // 加入 terser 插件，用来压缩代码
      plugins: [terser()]
      // 以下三个配置项都可以使用这些占位符:
      // 1. [name]: 去除文件后缀后的文件名
      // 2. [hash]: 根据文件名和文件内容生成的 hash 值
      // 3. [format]: 产物模块格式，如 es、cjs
      // 4. [extname]: 产物后缀名(带`.`)
      // 入口模块的输出文件名
      // entryFileNames: `[name].js`,
      // 非入口模块(如动态 import)的输出文件名
      // chunkFileNames: 'chunk-[hash].js',
      // 静态资源文件输出文件名
      // assetFileNames: 'assets/[name]-[hash][extname]',
      // 是否生成 sourcemap 文件
      // sourcemap: true,
      // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
      // name: 'MyBundle',
      // 全局变量声明
      // globals: {
      //   // 项目中可以直接用`$`代替`jquery`
      //   jquery: '$'
      // }
    }
  ],
  plugins: [
    replace({
      'import.meta.vitest': 'undefined',
      preventAssignment: true
    }),
    typescript(),
    resolve(),
    commonjs()
    // @rollup/plugin-json： 支持.json的加载，并配合rollup的Tree Shaking机制去掉未使用的部分，进行按需打包。
    // @rollup/plugin-babel：在 Rollup 中使用 Babel 进行 JS 代码的语法转译。
    // @rollup/plugin-alias：支持别名配置。
    // rollup-plugin-visualizer: 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。
  ]
  // 对于某些第三方包，有时候我们不想让 Rollup 进行打包，也可以通过 external 进行外部化
  // external: ['react', 'react-dom']
}
export default buildOptions

// /**
//  * @type { import('rollup').RollupOptions }
//  */
// const buildIndexOptions = {
//   // 产物入口
//   input: ['src/index.ts'],
//   // 产物输出目录
//   output: [
//     {
//       dir: 'dist/es',
//       format: 'esm'
//     },
//     {
//       dir: 'dist/cjs',
//       format: 'cjs'
//     }
//   ],
//   plugins: [
//     replace({
//       'import.meta.vitest': 'undefined',
//       preventAssignment: true
//     }),
//     typescript()
//   ]
// }

// /**
//  * @type { import('rollup').RollupOptions }
//  */
// const buildNumberOptions = {
//   // 产物入口
//   input: ['src/number.ts'],
//   // 产物输出目录
//   output: [
//     {
//       dir: 'dist/es',
//       format: 'esm'
//     },
//     {
//       dir: 'dist/cjs',
//       // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
//       format: 'cjs',
//         // 以下三个配置项都可以使用这些占位符:
//       // 1. [name]: 去除文件后缀后的文件名
//       // 2. [hash]: 根据文件名和文件内容生成的 hash 值
//       // 3. [format]: 产物模块格式，如 es、cjs
//       // 4. [extname]: 产物后缀名(带`.`)
//       // 入口模块的输出文件名
//       // entryFileNames: `[name].js`,
//       // 非入口模块(如动态 import)的输出文件名
//       // chunkFileNames: 'chunk-[hash].js',
//       // 静态资源文件输出文件名
//       // assetFileNames: 'assets/[name]-[hash][extname]',
//       // 是否生成 sourcemap 文件
//       // sourcemap: true,
//       // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
//       // name: 'MyBundle',
//       // 全局变量声明
//       // globals: {
//       //   // 项目中可以直接用`$`代替`jquery`
//       //   jquery: '$'
//       // }
//     }
//   ],
//   plugins: [
//     replace({
//       'import.meta.vitest': 'undefined',
//       preventAssignment: true
//     }),
//     typescript()
//   ]
// }

// export default [buildIndexOptions, buildNumberOptions]
