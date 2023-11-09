# vite 代码分割

Vite 生产环境使用 Rollup 进行打包，Rollup 底层的拆包 API——manualChunks，用对象配置和函数配置两种方式来自定义拆包策略

bundle 指的是整体的打包产物，包含 JS 和各种静态资源。
chunk 指的是打包后的 JS 文件，是 bundle 的子集。
vendor 是指第三方包的打包产物，是一种特殊的 chunk。

> 注意
>
> 传统单 chunk 打包模式下，从页面加载性能角度来说，存在一下问题：
>
> 1. 无法做到按需加载，即使是当前页面不需要的代码也会进行加载。
> 2. 线上缓存复用率极低，改动一行代码即可导致整个 bundle 产物缓存失效。

## Vite 默认拆包策略

Vite 默认拆包的优势在于实现了 CSS 代码分割与业务代码、第三方库代码、动态 import 模块代码三者的分离，但缺点也比较直观，第三方库的打包产物容易变得比较臃肿

## 自定义拆包策略

> vite-plugin-chunk-split

```ts
// vite.config.ts
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';

export default {
  chunkSplitPlugin({
    // 指定拆包策略
    customSplitting: {
      // 1. 支持填包名。`react` 和 `react-dom` 会被打包到一个名为`render-vendor`的 chunk 里面(包括它们的依赖，如 object-assign)
      'react-vendor': ['react', 'react-dom'],
      // 2. 支持填正则表达式。src 中 components 和 utils 下的所有文件被会被打包为`component-util`的 chunk 中
      'components-util': [/src\/components/, /src\/utils/]
    }
  })
}
```
