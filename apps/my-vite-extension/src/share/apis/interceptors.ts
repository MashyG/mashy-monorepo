import type {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
  ResponseType
} from 'axios'

export type InterceptApi = AxiosRequestConfig & {
  message?: string
  originApi: AxiosRequestConfig
  excludeHeader?: Array<string>
  dataType?: ResponseType
  otherConfig?: Record<string, any>
}

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>,
  getInterceptApis?: () => Array<InterceptApi>
): Promise<InternalAxiosRequestConfig> => {
  const { url, method, headers } = config
  const interceptApis = getInterceptApis?.() || []
  const defaultHeaders = (await getHeaders?.()) || {}
  const interceptApi = interceptApis.find(item => {
    const { originApi } = item
    const { url: originUrl, method: originMethod } = originApi
    return url === originUrl && method === originMethod
  })

  Object.entries(defaultHeaders).forEach(([key, value]) => {
    if (!headers.get(key)) {
      headers.set(key, value)
    }
  })

  if (interceptApi) {
    const { originApi, excludeHeader = [], ...apiConf } = interceptApi
    console.log('interceptApi: ', originApi, ' to ==> ', apiConf)

    Object.entries(apiConf?.headers || {}).forEach(([key, value]) => {
      headers.delete(key)
      headers.set(key, value)
    })
    Object.keys(excludeHeader).forEach(key => {
      headers.delete(key)
    })

    return {
      ...config,
      ...apiConf,
      headers
    }
  }

  return config
}

export const responseInterceptor = async (
  response: AxiosResponse,
  getErrorFunc: (response: AxiosResponse) => Promise<AxiosResponse>
): Promise<AxiosResponse> => {
  const errorResponse = await getErrorFunc?.(response)
  const isError = errorResponse.status !== 200

  if (isError) {
    return errorResponse ?? null
  }

  return response
}
