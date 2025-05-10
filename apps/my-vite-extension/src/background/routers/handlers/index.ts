import { sleep } from '@/share/index'
export const getProductOpportunity = async () => {
  await sleep(5 * 1000)
  return {
    list: [
      {
        id: 1,
        name: 'opportunity1'
      },
      {
        id: 2,
        name: 'opportunity2'
      }
    ]
  }
}
