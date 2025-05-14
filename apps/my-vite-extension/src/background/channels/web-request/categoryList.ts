import qs from 'qs'
import type { ChannelFunc } from '.'

export const getCategoryListParams: ChannelFunc = ({ url }, saveInChannelParams) => {
  const urlParams = new URL(url).searchParams

  saveInChannelParams({
    channel: 'categoryList',
    ...qs.parse(urlParams.toString())
  })
}
