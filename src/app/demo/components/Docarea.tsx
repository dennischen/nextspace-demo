'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */

import { memo, useEffect, useState } from "react"

import clsx from "clsx"
import Markdown from "./Markdown"
import compStyles from './docarea.module.scss'

import bookOpen from "@/app/demo/assets/book-open.svg?as_txt"
import book from "@/app/demo/assets/book.svg?as_txt"
import InnerHTML from "./InnerHTML"
import { useI18n } from "@nextspace"

export type DocareaProps = {
    children?: React.ReactNode
    contentMarkdown?: string
    contentSrc?: string
    className?: string
    styles?: React.CSSProperties
    defaultShow?: boolean
    position?: 'start' | 'end'
}

export default memo(function Docarea({ children, contentMarkdown, contentSrc, className, styles, defaultShow = false, position = 'start' }: DocareaProps) {

    const i18n = useI18n()

    const [show, setShow] = useState(defaultShow)

    const [markdown, setMarkdown] = useState(contentMarkdown)

    const onToggle = () => {
        setShow(!show)
    }

    useEffect(() => {
        if (!markdown && show && contentSrc) {
            fetch(contentSrc).then((res) => {
                res.ok && res.text().then((markdown) => {
                    setMarkdown(markdown)
                })
            })
        }
    }, [markdown, show, contentSrc])

    const markdownComp = show && <div className={clsx(compStyles.markdown, compStyles['grid-item'])}>
        {(!markdown && contentSrc) ? <div className={compStyles.loading}>{i18n.l('loading')}...</div> :
            <Markdown content={markdown} />
        }
    </div>

    return <div className={clsx("--docarea", compStyles.root, className)} style={styles}>
        <button
            className={clsx(compStyles.toggle, show && compStyles['toggle-show'], position === 'end' && compStyles['toggle-end'])}
            onClick={onToggle}
        ><InnerHTML innerHtml={show ? bookOpen : book}></InnerHTML></button>
        {position === 'start' && markdownComp}
        <div className={clsx(show ? compStyles['grid-item'] : compStyles['grid-item-single'], compStyles.children)}>
            {children}
        </div>
        {position === 'end' && markdownComp}
    </div>
})