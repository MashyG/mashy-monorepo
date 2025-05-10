import { isString } from 'lodash-es'

type ModifyHeaderInfo = chrome.declarativeNetRequest.ModifyHeaderInfo
type Rule = chrome.declarativeNetRequest.Rule

const isIncludeNeedForHeadersKey = (headers: Record<string, string>) => {
  return Object.keys(headers).some(key => key.toLocaleLowerCase().includes('need'))
}

const passAddRules = (url: string, headers: Record<string, string>) => {
  return !url || (headers && !isIncludeNeedForHeadersKey(headers))
}

export const getDynamicRules = () => {
  return new Promise<Rule[]>(resolve => {
    chrome.declarativeNetRequest.getDynamicRules(rules => {
      resolve(rules)
    })
  })
}

export const getDynamicRulesByUrl = (url: string) => {
  return new Promise<Rule | undefined>(resolve => {
    chrome.declarativeNetRequest.getDynamicRules(rules => {
      const curRule = rules.find(rule => {
        const { condition } = rule || {}
        const { urlFilter } = condition || {}
        const ruleUrl = urlFilter?.slice(2)
        return (url || '').includes(ruleUrl ?? '')
      })

      resolve(curRule)
    })
  })
}

export const updateDynamicRules = (params: { removeRuleIds?: number[]; addRules?: Rule[] }) => {
  const { removeRuleIds = [], addRules = [] } = params || {}
  return new Promise<any>(resolve => {
    chrome.declarativeNetRequest.updateDynamicRules(
      {
        removeRuleIds,
        addRules
      },
      () => {
        resolve(true)
      }
    )
  })
}

// 添加动态请求头的规则，用于修改请求头
export const updateDynamicRulesByHeaders = async (params: {
  url: string
  headers: Record<string, string>
}) => {
  const { url, headers } = params || {}
  const { HeaderOperation, RuleActionType } = chrome.declarativeNetRequest

  const isPass = passAddRules(url, headers)
  if (isPass) {
    return true
  }

  const hasRule = await getDynamicRulesByUrl(url)
  if (hasRule) {
    return true
  }

  const rules = await getDynamicRules()
  const len = rules.length

  const requestHeaders: ModifyHeaderInfo[] = []
  Object.keys(headers).forEach(key => {
    const value = headers[key]
    const localeKey = key.toLocaleLowerCase()
    const headerKey = localeKey.includes('need') ? localeKey.slice(4) : localeKey

    if (isString(value)) {
      requestHeaders.push(
        {
          header: headerKey,
          operation: HeaderOperation.SET,
          value
        },
        {
          header: localeKey,
          operation: HeaderOperation.REMOVE
        }
      )
    }
  })

  const { host, pathname } = new URL(url)
  const urlFilter = `||${host}${pathname}`
  return updateDynamicRules({
    addRules: [
      {
        id: len,
        priority: 2,
        action: {
          type: RuleActionType.MODIFY_HEADERS,
          requestHeaders
        },
        condition: {
          urlFilter: urlFilter
        }
      }
    ]
  })
}
