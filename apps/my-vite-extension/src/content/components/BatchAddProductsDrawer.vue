<script setup lang="ts">
import { sendMsg2Bg } from '@/share/messages'
import { computed, onBeforeMount, ref, watch } from 'vue'
import { ElButton, ElInput, ElMessage, ElPagination } from 'element-plus'
import PopularProductShow from './PopularProductShow.vue'
import { arrayToTree } from '@/share'

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

const props = defineProps({
  params: {
    type: Object,
    default: () => ({
      lead_id: '',
      lead_name: ''
    })
  }
})

const categoryIds = computed(() => {
  return ['601739', category.value] // 手机与数码 + ...
})

const fetchProductList = async () => {
  if (!props.params.lead_id) {
    ElMessage({
      message: '没有lead_id',
      type: 'warning'
    })
    return
  }
  const params = {
    lead_id: props.params.lead_id,
    search_text: keyword.value,
    cate_ids: categoryIds.value,
    opportunity_type: 3,
    page_number: pageNumber.value,
    page_size: 20
  }
  dataLoading.value = true
  const { data } = await sendMsg2Bg('/get_tts_product', params)
  popularProductList.value = formatList(data?.spo_tts_product_details_list ?? [])
  total.value = data?.total_count ?? 0
  dataLoading.value = false
}

const formatList = (list: Array<any>) => {
  return list.map((item: any) => {
    return {
      ...item,
      imgUrl: item.images?.[0]?.url_list?.[0] ?? ''
    }
  })
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
    keyword.value = props.params.lead_name?.substring(0, 15) ?? ''
    if (keyword.value) {
      fetchProductList()
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const handleSearchProduct = async () => {
  isSearching.value = true
  pageNumber.value = 1
  await fetchProductList()
  isSearching.value = false
}

const handleBatchAddProduct = async () => {
  isBatchAdd.value = true
  dataLoading.value = true
  const defaultParams = {
    lead_id: props.params.lead_id,
    opportunity_type: 3,
    user_action: 'popular_product_tab',
    source: 1,
    traffic_source: 'seller_organic',
    tour_id: '7398097458277680901'
  }
  // popularProductList.value 将这个数组分为5各一组，组成新数组
  const params = popularProductList.value
    .slice(0, size.value)
    .reduce((acc, cur, index) => {
      if (index % 5 === 0) {
        acc.push([])
      }
      acc[acc.length - 1].push({
        tts_product_id: cur.id
      })
      return acc
    }, [])
    .map((item: Array<any>) => {
      return {
        ...defaultParams,
        relate_product_items: item
      }
    })
  await sendMsg2Bg('/add_product_opportunity', params)
  ElMessage({
    message: '批量添加成功',
    type: 'success'
  })
  dataLoading.value = false
  isBatchAdd.value = false
}

const handleDel = (index: number) => {
  popularProductList.value.splice(index, 1)
}

const handleCurrentChange = (currentPage: number) => {
  pageNumber.value = currentPage
  fetchProductList()
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <div class="flex-1">
        <div class="flex items-center">
          <label for="keyword">商品名称：</label
          ><ElInput id="keyword" class="flex-1" v-model="keyword" placeholder="请输入商品名称" />
        </div>
        <div class="flex items-center">
          <label for="keyword">商品分类：</label
          ><el-tree-select
            id="category"
            class="flex-1"
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
    <div class="flex flex-wrap p-2" v-loading="dataLoading">
      <div v-if="!popularProductList.length" class="text-center text-gray-600 w-full pt-3">
        暂无数据~
      </div>
      <template v-else>
        <div class="w-full text-center">
          <ElPagination
            layout="prev, pager, next"
            :pageSize="20"
            :total="total"
            @change="handleCurrentChange"
          />
        </div>
        <div
          v-for="(item, index) in popularProductList"
          :key="item.id"
          class="p-2 w-1/2 text-center relative"
          @click="() => handleDel(index)"
        >
          <div
            class="absolute top-0 right-0 text-black bg-white rounded-full px-4 text-lg cursor-pointer"
          >
            X
          </div>
          <PopularProductShow :item="item" isHideBtn />
        </div>
      </template>
    </div>
  </div>
</template>
