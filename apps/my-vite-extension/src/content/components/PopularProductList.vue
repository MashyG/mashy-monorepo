<script setup lang="ts">
import PopularProductShow from './PopularProductShow.vue'

const emits = defineEmits(['del'])

const props = defineProps<{
  list: Array<any>
}>()

const handleDel = (index: number) => {
  emits('del', index)
}
</script>

<template>
  <div v-for="(item, index) in props.list" :key="item.id" class="p-2 w-1/2 text-center relative">
    <div
      id="del"
      class="absolute top-0 right-0 text-black bg-white rounded-full px-4 text-lg cursor-pointer"
      @click="() => handleDel(index)"
    >
      X
    </div>
    <PopularProductShow :item="item" isHideBtn />
  </div>
</template>
