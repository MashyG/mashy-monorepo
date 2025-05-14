import { observable, action } from './index'
import { SetOecSellerId } from './productOpportunity'

export type ChannelParamsStore = {
  ChannelMap: Map<
    string,
    {
      channel: string
      tabId: number
      apiUrl: string
      data: any
    }
  >
}

export const channelParamsStore = observable<ChannelParamsStore>({
  ChannelMap: new Map()
})

export const SetChannelParamsByWebTab = action(
  (params: { tabId: number; channel: string; apiUrl: string; data: any }) => {
    const { channel, tabId, apiUrl, data } = params
    const { oec_seller_id } = data || {}
    if (oec_seller_id) {
      SetOecSellerId(oec_seller_id)
    }
    channelParamsStore.ChannelMap.set(channel, { channel, tabId, apiUrl, data })
  }
)

export const GetChannelParamsByWebTab = action((tabId: number, channel: string) => {
  const params = channelParamsStore.ChannelMap.get(channel)
  if (!params) {
    return
  }
  if (params.tabId !== tabId) {
    return
  }
  return params
})
