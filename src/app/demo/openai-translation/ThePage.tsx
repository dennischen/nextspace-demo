'use client'
/*
 * @file-created: 2023-12-08
 * @author: Dennis Chen
 */
import Docarea from "@/app/demo/components/Docarea"
import demoStyles from "@/app/demo/demo.module.scss"
import { useI18n, useTheme, useWorkspace } from "@nextspace"
import { AbortablePromise } from "@nextspace/types"
import clsx from "clsx"
import { Marked } from 'marked'
import { ClientOptions } from 'openai'
import { ChangeEvent, MouseEvent, useCallback, useDeferredValue, useEffect, useReducer, useState } from "react"

import { DemoThemepack, TiktokenCalculation } from "@/app/demo/types"
import options from './options.json'
import sample from './sample.md?as_txt'
import translateMarkdown, { DEFAULT_INSTURCTION } from "./translateMarkdown"

import readme_default from './README.md?as_uri'
import readme_zh from './README_zh.md?as_uri'

import pageStyles from './page.module.scss'

const CUSTOM_VALUE = '--'

type ThePageProps = {
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

export default function ThePage({ }: ThePageProps) {
    const workspace = useWorkspace()
    const i18n = useI18n()
    const themepack = useTheme().themepack as DemoThemepack

    const publicApiKey = workspace.envVariables.DEMO_PUBLIC_OPENAI_API_KEY || ''
    const enableCalculatToekn = workspace.envVariables.DEMO_PUBLIC_ENABLE_CALCULATE_TOKEN === 'true' ? true: false

    const [apikey, setApikey] = useState(publicApiKey)
    const [instruction, setInstruction] = useState(DEFAULT_INSTURCTION)
    const [viewkey, setViewkey] = useState(false)
    const [markdown, setMarkdown] = useState(sample)
    const [optPreview, setOptPreview] = useState(false)
    const [optConversation, setOptConversation] = useState(true)
    const [optInstruction, setOptInstruction] = useState(false)
    const [optGptModel, setOptGptModel] = useState(options.default.gptModel)
    const [optTargetLanguage, setOptTargetLanguage] = useState(options.default.targetLanguage)


    const [renderedHtml, setRenderedHtml] = useState('')
    const [translatedMarkdown, setTranslatedMarkdown] = useState('')
    const [translateddHtml, setTranslatedHtml] = useState('')
    const [tokentNum, setTokenNum] = useState(0)
    const [transTokentNum, setTransTokenNum] = useState(0)

    const deferredApikey = useDeferredValue(apikey)
    const deferredInstruction = useDeferredValue(instruction)
    const deferredOptPreview = useDeferredValue(optPreview)

    const deferredMarkdown = useDeferredValue(markdown)
    const deferredTranslatedMarkdown = useDeferredValue(translatedMarkdown)

    const onChangeApikey = (evt: ChangeEvent<HTMLInputElement>) => {
        setApikey(evt.target.value)
    }
    const onClickDefaultInstruction = (evt: MouseEvent) => {
        setInstruction(DEFAULT_INSTURCTION)
    }
    const onChangeInstruction = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        setInstruction(evt.target.value)
    }
    const onChangeViewkey = (evt: ChangeEvent<HTMLInputElement>) => {
        setViewkey(evt.target.checked)
    }
    const onChangeOptGptModel = (evt: ChangeEvent<HTMLSelectElement>) => {
        setOptGptModel(evt.target.value)
    }
    const onChangeOptTargetLanguage = (evt: ChangeEvent<HTMLSelectElement>) => {
        if (evt.target.value === CUSTOM_VALUE) {
            setOptInstruction(true)
        } else {
            setOptTargetLanguage(evt.target.value)
        }
    }

    const onChangeOptPreview = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setOptPreview(evt.target.checked)
    }, [])
    const onChangeOptConversation = (evt: ChangeEvent<HTMLInputElement>) => {
        setOptConversation(evt.target.checked)
    }
    const onChangeOptInstruction = (evt: ChangeEvent<HTMLInputElement>) => {
        setOptInstruction(evt.target.checked)
    }

    const onChangeMarkdown = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(evt.target.value)
    }
    const onChangeTransMarkdown = (evt: ChangeEvent<HTMLTextAreaElement>) => {
        setTranslatedMarkdown(evt.target.value)
    }


    const [processingState, handleProcessingState] = useReducer(processingStateReducer, { state: 'stopped' })
    const resetProcessingState = () => {
        handleProcessingState({ type: 'reset' })
    }
    const setRunProcessingState = (promise: AbortablePromise) => {
        handleProcessingState({ type: 'run', promise })
    }
    const setAbortProcessingState = () => {
        handleProcessingState({ type: 'abort' })
    }

    const [logs, handleLogs] = useReducer(logsReducer, [])
    const addLog = (log: string) => {
        handleLogs({ type: 'add', log })
    }
    const clearLogs = () => {
        handleLogs({ type: 'clear' })
    }

    const running = processingState.state === 'running'
    const aborting = processingState.state === 'aborting'
    const stopped = processingState.state === 'stopped'

    const onClickClear = (evt: MouseEvent) => {
        setTranslatedMarkdown('')
        clearLogs()
    }

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
                addLog(i18n.l('openaiTranslation.msg.calculationAborted'))
            } else if (res.status === 200) {
                const calculation = (await res.json()) as TiktokenCalculation
                setTokenNum(calculation.tokenNum)
                addLog(i18n.l('openaiTranslation.msg.tokenCalculation', { tokenNum: calculation.tokenNum, charNum: calculation.charNum }))
            } else {
                addLog(i18n.l('openaiTranslation.msg.err', { err: res.statusText }))
            }
            resetProcessingState()
        }).catch((err) => {
            addLog(i18n.l('openaiTranslation.msg.err', { err }))
            resetProcessingState()
        })

        setRunProcessingState(calculationPromise)
    }, [workspace, i18n, deferredMarkdown])

    const onClickTranslate = useCallback((evt: MouseEvent) => {
        const clientOptions: ClientOptions = {
            apiKey: deferredApikey,
            dangerouslyAllowBrowser: true
        }

        const translationPromise = translateMarkdown(deferredMarkdown, clientOptions, {
            instruction: optInstruction ? deferredInstruction : undefined,
            conversation: optConversation,
            targetLanguage: optTargetLanguage || undefined,
            gptModel: optGptModel || optGptModel,
            workspace,
            log: addLog,
            report: (report) => {
                setTranslatedMarkdown(report.content || '')
            }
        })

        translationPromise.then((report) => {
            if (translationPromise.aborted()) {
                addLog(i18n.l('openaiTranslation.msg.translationAborted'))
            } else {
                addLog(i18n.l('openaiTranslation.msg.translationDown'))
                setTranslatedMarkdown(report.content || '')
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

            resetProcessingState()
        }).catch((err) => {
            console.error(err)
            addLog(i18n.l('openaiTranslation.msg.err', { err }))
            resetProcessingState()
        })
        setRunProcessingState(translationPromise)
        setTranslatedMarkdown('')
    }, [workspace, i18n, deferredMarkdown, deferredApikey, optGptModel, optTargetLanguage, optConversation, optInstruction, deferredInstruction])


    //always use last processingState for aborting
    const onClickAbort = useCallback((evt: MouseEvent) => {
        processingState.promise?.abort()
        setAbortProcessingState()
    }, [processingState?.promise])


    useEffect(() => {
        if (deferredMarkdown && deferredOptPreview) {
            (async function _() {
                const marked = new Marked({ async: true })
                const html = await marked.parse(deferredMarkdown)
                setRenderedHtml(html)
            })()
        } else {
            setRenderedHtml('')
        }

    }, [deferredMarkdown, deferredOptPreview])
    useEffect(() => {
        if (deferredTranslatedMarkdown && deferredOptPreview) {
            (async function _() {
                const marked = new Marked({ async: true })
                const html = await marked.parse(deferredTranslatedMarkdown)
                setTranslatedHtml(html)
            })()
        } else {
            setTranslatedHtml('')
        }

    }, [deferredTranslatedMarkdown, deferredOptPreview])

    //abort also when page exit
    useEffect(() => {
        //return cleaner in useEffect to clean
        return () => {
            processingState?.promise?.abort()
        }
    }, [processingState?.promise])


    let readmeUri = readme_default
    switch (i18n.language) {
        case 'zh':
            readmeUri = readme_zh
    }

    return <main className={demoStyles.main}>
        <Docarea className={demoStyles.docarea} contentSrc={readmeUri} defaultShow={true} position="start">
            <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 8 }}>
                {i18n.l('openaiTranslation.title')} ({i18n.l(`state.${processingState.state}`)})
                <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 8, padding: '0px 8px' }}>
                    <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                        <div className={demoStyles.hlayout}>
                            {i18n.l('openaiTranslation.apikey')}:
                            (<label className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.viewkey')}
                                <input type="checkbox" checked={viewkey} onChange={onChangeViewkey} />
                            </label>)
                        </div>
                        <input id="apikey" type={viewkey ? 'text' : 'password'} className={demoStyles.fullwidth} disabled={!stopped} value={apikey} onChange={onChangeApikey}></input>
                    </div>
                    <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                        <div className={demoStyles.hlayout} style={{ gap: 8, flexFlow: 'wrap' }}>
                            <label className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.gptModel')}:
                                &nbsp;
                                <select className={pageStyles.select} disabled={!stopped} value={optGptModel} onChange={onChangeOptGptModel}>
                                    {options.gptModels.map((m) => {
                                        return <option key={m} value={m}>{m}</option>
                                    })}
                                </select>
                            </label>
                            <label className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.targetLanguage')}:
                                &nbsp;
                                <select className={pageStyles.select} disabled={!stopped} value={optTargetLanguage} onChange={onChangeOptTargetLanguage}>
                                    {options.targetLanguages.map((lang) => {
                                        return <option key={lang.en} value={lang.en}>{`${lang.native} ( ${lang.en} )`}</option>
                                    })}
                                    <option value={CUSTOM_VALUE}>-- {i18n.l('openaiTranslation.customInstruction')} --</option>
                                </select>
                            </label>
                            <label className={demoStyles.hlayout}>
                                <input disabled={!stopped} type="checkbox" checked={optConversation} onChange={onChangeOptConversation} />
                                &nbsp;
                                {i18n.l('openaiTranslation.conversation')}
                            </label>
                            <label className={demoStyles.hlayout}>
                                <input disabled={!stopped} type="checkbox" checked={optInstruction} onChange={onChangeOptInstruction} />
                                &nbsp;
                                {i18n.l('openaiTranslation.customInstruction')}
                            </label>
                        </div>
                    </div>
                    {optInstruction && <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                        <div className={clsx(demoStyles.hlayout, demoStyles.fullwidth)}>
                            {i18n.l('openaiTranslation.customInstruction')}:
                            <div className={demoStyles.flex}/>
                            {instruction !== DEFAULT_INSTURCTION  && <button onClick={onClickDefaultInstruction} style={{padding: "1px 2px", fontSize: 'small'}}>{i18n.l('action.default')}</button>}
                        </div>
                        <textarea id="instruction" className={demoStyles.fullwidth} disabled={!stopped} value={instruction} style={{ padding: 4, height: 150 }} onChange={onChangeInstruction}></textarea>
                    </div>}
                    <div className={clsx(demoStyles.hlayout, demoStyles.fullwidth, pageStyles['markdown-area'])} >
                        <div className={clsx(demoStyles.flex, demoStyles.vlayout, '-item')}>
                            <div className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.markdown')}:
                                {(tokentNum) ? `(${i18n.l('openaiTranslation.tokenNum')}:${tokentNum})` : ''}
                                (<label className={demoStyles.hlayout}>
                                    <input type="checkbox" checked={optPreview} onChange={onChangeOptPreview} />
                                    &nbsp;
                                    {i18n.l('openaiTranslation.previewHtml')}
                                </label>)
                            </div>
                            <textarea id="markdown" className={clsx(demoStyles.fullwidth, demoStyles.flex)} style={{ padding: 4 }} disabled={!stopped} value={markdown} onChange={onChangeMarkdown}></textarea>
                        </div>
                        {optPreview && <div className={clsx(demoStyles.flex, demoStyles.vlayout, '-item')}>
                            <div className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.renderedHtml')}:
                            </div>
                            <div className={clsx(demoStyles.fullwidth, demoStyles.flex)} style={{ border: `1px solid ${themepack.variables.primaryColor}`, padding: '0 4px', overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: renderedHtml }} ></div>
                        </div>}
                    </div>
                    <div className={clsx(demoStyles.hlayout, demoStyles.fullwidth, pageStyles['markdown-area'])} >
                        <div className={clsx(demoStyles.flex, demoStyles.vlayout, '-item')}>
                            <div className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.translatedMarkdown')}:
                                {(transTokentNum) ? `(${i18n.l('openaiTranslation.translatedTokenNum')}:${transTokentNum})` : ''}
                            </div>
                            <textarea id="translatedMarkdown" className={clsx(demoStyles.fullwidth, demoStyles.flex)} style={{ padding: 4 }} disabled={!stopped} value={translatedMarkdown} onChange={onChangeTransMarkdown}></textarea>
                        </div>
                        {optPreview && <div className={clsx(demoStyles.flex, demoStyles.vlayout, '-item')}>
                            <div className={demoStyles.hlayout}>
                                {i18n.l('openaiTranslation.renderedHtml')}:
                            </div>
                            <div className={clsx(demoStyles.fullwidth, demoStyles.flex)} style={{ border: `1px solid ${themepack.variables.primaryColor}`, padding: '0 4px', overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: translateddHtml }} ></div>
                        </div>}
                    </div>
                </div>
                <div className={demoStyles.hlayout} style={{ gap: 8 }}>
                    <button id="clear" disabled={!stopped} onClick={onClickClear}>{i18n.l('action.clear')}</button>
                    {enableCalculatToekn && <button id="calculate" disabled={!stopped} onClick={onClickCalculate}>{i18n.l('openaiTranslation.calculateToken')}</button>}
                    <button id="translate" disabled={!stopped} onClick={onClickTranslate}>{i18n.l('openaiTranslation.translate')}</button>
                    <button id="abort" disabled={!running} onClick={onClickAbort}>{i18n.l('action.abort')}</button>
                </div>
                <div className={demoStyles.vlayout} style={{ color: themepack.dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)' }}>
                    {[...logs].reverse().map((log, idx) => <span key={idx}>
                        {log}
                    </span>)}
                </div>
            </div>
        </Docarea>
    </main>
}