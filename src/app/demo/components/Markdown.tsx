import { useEffect, useState } from "react"

import { remark } from 'remark'
import remarkHtml from 'remark-html'

export type MarkdownProps = {
    content?: string
    className?: string
    styles?: React.CSSProperties
}

async function remarkContent(source: string) {
    const processedContent = await remark().use(remarkHtml).process(source)
    const contentHtml = processedContent.toString()
    return contentHtml
}

export default function Markdown({ content, styles, className }: MarkdownProps) {

    const [html, setHtml] = useState('')

    useEffect(() => {
        if (content && !html) {
            remarkContent(content).then((html) => {
                setHtml(html)
            })
        }
    })

    return <div className={className} style={styles} dangerouslySetInnerHTML={{ __html: html }}>
    </div >
}