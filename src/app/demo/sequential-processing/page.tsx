'use client'
/*
 * @file-created: 2023-10-31
 * @author: Dennis Chen
 */

import demoStyles from "@/app/demo/demo.module.scss"
import { useI18n, useWorkspace } from "@nextspace"
import { AbortablePromise, Process } from "@nextspace/types"
import moment from 'moment'
import { ChangeEvent, MouseEvent, useCallback, useEffect, useReducer, useState } from "react"


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
    state: 'stopped' | 'running' | 'aborting'
    promise?: AbortablePromise
}

type ProcessingStateOperation = {
    type: 'run' | 'abort' | 'reset'
    promise?: AbortablePromise
}

function processingStateReducer(state: ProcessingState, operation: ProcessingStateOperation): ProcessingState {
    switch (operation.type) {
        case 'run':
            return {
                ...state,
                state: 'running',
                promise: operation.promise

            }
        case 'abort':
            return {
                ...state,
                state: 'aborting',

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
    const workspace = useWorkspace()
    const i18n = useI18n()

    const [procNumber, setProcNumber] = useState(5)
    const [errNumber, setErrNumber] = useState(6)
    const [maxTimeout, setMaxTimeout] = useState(5000)
    const [processingState, handleProcessingState] = useReducer(processingStateReducer, { state: 'stopped' })
    const [logs, handleLogs] = useReducer(logsReducer, [])

    const running = processingState.state === 'running'
    const aborting = processingState.state === 'aborting'
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
            return (previous: number = 0) => {
                const timeout = Math.max(1000, Math.trunc(Math.random() * maxTimeout))

                handleLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.start', { idx: idx + 1, time: moment().format('HH:mm:ss'), timeout, previous })
                })
                return new Promise<number>((resolve, reject) => {

                    setTimeout(() => {
                        if (idx >= errNumber - 1) {
                            reject(`a fake error at process ${idx + 1}`)
                        } else {
                            resolve(previous + 1)
                            handleLogs({
                                type: 'add',
                                log: i18n.l('sequentialProcessing.msg.done', { idx: idx + 1, time: moment().format('HH:mm:ss') })
                            })
                        }
                    }, timeout)
                })
            }
        })



        const sequentialPromise = workspace.withProcessIndicator(processes)
        sequentialPromise.then((value) => {
            if (sequentialPromise.aborted()) {
                handleLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.aborted', { value, step: sequentialPromise.step() + 1 })
                })
            } else {
                handleLogs({
                    type: 'add',
                    log: i18n.l('sequentialProcessing.msg.allDone', { value })
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
    }, [workspace, i18n, procNumber, errNumber, maxTimeout, processingState?.promise])


    //always use last processingState for aborting
    const onClickCancel = useCallback((evt: MouseEvent) => {
        processingState.promise?.abort()
        handleProcessingState({ type: 'abort' })
    }, [processingState?.promise])

    //abort also when page exit
    useEffect(() => {
        //return cleaner in useEffect to clean
        return () => {
            processingState?.promise?.abort()
        }
    }, [processingState?.promise])

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
                <button id="abort" disabled={!running} onClick={onClickCancel}>{i18n.l('action.abort')}</button>
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