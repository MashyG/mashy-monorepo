# 模块化 css

> css 模块化的几个重要作用
>
> 1. 防止全局污染，样式被覆盖
> 2. 命名混乱
> 3. css 代码冗余，体积庞大

解决以上问题，有以下两种方式：

1. css module ，依赖于 webpack 构建和 css-loader 等 loader 处理，将 css 交给 js 来动态加载。
2. **css in js**

## CSS Module

[示例](../../../../apps/react-project/src/components/CSSModule.tsx)

在 vite 中，通过 CSS 文件名命名（[name].module.css）导入到 ts 文件中使用

```css
.text {
  color: royalblue;
}
```

另外的使用方式：

1. 全局变量

```css
:global(.text-bg) {
  background-color: sandybrown;
}
```

2. 组合样式 + from

```css
.baseText {
  composes: base from "./base.module.css";
  background-color: aquamarine;
}
```

### 总结

CSS Modules 优点：

1. CSS Modules 的类名都有自己的私有域的，可以避免类名重复/覆盖，全局污染问题。
2. 引入 css 更加灵活，css 模块之间可以互相组合。
3. class 类名生成规则配置灵活，方便压缩 class 名。

CSS Modules 的注意事项：

1. 仅用 class 类名定义 css ，不使用其他选择器。
2. 不要嵌套 css .a{ .b{} } 或者重叠 css .a .b {} 。

## CSS IN JS

> js 对象形式直接写 style

```jsx
const baseStyles = {
  fontSize: "16px",
};
const styles = {
  ...baseStyles, // 继承
  backgroundColor: "blue",
  padding: "10px",
  borderRadius: "5px",
  color: "white",
};
// 使用
<div style={styles}>CSS IN JS</div>;
```

### 第三方库 style-components

```jsx
import styled from "styled-components";
/* 给button标签添加样式，形成 Button React 组件 */
const Button = styled.button`
  background: blue;
`;

const NewButton = styled(Button)`
  background: red;
`;
export default function Index() {
  return (
    <div>
      <Button>按钮</Button>
      <NewButton>继承按钮</NewButton>
    </div>
  );
}
```

### 总结

CSS IN JS 特点。

1. CSS IN JS 本质上放弃了 css ，变成了 css in line 形式，所以根本上解决了全局污染，样式混乱等问题。
2. 运用起来灵活，可以运用 js 特性，更灵活地实现样式继承，动态添加样式等场景。
3. 由于编译器对 js 模块化支持度更高，使得可以在项目中更快地找到 style.js 样式文件，以及快捷引入文件中的样式常量。
4. 无须 webpack 额外配置 css，less 等文件类型。

CSS IN JS 注意事项。

虽然运用灵活，但是写样式不如 css 灵活，由于样式用 js 写，所以无法像 css 写样式那样可以支持语法高亮，样式自动补全等。所以要更加注意一些样式单词拼错的问题。
