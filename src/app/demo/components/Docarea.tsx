'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */

import { useEffect, useState } from "react"

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
}

export default function Docarea({ children, contentMarkdown, contentSrc, className, styles, defaultShow = false }: DocareaProps) {


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


    return <div className={clsx("_docarea", compStyles.root, className)} style={styles}>
        <button
            className={clsx(compStyles.toggle, show && compStyles['toggle-show'])}
            onClick={onToggle}
        ><InnerHTML innerHtml={show ? bookOpen : book}></InnerHTML></button>
        <div className={clsx(show ? compStyles['grid-item'] : compStyles['grid-item-single'])}>
            {children}
        </div>
        {show && <div className={clsx(compStyles.markdown, compStyles['grid-item'])}>
            {(!markdown && contentSrc) ? <div className={compStyles.loading}>{i18n.l('loading')}...</div> :
                <Markdown content={markdown} />
            }
        </div>}
    </div>
}