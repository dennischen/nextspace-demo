import { useEffect, useState } from "react"

import compStyles from './dockbox.module.scss'
import clsx from "clsx"
import Markdown from "./Markdown"

export type DocareaProps = {
    content?: string
    toggleLabel?: React.ReactNode
    className?: string
    styles?: React.CSSProperties
    defaultShow?: boolean
}

export default function Docarea({ content, toggleLabel, className, styles, defaultShow = false }: DocareaProps) {

    const [show, setShow] = useState(defaultShow)

    const onToggle = () => {
        setShow(!show)
    }


    return <div className={clsx(compStyles.root, className)} style={styles}>
        <button
            className={compStyles.toggle}
            onClick={onToggle}
        >{show ? 'Hide' : toggleLabel}</button>
        {show && <Markdown content={content} className={compStyles.markdown} styles={{ maxWidth: 500 }} />}
    </div>
}