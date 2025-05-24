import { RouterConfig } from '@/share/router'
import {
  getProductOpportunityList,
  addProductOpportunity,
  getTTSPrudocts
} from './handler/productOpportunity'
import { getCategoryList } from './handler/categoryList'
import { collectProducts } from './handler/collectProducts'

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
            ...res,
            message: 'Get product successfully'
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
  },
  '/get_category_list': {
    handler: async (_, sender) => {
      if (!sender?.tab?.id) {
        return {
          status: 500,
          message: 'TabId is not exist'
        }
      }
      try {
        const res = await getCategoryList(sender?.tab?.id)
        return {
          status: 200,
          data: {
            ...res,
            message: 'Get category list successfully'
          }
        }
      } catch (error) {
        return {
          status: 500,
          message: 'Get category list error'
        }
      }
    }
  },
  '/collect_products': {
    handler: async (message, sender) => {
      try {
        return await collectProducts(message.params, sender)
      } catch (error) {
        return {
          status: 500,
          message: 'Collect products error'
        }
      }
    }
  }
}
