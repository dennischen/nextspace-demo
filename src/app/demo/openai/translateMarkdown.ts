import type { AbortablePromise, Process, Workspace } from "@nextspace"
import { sequential } from '@nextspace/utils/process'
import { Marked, Token, Tokens } from "marked"
import OpenAI, { ClientOptions } from "openai"
import { ChatCompletionMessageParam, ChatCompletionRole } from "openai/resources"

const targetTokenTypes = new Set(['heading', 'paragraph', 'list', 'table'])

const renderRaw = (output: string[], raw: string, blockdepth: number) => {
    if (blockdepth > 0) {
        const arr: string[] = []
        for (var i = 0; i < blockdepth; i++) {
            arr.push('>')
        }
        arr.push(' ')
        const h = arr.join('')
        raw = h + raw.replaceAll('\n', '\n' + h)
    }
    output.push(raw)
}
const renderMarkdown = (tokens: Token[], output: string[] = [], blockdepth: number = 0) => {
    tokens && tokens.forEach((token: Token) => {
        if (targetTokenTypes.has(token.type)) {
            renderRaw(output, token.raw, blockdepth)
        } else {
            if ((token as any).tokens) {
                if (token.type === 'blockquote') {
                    (token as Tokens.Blockquote).tokens.forEach((token) => {
                        renderMarkdown([token], output, blockdepth + 1)
                        output.push('\n')
                    })
                } else {
                    renderMarkdown((token as any).tokens, output, blockdepth)
                }
                output.push('\n')
            } else {
                renderRaw(output, token.raw, blockdepth)
            }
        }
    })
    return output
}

const extractTargetTokens = (tokens: Token[], targetNodesMap: Map<string, Token[]> = new Map()) => {
    tokens && tokens.forEach((token: Token) => {
        if (targetTokenTypes.has(token.type)) {
            if (targetNodesMap.has(token.raw)) {
                targetNodesMap.get(token.raw)?.push(token)
            } else {
                targetNodesMap.set(token.raw, [token])
            }
            //we will translate it by it's raw
            delete (token as any).tokens
            //list has items
            delete (token as any).items
        } else {
            if ((token as any).tokens) {
                extractTargetTokens((token as any).tokens, targetNodesMap)
            }
        }
    })
    return targetNodesMap
}


export type TranslationReport = {
    content?: string,
    promptTokens?: number[]
    completionTokens?: number[]
}

export const DEFAULT_INSTURCTION = `You are an multilingual assistant helping me translate text into \${targetLanguage}.\n`
    + `You must strictly follow the rules below:\n`
    + `* Never change the Markdown markup structure. Don't add or remove links. Do not change any URL.\n`
    + `* Never change the contents of code blocks even if they appear to have a bug.\n`
    + `* Always preserve the original line breaks. Do not add or remove blank lines.\n`
    + `* Never touch HTML-like tags such as <Notes>.\n`
    + `* Never touch the permalink such as {/*examples*/} at the end of each heading`


export default function translateMarkdown(content: string, clientOptions: ClientOptions,
    options?: {
        srcLanguage?: string,
        targetLanguage?: string,
        instruction?: string
        conversation?: boolean,
        gptModel?: string,
        log?: (text: string) => void
        report?: (report: TranslationReport) => void
        workspace?: Workspace
    }
): AbortablePromise<TranslationReport> {

    const {
        targetLanguage = '繁體中文',
        gptModel = 'gpt-3.5-turbo',
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

    //process
    const marked = new Marked()
    const rootTokensList = marked.lexer(content)
    const targetTokenMap = extractTargetTokens(rootTokensList)
    const targetTokens = Array.from(targetTokenMap.entries())

    log(`Start ${targetTokens.length} translations by OpenAI Chat Completions API`)
    log(`Instrucation: ${instruction}`)

    const openai = new OpenAI(clientOptions)

    const promptTokens: number[] = []
    const completionTokens: number[] = []

    const rootMessages: ChatCompletionMessageParam[] = []

    const processes: Process[] = []

    rootMessages.push({
        role: 'system',
        content: instruction
    })

    for (var i = 0; i < targetTokens.length; i++) {
        const idx = i
        const text = targetTokens[i][0]
        const tokens = targetTokens[i][1]
        processes.push(async () => {

            const localMessages = [...rootMessages]

            localMessages.push({
                role: 'user',
                content: text
            })

            const completion = await openai.chat.completions.create({
                model: gptModel,
                messages: localMessages,
            })
            const completionMessage = completion.choices?.[0]?.message


            if (conversation) {
                localMessages.push({
                    role: 'assistant',
                    content: completionMessage?.content || ''
                })
                rootMessages.splice(0)
                rootMessages.push(...localMessages)
            }

            const content = completionMessage?.content || text

            log(`${idx + 1}.${text} >> ${content}`)
            promptTokens.push(completion?.usage?.prompt_tokens || 0)
            completionTokens.push(completion?.usage?.completion_tokens || 0)

            tokens.forEach((node) => {
                let raw = content
                //gpt is not so smart as you want, it usually don't follow instruction precisely
                raw = raw + (raw.endsWith('\n') ? '' : '\n');
                (node as Token).raw = raw
            })

            const translatedMarkdown = renderMarkdown(rootTokensList).join('')

            const result = {
                content: translatedMarkdown,
                promptTokens: [...promptTokens],
                completionTokens: [...completionTokens],
            }

            report(result)

            return result
        })
    }

    processes.push(async () => {
        const translatedMarkdown = renderMarkdown(rootTokensList).join('')
        const result = {
            content: translatedMarkdown,
            promptTokens: [...promptTokens],
            completionTokens: [...completionTokens],
        }

        return result
    })

    if (workspace) {
        return workspace.withProcessIndicator(processes)
    } else {
        return sequential(processes)
    }
}