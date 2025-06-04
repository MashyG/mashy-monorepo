<script setup lang="ts">
import JSZip from 'jszip'
import { ElButton, ElMessage } from 'element-plus'
import { ref, computed } from 'vue'
import { sleep } from '@/share/index'

const needDownloadProducts = ref<Array<any>>([])
const isLoading = ref<boolean>(false)
const downloadCount = ref<number>(0)
const breakLoading = ref<boolean>(false)
const message = ref<string>('')
const isCheckedAll = ref<boolean>(false)

const hasList = computed(() => {
  return needDownloadProducts.value.length > 0
})

const getAllProductsImgs = () => {
  const allProducts = Array.from(document.querySelectorAll('.goods-item'))
  if (allProducts.length === 0) {
    message.value = '没有找到商品'
    return
  }

  const allProductsImgs = allProducts?.map(item => {
    return {
      item,
      imgUrl: item.querySelector('.jx-image__inner')?.src,
      productName: item.querySelector('.item-title')?.textContent?.substring(0, 10),
      productOriginId: item.querySelector('.source-link')?.textContent,
      checked: true
    }
  })
  needDownloadProducts.value = allProductsImgs
  isCheckedAll.value = true
  ElMessage.success('获取所有产品成功')
}

const downloadImages = async (productName: string, productOriginId: string) => {
  try {
    // 获取所有指定class的图片元素
    const images = document.querySelectorAll(
      '.scroll-menu-pane .jx-image__inner'
    ) as NodeListOf<HTMLImageElement>

    if (images.length === 0) {
      message.value = '没有找到图片'
      return false
    }

    // 创建新的zip实例
    const zip = new JSZip()

    // 下载所有图片并添加到zip
    const downloadPromises = Array.from(images).map(async (img, index) => {
      try {
        const response = await fetch(img.src)
        const blob = await response.blob()
        const fileName = `image_${index + 1}.${blob.type.split('/')[1]}`
        zip.file(fileName, blob)
      } catch (error) {
        console.error(`Error downloading image ${productOriginId}:`, error)
      }
    })

    // 等待所有图片下载完成
    await Promise.all(downloadPromises)

    // 生成zip文件并下载
    const content = await zip.generateAsync({ type: 'blob' })
    const downloadLink = document.createElement('a')
    downloadLink.href = URL.createObjectURL(content)
    downloadLink.download = `${productName}_${productOriginId}.zip`
    downloadLink.click()
    URL.revokeObjectURL(downloadLink.href)
    return true
  } catch (error) {
    console.error('Error creating zip file:', error)
    return false
  }
}

const handleCheckedAll = () => {
  needDownloadProducts.value.forEach(item => {
    item.checked = isCheckedAll.value
  })
}

// 取消下载
const handleBreakDownload = () => {
  breakLoading.value = true
}

// 下载图片
const handleDownload = async () => {
  // 下载所有需要下载的图片
  const checkedProducts = needDownloadProducts.value.filter(item => item.checked)
  if (checkedProducts.length === 0) {
    message.value = '没有找到商品'
    return
  }

  isLoading.value = true
  downloadCount.value = 1
  for (let i = 0; i < checkedProducts.length; i++) {
    // 点击product，等待页面加载完成，再进行下一次下载
    const product = checkedProducts?.[i] ?? {}
    if (product?.item) {
      await product.item?.click()
      await sleep(500)
      const hasModel = document.querySelector('.jx-message-box .jx-button--primary')
      if (hasModel) {
        await hasModel.click()
      }
      const { productName, productOriginId } = product
      const isSuccess = await downloadImages(productName, productOriginId)
      if (!isSuccess || breakLoading.value) {
        break
      }
      checkedProducts[i].checked = false
      await sleep(2 * 1000)
      downloadCount.value++
    } else {
      break
    }
  }
  ElMessage.success('下载完成')
  isLoading.value = false
}
</script>

<template>
  <div>
    <ElButton
      @click="getAllProductsImgs"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      获取当前页所有产品
    </ElButton>
    <template v-if="hasList">
      <ElButton type="danger" @click="handleBreakDownload" :disabled="!isLoading">
        取消下载
      </ElButton>
      <ElButton type="primary" @click="handleDownload" :loading="isLoading">
        {{ isLoading ? `第${downloadCount}个产品图片下载中...` : '开始下载' }}
      </ElButton>
    </template>
    <p v-show="message" class="text-red-500">{{ message }}</p>
    <div v-if="hasList" class="max-h-[300px] overflow-auto">
      <ElCheckbox label="全选" v-model="isCheckedAll" @change="handleCheckedAll" />
      <div
        v-for="item of needDownloadProducts"
        :key="item.productOriginId"
        class="flex items-start"
      >
        <ElCheckbox v-model="item.checked" />
        <img :src="item.imgUrl" alt="" class="w-[50px] h-[50px] rounded mx-4" />
        <div class="flex-1">
          <p>{{ item.productName }}</p>
          <p>{{ item.productOriginId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
