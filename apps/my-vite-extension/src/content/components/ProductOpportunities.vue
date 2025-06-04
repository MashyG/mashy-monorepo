<script setup lang="ts">
import { ref, computed, nextTick, type PropType } from 'vue'
import { ElButton, ElSelect, ElOption, ElDrawer, ElPagination, ElCheckbox } from 'element-plus'
import { sendMsg2Bg } from '@/share/messages'
import { SORT_BY_FOR_PRODUCT, SORT_BY_FOR_KEYWORD } from '@/share/constant'
import PopularProductShow from './PopularProductShow.vue'
import BatchAddProductsDrawer from './BatchAddProductsDrawer.vue'
import CollectProductsDrawer from './CollectProductsDrawer.vue'
import { type TabName } from '../utils/types'

const props = defineProps({
  activeTab: {
    type: String as PropType<TabName>,
    default: 'PopularKeyword'
  }
})

const tabToTypeMap = ref({
  PopularKeyword: 201,
  PopularProducts: 3
})
const productOpportunitys = ref<Array<any>>([])
const isLoading = ref(false)
const sortBy = ref(1)
const showDrawer = ref(false)
const drawerParams = ref({})
const pageNumber = ref(1)
const total = ref(0)
const showSelected = ref(false)
const showCollectDrawer = ref(false)
const selectedProductsDrawerParams = ref({})

const SORT_BY = computed(() => {
  return props.activeTab === 'PopularKeyword' ? SORT_BY_FOR_KEYWORD : SORT_BY_FOR_PRODUCT
})
const params = computed(() => {
  return {
    incentiveTaskId: null,
    incentive_tag_query: {},
    opportunity_type: tabToTypeMap.value[props.activeTab],
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
      imgUrl: item.pic_url?.[0] ?? '',
      selected: false
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
  drawerParams.value = {
    lead_id,
    lead_name,
    l2_cate_id,
    active: props.activeTab
  }
  showDrawer.value = true
}
const handleClear = () => {
  pageNumber.value = 1
  sortBy.value = 1
  productOpportunitys.value = []
  showSelected.value = false
}

const handleCollect = () => {
  const selectedProducts = productOpportunitys.value.filter((item: any) => item.selected)
  selectedProductsDrawerParams.value = {
    selectedProducts,
    list: productOpportunitys.value.map((item: any) => {
      return {
        id: item.id,
        name: item.name,
        imgUrl: item.imgUrl,
        selected: !!item.selected
      }
    })
  }
  nextTick(() => {
    showCollectDrawer.value = true
  })
}
const handleChangeCollectDrawer = () => {
  showCollectDrawer.value = false
  selectedProductsDrawerParams.value = {}
}
</script>

<template>
  <div class="w-ful">
    <div class="w-full">
      <div class="w-full flex items-center justify-center">
        <div class="flex items-center mr-6 flex-1">
          <label>排序：</label>
          <ElSelect v-model="sortBy" placeholder="Select" class="flex-1 min-w-[200px]">
            <ElOption v-for="item in SORT_BY" :key="item.id" :label="item.name" :value="item.id" />
          </ElSelect>
        </div>
        <ElButton type="primary" @click="handleSearch" :loading="isLoading">搜索</ElButton>
        <ElButton type="danger" @click="handleClear">清空列表</ElButton>
      </div>
      <div class="p-2 overflow-auto max-h-[420px]" v-if="productOpportunitys.length">
        <ElButton @click="showSelected = !showSelected">采集产品</ElButton>
        <ElButton v-if="showSelected" type="primary" @click="handleCollect">开始采集</ElButton>
        <div class="w-full text-center">
          <ElPagination
            layout="prev, pager, next"
            :pageSize="100"
            :total="total"
            @change="handleCurrentChange"
          />
        </div>
        <div class="flex flex-wrap">
          <div
            v-for="(item, index) of productOpportunitys"
            :key="item.id"
            class="p-2 w-1/4 text-center border border-solid border-gray-300 rounded-md"
          >
            <template v-if="showSelected">
              <ElCheckbox v-model="item.selected" :label="`序号 ${index + 1}`" />
            </template>
            <PopularProductShow
              :item="item"
              :isHideBtn="showSelected"
              @changeDrawer="handleShowDrawer"
            />
          </div>
        </div>
        <div class="w-full text-center">
          <ElPagination
            layout="prev, pager, next"
            :pageSize="100"
            :total="total"
            @change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <ElDrawer append-to-body v-model="showDrawer" title="批量添加产品" size="50%">
      <BatchAddProductsDrawer :params="drawerParams" />
    </ElDrawer>
    <ElDrawer append-to-body v-model="showCollectDrawer" title="采集产品" size="50%">
      <CollectProductsDrawer
        :params="selectedProductsDrawerParams"
        @changeDrawer="handleChangeCollectDrawer"
      />
    </ElDrawer>
  </div>
</template>
