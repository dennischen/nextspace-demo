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
    content?: string
    className?: string
    styles?: React.CSSProperties
    defaultShow?: boolean
}

export default function Docarea({ content, className, styles, defaultShow = false }: DocareaProps) {

    const [show, setShow] = useState(defaultShow)

    const onToggle = () => {
        setShow(!show)
    }


    return <div className={clsx("_darkarea", compStyles.root, className)} style={styles}>
        <button
            className={compStyles.toggle}
            onClick={onToggle}
        ><InnerHTML innerHtml={show ? bookOpen : book}></InnerHTML></button>
        {show && <Markdown content={content} className={compStyles.markdown} />}
    </div>
}