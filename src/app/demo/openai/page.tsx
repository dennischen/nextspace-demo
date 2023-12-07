'use client'
/*
 * @file-created: 2023-10-31
 * @author: Dennis Chen
 */

import demoStyles from "@/app/demo/demo.module.scss"
import { useI18n, useTheme, useWorkspace } from "@nextspace"
import { AbortablePromise } from "@nextspace/types"
import clsx from "clsx"
import { Marked } from 'marked'
import { ClientOptions } from 'openai'
import { ChangeEvent, MouseEvent, useCallback, useDeferredValue, useEffect, useReducer, useState } from "react"

import { DemoThemepack, TiktokenCalculation } from "@/app/demo/types"
import standard from './standard.md?as_txt'
import translateMarkdown from "./translateMarkdown"

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
    const themepack = useTheme().themepack as DemoThemepack

    const publicApiKey = workspace.envVariables.DEMO_PUBLIC_OPENAI_API_KEY || ''

    const [apikey, setApikey] = useState(publicApiKey)
    const [instruction, setInstruction] = useState('')
    const [viewkey, setViewkey] = useState(false)
    const [markdown, setMarkdown] = useState(standard)
    const [preview, setPreview] = useState(false)
    const [renderedHtml, setRenderedHtml] = useState('')
    const [transMarkdown, setTransMarkdown] = useState('')
    const [transRenderedHtml, setTransRenderedHtml] = useState('')
    const [tokentNum, setTokenNum] = useState(0)
    const [transTokentNum, setTransTokenNum] = useState(0)

    const deferredApikey = useDeferredValue(apikey)
    const deferredInstruction = useDeferredValue(instruction)
    const deferredMarkdown = useDeferredValue(markdown)
    const deferredPreview = useDeferredValue(preview)
    const deferredTransMarkdown = useDeferredValue(transMarkdown)

    const onChangeApikey = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setApikey(evt.target.value)
    }, [])
    const onChangeInstruction = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setInstruction(evt.target.value)
    }, [])
    const onChangeViewkey = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setViewkey(evt.target.checked)
    }, [])

    const onChangePreview = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setPreview(evt.target.checked)
    }, [])
    const onChangeMarkdown = useCallback((evt: ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(evt.target.value)
    }, [])
    const onChangeTransMarkdown = useCallback((evt: ChangeEvent<HTMLTextAreaElement>) => {
        setTransMarkdown(evt.target.value)
    }, [])


    const [processingState, handleProcessingState] = useReducer(processingStateReducer, { state: 'stopped' })
    const resetProcessing = useCallback(() => {
        handleProcessingState({ type: 'reset' })
    }, [])
    const runProcessing = useCallback((promise: AbortablePromise) => {
        handleProcessingState({ type: 'run', promise })
    }, [])


    const [logs, handleLogs] = useReducer(logsReducer, [])
    const addLog = useCallback((log: string) => {
        handleLogs({ type: 'add', log })
    }, [])
    const clearLogs = useCallback(() => {
        handleLogs({ type: 'clear' })
    }, [])

    const running = processingState.state === 'running'
    const aborting = processingState.state === 'aborting'
    const stopped = processingState.state === 'stopped'

    const onClickClear = useCallback((evt: MouseEvent) => {
        clearLogs()
    }, [])

    const onClickCalculate = useCallback((evt: MouseEvent) => {
        const calculationPromise = workspace.withProcessIndicator(() => {
            return fetch('/api/tiktoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: deferredMarkdown, detail: false })
            })
        })
        calculationPromise.then(async (res) => {
            if (calculationPromise.aborted()) {
                addLog(i18n.l('openai.msg.calculationAborted'))
            } else if (res.status === 200) {
                const calculation = (await res.json()) as TiktokenCalculation
                setTokenNum(calculation.tokenNum)
                addLog(i18n.l('openai.msg.tokenCalculation', { tokenNum: calculation.tokenNum, charNum: calculation.charNum }))
            } else {
                addLog(i18n.l('openai.msg.err', { err: res.statusText }))
            }
            resetProcessing()
        }).catch((err) => {
            addLog(i18n.l('openai.msg.err', { err }))
            resetProcessing()
        })

        runProcessing(calculationPromise)
    }, [workspace, i18n, deferredMarkdown])

    const onClickTranslate = useCallback((evt: MouseEvent) => {
        const clientOptions: ClientOptions = {
            apiKey: deferredApikey,
            dangerouslyAllowBrowser: true
        }

        const translationPromise = translateMarkdown(deferredMarkdown, clientOptions, {
            instruction: deferredInstruction || undefined,
            workspace,
            log: addLog,
            report: (report) => {
                setTransMarkdown(report.content || '')
            }
        })
        translationPromise.then((report) => {
            if (translationPromise.aborted()) {
                addLog(i18n.l('openai.msg.translationAborted'))
                setTransMarkdown(report.content || '')
            } else {
                addLog(i18n.l('openai.msg.translationDown'))
                setTransMarkdown(report.content || '')
            }

            const promptTokens = report.promptTokens || []
            const completionTokens = report.completionTokens || []

            const promptTotal = promptTokens.reduce((v, c) => {
                return v + c
            }, 0) || 0
            const completionTotal = completionTokens?.reduce((v, c) => {
                return v + c
            }, 0)

            addLog(`prompt tokens ${JSON.stringify(promptTokens)}, total: ${promptTotal}`)
            addLog(`completion tokens ${JSON.stringify(completionTokens)}, total ${completionTotal}`)
            addLog(`total tokens ${promptTotal + completionTotal}`)


            setTransTokenNum(promptTotal + completionTotal)

            resetProcessing()
        }).catch((err) => {
            console.error(err)
            addLog(i18n.l('openai.msg.err', { err }))
            resetProcessing()
        })
        runProcessing(translationPromise)
    }, [workspace, i18n, deferredMarkdown, deferredApikey, deferredInstruction])


    //always use last processingState for aborting
    const onClickCancel = useCallback((evt: MouseEvent) => {
        processingState.promise?.abort()
        handleProcessingState({ type: 'abort' })
    }, [processingState?.promise])


    useEffect(() => {
        if (deferredMarkdown && deferredPreview) {
            (async function _() {
                const marked = new Marked({ async: true })
                const html = await marked.parse(deferredMarkdown)
                setRenderedHtml(html)
            })()
        } else {
            setRenderedHtml('')
        }

    }, [deferredMarkdown, deferredPreview])
    useEffect(() => {
        if (deferredTransMarkdown && deferredPreview) {
            (async function _() {
                const marked = new Marked({ async: true })
                const html = await marked.parse(deferredTransMarkdown)
                setTransRenderedHtml(html)
            })()
        } else {
            setTransRenderedHtml('')
        }

    }, [deferredTransMarkdown, deferredPreview])

    //abort also when page exit
    useEffect(() => {
        //return cleaner in useEffect to clean
        return () => {
            processingState?.promise?.abort()
        }
    }, [processingState?.promise])

    return <main className={demoStyles.main}>
        <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 8 }}>
            {i18n.l('openai')}
            <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 8, padding: '0px 8px' }}>
                <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                    <div className={demoStyles.hlayout}>
                        {i18n.l('openai.apikey')}
                        (<label className={demoStyles.hlayout}>
                            {i18n.l('openai.viewkey')}
                            <input type="checkbox" checked={viewkey} onChange={onChangeViewkey} />
                        </label>)
                    </div>
                    <input id="apikey" type={viewkey ? 'text' : 'password'} className={demoStyles.fullwidth} disabled={!stopped} value={apikey} onChange={onChangeApikey}></input>
                </div>
                <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                    <div className={demoStyles.hlayout}>
                        {i18n.l('openai.instruction')}
                    </div>
                    <input id="instruction" className={demoStyles.fullwidth} disabled={!stopped} value={instruction} onChange={onChangeInstruction}></input>
                </div>
                <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                    <div className={demoStyles.hlayout}>
                        {i18n.l('openai.markdown')}
                        {(tokentNum) ? `(${i18n.l('openai.tokenNum')}:${tokentNum})` : ''}
                        (<label className={demoStyles.hlayout}>
                            {i18n.l('openai.preview')}
                            <input type="checkbox" checked={preview} onChange={onChangePreview} />
                        </label>)
                    </div>
                    <div className={clsx(demoStyles.hlayout, demoStyles.fullwidth)} style={{ gap: 8, alignItems: 'start' }}>
                        <textarea id="markdown" className={demoStyles.flex} style={{ height: 400, padding: 4 }} disabled={!stopped} value={markdown} onChange={onChangeMarkdown}></textarea>
                        {preview && <div className={demoStyles.flex} style={{ border: `1px solid ${themepack.variables.primaryColor}`, padding: '0 4px', height: 400, overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: renderedHtml }} ></div>}
                    </div>
                    <div className={demoStyles.hlayout}>
                        {i18n.l('openai.transMarkdown')}
                        {(transTokentNum) ? `(${i18n.l('openai.transTokenNum')}:${transTokentNum})` : ''}
                    </div>
                    <div className={clsx(demoStyles.hlayout, demoStyles.fullwidth)} style={{ gap: 8, alignItems: 'start' }}>
                        <textarea id="transMarkdown" className={demoStyles.flex} style={{ height: 400, padding: 4 }} disabled={!stopped} value={transMarkdown} onChange={onChangeTransMarkdown}></textarea>
                        {preview && <div className={demoStyles.flex} style={{ border: `1px solid ${themepack.variables.primaryColor}`, padding: '0 4px', height: 400, overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: transRenderedHtml }} ></div>}
                    </div>
                </div>
            </div>
            <ul>
                <li>{i18n.l('openai.hint')}</li>
                <li>{i18n.l('openai.hint2')}</li>
            </ul>
            <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                <button id="clear" disabled={!stopped} onClick={onClickClear}>{i18n.l('action.clear')}</button>
                <button id="calculate" disabled={!stopped} onClick={onClickCalculate}>{i18n.l('openai.calculateToken')}</button>
                <button id="translate" disabled={!stopped} onClick={onClickTranslate}>{i18n.l('openai.translate')}</button>
                <button id="abort" disabled={!running} onClick={onClickCancel}>{i18n.l('action.abort')}</button>
            </div>
            <div className={demoStyles.vlayout}>
                {processingState.state}
            </div>
            <div className={demoStyles.vlayout}>
                {[...logs].reverse().map((log, idx) => <span key={idx}>
                    {log}
                </span>)}
            </div>
        </div>

    </main>
}