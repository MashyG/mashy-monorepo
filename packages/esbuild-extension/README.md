# esbuild

## Esbuild 性能极高？

1. 使用 Golang 开发。构建逻辑代码直接被编译为原生机器码，而不用像 JS 一样先代码解析为字节码，然后转换为机器码，大大节省了程序运行时间
2. 多核并发。内部打包算法充分利用多核 CPU 优势，所有步骤尽可能并行，这也得益于 GO 当中多线程共享内存的优势
3. 从零造轮子。几乎没有使用任何第三方库，所有逻辑自己编写，达到 AST 解析，小到字符串的操作，保证极致的代码性能
4. 搞笑的内存利用。Esbuild 中从头到尾尽可能地复用一份 AST 节点数据，而不用像 JS 打包工具中频繁地解析和传递 AST 数据（如 string -> TS -> JS -> string），造成内存的大量浪费

## 使用 Esbuild 有 2 种方式，分别是 命令行调用和代码调用

### 命令行调用

> 命令行的使用方式不够灵活,只能传入一些简单的命令行参数，稍微复杂的场景就不适用了

```shell
pnpm build
```

### 代码调用

> Esbuild 对外暴露了一系列的 API，主要包括两类: Build API 和 Transform API，我们可以在 Nodejs 代码中通过调用这些 API 来使用 Esbuild 的各种功能。

#### 项目打包——Build API

> Build API 主要用来进行项目打包，包括 build、buildSync 和 serve 三个方法

- build API

  [代码 - build](./scripts/build.js)

- buildSync API

  > buildSync API 问题：
  >
  > 1. 容易使 Esbuild 在当前线程阻塞，丧失并发任务处理的优势
  > 2. Esbuild 所有插件中都不能使用任何异步操作，这给插件开发增加了限制

```shell
node ./scripts/build.js
```

- serve API

  [代码 - build](./scripts/build-serve.js)

  > 后续每次在浏览器请求都会触发 Esbuild 重新构建，而每次重新构建都是一个增量构建的过程，耗时也会比首次构建少很多(一般能减少 70% 左右)。
  >
  > serve API 只适合在开发阶段使用，不适用于生产环境。
  >
  > serve 特点：
  >
  > 1. 开启 serve 模式后，将在指定的端口和目录上搭建一个静态文件服务，这个服务器用原生 Go 语言实现，性能比 Nodejs 更高。
  > 2. 类似 webpack-dev-server，所有的产物文件都默认不会写到磁盘，而是放在内存中，通过请求服务来访问。
  > 3. 每次请求到来时，都会进行重新构建(rebuild)，永远返回新的产物。

```shell
node ./scripts/build-serve.js
```

#### 单文件转译 - Transform API

[代码 - build](./scripts/transform.js)

> 除了项目的打包功能之后，Esbuild 还专门提供了单文件编译的能力，即 Transform API，与 Build API 类似，它也包含了同步和异步的两个方法，分别是 transformSync 和 transform。

```shell
node ./scripts/transform.js
```
