'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { COOKIE_LOCALE } from "@/app/demo/constants"
import demoStyles from "@/app/demo/demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import { useContext } from "react"
import Cookies from 'universal-cookie'

type PageProps = {
}

export default function Page({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        workspace.changeLocale(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_LOCALE, evt.target.value)
    }

    return <main className={demoStyles.main}>
        <div className={demoStyles.vlayout} style={{ gap: 8 }}>
            {i18n.l('language')}: {i18n.l(i18n.locale)} ({i18n.locale})
            <label>
                {`${i18n.l("language.selectLanguage")} : `}
                <select name="language" className={demoStyles.select} defaultValue={i18n.locale} onChange={onChangeLanguage}>
                    {workspace.locales.map(locale => <option key={locale} value={locale}>{i18n.l(locale)} ({locale})</option>)}
                </select>
            </label>
            {i18n.l("fallback")}
        </div>
    </main>
}