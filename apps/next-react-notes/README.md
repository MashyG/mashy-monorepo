# project Next-React-notes

> 首先需要在本机安装 `redis`

项目启动：

```shell
pnpm i
pnpm dev
```

## React Server Components Payload (RSC Payload)

**使用这种格式的优势在于它针对流做了优化，数据是分行的，它们可以以流的形式逐行从服务端发送给客户端，客户端可以逐行解析 RSC Payload，渐进式渲染页面。**

## SSR（传统的 SSR，想想 Pages Router 下的 SSR 实现） 和 RSC 的区别：

> RSC 实现的关键就在于服务端组件没有被渲染成 HTML，而是一种特殊的格式（RSC Payload）

1. RSC 的代码不会发送到客户端，但传统 SSR 所有组件的代码都会被发送到客户端
2. RSC 可以在组件树中任意位置获取后端，传统 SSR 只能在顶层（getServerSideProps）访问后端
3. 服务器组件可以重新获取，而不会丢失其树内的客户端状态

## 客户端缓存功能

路由缓存存放在浏览器的临时缓存中，有两个因素决定了路由缓存的持续时间：

1. Session，缓存在导航期间会持续存在，当页面刷新的时候会被清除
2. 自动失效期：单个路由段会在特定时长后自动失效，如果路由是静态渲染，持续 5 分钟，如果是动态渲染，持续 30s

## Server Actions 基本注意项

### 定义在 actions 的代码要注意：

1. 从 `formData` 中获取提交的数据
2. 使用 `zod` 进行数据校验
3. 使用 `revalidate` 更新数据缓存
4. 返回合适的信息

### 定义表单的代码要注意：

搭配使用 `useFormState` 和 `useFormStatus`
特殊数据使用隐藏 input 提交
