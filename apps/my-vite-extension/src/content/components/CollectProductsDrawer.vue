<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { ElButton, ElDivider, ElMessage } from 'element-plus'
import { sendMsg2Bg } from '@/share/messages'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const emit = defineEmits(['changeDrawer'])

const selectedProducts = ref<Array<any>>([])
const list = ref<Array<any>>([])
const start = ref<number>(1)
const end = ref<number>(10)
const count = ref<number>(2)
const isCollecting = ref<boolean>(false)
// const isAutoCollect = ref<boolean>(false)

const hasSelectedProducts = computed(() => {
  return selectedProducts.value.length > 0
})

const hasInputSelectedProducts = computed(() => {
  return props.params.selectedProducts.length > 0
})

watchEffect(
  () => {
    selectedProducts.value = props.params.selectedProducts
    list.value = props.params.list
  },
  {
    immediate: true,
    deep: true
  }
)

const getSelectProducts = () => {
  selectedProducts.value = list.value.slice(start.value - 1, end.value).map((item: any) => {
    return {
      id: item.id,
      name: item.name,
      imgUrl: item.imgUrl,
      selected: true
    }
  })
}

const handleCollect = async () => {
  if (selectedProducts.value.length === 0) {
    ElMessage.error('请选择产品')
    return
  }
  const params = {
    collectCount: count.value,
    list: selectedProducts.value.filter((item: any) => item.selected)
  }
  try {
    isCollecting.value = true
    await sendMsg2Bg('/collect_products', params)
    ElMessage.success('采集成功')
    emit('changeDrawer')
  } catch (error) {
    console.log(error)
  } finally {
    isCollecting.value = false
  }
}
</script>

<template>
  <div>
    <div class="text-center text-lg font-bold">请选择产品</div>
    <div>
      <p class="text-lg font-bold">填写采集范围</p>
      <div class="flex items-center">
        <label>开始序号</label>
        <ElInput
          class="flex-1"
          v-model="start"
          type="number"
          placeholder="请输入开始序号"
          :disabled="hasInputSelectedProducts"
        />
      </div>
      <div class="flex items-center">
        <label>结束序号</label>
        <ElInput
          class="flex-1"
          v-model="end"
          type="number"
          max="20"
          placeholder="请输入结束序号"
          :disabled="hasInputSelectedProducts"
        />
      </div>
      <div class="flex items-center">
        <label>每个产品采集的数量</label>
        <ElInput
          class="flex-1"
          v-model="count"
          type="number"
          placeholder="请输入每个产品采集的数量"
        />
      </div>
      <ElButton @click="getSelectProducts" class="mt-4 w-full" :disabled="hasInputSelectedProducts">
        获取采集产品
      </ElButton>
      <template v-if="hasSelectedProducts">
        <ElDivider class="py-4" />
        <div class="text-center text-lg font-bold">
          已选产品{{ selectedProducts.length > 0 ? `(${selectedProducts.length}个)` : '' }}
        </div>
        <div class="max-h-[300px] overflow-auto">
          <div v-for="item of selectedProducts" :key="item.id" class="flex items-start p-4">
            <ElCheckbox v-model="item.selected" />
            <img :src="item.imgUrl" alt="" class="w-[50px] h-[50px] rounded" />
            <div class="flex-1">{{ item.name }}</div>
          </div>
        </div>
      </template>
    </div>
    <!-- <ElDivider class="py-4" />
    <div>
      <div>
        是否自动采集<ElSwitch v-model="isAutoCollect" />
      </div>
      <div v-if="!isAutoCollect">
        TODO
      </div>
    </div> -->
    <ElDivider class="py-4" />
    <ElButton type="primary" class="mt-4 w-full" @click="handleCollect" :loading="isCollecting">
      {{ isCollecting ? '采集中...' : '采集' }}
    </ElButton>
  </div>
</template>
