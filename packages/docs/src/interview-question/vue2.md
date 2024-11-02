# `data` 为什么要返回一个函数？

为了保证每个组件实例可以维护一份被返回对象的独立的拷贝。
如果 `data` 直接是一个对象，那么它就不再是独立的，当 `data` 在多个组件间共享时，一旦在一个组件中改变了 `data`，其他的组件也会受到影响

# `v-if` 和 `v-for` 为什么不推荐同时使用？

1. 优先级问题：`v-for` 的优先级高于 `v-if` (vue2)，如果同时使用，每次渲染都会先执行 `v-for`，然后在每个循环中执行 `v-if`，这样会导致**性能问题**，因为 `v-for` 需要遍历整个列表，无论 `v-if` 的条件是否满足。

2. 可读性问题：同时使用 `v-if` 和 `v-for` 会**使模板变得复杂，不易于理解和维护**。通常我们可以通过**计算属性**来替代这种用法，将筛选逻辑放在计算属性中，使模板保持简洁。

# `key` 有什么作用？

`key` 是一个特殊的属性，主要用于 Vue 的虚拟 DOM 算法，在新旧 nodes 对比时辨识 VNodes。
如果不使用 `key`，Vue 会使用一种最大限度减少动态元素并尽可能的尝试就地修改/复用相同类型元素的**算法 ①**。而使用 key，它会基于 `key` 的变化重新排列元素顺序，并且会移除 `key` 不存在的元素。

**有了 `key`，Vue 可以更准确地判断哪些元素对应哪些节点，从而更准确地进行 DOM 更新，提高应用性能。**

> **①** “就地更新”：主要思想是尽可能地复用现有的 DOM 节点，而不是创建新的节点。
> 在进行列表渲染时，如果没有提供 key 属性，Vue 会尽量就地复用和修改 DOM 节点，而不是移动或删除旧节点然后创建新节点，且*重新渲染时对整个列表进行更新*。这样可以**提高渲染性能**，因为操作 DOM 是非常消耗性能的。
>
> 但是，这种就地复用的策略有时候可能会导致一些不可预期的行为，特别是在涉及到状态保持或者节点的生命周期钩子函数时。因此，Vue 推荐在进行列表渲染时，总是提供 key 属性。

```ts
// 源码（src\core\vdom\patch.ts）
function updateChildren() {}
// 使用了「头尾指针」和「标记索引」的方式来进行比较和移动子节点
/**
 * updateChildren 方法的主要工作流程：
 * 1. 初始化头尾指针和标记索引。
 * 2. 进入循环，比较新旧子节点列表，直到头尾指针相遇为止。
 * 3. 在循环中，依次比较新旧子节点列表中的节点：
 *
 *    - 如果新旧节点相同（通过 sameVnode 函数判断），则进行「patchVnode」操作，即更新节点。
 *    - 如果新旧节点不同，则尝试在旧节点列表中找到与当前新节点相同的节点：
 *      - 如果找到了相同的节点，在新节点之前的旧节点中，将该节点移动到正确的位置，并更新节点。
 *      - 如果没有找到相同的节点，则创建新节点并插入到正确的位置。
 *
 * 4. 循环结束后，检查是否还有剩余的旧节点或新节点：
 *
 *    - 如果有剩余的旧节点，说明新节点列表比旧节点列表短，需要将剩余的旧节点删除。
 *    - 如果有剩余的新节点，说明新节点列表比旧节点列表长，需要将剩余的新节点插入到正确的位置。
 */
```

# `虚拟 DOM` 和 `diff` 算法的原理？

## 虚拟 `DOM`

是一个在内存中的轻量级 `JavaScript 对象`，它是`实际 DOM 的抽象表示`。Vue 通过虚拟 DOM 来**跟踪组件的状态变化**。当状态发生变化时，Vue 会生成一个新的虚拟 DOM，并将新旧虚拟 DOM 进行对比。

## diff 算法

是 Vue 在对比新旧虚拟 DOM 时使用的算法。

`diff 算法`的工作原理如下：

1. Vue 会遍历新的虚拟 DOM 树，并尝试找到与旧的虚拟 DOM 树相同的 "节点"。
2. 如果找到了相同的节点，Vue 会**更新 ②**这个节点的属性和事件。
3. 如果没有找到相同的节点，Vue 会创建一个新的节点，并将其**添加**到真实的 DOM 中。
4. 如果在旧的虚拟 DOM 树中存在节点，而在新的虚拟 DOM 树中不存在，Vue 会**删除**这个节点。

> 解释**更新 ②**操作：
>
> **节点类型不同**：如果新旧节点的类型不同，例如一个是 div 节点，一个是 p 节点，那么 Vue 会直接删除旧节点，并创建并插入新节点。
>
> **节点类型相同，但是属性不同**：如果新旧节点的类型相同，但是属性不同，例如 class 或 style 不同，那么 Vue 会复用旧节点，并更新其属性。
>
> **文本节点内容不同**：如果新旧节点都是文本节点，但是内容不同，那么 Vue 会直接更新文本内容。
>
> **列表节点中的子节点不同**：如果新旧节点都是列表节点，那么 Vue 会**递归**地对子节点进行 diff。这时候 key 属性就显得非常重要，因为 Vue 会根据 key 来判断哪些子节点可以复用。

# `computed` 计算属性如何缓存？

在 Vue 中，**每个计算属性都有一个对应的 watcher 实例**，这个 watcher 实例**负责追踪计算属性的依赖**（也就是计算属性的 getter 函数中访问的响应式数据）。

当我们访问一个计算属性时，Vue 会先检查这个计算属性对应的 `watcher`。`watcher` 有一个属性叫做 `dirty`，这个属性用来标记计算属性的依赖是否发生了变化。

- ① 如果 `dirty` 是 `true`，说明依赖的数据发生了变化，那么 `watcher` 会重新运行 `getter` 函数来计算新的结果，并将新的结果保存起来，同时将 `dirty` 设置为 `false`。
- ② 如果 `dirty` 是 `false`，说明依赖的数据没有变化，那么 `watcher` 就不会重新运行 `getter` 函数，而是直接返回上一次计算的结果。

```ts
// Vue2 源码（src\core\instance\state.ts）
function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate(); // ①
      }
      if (Dep.target) {
        if (__DEV__ && Dep.target.onTrack) {
          Dep.target.onTrack({
            effect: Dep.target,
            target: this,
            type: TrackOpTypes.GET,
            key,
          });
        }
        watcher.depend();
      }
      return watcher.value; // ②
    }
  };
}
```

# 计算属性 `computed` 和 侦听属性 `watch` 有何区别？

1. 从**使用场景**来看：计算属性适合用在模板渲染中，某个值是*依赖了其它的响应式对象甚至是其它计算属性计算得来的*；而侦听属性适用于*观测某个值的变化去完成一段复杂的业务逻辑*。
2. 从**内部实现**来看：计算属性和侦听属性在 Vue 内部都是通过 watcher 来实现的，但是它们的工作方式不同。计算属性的 computed 会*缓存*计算结果，并且只有在依赖数据改变时才会重新计算。而侦听属性的 watcher 在数据每次改变时都会执行回调函数。

# `watch` 内部实现是怎样的？

在 Vue 中，watch 选项的内部实现主要依赖于 Vue 的响应式系统和 Watcher 类。

当你在 Vue 实例中定义了 watch 选项时，Vue 会遍历 watch 对象的每一个属性，对每一个属性创建一个 Watcher 实例。这个 Watcher 实例的任务就是观察它所对应的属性值的变化。

Watcher 实例在创建时，会读取它所对应的属性的当前值，并收集这个属性的依赖。这个过程是通过调用属性的 getter 函数完成的。在这个过程中，Watcher 实例会被添加到这个属性的依赖列表中。

当这个属性的值发生变化时，Vue 的响应式系统会通知所有依赖这个属性的 Watcher 实例。Watcher 实例在接到通知后，会重新读取属性的新值，并调用 watch 选项中定义的回调函数，将新值和旧值作为参数传入。

# `v-model` 的实现原理？

> 实现原理可以分为两个方面：属性绑定和事件绑定。
>
> 属性绑定：当使用 v-model 指令时，Vue 会将一个值绑定到表单元素或组件的 value 属性（或 checked、selected 等属性）上。这样，当用户输入或选择内容时，实际上是在改变这个值。同时，Vue 还会为这个元素或组件注册一个 input 事件监听器。
>
> 事件绑定：当用户在表单元素中输入内容时，例如输入框中键入文字，Vue 会捕获到 input 事件。然后，Vue 会更新与 v-model 指令绑定的数据模型，将输入的值赋给这个模型。这样，数据模型的变化会自动反映到表单元素上，实现了双向数据绑定。
>
> 简而言之，**v-model 指令通过属性绑定将数据模型与表单元素或组件的属性进行绑定，并通过事件绑定将用户的输入同步到数据模型中，从而实现了双向的数据绑定。**

假设我们有一个简单的 Vue 组件，它是一个输入框组件，可以接受用户的输入并将其显示出来。组件代码如下：

```vue
<template>
  <input
    v-bind:value="inputValue"
    v-on:input="updateValue($event.target.value)"
  />
</template>

<script>
export default {
  data() {
    return {
      inputValue: "",
    };
  },
  methods: {
    updateValue(value) {
      this.inputValue = value;
    },
  },
};
</script>
```

在这个组件中，我们使用了`v-model`指令，它绑定了`inputValue`这个数据模型。下面是一个使用该组件的示例：

```vue
<template>
  <div>
    <my-input v-model="message"></my-input>
    <p>输入的内容：{{ message }}</p>
  </div>
</template>

<script>
import MyInput from "./MyInput.vue";

export default {
  components: {
    MyInput,
  },
  data() {
    return {
      message: "",
    };
  },
};
</script>
```

在这个示例中，我们在父组件中使用了`v-model="message"`，这意味着`message`变量将与子组件的`inputValue`数据模型进行双向绑定。

当用户在输入框中输入内容时，输入框的`input`事件将被触发。然后，子组件的`updateValue`方法会被调用，将输入框的值更新到`inputValue`数据模型中。由于双向绑定的机制，`message`变量也会相应地更新。因此，无论是在输入框中输入内容，还是在`<p>`标签中显示的内容，都会保持同步。

# `.sync`、`.lazy`、`.number` 和 `.trim` 修饰符的作用？

- `.sync` 是一个特殊的修饰符，用于实现子组件和父组件之间的双向数据绑定。这是一个简化的替代方案，用于代替在子组件中触发一个事件，然后在父组件中响应这个事件来更新一个 prop 的值。
- `.lazy`：在 `v-model` 中使用，用于改变输入框的更新时机。默认情况下，`v-model` 在每次 input 事件触发后将输入框的值与数据进行同步。使用 `.lazy` 修饰符后，变为在 `change` 事件（例如，离开输入框或按下 Enter 键）触发后同步。
- `.number`：如果想自动将用户的输入值转为 Number 类型（如果原始值的转换结果为 NaN 则返回原始值），可以添加一个 number 修饰符到 v-model 上处理输入值。
- `.trim`：如果要自动过滤用户输入的首尾空白字符，可以添加 trim 修饰符到 `v-model` 上处理输入值。

# 响应式原理中 `Object.defineProperty` 和 `Proxy` 区别

> `Proxy` 提供了更全面和强大的拦截能力，但 `Object.defineProperty` 在处理单个属性时可能更简单和直接

## `Object.defineProperty` 和 `Proxy` 都可以用来拦截和定义对象的行为，但它们在使用方式和能力上有一些重要的区别。

1. `Object.defineProperty` 可以用来**精确地添加或修改对象的属性**。你可以控制属性的可枚举性、可配置性和可写性，还可以定义 `getter` 和 `setter` 函数。然而，`Object.defineProperty` 只能作用于单个属性。

```js
let obj = {};
Object.defineProperty(obj, "prop", {
  value: "hello",
  writable: false,
  enumerable: true,
  configurable: true,
});
```

2. `Proxy` 提供了一种**机制**，可以**定义或修改基本操作的行为**，如属性查找、赋值、枚举、函数调用等。与 `Object.defineProperty` 不同，`Proxy` 可以拦截对象的所有属性，不仅仅是一个。

```js
let obj = new Proxy(
  {},
  {
    get: function (target, prop, receiver) {
      console.log(`getting ${prop}!`);
      return Reflect.get(target, prop, receiver);
    },
    set: function (target, prop, value, receiver) {
      console.log(`setting ${prop}!`);
      return Reflect.set(target, prop, value, receiver);
    },
  }
);
```

# `keep-alive` 是什么？有什么作用？有哪些生命周期钩子函数？与在 Vue3 中的区别？

> `<keep-alive>` 是 Vue 提供的一个**抽象组件**，用于保留组件状态或避免重新渲染。

## 作用

- 保留组件状态：当组件在 <keep-alive> 内部被切换时，组件实例不会被销毁，而是被缓存起来，下次再切换回来时，可以直接从缓存中恢复，而不需要重新创建和渲染。

- 避免重新渲染：由于组件实例被缓存，所以当组件切换时，不需要重新渲染，可以提高性能。

```html
<!-- currentTabComponent 可以动态切换，但无论切换到哪个组件，都会被 <keep-alive> 缓存起来。 -->
<keep-alive>
  <component :is="currentTabComponent"></component>
</keep-alive>
```

## 区别

- 在 Vue 2 中，`<keep-alive>` 提供了 `include、exclude` 属性来决定哪些组件可以被缓存，这两个属性接受字符串或正则表达式。

- 在 Vue 3 中，`<keep-alive>` 的 `include、exclude` 属性被移除，取而代之的是 `max` 属性，用于限制被缓存组件的数量。

## 生命周期钩子函数

1. `activated`：当组件被激活时触发。
2. `deactivated`：当组件被停用时触发。

# `nextTick`

> `Vue.nextTick()` 是 Vue 的一个全局 API，用于延迟执行一段代码，使其在下次 DOM 更新循环结束之后执行。这在修改数据之后立即使用 DOM 可能还没更新的情况下非常有用。

## `nextTick` 作用

1. **延迟执行代码**: Vue.nextTick() 可以接受一个回调函数作为参数，在下次 DOM 更新循环结束之后执行该回调函数。
2. **返回 Promise**: 如果没有提供回调函数，Vue.nextTick() 返回一个 Promise。

### **注意**

在 Vue 3 中，由于 Vue 的全局 API 已经被移除，nextTick() 现在是一个导出的函数，需要单独导入。

## `nextTick` 实现原理

Vue 的 nextTick 函数的实现主要涉及到 JavaScript 的**事件循环**和**微任务队列**。

> 在 JavaScript 中，有一个称为事件循环的概念，它负责处理异步任务。事件循环有一个微任务队列，用于存放所有的微任务。Promise 的回调函数就是一个典型的微任务。

> 如果环境不支持 Promise，Vue 会尝试使用其他的异步 API，如 MutationObserver 或 setImmediate，如果这些 API 也不支持，最后会退化到使用 setTimeout。

## 使用场景

1. 在修改数据后立即使用这个数据。由于 Vue.js 的更新是异步的，当数据变化后，DOM 不会立即更新，而是等待所有数据变化完成后，再统一进行 DOM 更新。nextTick 就是为了在数据变化后，下一次 DOM 更新循环开始之前，修改 DOM。

```js
this.message = "Hello";
Vue.nextTick(() => {
  //DOM 更新已完成
  this.$el.textContent === "Hello";
});
```

2. 在树中的无根的组件中，用于延迟挂载事件监听器等操作。因为组件在被实例化创建后，并不会马上插入到 DOM 中，当我们需要在组件或指令的生命周期中操作子组件的 DOM 或实例时，应该放在 Vue.nextTick() 里。

> 总的来说，Vue.js 的 nextTick 方法是一个重要的工具，特别是当你需要在 DOM 状态更新后去操作 DOM 的时候。

# Vuex 中的 `mutations` 为什么是同步的？

1. **易于追踪状态变化**：Vuex 使用单一状态树，所有的状态都是响应式的。当我们在组件中改变状态时，视图会自动更新。如果 mutations 是异步的，那么我们就无法准确地追踪状态在何时何地被改变，这使得状态的变化变得难以追踪。

2. **保证数据一致性**：如果允许异步修改状态，可能会导致在一个 mutation 完成前，另一个 mutation 已经开始执行，这可能会导致数据不一致。

3. **Devtools 的时间旅行功能**：Vuex 配合 devtools 可以做到时间旅行的功能，即在开发过程中，你可以任意地切换状态的历史快照，以便查看不同状态下的应用界面。如果 mutations 是异步的，那么这个功能就无法正确地工作。

# `slot`

> 在 Vue 中，slot 是一种分发内容的机制，允许我们在组件模板中插入子组件或者文本。

## 默认插槽

> 如果在子组件模板中使用 `<slot></slot>`，那么父组件在使用子组件时，可以在子组件标签内部写入内容，这些内容会替换掉子组件模板中的 `<slot></slot>`。

```html
<!-- 子组件 -->
<template>
  <div>
    <slot></slot>
  </div>
</template>

<!-- 父组件 -->
<template>
  <ChildComponent>这是插槽内容</ChildComponent>
</template>
```

## 具名插槽

> 可以使用 slot 属性给插槽命名，然后在父组件中使用 <template v-slot:插槽名> 来向具名插槽提供内容。

```html
<!-- 子组件 -->
<template>
  <div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<!-- 父组件 -->
<template>
  <ChildComponent>
    <template v-slot:header>这是头部插槽内容</template>
    这是默认插槽内容
    <template v-slot:footer>这是底部插槽内容</template>
  </ChildComponent>
</template>
```

## 与 Vue3 的区别

在 Vue 2 和 Vue 3 中，slot 的不同之处主要在于作用域插槽的语法变化：

- 在 Vue 2 中，作用域插槽的语法是 `<slot name="xxx" :data="data"></slot>` 和 `<template slot="xxx" slot-scope="props"></template>`。

- 在 Vue 3 中，作用域插槽的语法变为 `<slot name="xxx" :data="data"></slot>` 和 `<template v-slot:xxx="props"></template>`。

# v-for 和 v-if 优先级

## vue2：v-for 比 v-if 优先级高

## vue3：v-if 比 v-for 优先级高

# 如何操作子组件？

1. 通过 `ref` 属性 (**√**)
2. `$children` 和 `$parent` (**×**)
3. 使用自定义事件 (**×**)
