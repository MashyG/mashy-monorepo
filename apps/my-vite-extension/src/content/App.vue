<script setup>
import DragBox from './components/DragBox.vue'
import PopularProducts from './components/PopularProducts.vue'
</script>

<template>
  <DragBox>
    <div
      class="w-[600px] max-h-[500px] overflow-auto bg-white shadow-md rounded-md p-4 border border-solid border-blue-400"
    >
      <PopularProducts /></div
  ></DragBox>
</template>

<style scoped></style>
