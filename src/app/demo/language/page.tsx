/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { context } from '@nextspace/server/request'


import ThePage from "./ThePage"
import { BannerState } from '@/app/demo/types'



export default function page() {


    const defaultBannerState: BannerState = {
    }

    context().set('defaultBannerState', defaultBannerState)


    return <ThePage defaultBannerState={defaultBannerState}/>
}