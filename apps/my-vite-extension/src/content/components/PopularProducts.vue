<script setup lang="ts">
import PopularProductShow from './PopularProductShow.vue'
import { sendMsg2Bg } from '@/share/messages'
import { ElButton, ElSelect, ElOption, ElDrawer, ElPagination } from 'element-plus'
import { ref, computed } from 'vue'
import { SORT_BY } from '@/share/constant'
import BatchAddProductsDrawer from './BatchAddProductsDrawer.vue'

const productOpportunitys = ref<Array<any>>([])
const isLoading = ref(false)
const sortBy = ref(1)
const showDrawer = ref(false)
const drawerParams = ref({})
const pageNumber = ref(1)
const total = ref(0)

const params = computed(() => {
  return {
    incentiveTaskId: null,
    incentive_tag_query: {},
    opportunity_type: 3,
    page_number: pageNumber.value,
    page_size: 100,
    sort_field: sortBy.value, // 排序
    traffic_source: 'seller_organic',
    use_like: false
  }
})

const handleSearch = async () => {
  isLoading.value = true
  const { data } = await sendMsg2Bg('/get_product_opportunity', params.value)
  productOpportunitys.value = formatList(data?.data ?? [])
  total.value = data?.total_product_count ?? 0
  isLoading.value = false
}
const formatList = (list: Array<any>) => {
  return list.map((item: any) => {
    return {
      ...item,
      name: item.lead_name,
      id: item.lead_id,
      imgUrl: item.pic_url?.[0] ?? ''
    }
  })
}

const handleCurrentChange = (currentPage: number) => {
  pageNumber.value = currentPage
  handleSearch()
}

const handleShowDrawer = (product: any) => {
  const { lead_id, lead_name, level2_cate_name_key } = product
  const l2_cate_id = level2_cate_name_key.split('_')?.[1] ?? '909064' // 手机配件
  drawerParams.value = { lead_id, lead_name, l2_cate_id }
  showDrawer.value = true
}
const handleClear = () => {
  pageNumber.value = 1
  sortBy.value = 1
  productOpportunitys.value = []
}
</script>

<template>
  <div class="p-6 rounded shadow-lg">
    <div class="flex items-center justify-center">
      <div class="flex items-center mr-6">
        <label>排序：</label>
        <ElSelect v-model="sortBy" placeholder="Select" class="flex-1 w-[200px]">
          <ElOption v-for="item in SORT_BY" :key="item.id" :label="item.name" :value="item.id" />
        </ElSelect>
      </div>
      <ElButton type="primary" @click="handleSearch" :loading="isLoading">搜索</ElButton>
      <ElButton @click="handleClear">清空</ElButton>
    </div>
    <div class="p-2 text-center" v-if="productOpportunitys.length">
      <ElPagination
        layout="prev, pager, next"
        :current-page="pageNumber"
        :pageSize="100"
        :total="total"
        @change="handleCurrentChange"
      />
      <div class="flex flex-wrap">
        <div v-for="item of productOpportunitys" :key="item.id" class="p-2 w-1/3 text-center">
          <PopularProductShow :item="item" @changeDrawer="handleShowDrawer" />
        </div>
      </div>
      <ElPagination
        layout="prev, pager, next"
        :current-page="pageNumber"
        :pageSize="100"
        :total="total"
        @change="handleCurrentChange"
      />
      <ElDrawer append-to-body v-model="showDrawer" title="批量添加产品">
        <BatchAddProductsDrawer :params="drawerParams" />
      </ElDrawer>
    </div>
  </div>
</template>
