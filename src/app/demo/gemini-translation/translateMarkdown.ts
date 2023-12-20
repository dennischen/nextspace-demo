/*
 * @file-created: 2023-12-08
 * @author: Dennis Chen
 */

import { Content, CountTokensRequest, GenerateContentRequest, GoogleGenerativeAI } from "@google/generative-ai"
import type { AbortablePromise, Process, Workspace } from "@nextspace"
import { sequential } from '@nextspace/utils/process'


export type TranslationReport = {
    content?: string,
    promptTokens?: number[]
}

export const DEFAULT_INSTURCTION = `Help me to translate below markdown content into \${targetLanguage}.\n`


export default function translateMarkdown(markdown: string, { apiKey }: { apiKey: string },
    options?: {
        srcLanguage?: string,
        targetLanguage?: string,
        instruction?: string
        conversation?: boolean,
        model?: string,
        log?: (text: string) => void
        report?: (report: TranslationReport) => void
        workspace?: Workspace
    }
): AbortablePromise<TranslationReport> {

    const {
        targetLanguage = '繁體中文',
        model = 'gemini-pro',
        conversation = false,
        log = (text: string) => {
            console.log(text)
        },
        report = () => { },
        workspace
    } = options ?? {}
    // thanks https://github.com/smikitky/chatgpt-md-translator/blob/main/prompt-example.md
    let instruction = options?.instruction || DEFAULT_INSTURCTION

    try {
        let script = `(\`${instruction.replaceAll('\n', '\\n').replaceAll('\`', '\\`')}\`)`
        instruction = eval(script)
    } catch (err) {
        //for error handling consistant, re throw error in aysnc
        return sequential([async () => {
            throw err
        }])
    }


    log(`Start translation by Gemini Generate Content API`)
    log(`Instrucation: ${instruction}`)

    const genAI = new GoogleGenerativeAI(apiKey)
    const genModel = genAI.getGenerativeModel({
        model: model,
        generationConfig: {
            temperature: 1 //to prevent too many creatives
        }
    })

    const promptTokens: number[] = []

    const rootContents: Content[] = []

    const processes: Process[] = []


    processes.push(async () => {

        const localContents = [...rootContents]

        localContents.push({
            role: 'user',
            parts: [{
                text: `${instruction} ${markdown}`
            }]
        })

        const generateContentRequest: GenerateContentRequest = {
            contents: localContents
        }
        const countTokenRequest: CountTokensRequest = {
            contents: localContents
        }


        const contentResult = await genModel.generateContent(generateContentRequest)

        const contentResultResponse = contentResult.response

        const countTokensResponse = await genModel.countTokens(countTokenRequest)


        if (conversation) {
            localContents.push({
                role: 'model',
                parts: [{ text: contentResultResponse?.text() || '' }]
            })
            rootContents.splice(0)
            rootContents.push(...localContents)
        }

        const content = contentResultResponse?.text() || markdown

        log(`${markdown} >> ${content}`)

        promptTokens.push(countTokensResponse.totalTokens || 0)


        const result = {
            content,
            promptTokens: [...promptTokens],
        }

        report(result)

        return result
    })

    if (workspace) {
        return workspace.withProcessIndicator(processes)
    } else {
        return sequential(processes)
    }
}