'use client'

/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { useI18n, useTheme, useWorkspace } from "@nextspace"
import Link from "@nextspace/components/Link"
import clsx from "clsx"
// import Link from "next/link"
import demoStyles from "./demo.module.scss"
import { BannerState, DemoThemepack } from "./types"
import { useEffect, useMemo, useSyncExternalStore } from "react"
import BannerStore, { BANNER_STORE, initBannerStore } from "./stores/BannerStore"



export default function ThePage({ pageBannerState }: { pageBannerState: BannerState }) {
    const workspace = useWorkspace()
    const i18n = useI18n()
    const { styles: themeStyles } = useTheme().themepack as DemoThemepack

    let key = 0
    const demoLinks: React.ReactNode[] = [
        <Link key={key++} id="language" href="/demo/language">{i18n.l("language")}</Link>,
        <Link key={key++} id="theme" href="/demo/theme">{i18n.l("theme")}</Link>,
        <Link key={key++} id="sequential-processing" href="/demo/sequential-processing">{i18n.l("sequentialProcessing")}</Link>,
        <Link key={key++} id="lazy-preloading" href="/demo/lazy-preloading">{i18n.l("lazyPreloading")}</Link>,
        <Link key={key++} id="slow-route" href="/demo/slow-route">{i18n.l("slowRoute")}</Link>,
        <Link key={key++} id="openai-translation" href="/demo/openai-translation">{i18n.l("openaiTranslation")}</Link>,
        <Link key={key++} id="gemini-translation" href="/demo/gemini-translation">{i18n.l("geminiTranslation")}</Link>,
    ]

    //sets the banner state to workspace store which will be read in client banner
    useEffect(() => {
        (workspace.getStore(BANNER_STORE) as BannerStore)?.setState(pageBannerState)
    }, [workspace, pageBannerState])


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