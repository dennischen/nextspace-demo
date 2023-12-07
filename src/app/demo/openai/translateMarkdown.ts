import type { AbortablePromise, Process, Workspace } from "@nextspace"
import { sequential } from '@nextspace/utils/process'
import { Marked, Token, Tokens } from "marked"
import OpenAI, { ClientOptions } from "openai"
import { ChatCompletionMessageParam } from "openai/resources"

const transTypes = new Set(['heading', 'paragraph', 'list', 'table'])

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
        if (transTypes.has(token.type)) {
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

const extractTransTokens = (tokens: Token[], transNodesMap: Map<string, Token[]> = new Map()) => {
    tokens && tokens.forEach((token: Token) => {
        if (transTypes.has(token.type)) {
            if (transNodesMap.has(token.raw)) {
                transNodesMap.get(token.raw)?.push(token)
            } else {
                transNodesMap.set(token.raw, [token])
            }
            //we will translate it by it's raw
            delete (token as any).tokens
            //list has items
            delete (token as any).items
        } else {
            if ((token as any).tokens) {
                extractTransTokens((token as any).tokens, transNodesMap)
            }
        }
    })
    return transNodesMap
}

async function sendAndResponse(openai: OpenAI, gptModel: string, message: string, messages: ChatCompletionMessageParam[]) {
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


export type TranslationReport = {
    content?: string,
    promptTokens?: number[]
    completionTokens?: number[]
}


export default function translateMarkdown(content: string, clientOptions: ClientOptions,
    options?: {
        srcLanguage?: string,
        targetLanguage?: string,
        instruction?: string
        gptModel?: string,
        log?: (text: string) => void
        report?: (report: TranslationReport) => void
        workspace?: Workspace
    }
): AbortablePromise<TranslationReport> {

    const {
        srcLanguage = 'English',
        targetLanguage = '繁體中文',
        gptModel = 'gpt-3.5-turbo',
        log = (text: string) => {
            console.log(text)
        },
        report = () => { },
        workspace
    } = options ?? {}
    // thanks https://github.com/smikitky/chatgpt-md-translator/blob/main/prompt-example.md
    let instruction = options?.instruction ?? `You are an multilingual assistant helping me translate text into ${targetLanguage}.\n`
        + `You must strictly follow the rules below:\n`
        + `* Never change the Markdown markup structure. Don't add or remove links. Do not change any URL.\n`
        + `* Never change the contents of code blocks even if they appear to have a bug.\n`
        + `* Always preserve the original line breaks. Do not add or remove blank lines.\n`
        + `* Never touch HTML-like tags such as <Notes>.\n`
        + `* Never touch the permalink such as {/*examples*/} at the end of each heading\n`
        + 'Say OK when your are ready.'

    let script = `(\`${instruction.replaceAll('\n', '\\n').replaceAll('\`', '\\`')}\`)`
    instruction = eval(script)

    //process
    const marked = new Marked()
    const rootTokensList = marked.lexer(content)
    const transTokenMap = extractTransTokens(rootTokensList)
    const transTokens = Array.from(transTokenMap.entries())

    log(`Start ${transTokens.length} translation by OpenAI Chat Completions API`)

    const openai = new OpenAI(clientOptions)

    const promptTokens: number[] = []
    const completionTokens: number[] = []

    const messages: ChatCompletionMessageParam[] = []

    const processes: Process[] = []


    processes.push(async () => {
        const instructionResponse = await sendAndResponse(openai, gptModel, instruction, messages)
        log(`0.${instruction} >> ${instructionResponse?.content}`)
        promptTokens.push(instructionResponse?.prompt_tokens || 0)
        completionTokens.push(instructionResponse?.completion_tokens || 0)
        return {
            content: '',
            promptTokens: [],
            completionTokens: [],
        }
    })
    for (var i = 0; i < transTokens.length; i++) {
        const idx = i
        const text = transTokens[i][0]
        const tokens = transTokens[i][1]
        processes.push(async () => {
            const response = await sendAndResponse(openai, gptModel, text, messages)
            log(`${idx + 1}.${text} >> ${response?.content}`)
            promptTokens.push(response?.prompt_tokens || 0)
            completionTokens.push(response?.completion_tokens || 0)

            tokens.forEach((node) => {
                let content = response?.content || text
                //gpt is not so smart as you want, it usually don't follow instruction precisely
                content = content + (content.endsWith('\n') ? '' : '\n');
                (node as Token).raw = content
            })

            const transMarkdown = renderMarkdown(rootTokensList).join('')

            const result = {
                content: transMarkdown,
                promptTokens: [...promptTokens],
                completionTokens: [...completionTokens],
            }

            report(result)

            return result
        })
    }

    processes.push(async () => {
        const transMarkdown = renderMarkdown(rootTokensList).join('')
        const result = {
            content: transMarkdown,
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