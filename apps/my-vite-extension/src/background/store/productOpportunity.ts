import { getProductOpportunityLList } from '../channels/web-request/popularProducts'
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
  }
}

interface ProductOpportunityStore {
  list: Array<any>
  paramsMap: Record<string, ProductOpportunityParams>
}

export const productOpportunityStore = observable<ProductOpportunityStore>({
  list: [],
  paramsMap: {}
})

export const SetProductOpportunity = action((list: any) => {
  productOpportunityStore.list = list ?? []
})

export const GetProductOpportunity = action(async ({ data }: { data: any }) => {
  const { tabId, payload } = data || {}
  const { apiUrl } = await GetProductOpportunityParams({ id: tabId })
  const list = await getProductOpportunityLList({
    apiUrl,
    payload
  })
  await SetProductOpportunity(list)
  return list
})

export const SetProductOpportunityParams = action((parmas: ProductOpportunityParams) => {
  const { tabId } = parmas || {}
  productOpportunityStore.paramsMap[tabId] = parmas || {}
})

export const GetProductOpportunityParams = action(({ id }: { id: string | number }) => {
  return productOpportunityStore.paramsMap[id] ?? {}
})
