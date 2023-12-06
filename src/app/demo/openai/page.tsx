'use client'
/*
 * @file-created: 2023-10-31
 * @author: Dennis Chen
 */

import demoStyles from "@/app/demo/demo.module.scss"
import { useI18n, useTheme, useWorkspace } from "@nextspace"
import { AbortablePromise } from "@nextspace/types"
import clsx from "clsx"
import { Marked, Token, Tokens, TokensList } from 'marked'
import { ClientOptions, OpenAI } from 'openai'
import { ChangeEvent, MouseEvent, useCallback, useDeferredValue, useEffect, useReducer, useState } from "react"

import { DemoThemepack, TiktokenCalculation } from "@/app/demo/types"
import { ChatCompletionMessageParam } from "openai/resources"
import standard from './standard.md?as_txt'

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
    const [viewkey, setViewkey] = useState(false)
    const [markdown, setMarkdown] = useState(standard)
    const [preview, setPreview] = useState(false)
    const [renderedHtml, setRenderedHtml] = useState('')
    const [tokentNum, setTokenNum] = useState(0)
    const deferredApikey = useDeferredValue(apikey)
    const deferredMarkdown = useDeferredValue(markdown)
    const deferredPreview = useDeferredValue(preview)
    const deferredViewkey = useDeferredValue(viewkey)

    const onChangeApikey = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
        setApikey(evt.target.value)
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


    const [processingState, handleProcessingState] = useReducer(processingStateReducer, { state: 'stopped' })
    const [logs, handleLogs] = useReducer(logsReducer, [])

    const running = processingState.state === 'running'
    const aborting = processingState.state === 'aborting'
    const stopped = processingState.state === 'stopped'

    const onClickClear = useCallback((evt: MouseEvent) => {
        handleLogs({ type: 'clear' })
    }, [])

    const onClickCalculate = useCallback((evt: MouseEvent) => {
        const processingPromise = workspace.withProcessIndicator(() => {
            return fetch('/api/tiktoken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: deferredMarkdown, detail: false })
            })
        })
        processingPromise.then(async (res) => {
            if (processingPromise.aborted()) {
                handleLogs({
                    type: 'add',
                    log: i18n.l('openai.msg.calculationAborted')
                })
            } else if (res.status === 200) {
                const calculation = (await res.json()) as TiktokenCalculation
                setTokenNum(calculation.tokenNum)
                handleLogs({
                    type: 'add',
                    log: i18n.l('openai.msg.tokenCalculation', { tokenNum: calculation.tokenNum, charNum: calculation.charNum })
                })
            } else {
                handleLogs({
                    type: 'add',
                    log: i18n.l('openai.msg.err', { err: res.statusText })
                })
            }
            handleProcessingState({ type: 'reset' })
        }).catch((err) => {
            handleLogs({
                type: 'add',
                log: i18n.l('openai.msg.err', { err })
            })
            handleProcessingState({ type: 'reset' })
        })

        handleProcessingState({ type: 'run', promise: processingPromise })
    }, [workspace, i18n, deferredMarkdown])

    const onClickTranslate = useCallback((evt: MouseEvent) => {


        const translationMap = new Map<string, Token[]>()
        const walkTokens = (tokens: TokensList) => {
            tokens && tokens.forEach((token: Token) => {
                if (token.type === 'text') {
                    if (translationMap.has(token.text)) {
                        translationMap.get(token.text)?.push(token)
                    } else {
                        translationMap.set(token.text, [token])
                    }
                }
                if ((token as any).tokens) {
                    walkTokens((token as any).tokens)
                } else if ((token as any).items) {
                    (token as any).items.forEach((item: any) => {
                        if (item.tokens) {
                            walkTokens(item.tokens)
                        }
                    })
                }
            })
        }
        const marked = new Marked()
        const tokensList = marked.lexer(deferredMarkdown)
        walkTokens(tokensList)
        const translationArray = Array.from(translationMap.entries())

        const clientOptions: ClientOptions = {
            apiKey: apikey,
            dangerouslyAllowBrowser: true
        }
        const openai = new OpenAI(clientOptions)

        const srcLanguage = 'English'
        const targetLanguage = 'Traditional Chinese'
        const IDK = `!!IDONTKNOW!!`
        const instruction = `You are an assistant helping me translate text from ${srcLanguage} into ${targetLanguage}.\n`
            + `You must strictly follow the rules below:\n`
            + `Don't add any extra words except the translation.\n`
            + `Rerutn "${IDK}" directly if you find it is too short or if you can't understandard it.\n`
        const gptModel = 'gpt-3.5-turbo'

        async function sendAndResponse(message: string, messages: ChatCompletionMessageParam[]) {
            const requestMessage: ChatCompletionMessageParam = {
                role: 'user',
                content: message,
            }
            messages.push(requestMessage)
            const completion = await openai.chat.completions.create({
                model: gptModel,
                messages: messages,
            })
            const responseMessage = completion.choices?.[0]?.message
            if (responseMessage) {
                messages.push({
                    role: responseMessage.role,
                    content: responseMessage.content,
                })
                return {
                    prompt_tokens: completion.usage?.prompt_tokens,
                    completion_tokens: completion.usage?.completion_tokens,
                    total_tokens: completion.usage?.total_tokens,
                    content: responseMessage.content
                }
            }
        }

        (async function _() {

            const messages: ChatCompletionMessageParam[] = []
            const response = await sendAndResponse(instruction, messages)
            handleLogs({
                type: 'add',
                log: `${instruction} >> ${response?.content}`
            })

            for (var i = 0; i < translationArray.length; i++) {
                const text = translationArray[i][0]
                const tokens = translationArray[i][1]
                const response = await sendAndResponse(`"${translationArray[i][0]}"`, messages)
                handleLogs({
                    type: 'add',
                    log: `${text} >> ${response?.content}`
                })
                tokens.forEach((node) => {
                    const content = response?.content;
                    (node as Tokens.Text).text = (content && content !== IDK) ? content : text
                })
            }

            console.log(">>>>>tokens", tokensList)
            const html = marked.parser(tokensList)
            console.log(">>>>>html", html)

            // const html2 = marked.parse(deferredMarkdown)
            // console.log(">>>>>html2", html2)


            // const html = await marked.parse(deferredMarkdown)
            setRenderedHtml(html)
        })()

    }, [workspace, i18n, deferredMarkdown, deferredApikey])


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
                            <input type="checkbox" checked={deferredViewkey} onChange={onChangeViewkey} />
                        </label>)
                    </div>
                    <input id="apikey" type={deferredViewkey ? 'text' : 'password'} className={demoStyles.fullwidth} disabled={!stopped} value={apikey} onChange={onChangeApikey}></input>
                </div>
                <div className={clsx(demoStyles.vlayout, demoStyles.fullwidth)} style={{ gap: 4, alignItems: 'start' }}>
                    <div className={demoStyles.hlayout}>
                        {i18n.l('openai.markdown')}
                        {(tokentNum) ? `(${i18n.l('openai.tokenNum')}:${tokentNum})` : ''}
                        (<label className={demoStyles.hlayout}>
                            {i18n.l('openai.preview')}
                            <input type="checkbox" checked={deferredPreview} onChange={onChangePreview} />
                        </label>)
                    </div>
                    <div className={clsx(demoStyles.hlayout, demoStyles.fullwidth)} style={{ gap: 8, alignItems: 'start' }}>
                        <textarea id="markdown" className={demoStyles.flex} style={{ height: 400, padding: 4 }} disabled={!stopped} value={markdown} onChange={onChangeMarkdown}></textarea>
                        {deferredPreview && <div className={demoStyles.flex} style={{ border: `1px solid ${themepack.variables.primaryColor}`, padding: '0 4px', height: 400, overflowY: "auto" }} dangerouslySetInnerHTML={{ __html: renderedHtml }} ></div>}
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
                {logs.map((log, idx) => <span key={idx}>
                    {log}
                </span>)}
            </div>
        </div>

    </main>
}