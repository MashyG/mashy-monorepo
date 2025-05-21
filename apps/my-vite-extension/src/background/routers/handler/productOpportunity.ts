import { GetChannelParamsByWebTab } from '@/background/store/channel-params'
import { GetQueryParams } from '@/background/store/productOpportunity'
import { useApi } from '@/share/apis'

export const getProductOpportunityList = async ({ data }: { data: any }) => {
  const { tabId, payload } = data || {}
  const params = GetChannelParamsByWebTab(tabId, 'popularProducts')
  const res = await await useApi().apiFetch(params?.apiUrl ?? '', {
    method: 'POST',
    withCredentials: true,
    data: payload
  })
  return res?.data ?? {}
}

export const getTTSPrudocts = async (params: any): Promise<Array<any>> => {
  // 1. 获取所有产品
  /**
   * apiUrl： `https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/oc/seller_product_opportunity/tts_product/trending/search`
   * POST
   * params: { oec_seller_id： 站点ID }
   * data: {
   *  cate_ids: ["601739", "909064"],
   *  lead_id: "7490610469666424581"，
   *  opportunity_type: 3，
   *  page_number: 1,
   *  page_size: 20
   * }
   * */
  const queryParams = await GetQueryParams()
  const { data } = await useApi().apiFetch(
    `https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/oc/seller_product_opportunity/tts_product/trending/search?${queryParams}`,
    {
      method: 'POST',
      withCredentials: true,
      data: params
    }
  )
  return data ?? {}
}

export const addProductOpportunity = async (params: Array<any>) => {
  // 2. 遍历所有产品进行关联
  /**
   * apiUrl： `https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/oc/seller_product_opportunity/relate?oec_seller_id=${oec_seller_id}`
   * POST
   * params: { oec_seller_id： 站点ID }
   * data: {
   *  lead_id: ["601739", "909064"],
   *  opportunity_type: "7490610469666424581"，
   *  user_action: 3，
   *  source: 1,
   *  traffic_source: 20,
   *  tour_id: '',
   *  tts_product_id: []
   * }
   * */
  try {
    const queryParams = await GetQueryParams()
    for (let item of params) {
      await useApi().apiFetch(
        `https://api16-normal-sg.tiktokglobalshop.com/api/v1/product/oc/seller_product_opportunity/relate?${queryParams}`,
        {
          method: 'POST',
          withCredentials: true,
          data: { ...item }
        }
      )
    }
  } catch (error) {
    console.error(error, 'addProductOpportunity')
  }
}
