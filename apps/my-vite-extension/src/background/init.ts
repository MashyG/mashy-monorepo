import {
  getDynamicRules,
  updateDynamicRules,
  updateDynamicRulesByHeaders
} from '@/share/declarativeNetRequest'
import { getChannelWebRequest } from './channels/web-request'
import { type AxiosResponse } from 'axios'
import { defineApiConfig } from '@/share/apis'

// 初始化网络数据监听器
export const initNetworkListener = async () => {
  const { RuleActionType, ResourceType } = chrome.declarativeNetRequest
  const rules = await getDynamicRules()
  const ruleIds = rules.map(rule => rule.id)
  await updateDynamicRules({
    removeRuleIds: ruleIds,
    addRules: [
      {
        id: 10,
        priority: 1,
        action: {
          type: RuleActionType.ALLOW_ALL_REQUESTS
        },
        condition: {
          urlFilter: '|https*',
          resourceTypes: [ResourceType.MAIN_FRAME, ResourceType.SUB_FRAME]
        }
      }
    ]
  })

  // 监听渠道api信息
  chrome.webRequest.onBeforeSendHeaders.addListener(
    getChannelWebRequest,
    { urls: ['<all_urls>'] },
    ['requestHeaders']
  )
}

// 初始化API配置
export const initApiConfig = () => {
  const { apiFetch } = defineApiConfig({
    getErrorFunc: async (res: AxiosResponse) => {
      const { data } = res || {}
      const errorData = data?.error ?? data

      if (errorData?.code === 401) {
        return {
          ...res,
          data: {
            error: { message: '登录已过期，请重新登录' }
          }
        }
      }

      return res
    }
  })

  apiFetch.interceptors.request.use(async config => {
    const { url = '', headers } = config || {}
    await updateDynamicRulesByHeaders({
      url,
      headers
    })

    return config
  })
}
