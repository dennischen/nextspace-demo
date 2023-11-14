'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */
import React from "react"

export type InnerHTMLProps = {
    innerHtml: string
    tag?: string
    className?: string
    styles?: React.CSSProperties
}

export default function InnerHTML({ tag = 'div', innerHtml, styles, className }: InnerHTMLProps) {

    return React.createElement(tag, {
        className,
        styles,
        dangerouslySetInnerHTML: { __html: innerHtml },
    })
}