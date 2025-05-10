export const getCookieWithUrlAndName = (detail: chrome.cookies.CookieDetails) => {
  return new Promise<string>(resolve => {
    chrome.cookies.get(detail, cookie => {
      const { value = '' } = cookie || {}
      resolve(value)
    })
  })
}

export const setCookieWithUrlAndName = (detail: chrome.cookies.SetDetails) => {
  return new Promise<chrome.cookies.Cookie>(resolve => {
    chrome.cookies.set(detail, (cookie: any) => {
      resolve(cookie)
    })
  })
}

export const removeCookieWithUrlAndName = (detail: chrome.cookies.CookieDetails) => {
  return new Promise<chrome.cookies.CookieDetails>(resolve => {
    chrome.cookies.remove(detail, cookie => {
      resolve(cookie)
    })
  })
}

export const getAllCookiesWithUrl = (url: string) => {
  return new Promise<chrome.cookies.Cookie[]>(resolve => {
    chrome.cookies.getAll({ url }, cookies => {
      resolve(cookies)
    })
  })
}
