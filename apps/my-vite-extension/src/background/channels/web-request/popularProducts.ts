import qs from 'qs'
import type { ChannelFunc } from '.'
import { useApi } from '@/share/apis'
import { type ProductOpportunityParams } from '@/background/store/productOpportunity'

export const getProductOpportunityLList = async (
  params: Pick<ProductOpportunityParams, 'apiUrl' | 'payload'>
) => {
  const { apiUrl, payload } = params
  console.log(params, 'params    ======')
  const { data } = await useApi().apiFetch(apiUrl, {
    method: 'POST',
    withCredentials: true,
    data: payload
  })
  console.log(data, 'data   ======')
  return data?.data
}

export const getPopularProductsParams: ChannelFunc = ({ url }, saveInChannelParams) => {
  const urlParams = new URL(url).searchParams

  saveInChannelParams({
    ...qs.parse(urlParams.toString())
  })
}
