<script setup lang="ts">
import { sendMsg2Bg } from '@/share/messages'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { arrayToTree, sleep } from '@/share'

import { ElButton, ElInput, ElMessage, ElPagination, ElDivider, ElTreeSelect } from 'element-plus'
import PopularProductsList from './PopularProductList.vue'
import PopularKeywordList from './PopularKeywordList.vue'

const keyword = ref('')
const isSearching = ref(false)
const size = ref(20)
const isBatchAdd = ref(false)
const category = ref('909064')
const categoryList = ref<Array<any>>([])
const popularProductList = ref<Array<any>>([])
const dataLoading = ref(false)
const pageNumber = ref(1)
const total = ref(0)
const tabToTypeMap = ref<any>({
  PopularKeyword: 2,
  PopularProducts: 3
})
const userActionMap = ref<any>({
  PopularKeyword: 'popular_keyword_search_tab',
  PopularProducts: 'popular_product_tab'
})
const showCustomSelect = ref(false)
const selectedAll = ref(false)

const props = defineProps({
  params: {
    type: Object,
    default: () => ({
      lead_id: '',
      lead_name: '',
      l2_cate_id: '909064',
      active: 'PopularKeyword'
    })
  }
})

const categoryIds = computed(() => {
  return ['601739', category.value] // 手机与数码 + ...
})
const opportunityType = computed(() => {
  return tabToTypeMap.value?.[props.params.active] ?? '2'
})
const userAction = computed(() => {
  return userActionMap.value?.[props.params.active] ?? 'popular_product_tab'
})
const showPopularProducts = computed(() => {
  return props.params.active === 'PopularProducts'
})
const showPopularKeyword = computed(() => {
  return props.params.active === 'PopularKeyword'
})
const fetchProductsParams = computed(() => {
  return {
    lead_id: props.params.lead_id,
    search_text: keyword.value,
    cate_ids: categoryIds.value,
    opportunity_type: opportunityType.value,
    page_number: pageNumber.value,
    page_size: 20
  }
})

const init = () => {
  pageNumber.value = 1
  popularProductList.value = []
}
const formatList = (list: Array<any>) => {
  return (list || []).map((item: any) => {
    return {
      ...item,
      imgUrl: item.images?.[0]?.url_list?.[0] ?? '',
      selected: false
    }
  })
}
const getProducts = async (params: any) => {
  const { data } = await sendMsg2Bg('/get_tts_product', params)
  return {
    list: formatList(data?.spo_tts_product_details_list ?? []),
    totalCount: data?.total_count ?? 0
  }
}
const fetchProductList = async () => {
  if (!props.params.lead_id) {
    ElMessage({
      message: '没有lead_id',
      type: 'warning'
    })
    return
  }
  dataLoading.value = true
  const { list, totalCount } = await getProducts(fetchProductsParams.value)
  popularProductList.value = list
  total.value = totalCount
  dataLoading.value = false
}

const formatCategoryList = (list: Array<any>) => {
  const newList = list
    .filter(item => item.id === '601739' || item.parent_id === '601739')
    .map(i => {
      return {
        ...i,
        value: i.id,
        label: i.name
      }
    })
  return arrayToTree(newList)
}
const fetchCatagoryList = async () => {
  const { data } = await sendMsg2Bg('/get_category_list')
  const categories = formatCategoryList(data?.categories ?? [])
  categoryList.value = categories
}

onBeforeMount(() => {
  fetchCatagoryList()
})

watch(
  () => props.params,
  async () => {
    if (props.params?.l2_cate_id) {
      category.value = props.params.l2_cate_id
    }
    init()
    await fetchProductList()
  },
  {
    immediate: true,
    deep: true
  }
)

const handleSearchProduct = async () => {
  isSearching.value = true
  init()
  if (showCustomSelect.value) {
    await getProductsByPage(1, 5)
    pageNumber.value = 6
  } else {
    await fetchProductList()
  }
  isSearching.value = false
}

const getOtherParams = (item: any) => {
  const { id, name, update_title } = item || {}
  switch (props.params.active) {
    case 'PopularKeyword':
      return {
        tts_product_id: id,
        title: name,
        update_title: update_title
      }
    case 'PopularProducts':
      return {
        tts_product_id: id
      }
    default:
      return {}
  }
}
const formatParams = () => {
  const defaultParams = {
    lead_id: props.params.lead_id,
    opportunity_type: opportunityType.value,
    user_action: userAction.value,
    source: 1,
    traffic_source: 'seller_organic',
    tour_id: '7398097458277680901'
  }

  const filteredList = popularProductList.value
    .filter(item => !item.seller_linked)
    .filter(item => !showCustomSelect.value || item.selected)
    .slice(0, size.value)

  if (filteredList.length === 0) {
    ElMessage({
      message: '没有可提报的商品',
      type: 'warning'
    })
    return null
  }

  return filteredList
    .reduce((acc, cur, index) => {
      const groupIndex = Math.floor(index / 5)
      if (!acc[groupIndex]) {
        acc[groupIndex] = []
      }
      acc[groupIndex].push(getOtherParams(cur))
      return acc
    }, [])
    .map(group => ({
      ...defaultParams,
      relate_product_items: group
    }))
}
const handleBatchAddProduct = async () => {
  isBatchAdd.value = true
  dataLoading.value = true
  const params = formatParams()
  if (params) {
    await sendMsg2Bg('/add_product_opportunity', params)
    ElMessage({
      message: '批量添加成功',
      type: 'success'
    })
    if (!showCustomSelect.value) {
      await fetchProductList()
    }
  }
  dataLoading.value = false
  isBatchAdd.value = false
}

const handleDel = (index: number) => {
  popularProductList.value.splice(index, 1)
}

const handleUpdateList = (list: Array<any>) => {
  popularProductList.value = list
}

const handleCurrentChange = async (currentPage: number) => {
  pageNumber.value = currentPage
  await fetchProductList()
}

const getProductsByPage = async (pageStart: number, pageEnd: number) => {
  dataLoading.value = true
  for (let i = pageStart; i <= pageEnd; i++) {
    const params = {
      ...fetchProductsParams.value,
      page_number: i
    }
    const { list, totalCount } = await getProducts(params)
    popularProductList.value.push(...(list ?? []))
    dataLoading.value = false
    total.value = totalCount
    if (totalCount / 20 < 2) {
      break
    }
    await sleep(500)
  }
}
const handleCustomSelect = async () => {
  showCustomSelect.value = !showCustomSelect.value
  if (showCustomSelect.value) {
    await getProductsByPage(pageNumber.value, pageNumber.value + 4)
    pageNumber.value = pageNumber.value + 4
  }
}
const handleCustomSelectPrev = async () => {
  if (pageNumber.value - 4 < 1) {
    ElMessage({
      message: '已经是第一批了',
      type: 'warning'
    })
    return
  }
  popularProductList.value = []
  await getProductsByPage(pageNumber.value - 4, pageNumber.value)
  pageNumber.value = pageNumber.value - 4
}
const handleCustomSelectNext = async () => {
  if (pageNumber.value > total.value / 20) {
    ElMessage({
      message: '已经是最后一批了',
      type: 'warning'
    })
    return
  }
  popularProductList.value = []
  await getProductsByPage(pageNumber.value, pageNumber.value + 4)
  pageNumber.value = pageNumber.value + 4
}
const changeSelectedAll = (isSelected: boolean) => {
  popularProductList.value = popularProductList.value.map(i => {
    return {
      ...i,
      selected: isSelected
    }
  })
}
</script>

<template>
  <div>
    <div class="w-full"><span class="text-gray-600">名称：</span>{{ props.params.lead_name }}</div>
    <ElDivider />
    <div class="flex items-center">
      <div class="flex-1">
        <div class="flex items-center">
          <label for="keyword">商品名称：</label
          ><ElInput
            id="keyword"
            class="flex-1"
            v-model="keyword"
            clearable
            placeholder="请输入商品名称"
          />
        </div>
        <div class="flex items-center">
          <label for="keyword">商品分类：</label
          ><ElTreeSelect
            id="category"
            class="flex-1"
            clearable
            v-model="category"
            :data="categoryList"
            :render-after-expand="false"
          />
        </div>
      </div>
      <ElButton type="primary" :loading="isSearching" @click="handleSearchProduct">搜索</ElButton>
    </div>
    <div class="flex items-center my-4">
      <label for="size">批量处理数量：</label
      ><ElInput id="size" class="flex-1" v-model="size" placeholder="请输入数量" />
      <ElButton :loading="isBatchAdd" @click="handleBatchAddProduct">批量处理</ElButton>
    </div>
    <div class="flex items-center justify-end my-4">
      <div v-if="showCustomSelect">
        <ElCheckbox v-model="selectedAll" @change="changeSelectedAll" label="全选" />
        <span class="text-sm text-red-500">自定义选择情况下，必须选择下列产品才可批量处理！！</span>
        <ElButton @click="handleCustomSelectPrev">上一批</ElButton>
        <ElButton @click="handleCustomSelectNext">下一批</ElButton>
      </div>
      <ElButton type="primary" @click="handleCustomSelect">自定义选择</ElButton>
    </div>
    <div v-if="!popularProductList.length" class="text-center text-gray-600 w-full pt-3">
      暂无数据~
    </div>
    <div v-if="showCustomSelect" class="flex flex-wrap p-2" v-loading="dataLoading">
      <div
        v-for="item in popularProductList"
        :key="item.id"
        class="flex flex-col items-center border rounded p-1"
      >
        <ElCheckbox v-model="item.selected" size="large" class="!h-full">
          <img :src="item.imgUrl" alt="" class="w-[120px] h-[120px]" />
          <span class="text-xs text-blue-400 py-1" v-if="item.seller_linked">已提报</span>
        </ElCheckbox>
      </div>
    </div>
    <div v-else class="flex flex-wrap p-2" v-loading="dataLoading">
      <div class="w-full text-center">
        <ElPagination
          layout="prev, pager, next"
          :pageSize="20"
          :total="total"
          @change="handleCurrentChange"
        />
      </div>
      <PopularProductsList v-if="showPopularProducts" :list="popularProductList" @del="handleDel" />
      <PopularKeywordList
        v-else-if="showPopularKeyword"
        :list="popularProductList"
        @del="handleDel"
        @update="handleUpdateList"
      />

      <div class="w-full text-center">
        <ElPagination
          layout="prev, pager, next"
          :pageSize="20"
          :total="total"
          @change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
