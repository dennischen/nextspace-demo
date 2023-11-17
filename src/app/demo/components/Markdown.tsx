'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */
import clsx from "clsx"
import { useEffect, useRef, useState } from "react"

import rehypeExternalLinks from 'rehype-external-links'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'

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

    const processedContent = await remark()
        // .use(remarkHtml) = .use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).
        .use(remarkRehype)
        .use(rehypeSanitize)
        .use(rehypeExternalLinks, { target: '_blank', rel: ['nofollow'] })
        .use(rehypeStringify)
        .process(source)
    const contentHtml = processedContent.toString()
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