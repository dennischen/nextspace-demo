'use client'

import { useContext } from "react"
import demoStyles from "./demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import Link from "next/link"

export default function Banner() {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace
    return <div className={demoStyles.banner} >
        <Link href={"/demo"}>{i18n.l('home')}</Link>
    </div>
}