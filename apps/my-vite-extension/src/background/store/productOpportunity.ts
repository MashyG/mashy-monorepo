import { action, observable } from './index'

export interface ProductOpportunityParams {
  tabId: number | string
  apiUrl: string
  payload?: {
    page_size: number
    sort_field: number
    traffic_source: string
    use_like: boolean
    page_number: number
    opportunity_type: number
    incentive_tag_query: Record<string, any>
    incentiveTaskId: null | string
    oec_seller_id: string
  }
}

interface ProductOpportunityStore {
  oecSellerId: string
  list: Array<any>
  paramsMap: Record<string, ProductOpportunityParams>
}

export const productOpportunityStore = observable<ProductOpportunityStore>({
  oecSellerId: '',
  list: [],
  paramsMap: {}
})

export const SetOecSellerId = action((id: string) => {
  productOpportunityStore.oecSellerId = id ?? ''
})

export const GetOecSellerId = action(() => {
  return productOpportunityStore.oecSellerId
})

export const SetProductOpportunity = action((list: any) => {
  productOpportunityStore.list = list ?? []
})

export const GetProductOpportunity = action(() => {
  return productOpportunityStore.list
})
