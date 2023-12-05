'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

import { Marked, Renderer, Token, Tokenizer } from 'marked'


import Prism from "prismjs"
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/themes/prism.css'

import compStyles from './markdown.module.scss'

export type MarkdownProps = {
    content?: string
    className?: string
    styles?: React.CSSProperties
}

async function remarkContent(source: string) {

    const marked = new Marked()
    const tokenizer: Partial<Tokenizer> = {
        // link(src: string) {
        //     return undefined
        // }
    }
    const walkTokens = async (token: Token) => {
        // switch (token.type) {
        //     case 'link':
        //         break
        // }
    }
    const defaultRenderer = new Renderer()
    const renderer: Partial<Renderer> = {
        link(href: string, title: string | null | undefined, text: string) {
           const a = defaultRenderer.link(href, title, text) ;
           return a.replace("<a ","<a target='_blank' ");
        }
    }

    marked.use({ /*tokenizer, */ walkTokens, renderer, async: true })
    const contentHtml = await marked.parse(source)
    return contentHtml
}

export default function Markdown({ content, styles, className }: MarkdownProps) {

    const [html, setHtml] = useState('')
    const ref = useRef(null)

    useEffect(() => {
        if (content) {
            remarkContent(content).then((html) => {
                setHtml(html)
            })
        }
    }, [content])
    useEffect(() => {
        html && Prism.highlightAllUnder(ref.current as any)
    }, [html])

    return <div ref={ref} className={clsx('_markdown', compStyles.root, className)} style={styles} dangerouslySetInnerHTML={{ __html: html }}>
    </div >
}