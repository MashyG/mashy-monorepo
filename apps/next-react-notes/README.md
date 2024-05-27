# project Next-React-notes

> 首先需要在本机安装 `redis`

项目启动：

```shell
pnpm i
pnpm dev
```

## 数据库查询

### 展示所有数据表

```shell
show databases;
```

## 定义数据模型，数据模型需要与数据库保持一致

我们有两种方式使其保持一致：

1. 手动修改数据模型，然后运行 npx prisma migrate dev 修改数据库，使其保持一致
2. 手动修改数据库，然后运行 npx prisma db pull 修改数据模型，使其保持一致

> 注意：
> 修改了 schema，运行 `npx prisma migrate dev`，将修改同步数据库，migrate 会自动更新 Prisma Client，所以无须再运行 `prisma generate`

## Prisma Studio

`npx prisma studio`
打开一个网页,可以在这个页面查看和编辑数据库中的数据

## Prisma schema

### 模型 { 字段名称 字段类型 [类型修饰符] [属性] }

```prisma
model Post {
  id  Int @id @default(autoincrement())
  name String?
  favoriteColors String[]
}
```

#### 字段类型

字段类型有 `String`、`Boolean`、`Int`、`BigInt`、`Float`、`Decimal（存储精确小数值）`、`DateTime`、`Json`、` Bytes（存储文件）``、Unsupported `

字段类型还可以是数据库底层数据类型，通过 `@db.` 描述，比如 `@db.VarChar(255)`, varchar 正是 MySQL 支持的底层数据类型。

#### 类型修饰符

1. `[]` 表示字段是数组
2. `?` 表示字段可选

> 目前 Prisma 不支持可选数组，也就是这两个类型修饰符不能同时用。如果你有需要，那就创建数据的时候创建一个空数组。

#### 属性

> 属性的作用是修改字段或块（model）的行为
> 影响字段的属性用 `@` 作为前缀，影响块的属性用 `@@` 作为前缀

```prisma
model User {
  id        Int    @id @default(autoincrement())
  firstName String @map("first_name")
  @@map("users")
}
/**
 * map的作用是映射:
 * @map("first_name") 表示 `firstName` 字段映射数据库中的 `first_name` 字段
  * @@map("users")表示 `User` 映射数据库的中的 `users` 表
*/
```

具体影响字段的属性有：

1. ` @id`（设置**主键 PRIMARY KEY**）
2. `@default`（设置字段**默认值**）
3. `@unique`（**唯一**约束，表示该字段值唯一，设置后可以用 findUnique 来查找）
4. `@relation`（设置**外键** FOREIGN KEY/ REFERENCES，**用于建立表与表之间的关联**）
5. `@map`（**映射数据库中的字段**）
6. `@updatedAt`（自动存储记录更新的时间）
7. `@ignore`（该字段会被忽略，不会生成到 Prisma Client 中）

影响块的属性有：

1. `@@id`：相当于关系型数据库中复合主键

```prisma
model User {
  firstName String
  lastName  String
  email     String  @unique
  isAdmin   Boolean @default(false)

  @@id([firstName, lastName])
}
// firstName 和 lastName 共同组成主键，允许 firstName 或 lastName 单独重复，但不能一起重复。

// 创建时
const user = await prisma.user.create({
  data: {
    firstName: 'Alice',
    lastName: 'Smith',
  },
})


// 查询时
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: {
      firstName: 'Alice',
      lastName: 'Smith',
    },
  },
})

```

2. `@@unique`：复合唯一约束

```prisma
// 定义时
model User {
  id        Int     @default(autoincrement())
  firstName String
  lastName  String
  isAdmin   Boolean @default(false)

  @@unique([firstName, lastName])
}

// 查询时
const user = await prisma.user.findUnique({
  where: {
    firstName_lastName: {
      firstName: 'Alice',
      lastName: 'Smith'
    },
  },
})
```

3. `@@index`：创建数据库索引
4. `@@map`：映射数据库表名
5. `@@ignore`：忽略此模型
6. `@@schema`：在支持 `multiSchema` 的时候使用，比如搭配 `supabase`，为 model 添加授权相关的字段 `@@schema("auth")`

#### 属性函数

```prisma
model User {
  id       Int    @id @default(autoincrement())
}
// @default 中的 autoincrement() 被称为属性函数
```

1. `auto()`：由数据库自动生成，只用于 Mongodb 数据库（因为 Mongodb 的 \_id 是自动生成的）：

```prisma
model User {
  id   String  @id @default(auto()) @map("_id") @db.ObjectId
}
```

2. `autoincrement()`：自动增长，只用于关系型数据库：

```prisma
model User {
  id   Int    @id @default(autoincrement())
  name String
}
```

3. `cuid()`：基于 `cuid` 规范生成唯一标识符，适用于浏览器环境中
4. `uuid()`：基于 `uuid` 规范生成唯一标识符
5. `now()`：创建记录的时间戳
6. `dbgenerated()`：无法在 Prisma schema 中表示的默认值（如 random()）

### 操作数据库 Prisma Client

- **增**：`create()`、`createMany()`
- **删**：`delete()`、`deleteMany()`
- **改**：`update()`、`upsert()`（找不到就创建）、`updateMany()`
- **查**：`findUnique()`(需要有 `@unique` 属性)`、findUniqueOrThrow()`（找不到就报错）、`findFirst()`（找第一个）、`findFirstOrThrow()`（找不到就报错）、`findMany()`
- **其他**：`count()`、`aggregate()`（聚合）、`groupBy()`

#### 查询参数

其查询参数除了 `where` 用于条件查找之外，还有：

- `include` 用于**定义返回的结果中包含的关系**
- `select` 用于**选择返回的字段**
- `orderBy` 用于**排序**
- `distinct` 用于**去重**

#### 筛选条件

筛选条件支持 `equals、not、in、notIn、lt、lte、gt、gte、contains、search、mode、startsWith、endsWith、AND、OR、NOT`

```ts
const result = await prisma.post.findMany({
  where: {
    OR: [
      {
        title: {
          contains: "Prisma",
        },
      },
      {
        title: {
          contains: "databases",
        },
      },
    ],
    AND: {
      published: false,
    },
  },
});
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
