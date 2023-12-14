'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import Docarea from "@/app/demo/components/Docarea"
import { COOKIE_LANGUAGE } from "@/app/demo/constants"
import demoStyles from "@/app/demo/demo.module.scss"
import Cookies from 'universal-cookie'

import { useI18n, useWorkspace } from "@nextspace"

import BannerStore, { BANNER_STORE } from "@/app/demo/stores/BannerStore"
import { BannerState } from "@/app/demo/types"
import { useEffect } from "react"
import readme_default from './README.md?as_uri'
import readme_zh from './README_zh.md?as_uri'


export default function ThePage({ defaultBannerState }: { defaultBannerState: BannerState }) {
    const workspace = useWorkspace()
    const i18n = useI18n()

    const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_LANGUAGE, evt.target.value)
    }


    let readmeUri = readme_default
    switch (i18n.language) {
        case 'zh':
            readmeUri = readme_zh
    }

    useEffect(() => {
        (workspace.getStore(BANNER_STORE) as BannerStore)?.setState(defaultBannerState)
    }, [workspace])

    return <main className={demoStyles.main}>
        <Docarea className={demoStyles.docarea} contentSrc={readmeUri} defaultShow={true}>
            <div className={demoStyles.vlayout} style={{ gap: 8 }}>
                {i18n.l('language')}: {i18n.l(`language.${i18n.language}`)} ({i18n.language})
                <label>
                    {`${i18n.l("language.selectLanguage")} : `}
                    <select name="language" defaultValue={i18n.language} onChange={onChangeLanguage}>
                        {i18n.languages.map(language =>
                            <option key={language} value={language}>{i18n.l(`language.${language}`)}</option>)}
                    </select>
                </label>
                {i18n.l("fallback")}
            </div>
        </Docarea>
    </main>
}