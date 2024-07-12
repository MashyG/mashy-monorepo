# Next Blog

## next-mdx-remote

> 动态读取 `mdx` 文件内容

## Contentlayer

[Contentlayer 配置](./contentlayer.config.ts)

> 内容层。它会将内容转为数据

## SEO

1. **使用服务器组件**：将主体内容渲染成 HTML 返回给爬虫
2. **使用 Streaming**：改善了首次页面呈现时间等性能指标
3. **使用 Image 组件**：默认都做了阻止布局偏移处理
4. **使用 Font 组件**：默认都做了阻止布局偏移处理

## 深色模式

### 媒体查询：根据系统的主题色调整网页基础样式

```css
:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}
```

### JS 查询

> Web API 提供了 `Window.matchMedia()` 方法，它会返回一个新的 `MediaQueryList` 对象，表示指定的媒体查询字符串解析后的结果。返回的 MediaQueryList 可被用于判定 Document 是否匹配媒体查询，或者监控一个 document 来判定它匹配了或者停止匹配了此媒体查询。

#### 判断浏览器是否支持深色模式

```js
if (window.matchMedia("(prefers-color-scheme)").media !== "not all") {
  console.log("🎉 Dark mode is supported");
}
```

#### 监听深色模式变化

```js
const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

darkModeMediaQuery.addEventListener("change", (e) => {
  const darkModeOn = e.matches;
  console.log(`Dark mode is ${darkModeOn ? "🌒 on" : "☀️ off"}.`);
});
```

### 第三方库

`pnpm i next-themes @headlessui/react `
