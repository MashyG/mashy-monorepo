# Typescript 中的 type 和 interface 的区别

1. 扩展性：interface 可以通过名称相同的方式扩展，而 type 不能
   ```ts
   interface User {
     name: string;
   }
   interface User {
     age: number;
   }
   // User 现在有 name 和 age 属性
   ```
2. 实现：类可以实现（implements）interface，但不能实现（implements）type
   ```ts
   interface IUser {
     name: string;
   }
   class User implements IUser {
     name: string;
   }
   ```
3. 类型别名：type 可以用来给任何类型创建一个别名，包括基本类型，联合类型，交叉类型等；而 interface 只能用来描述对象或函数的类型
   ```ts
   type StringOrNumber = string | number;
   ```
4. 字面量：type 可以表示字面量类型；interface 不能
   ```ts
   type Direction = "north" | "south" | "east" | "west";
   ```

> 总结：interface 更适合用于定义对象的形状或类的公共接口，而 type 则更为灵活，可以用来定义各种复杂的类型。

# 泛型

> 在 TypeScript 中，泛型是一种允许你编写灵活且可重用代码的技术。它们是类型的一部分，你可以用它们创建能够适应各种类型的组件或函数，而不仅仅只能处理一个特定类型的数据。通过这种方式，你可以避免代码重复和增加类型安全性。
> 泛型是一种特殊的变量，代表任何类型。在函数、接口或类中，我们通常用<T>这样的符号来表示泛型，其中"T"只是一种约定的表示符号，其实你可以使用任何的字母来代表泛型。

下面是一个使用了泛型的例子：

```ts
function identity<T>(arg: T): T {
  return arg;
}

let output = identity<string>("myString");
// 在以上代码中，我们定义了一个名为 identity 的函数，它包含一个类型为 T 的参数和一个类型为 T 的返回值。<T> 表示我们可以将任何类型传递给这个函数，这个函数也将返回相同的类型。然后我们调用了这个函数并传递了一个字符串 "myString"， 同时明确指定了泛型 T 的类型为 string。
```
