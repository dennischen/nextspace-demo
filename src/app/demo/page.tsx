'use client'

/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { useI18n, useTheme } from "@nextspace"
import clsx from "clsx"
import Link from "next/link"
import demoStyles from "./demo.module.scss"
import { DemoThemepack } from "./types"

type PageProps = {
}

export default function DemoPage({ }: PageProps) {
    const i18n = useI18n();
    const { styles: themeStyles } = useTheme().themepack as DemoThemepack

    let key = 0
    const demoLinks: React.ReactNode[] = [
        <Link key={key++} id="language" href="/demo/language">{i18n.l("language")}</Link>,
        <Link key={key++} id="theme" href="/demo/theme">{i18n.l("theme")}</Link>,
        <Link key={key++} id="sequential-processing" href="/demo/sequential-processing">{i18n.l("sequentialProcessing")}</Link>,
        <Link key={key++} id="lazy-preloading" href="/demo/lazy-preloading">{i18n.l("lazyPreloading")}</Link>,
    ]

    return <main className={demoStyles.main}>
        <div className={demoStyles.homegrid}>
            {demoLinks.map((link, idx) =>
                <div key={idx} className={clsx(demoStyles.homegriditem)}>
                    <div className={clsx(demoStyles.homecase, themeStyles.homecase)}>
                        {link}
                    </div>
                </div>
            )}
        </div>
    </main>
}