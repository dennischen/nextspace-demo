
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { context } from '@nextspace/server/request'


import ThePage from "./ThePage"
import { BannerState } from './types'



export default function page() {


    //state for server side request this will be read in server banner
    const pageBannerState: BannerState = {
        showLanguage: true,
        showTheme: true
    }

    context().set('pageBannerState', pageBannerState)


    return <ThePage pageBannerState={pageBannerState}/>
}