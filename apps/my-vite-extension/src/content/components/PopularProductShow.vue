<script setup>
import { ElButton } from 'element-plus'
import { ref, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  isHideBtn: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['changeDrawer'])

const product = computed(() => {
  return props.item
})

const isSubmitLoading = ref(false)

const handleAddProduct = () => {
  emit('changeDrawer', product.value)
}
</script>

<template>
  <img :src="product.imgUrl" class="rounded" />
  <div class="text-xs text-gray-400 py-1">{{ product.id }}</div>
  <div class="text-blue-600 overflow-hidden text-nowrap text-ellipsis">
    {{ product.name }}
  </div>
  <ElButton v-if="!isHideBtn" type="primary" @click="handleAddProduct" :loading="isSubmitLoading"
    >Select Product</ElButton
  >
</template>
