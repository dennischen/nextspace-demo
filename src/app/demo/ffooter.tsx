
/*
 * @file-created: 2023-12-14
 * @author: Dennis Chen
 */
import TheFooter from "./TheFooter"
import { context } from '@nextspace/server/request'
import { FooterState } from "./types"


export default function footer() {

    const ctx = context()

    const state = (ctx.get('footerState') as FooterState)

    return <TheFooter hideProject={state?.hideProject}/>
}