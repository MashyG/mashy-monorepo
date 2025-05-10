import axios, { type AxiosInstance, type AxiosResponse, type CreateAxiosDefaults } from 'axios'

import fetchAdapter from './adapter/fetch'

import { type InterceptApi, requestInterceptor, responseInterceptor } from './interceptors'

export type { AxiosResponse, AxiosRequestConfig } from 'axios'

type DefineApiConfigParams = {
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>
  getInterceptApis?: () => Array<InterceptApi>
  getErrorFunc: (response: AxiosResponse) => Promise<AxiosResponse>
} & CreateAxiosDefaults

let apiConing: {
  config: DefineApiConfigParams
  apiFetch: AxiosInstance
}

export const defineApiConfig = (config: DefineApiConfigParams) => {
  const { getHeaders, getErrorFunc, getInterceptApis, ...AxiosConfig } = config

  const apiFetch = axios.create({
    ...AxiosConfig,
    adapter: [fetchAdapter]
  })

  apiFetch.interceptors.request.use(
    config => requestInterceptor(config, getHeaders, getInterceptApis),
    async error => {
      console.warn('request error: ', error)
      await getErrorFunc(error.response)
      return Promise.reject(error)
    }
  )

  apiFetch.interceptors.response.use(
    config => responseInterceptor(config, getErrorFunc),
    async error => {
      console.warn('request error: ', error)
      await getErrorFunc(error.response)
      return Promise.reject(error)
    }
  )

  apiConing = {
    apiFetch,
    config
  }

  return apiConing
}

export const useApi = () => {
  if (!apiConing) {
    throw new Error('请先调用 defineApiConfig 进行初始化')
  }

  return apiConing
}
