'use client'

import styles from "@/nextspace/nextspace.module.scss"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
/*
 * @file-created: 2023-10-24
 * @author: Dennis Chen
 */

export type ModalProps = {
    children?: React.ReactNode
    container?: HTMLElement
    delay?: number
}

export default function Modal({ container, children, delay = 300 }: ModalProps) {

    const [show, setShow] = useState(delay > 0 ? false : true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true)
        }, delay)
        return () => clearTimeout(timer)
    }, [show, delay])

    const content = <div className={clsx(styles.modal, !show && styles.hide)}>{children}</div>
    if (!container && typeof document === 'undefined') {
        return content
    }
    return createPortal(content, container || document.body)
}