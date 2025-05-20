<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElInput, ElButton, ElSwitch, ElDivider } from 'element-plus'

const emits = defineEmits(['del', 'update'])

const props = defineProps<{
  list: Array<any>
}>()

const curList = ref<Array<any>>([])
const isUpdateLoading = ref(false)

watch(
  () => props.list,
  () => {
    if (JSON.stringify(props.list) !== JSON.stringify(curList.value)) {
      curList.value = [...props.list]
    }
  },
  {
    immediate: true
  }
)

const handleDel = (index: number) => {
  curList.value.splice(index, 1)
  emits('del', index)
}

const handleUpdateList = () => {
  const newList = curList.value.map(item => {
    return {
      ...item,
      update_title: item?.update_title ? item.update_title : false
    }
  })
  emits('update', newList)
}
</script>

<template>
  <div class="w-full">
    <span class="text-xs text-gray-500">提示：先保存后批量处理~~~</span>
    <ElButton :loading="isUpdateLoading" @click="handleUpdateList">保存</ElButton>
    <div v-for="(item, index) in props.list" :key="item.id">
      <div class="flex items-start">
        <img :src="item.imgUrl" class="w-[120px] rounded" />
        <div class="flex-1 mr-4">
          <div class="flex items-start m-6">
            <label class="mr-4"> 标题 </label>
            <ElInput
              v-model="item.name"
              :rows="4"
              :max="255"
              type="textarea"
              placeholder="请输入/修改标题"
              class="flex-1"
            />
          </div>
          <div class="flex items-center m-6">
            <label class="mr-4"> 标题是否改变 </label>
            <ElSwitch v-model="item.update_title" />
          </div>
        </div>
        <ElButton type="danger" @click="() => handleDel(index)">移除</ElButton>
      </div>

      <ElDivider />
    </div>
    <ElButton :loading="isUpdateLoading" @click="handleUpdateList">保存</ElButton>
  </div>
</template>
