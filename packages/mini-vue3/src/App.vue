<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

const msg = ref('Vite + Vue')
const simpleNum = ref(0)
const obj = reactive({num: 0})

watch(obj, (newValue, oldValue) => {
  console.log('obj', newValue, oldValue)
})
watch(simpleNum, (newValue, oldValue) => {
  console.log('simpleNum', newValue, oldValue)
})

const changeNum = () => {
  obj.num++
}
const changeSimpleNum = () => {
  simpleNum.value++
}

const nums = computed(() => {
  return obj.num + simpleNum.value
})
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <h1>{{ msg }}</h1>
  <div>{{ obj }}</div>
  <button @click="changeNum">changeNum</button>
  <div>{{ simpleNum }}</div>
  <button @click="changeSimpleNum">changeSimpleNum</button>
  <div>computed:   {{ nums }}</div>
  
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
