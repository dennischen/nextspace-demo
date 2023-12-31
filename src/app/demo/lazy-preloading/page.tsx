'use client'
/*
 * @file-created: 2023-10-30
 * @author: Dennis Chen
 */

import demoStyles from "@/app/demo/demo.module.scss"
import { useI18n, useWorkspace } from "@nextspace"
import lazyWithPreload from "@nextspace/components/lazyWithPreload"
import { Suspense, lazy, useState } from "react"

type PageProps = {
}

const Panel1 = lazy(() => import('./Panel1'))
const Panel2 = lazy(() => import('./Panel2'))
const Panel3 = lazyWithPreload(() => import('./Panel3'))

export default function Page({ }: PageProps) {
    const workspace = useWorkspace()
    const i18n = useI18n()

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
                <button id="btn1" disabled={panel === 'panel1'} onClick={() => onChangePanel('panel1')}>Panel1</button>
                <button id="btn2" disabled={panel === 'panel2'} onClick={() => onChangePanel('panel2')}>Panel2</button>
                <button id="btn3" disabled={panel === 'panel3'} onClick={() => onChangePanel('panel3')}>Panel3 (Progress and no flash)</button>
            </div>

            <ul>
                <li>{i18n.l('lazyPreloading.hint')}</li>
                <li>{i18n.l('lazyPreloading.hint2')}</li>
                <li>{i18n.l('lazyPreloading.hint3')}</li>
            </ul>
            
            <Suspense fallback={<p id='loading'>Panel Loading</p>}>
                {panel === 'panel1' && <Panel1 />}
                {panel === 'panel2' && <Panel2 />}
                {panel === 'panel3' && <Panel3 />}
            </Suspense>
        </div>
    </main>
}