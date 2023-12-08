


export const dynamic = 'force-dynamic' // defaults to force-static


import { TiktokenCalculation } from "@/app/demo/types"
import { NextRequest, NextResponse } from "next/server"
import { Tiktoken } from "tiktoken/lite"
import { load } from "tiktoken/load"
import models from "tiktoken/model_to_encoding.json" assert { type: 'json' }
import registry from "tiktoken/registry.json" assert { type: 'json' }


let model: {
    explicit_n_vocab: number | undefined
    pat_str: string
    special_tokens: Record<string, number>
    bpe_ranks: string
}

async function calculateToken(content: string, detail: any = false) {

    if (!model) {
        model = await load((registry as any)[models["gpt-3.5-turbo"]])
    }
    
    const enc = new Tiktoken(
        model.bpe_ranks,
        model.special_tokens,
        model.pat_str
    )

    const encodedUnit32Array = enc.encode(content)
    enc.free()
    if (detail) {
        return {
            content,
            charNum: content.length,
            tokenNum: encodedUnit32Array.length,
            token: [...encodedUnit32Array.map(unit32 => unit32)]
        } as TiktokenCalculation
    } else {
        return {
            charNum: content.length,
            tokenNum: encodedUnit32Array.length,
        } as TiktokenCalculation
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const content = searchParams.get('content') ?? "Hello GPT"
    const detail = searchParams.get('detail') ?? true

    return Response.json(await calculateToken(content, detail))
}

export async function POST(req: NextRequest, res: NextResponse) {
    const contentType = req.headers.get('Content-Type')

    let detail: any
    let content: any

    if (contentType && contentType.indexOf('application/json') >= 0) {
        const json = await req.json()
        content = json.content
        detail = json.detail

    } else if (contentType &&
        (contentType.indexOf('multipart/form-data') >= 0 || contentType.indexOf('application/x-www-form-urlencoded') >= 0)) {
        const formData = await req.formData()
        content = formData.get('content')
        detail = formData.get('detail')
    } else {
        return new Response("", { status: 400, statusText: "unknown content type " + contentType })
    }

    if (content!=='' && !content) {
        return new Response("", { status: 400, statusText: "no content to calculate" })
    }

    const calculation = await calculateToken(content, detail)

    return Response.json(calculation)
}