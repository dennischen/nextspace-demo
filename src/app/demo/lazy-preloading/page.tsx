'use client'
/*
 * @file-created: 2023-10-30
 * @author: Dennis Chen
 */

import demoStyles from "@/app/demo/demo.module.scss"
import lazyWithPreload from "@nextspace/components/lazyWithPreload"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import { lazy, useContext, useState } from "react"

type PageProps = {
}

const Panel1 = lazy(() => import('./Panel1'))
const Panel2 = lazy(() => import('./Panel2'))
const Panel3 = lazyWithPreload(() => import('./Panel3'))

export default function Page({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    const [panel, setPanel] = useState('panel1')

    const onChangePanel = (panel: string) => {
        switch (panel) {
            case 'panel1':
            case 'panel2':
                setPanel(panel)
                break
            case 'panel3':
                workspace.withProcessIndicator(() => Panel3.preload()).then(() => {
                    setPanel(panel)
                })
        }


    }

    return <main className={demoStyles.main}>
        <div className={demoStyles.vlayout} style={{ gap: 8 }}>
            {i18n.l('lazyPreloading')}
            <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                <button id="btn1" className={demoStyles.button} disabled={panel === 'panel1'} onClick={() => onChangePanel('panel1')}>Panel1</button>
                <button id="btn2" className={demoStyles.button} disabled={panel === 'panel2'} onClick={() => onChangePanel('panel2')}>Panel2</button>
                <button id="btn3" className={demoStyles.button} disabled={panel === 'panel3'} onClick={() => onChangePanel('panel3')}>Panel3 (Progress and no flash)</button>
            </div>

            <ul>
                <li>{i18n.l('lazyPreloading.hint')}</li>
                <li>{i18n.l('lazyPreloading.hint2')}</li>
                <li>{i18n.l('lazyPreloading.hint3')}</li>
            </ul>
            {panel === 'panel1' && <Panel1 />}
            {panel === 'panel2' && <Panel2 />}
            {panel === 'panel3' && <Panel3 />}
        </div>
    </main>
}