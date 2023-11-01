'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import WorkspaceHolder from "@nextspace/contexts/workspace"
import Link from "next/link"
import { useContext } from "react"
import demoStyles from "./demo.module.scss"
import clsx from "clsx"

type PageProps = {
}

export default function DemoPage({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    let key = 0;
    const demoLinks: React.ReactNode[] = [
        <Link key={key++} href="/demo/language">{i18n.l("language")}</Link>,
        <Link key={key++} href="/demo/sequential-processing">{i18n.l("sequentialProcessing")}</Link>,
        <Link key={key++} href="/demo/lazy-preloading">{i18n.l("lazyPreloading")}</Link>,
    ]

    return <main className={demoStyles.main}>
        <div className={demoStyles.homegrid}>
            {demoLinks.map((link, idx) =>
                <div key={idx} className={clsx(demoStyles.homegriditem)}>
                    <div className={demoStyles.homecase}>
                        {link}
                    </div>
                </div>
            )}
        </div>
    </main>
}