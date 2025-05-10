export type RouterResType<T = any> =
  | {
      status: 200
      data: T
    }
  | {
      status: 400 | 404 | 500
      message: string
      data?: T
    }

export type RouterFunc = (
  message: {
    params: any
  },
  sender: chrome.runtime.MessageSender
) => RouterResType | Promise<RouterResType>

export class ChromeRouter {
  private _NotFoundController: RouterFunc = (msg: any) => {
    return {
      message: `routing not found for "${msg.action || msg.act}"`,
      status: 404
    }
  }

  public resolveFunc: (
    message: any,
    sender: chrome.runtime.MessageSender
  ) => {
    name: string
  }
  public routes: { [name: string]: RouterFunc }

  constructor(resolveFunc?: any) {
    this.resolveFunc = resolveFunc
    this.routes = {}
  }

  public on(name: `/${string}`, controllerFunc: RouterFunc) {
    this.routes = this.routes || {}
    this.routes[name] = controllerFunc
  }

  public listener(): any {
    return this.listen.bind(this)
  }

  private listen(message: any, sender?: any, sendResponse: (params?: any) => void = () => {}) {
    try {
      const { controllerFunc, path } = this.match(message, sender)

      if (!controllerFunc) {
        return true
      }

      const response = controllerFunc.call({ message, sender }, message, sender)

      if (typeof response === 'undefined') {
        return true
      }

      if (!(response instanceof Promise)) {
        sendResponse(this._formatResponse(response, path))
        return true
      }

      response
        .then(res => {
          sendResponse(this._formatResponse(res, path))
        })
        .catch(res => {
          sendResponse(this._formatResponse(res, path))
        })
      return true
    } catch (err) {
      sendResponse(
        this._formatResponse(
          {
            message: 'Unhandled Background Error: ' + String(err),
            status: 500
          },
          '__notfound'
        )
      )

      return true
    }
  }

  private match(message: any, sender: chrome.runtime.MessageSender) {
    const { name } = this._resolveRoute(message, sender)
    let controllerFunc = this.routes[name]
    if (!controllerFunc) {
      controllerFunc = this._NotFoundController
    }
    return { controllerFunc, path: name }
  }

  private _resolveRoute(message: any, sender: chrome.runtime.MessageSender) {
    if (typeof this.resolveFunc === 'function') {
      return this.resolveFunc(message, sender)
    }
    return this._defaultResolveFunc(message)
  }

  private _defaultResolveFunc(message: any) {
    if (typeof message === 'string') {
      return {
        name: message,
        params: {}
      }
    }
    if (typeof message.act === 'string') {
      return {
        name: message.act,
        params: {}
      }
    }
    if (typeof message.action === 'string') {
      return {
        name: message.action,
        params: {}
      }
    }
    return {
      name: '__notfound',
      params: {}
    }
  }

  private _formatResponse(response: any, path: string): RouterResType {
    if (response && Number.isInteger(response.status)) {
      if (response.status !== 200) {
        return {
          ...response,
          path
        }
      }
      return response
    }
    return { status: 200, data: response.data || response }
  }
}

export type RouterConfig = Record<
  `/${string}`,
  {
    handler: RouterFunc
  }
>

export const getRouterListener = (routerConfig: RouterConfig) => {
  const routers = new ChromeRouter()
  Object.entries(routerConfig).forEach(([path, { handler }]) => {
    routers.on(path as `/${string}`, handler)
  })
  return routers.listener()
}
