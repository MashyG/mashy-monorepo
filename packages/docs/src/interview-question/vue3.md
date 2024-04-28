# Vue2 和 Vue3 生命周期的区别

Vue 2 和 Vue 3 中的生命周期钩子函数的对应关系：

| Vue 2         | Vue 3             |
| ------------- | ----------------- |
| beforeCreate  | setup             |
| created       | setup             |
| beforeMount   | onBeforeMount     |
| mounted       | onMounted         |
| beforeUpdate  | onBeforeUpdate    |
| updated       | onUpdated         |
| beforeDestroy | onBeforeUnmount   |
| destroyed     | onUnmounted       |
| errorCaptured | onErrorCaptured   |
|               | onRenderTracked   |
|               | onRenderTriggered |

> 注意，Vue 3 中没有 `beforeCreate` 和 `created` 生命周期钩子，它们的功能被 `setup` 函数取代。`setup` 函数是 Vue 3 中新的 Composition API 的一部分，它在组件实例被创建和初始化 props 之后调用。
>
> 此外，Vue 3 中新增了 `onRenderTracked` 和 `onRenderTriggered` 两个生命周期钩子，它们用于**跟踪和触发组件的重新渲染**。

# beforeDestroy/onBeforeUnmount 钩子函数的有哪些作用？

进行任何类型的清理工作：

1.  取消所有的事件监听器
2.  停止正在运行的计时器
3.  解除与其他组件或库的绑定

# errorCaptured/onErrorCaptured 钩子函数是干嘛的？

当组件的渲染函数或者其中的所有生命周期钩子函数抛出错误时，errorCaptured 钩子函数会被调用。这个钩子函数接收三个参数：错误对象、发生错误的组件实例和一个字符串，表示错误来源。

如果这个钩子函数返回 false，那么错误会继续向上冒泡，被父组件的 errorCaptured 钩子函数或者全局的 Vue.config.errorHandler 函数捕获。

# setup 函数的主要作用有哪些？

1. 声明响应式数据
2. 定义计算属性
3. 定义方法
4. 使用生命周期钩子函数
5. 使用其他的 Composition API

# vue3 setup 函数中，父组件如何调用子组件的方法？

> ChildComponent 的 setup 函数返回了一个对象，这个对象包含了 childMethod 方法。然后在 ParentComponent 中，我们通过 ref 创建了一个引用 childRef，并在模板中将这个引用绑定到 child-component 上。这样，我们就可以在 ParentComponent 的 setup 函数中通过 childRef.value.childMethod() 来调用 ChildComponent 的 childMethod 方法了。

```vue
<!-- ChildComponent.vue -->
<template>
  <div>Child Component</div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const childMethod = () => {
      console.log("Child method is called.");
    };

    // 将方法暴露给父组件
    return {
      childMethod,
    };
  },
};
</script>

<!-- ParentComponent.vue -->
<template>
  <child-component ref="childRef"></child-component>
  <button @click="callChildMethod">Call Child Method</button>
</template>

<script>
import { ref, onMounted } from "vue";
import ChildComponent from "./ChildComponent.vue";

export default {
  components: {
    ChildComponent,
  },
  setup() {
    const childRef = ref(null);

    const callChildMethod = () => {
      childRef.value.childMethod();
    };

    onMounted(() => {
      callChildMethod();
    });

    return {
      childRef,
      callChildMethod,
    };
  },
};
</script>
```

# `effect` 和 `watchEffect` 有何区别？

1. **依赖追踪**： `watchEffect` 在函数内部自动追踪响应式数据的变化；而 `effect` 需要手动指定依赖项。
2. **触发时机**： `watchEffect` 在创建时立即执行；而 `effect` 在创建时不会立即执行，会在创建后的下一个事件循环周期或手动调用 `trigger` 时执行。
