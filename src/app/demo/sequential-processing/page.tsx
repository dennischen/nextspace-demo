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
import { SequentialPromise } from "@nextspace/utils/process"

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


type ProcessingState = {
    state: 'stopped' | 'running' | 'canceling'
    promise?: SequentialPromise
}

type ProcessingStateOperation = {
    type: 'run' | 'cancel' | 'reset'
    promise?: SequentialPromise
}

function processingStateReducer(state: ProcessingState, operation: ProcessingStateOperation): ProcessingState {
    switch (operation.type) {
        case 'run':
            return {
                ...state,
                state: 'running',
                promise: operation.promise

            }
        case 'cancel':
            return {
                ...state,
                state: 'canceling',

            }
        case 'reset':
            return {
                ...state,
                state: 'stopped',
                promise: undefined
            }
    }
}


export default function Page({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    const [procNumber, setProcNumber] = useState(5)
    const [errNumber, setErrNumber] = useState(6)
    const [maxTimeout, setMaxTimeout] = useState(5000)
    const [processingState, handleProcessingState] = useReducer(processingStateReducer, { state: 'stopped' })
    const [logs, handleLogs] = useReducer(logsReducer, [])

    const running = processingState.state === 'running'
    const canceling = processingState.state === 'canceling'
    const stopped = processingState.state === 'stopped'

    const onChangeProcNumber = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        let n = parseInt(evt.target.value)
        if (n > 0) {
            setProcNumber(n)
        } else {
            setProcNumber(0)
        }
    }, [])
    const onChangeErrNumber = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        let n = parseInt(evt.target.value)
        if (n > 0) {
            setErrNumber(n)
        } else {
            setErrNumber(0)
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
        handleLogs({ type: 'clear' })
    }, [])

    const onClickRun = useCallback((evt: MouseEvent) => {
        const processes: Process[] = [...Array(procNumber)].map((_, idx) => {
            return () => {
                const timeout = Math.max(1000, Math.trunc(Math.random() * maxTimeout))

                handleLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.start', { idx: idx + 1, time: moment().format('HH:mm:ss'), timeout })
                })
                return new Promise<void>((resolve, reject) => {

                    setTimeout(() => {
                        if (idx >= errNumber - 1) {
                            reject(`a fake error at process ${idx + 1}`)
                            return
                        }
                        resolve()
                        handleLogs({
                            type: 'add',
                            log: i18n.l('sequentialProcessing.msg.done', { idx: idx + 1, time: moment().format('HH:mm:ss') })
                        })
                    }, timeout)
                })
            }
        })



        const sequentialPromise = workspace.withProcessIndicator(...processes)
        sequentialPromise.then(() => {
            if (sequentialPromise.canceled()) {
                handleLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.canceled')
                })
            } else {
                handleLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.allDone')
                })
            }
            handleProcessingState({ type: 'reset' })
        }).catch((err) => {

            handleLogs({
                type: 'add',
                log: i18n.l('sequentialProcessing.msg.err', { err })
            })

            handleProcessingState({ type: 'reset' })
        })
        handleProcessingState({ type: 'run', promise: sequentialPromise })
    }, [workspace, i18n, procNumber, errNumber, maxTimeout])


    //always use last processingState for canceling
    const onClickCancel = (evt: MouseEvent) => {
        processingState.promise?.cancel()
        handleProcessingState({ type: 'cancel' })
    }

    return <main className={demoStyles.main}>
        <div className={demoStyles.vlayout} style={{ gap: 8 }}>
            {i18n.l('sequentialProcessing')}
            <div className={demoStyles.vlayout} style={{ gap: 8 }}>
                <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                    <span>{i18n.l('sequentialProcessing.procNumber')}</span>
                    <input id="procNumber" type="number" disabled={!stopped} value={procNumber} onChange={onChangeProcNumber}></input>
                </div>
                <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                    <span>{i18n.l('sequentialProcessing.errNumber')}</span>
                    <input id="errNumber" type="number" disabled={!stopped} value={errNumber} onChange={onChangeErrNumber}></input>
                </div>
                <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                    <span>{i18n.l('sequentialProcessing.maxTimeout')}</span>
                    <input id="maxTimeout" type="number" disabled={!stopped} value={maxTimeout} onChange={onChangeMaxTimeout}></input>
                </div>

            </div>
            <ul>
                <li>{i18n.l('sequentialProcessing.hint')}</li>
                <li>{i18n.l('sequentialProcessing.hint2')}</li>
            </ul>
            <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                <button id="clear" disabled={!stopped} onClick={onClickClearLogs}>{i18n.l('action.clear')}</button>
                <button id="run" disabled={!stopped} onClick={onClickRun}>{i18n.l('action.run')}</button>
                <button id="stop" disabled={!running} onClick={onClickCancel}>{i18n.l('action.cancel')}</button>
            </div>
            <div className={demoStyles.vlayout}>
                {processingState.state}
            </div>
            <div className={demoStyles.vlayout}>
                {logs.map((log, idx) => <span key={idx}>
                    {log}
                </span>)}
            </div>
        </div>

    </main>
}