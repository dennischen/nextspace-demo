'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import WorkspaceHolder from "@/nextspace/contexts/workspace"
import Link from "next/link"
import { useContext } from "react"
import demoStyles from "./demo.module.scss"

type PageProps = {
}

export default function DemoPage({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    return <main className={demoStyles.main}>
        <Link href="/demo/language">{i18n.l("language")}</Link>
        <Link href="/demo/theme">{i18n.l("theme")}</Link>
        <Link href="/demo/login">{i18n.l("login")}</Link>
    </main>
}