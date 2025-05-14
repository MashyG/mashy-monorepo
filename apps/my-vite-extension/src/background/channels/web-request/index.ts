import { getCategoryListParams } from './categoryList'
import { getPopularProductsParams } from './popularProducts'
import { SetChannelParamsByWebTab } from '@/background/store/channel-params'

export type ChannelFunc = (
  detail: chrome.webRequest.WebRequestHeadersDetails,
  saveInChannelParams: (params: any) => void
) => void

const ChannelUrlMap: Record<string, ChannelFunc> = {
  // 获取热门商品请求参数
  'https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/oc/seller_product_opportunity/seller/lead/list':
    getPopularProductsParams,
  'https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/product_creation/preload_all_categories':
    getCategoryListParams
}

export const getChannelWebRequest = (detail: chrome.webRequest.WebRequestHeadersDetails) => {
  const { tabId, url } = detail
  if (tabId === -1) {
    return
  }

  const channelFuncKeys = Object.keys(ChannelUrlMap) as Array<keyof typeof ChannelUrlMap>

  const key = channelFuncKeys.find(item => url.startsWith(item))

  if (!key) {
    return
  }

  const func = ChannelUrlMap[key]
  func?.(detail, ({ channel, ...data }) => {
    SetChannelParamsByWebTab({ tabId, channel, apiUrl: url, data })
  })
}
