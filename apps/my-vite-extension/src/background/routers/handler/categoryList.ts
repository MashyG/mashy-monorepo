import { GetChannelParamsByWebTab } from '@/background/store/channel-params'
import { useApi } from '@/share/apis'

export const getCategoryList = async (tabId: number) => {
  const params = await GetChannelParamsByWebTab(tabId, 'categoryList')
  const res = await useApi().apiFetch(params?.apiUrl ?? '', {
    method: 'GET',
    withCredentials: true
  })
  return res?.data ?? {}
}
