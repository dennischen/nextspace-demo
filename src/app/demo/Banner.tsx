
/*
 * @file-created: 2023-12-14
 * @author: Dennis Chen
 */
import TheBanner from "./TheBanner"
import { context } from '@nextspace/server/request'
import { BannerState } from "./types"


export default function banner() {

    const ctx = context()

    //state for server side request this will be setted in page
    const state = ctx.get('defaultBannerState') as BannerState

    return <TheBanner defaultBannerState={state} />
}