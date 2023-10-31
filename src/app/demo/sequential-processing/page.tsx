'use client'
/*
 * @file-created: 2023-10-31
 * @author: Dennis Chen
 */

import demoStyles from "@/app/demo/demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import { Process } from "@nextspace/types"
import { ChangeEvent, MouseEvent, useCallback, useContext, useReducer, useState } from "react"
import moment from 'moment'

type PageProps = {
}

type LogsOperation = {
    type: 'clear' | 'add'
    log?: string
}


function logsReducer(logs: string[], operation: LogsOperation): string[] {
    switch (operation.type) {
        case 'clear':
            return []
        case 'add':
            return [...logs, operation?.log || '']
    }

}

export default function Page({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    const [procNumber, setProcNumber] = useState(5)
    const [maxTimeout, setMaxTimeout] = useState(5000)
    const [running, setRunning] = useState(false)
    const [logs, reduceLogs] = useReducer(logsReducer, [])

    const onChangeProcNumber = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        let n = parseInt(evt.target.value)
        if (n > 0) {
            setProcNumber(n)
        } else {
            setProcNumber(0)
        }
    }, [])
    const onChangeMaxTimeout = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        let n = parseInt(evt.target.value)
        if (n > 0) {
            setMaxTimeout(n)
        } else {
            setMaxTimeout(0)
        }
    }, [])
    const onClickClearLogs = useCallback((evt: MouseEvent) => {
        reduceLogs({ type: 'clear' })
    }, [])
    const onClickRun = useCallback((evt: MouseEvent) => {
        let processes: Process[] = [...Array(procNumber)].map((_, idx) => {
            return () => {
                reduceLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.start', { idx: idx + 1, time: moment().format('HH:mm:ss') })
                })
                return new Promise<void>(resolve => {
                    setTimeout(() => {
                        resolve()
                        reduceLogs({
                            type: 'add',
                            log: i18n.l('sequentialProcessing.msg.done', { idx: idx + 1, time: moment().format('HH:mm:ss') })
                        })
                    }, 1 + (Math.random() * maxTimeout))
                })
            }
        })

        processes = [
            async () => {
                setRunning(true)
            },
            ...processes,
            async () => {
                setRunning(false)
            }
        ]

        workspace.withProcessIndicator(...processes)

    }, [workspace, i18n, procNumber, maxTimeout])

    return <main className={demoStyles.main}>
        <div className={demoStyles.vlayout} style={{ gap: 8 }}>
            {i18n.l('sequentialProcessing')}
            <div className={demoStyles.vlayout} style={{ gap: 8 }}>
                <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                    <span>{i18n.l('sequentialProcessing.procNumber')}</span>
                    <input type="number" className={demoStyles.input} disabled={running} value={procNumber} onChange={onChangeProcNumber}></input>
                </div>
                <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                    <span>{i18n.l('sequentialProcessing.maxTimeout')}</span>
                    <input type="number" className={demoStyles.input} disabled={running} value={maxTimeout} onChange={onChangeMaxTimeout}></input>
                </div>

            </div>
            <ul>
                <li>{i18n.l('sequentialProcessing.hint')}</li>
            </ul>
            <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                <button className={demoStyles.button} disabled={running} onClick={onClickClearLogs}>{i18n.l('action.clear')}</button>
                <button className={demoStyles.button} disabled={running} onClick={onClickRun}>{i18n.l('action.run')}</button>
            </div>
            <div className={demoStyles.vlayout}>
                {logs.map((log, idx) => <span key={idx}>
                    {log}
                </span>)}
            </div>
        </div>

    </main>
}