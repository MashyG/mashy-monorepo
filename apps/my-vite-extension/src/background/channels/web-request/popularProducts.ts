import qs from 'qs'
import type { ChannelFunc } from '.'
import { SetQueryParams } from '@/background/store/productOpportunity'

export const getPopularProductsParams: ChannelFunc = ({ url }, saveInChannelParams) => {
  const urlParams = new URL(url).searchParams
  SetQueryParams(urlParams.toString())

  saveInChannelParams({
    channel: 'popularProducts',
    ...qs.parse(urlParams.toString())
  })
}
