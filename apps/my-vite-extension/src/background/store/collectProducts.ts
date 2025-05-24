import { observable, action, makeObservable } from 'mobx'

export interface CollectProductsStoreType {
    miaoShouCollectBoxSetting: any
}

export const collectProductsStore = observable<CollectProductsStoreType>({
    miaoShouCollectBoxSetting: {},
})

export const SetMiaoShouCollectBoxSetting = action((setting: any) => {
    collectProductsStore.miaoShouCollectBoxSetting = setting
})

export const GetMiaoShouCollectBoxSetting = action(() => {
    return collectProductsStore.miaoShouCollectBoxSetting
})
