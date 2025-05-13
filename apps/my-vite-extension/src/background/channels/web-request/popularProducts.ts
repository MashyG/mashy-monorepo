import qs from 'qs'
import type { ChannelFunc } from '.'

export const getPopularProductsParams: ChannelFunc = ({ url }, saveInChannelParams) => {
  const urlParams = new URL(url).searchParams

  saveInChannelParams({
    ...qs.parse(urlParams.toString())
  })
}
