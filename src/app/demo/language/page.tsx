/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { context } from '@nextspace/server/request'


import ThePage from "./ThePage"
import { BannerState } from '@/app/demo/types'



export default function page() {


    const pageBannerState: BannerState = {
        showLanguage: false
    }

    context().set('pageBannerState', pageBannerState)


    return <ThePage pageBannerState={pageBannerState}/>
}