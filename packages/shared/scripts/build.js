// build.js
import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// 常用 inputOptions 配置
const inputOptions = {
  input: './src/index.ts',
  plugins: [
    replace({
      'import.meta.vitest': 'undefined',
      preventAssignment: true
    }),
    typescript(),
    resolve(),
    commonjs()
  ]
}

const outputOptionsList = [
  // 常用 outputOptions 配置
  {
    dir: 'dist/es',
    format: 'esm'
  }
  // 省略其它的输出配置
]

async function build() {
  let bundle
  let buildFailed = false
  try {
    // 1. 调用 rollup 生成 bundle 对象
    bundle = await rollup(inputOptions)
    for (const outputOptions of outputOptionsList) {
      // 2. 拿到 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
      const { output } = await bundle.generate(outputOptions)
      await bundle.write(outputOptions)
    }
  } catch (error) {
    buildFailed = true
    console.error(error)
  }
  if (bundle) {
    // 最后调用 bundle.close 方法结束打包
    await bundle.close()
  }
  console.log('🚀🚀🚀🚀🚀🚀🚀 build by js success')
  process.exit(buildFailed ? 1 : 0)
}

build()
