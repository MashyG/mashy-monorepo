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
