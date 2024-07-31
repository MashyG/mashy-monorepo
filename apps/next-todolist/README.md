# TO-DO-LIST APP

## process

### init

```shell

  # install dependencies
pnpm install
 # install prisma
pnpm install prisma --save-dev
 # init prisma
npx prisma init

```

### prisma settings

[prisma 文档](./prisma/schema.prisma)

```shell
# 手动修改数据模型，然后运行下面命令 修改数据库，使其保持一致
npx prisma migrate dev

# 手动修改数据库，然后运行下面命令 修改数据模型，使其保持一致
npx prisma db pull
```

## 产品详情

### 用户分类：

超级管理员 0：管理用户，增删改查事件/评论；
发起者：增删改查事件，评论事件；
参与者：完成事件，评论事件。

### 数据库表

用户表：
ID，名称，密码，状态（正常 1，已删 0），类型（超管 0，普通用户 1）

事件内容表：
创建者 ID，内容 ID，内容 content，参与者 ID，状态（未开始 0，进行中 1，已完成 2，已删除 3），评论 ID，创建时间，更新时间。

评论表：
ID，内容，创建者 ID，创建时间。

### 接口（9 个）：

用户：
api/user/list  GET
api/user  POST，POST（超管）

事件：
api/content/list  GET
api/content   GET, POST（事件创建者）
api/content/editSatus  POST（创建者，参与者）

评论：
api/comment/add  POST
api/comment/edit  POST
api/comment/list  GET（超管）

### 页面

tab：首页，我的（基本信息，用户管理）

登录页面：
账号密码登录，

首页：
展示全部与我有关，进行中的列表，（超管展示所有事件）

事件详情页：
编辑（创建者），评论；
进行中状态功能：完成按钮（设置事件状态为已完成，并添加到评论）；
已完成状态功能：撤销按钮（设置事件状态为进行中，并添加到评论）；
自由评论（参与者和创建者）

事件编辑页：
内容，参与者，状态（未开始，进行中）
