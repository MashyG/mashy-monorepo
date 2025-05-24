import {
  SetMiaoShouCollectBoxSetting,
  GetMiaoShouCollectBoxSetting
} from '@/background/store/collectProducts'
import { useApi } from '@/share/apis'
import { sleep } from '@/share/index'

export const collectProducts = async (params: any, sender: any) => {
  try {
    await initMiaoShouCollectBoxSetting()
    const { collectCount, list } = params
    for (const item of list) {
      const { imgUrl } = item || {}
      const imageResult = await uploadImageByUrl(imgUrl)
      const { image } = imageResult || {}
      const { imageId } = image || {}
      const { productList } = await searchProductsByImageId(imageId)
      const todCollectProducts = productList.slice(0, collectCount) // TODO 另外优化：根据关键词过滤出符合要求的数据
      const { result } = await collect(todCollectProducts)
      if (result === 'fail') {
        throw new Error('Collect products failed')
      }
      await sleep(1000)
    }
    return {
      status: 200,
      data: {
        message: 'Collect products successfully'
      }
    }
  } catch (error) {
    console.log(error, 'Collect products failed')
    return {
      status: 500,
      data: {
        message: 'Collect products failed'
      }
    }
  }
}

const initMiaoShouCollectBoxSetting = async () => {
  const res = await useApi().apiFetch(
    'https://erp.91miaoshou.com/api/move/common_collect_box/initCollectBoxSetting',
    {
      method: 'GET',
      withCredentials: true
    }
  )
  await SetMiaoShouCollectBoxSetting(res?.data ?? {})
  return res?.data ?? {}
}

const uploadImageByUrl = async (url: string) => {
  const formData = new FormData()
  formData.append('imgUrl', url)
  const res = await useApi().apiFetch(
    'https://erp.91miaoshou.com/api/move/alibaba_fen_xiao_cb/uploadImageByUrl',
    {
      method: 'POST',
      withCredentials: true,
      data: formData
    }
  )
  return res?.data ?? {}
}

const searchProductsByImageId = async (imageId: string) => {
  const formData = new FormData()
  formData.append('imageId', imageId)
  formData.append('pageNo', 1)
  formData.append('pageSize', 20)
  const res = await useApi().apiFetch(
    'https://erp.91miaoshou.com/api/move/alibaba_fen_xiao_cb/searchProductList',
    {
      method: 'POST',
      withCredentials: true,
      data: formData
    }
  )
  return res?.data ?? []
}

const collect = async (productList: any[]) => {
  const formData = new FormData()
  const miaoShouCollectBoxSetting = await GetMiaoShouCollectBoxSetting()
  const collectLinks = productList.reduce((acc: any, item: any) => {
    acc[item.itemId] = item
    return acc
  }, {})
  const defaultParams = {
    'fetchInfo[fetchType]': 'alibabaFenXiaoCb', // alibabaFenXiaoCb userDefinedLinksCopy
    'autoClaimedConfig[claimedPlatforms][0]': 'tiktok',
    'autoClaimedConfig[isAutoClaimed]': '0',
    collectBoxSetting: JSON.stringify({
      ...miaoShouCollectBoxSetting,
      isAutoPublish: '0'
    }),
    'fetchInfo[itemSimpleInfo]': JSON.stringify(collectLinks)
  }
  Object.entries(defaultParams).forEach(([key, value]) => {
    formData.append(key, value)
  })

  const res = await useApi().apiFetch(
    'https://erp.91miaoshou.com/api/move/common_collect_box/fetchItem',
    {
      method: 'POST',
      withCredentials: true,
      data: formData
    }
  )
  return res?.data ?? []
}
