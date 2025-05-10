<script setup>
import { sendMsg2Bg } from '@/share/messages'
import { ElButton } from 'element-plus'
import { ref } from 'vue'

const productOpportunitys = ref([])
const isLoading = ref(false)

const handleClick = async () => {
  isLoading.value = true
  const { data } = await sendMsg2Bg('/get_product_opportunity', {
    incentiveTaskId: null,
    incentive_tag_query: {},
    opportunity_type: 3,
    page_number: 1,
    page_size: 100,
    sort_field: 1, // 排序
    traffic_source: 'seller_organic',
    use_like: false
  })
  productOpportunitys.value = data?.list ?? []
  isLoading.value = false
}
</script>

<template>
  <div class="p-20">
    <ElButton type="primary" @click="handleClick" :loading="isLoading">商品机会</ElButton>
  </div>
  <div class="flex flex-wrap p-2">
    <div v-for="item of productOpportunitys" :key="item.id" class="p-2 w-1/2">
      <img :src="item.pic_url[0]" class="rounded" />
      <div class="text-xs text-gray-400 py-1">{{ item.lead_id }}</div>
      <div class="text-blue-600 overflow-hidden text-nowrap text-ellipsis">
        {{ item.lead_name }}
      </div>
    </div>
  </div>
</template>
