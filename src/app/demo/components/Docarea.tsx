'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */

import { useState } from "react"

import clsx from "clsx"
import Markdown from "./Markdown"
import compStyles from './docarea.module.scss'

import bookOpen from "@/app/demo/assets/book-open.svg?as_txt"
import book from "@/app/demo/assets/book.svg?as_txt"
import InnerHTML from "./InnerHTML"

export type DocareaProps = {
    children?: React.ReactNode
    markdown?: string
    className?: string
    styles?: React.CSSProperties
    defaultShow?: boolean
}

export default function Docarea({ children, markdown, className, styles, defaultShow = false }: DocareaProps) {

    const [show, setShow] = useState(defaultShow)

    const onToggle = () => {
        setShow(!show)
    }


    return <div className={clsx("_docarea", compStyles.root, className)} style={styles}>
        <button
            className={clsx(compStyles.toggle, show && compStyles['toggle-show'])}
            onClick={onToggle}
        ><InnerHTML innerHtml={show ? bookOpen : book}></InnerHTML></button>
        <div className={compStyles['grid-item']}>
            {children}
        </div>
        {show && <div className={clsx(compStyles.markdown, compStyles['grid-item'])}><Markdown content={markdown}/></div>}
    </div>
}