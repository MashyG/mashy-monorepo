import { RouterConfig } from '@/share/router'
import {
  getProductOpportunityList,
  addProductOpportunity,
  getTTSPrudocts
} from './handler/productOpportunity'

export const messageRouter: RouterConfig = {
  '/get_product_opportunity': {
    handler: async (message, sender) => {
      let res = {}
      if (sender?.tab?.id) {
        res = await getProductOpportunityList({
          data: { tabId: sender.tab.id, payload: message.params }
        })
      }
      return {
        status: 200,
        data: {
          ...res
        }
      }
    }
  },
  '/get_tts_product': {
    handler: async (message, sender) => {
      if (!sender?.tab?.id) {
        return {
          status: 500,
          message: 'TabId is not exist'
        }
      }
      try {
        const res = await getTTSPrudocts(message.params)
        return {
          status: 200,
          data: {
            message: 'Get product successfully',
            ...res
          }
        }
      } catch (error) {
        return {
          status: 500,
          message: 'add product opportunity error'
        }
      }
    }
  },
  '/add_product_opportunity': {
    handler: async (message, sender) => {
      if (!sender?.tab?.id) {
        return {
          status: 500,
          message: 'tabId is not exist'
        }
      }
      try {
        await addProductOpportunity(message.params)
        return {
          status: 200,
          data: {
            message: 'Add product successfully'
          }
        }
      } catch (error) {
        return {
          status: 500,
          message: 'add product opportunity error'
        }
      }
    }
  }
}
