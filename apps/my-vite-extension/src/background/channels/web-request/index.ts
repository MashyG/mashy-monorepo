import { SetProductOpportunityParams } from '@/background/store/productOpportunity'
import { getPopularProductsParams } from './popularProducts'

export type ChannelFunc = (
  detail: chrome.webRequest.WebRequestHeadersDetails,
  saveInChannelParams: (params: any) => void
) => void

const ChannelUrlMap: Record<string, ChannelFunc> = {
  // 获取热门商品请求参数
  'https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/oc/seller_product_opportunity/seller/lead/list':
    getPopularProductsParams
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
  func?.(detail, payload => {
    SetProductOpportunityParams({ tabId, apiUrl: url, payload })
  })
}
