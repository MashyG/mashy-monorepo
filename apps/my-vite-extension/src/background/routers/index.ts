import { RouterConfig } from '@/share/router'
import { GetProductOpportunity } from '../store/productOpportunity'

export const messageRouter: RouterConfig = {
  '/get_product_opportunity': {
    handler: async (message, sender) => {
      let list = []
      if (sender?.tab?.id) {
        list = await GetProductOpportunity({
          data: { tabId: sender.tab.id, payload: message.params }
        })
      }
      return {
        status: 200,
        data: {
          list
        }
      }
    }
  }
}
