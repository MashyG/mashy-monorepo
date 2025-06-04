<script setup lang="ts">
import DragBox from './components/DragBox.vue'
import ProductOpportunities from './components/ProductOpportunities.vue'
import { ElDivider, ElTabs, ElTabPane } from 'element-plus'
import DownLoadImgs from './components/DownLoadImgs.vue'
import { ref } from 'vue'
import { type TabName } from './utils/types'

const activeTab = ref<TabName>('PopularKeyword')
interface TabItem {
  name: TabName
  label: string
}
const elTabPanes = ref<Array<TabItem>>([
  { name: 'PopularKeyword', component: ProductOpportunities, label: '批量添加热门关键词' },
  { name: 'PopularProducts', component: ProductOpportunities, label: '批量添加热门产品' },
  { name: 'DownLoadImgs', component: DownLoadImgs, label: '妙手产品图片下载' }
])
</script>

<template>
  <DragBox :activeTab="activeTab">
    <div
      class="max-w-[800px] max-h-[550px] overflow-hidden bg-white shadow-md rounded-md p-12 border border-solid border-green-600"
    >
      <ElTabs v-model="activeTab" class="w-full">
        <ElTabPane
          v-for="item of elTabPanes"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        >
          <component :is="item.component" :activeTab="item.name" />
        </ElTabPane>
      </ElTabs>
    </div>
  </DragBox>
</template>

<style scoped></style>
