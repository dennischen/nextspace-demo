'use client'

import { useContext } from "react"
import demoStyles from "./demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import Link from "next/link"
import { DemoThemepack } from "./types"
import clsx from "clsx"

export default function Footer() {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace
    const { styles, dark } = workspace.themepack as DemoThemepack
    return <div className={clsx(demoStyles.footer, styles.footer)} >
        <Link href={"https://github.com/dennischen/nextspace"} target="_blank">Github {i18n.l('project')}</Link>
    </div>
}