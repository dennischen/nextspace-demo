
import AbstractStore from '@nextspace/utils/AbstractStore'
import { BannerState } from '@/app/demo/types'


export default class BannerStore extends AbstractStore<BannerState>{
}

export function initBannerStore(state?: BannerState) {
    return () => {
        return new BannerStore(state)
    }
}

export const BANNER_STORE = "bannerStore"