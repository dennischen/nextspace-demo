'use client'

import { useContext } from "react"
import demoStyles from "./demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import Link from "next/link"
import Cookies from "universal-cookie"
import { COOKIE_LANGUAGE, COOKIE_THEME } from "./constants"
import { DemoThemepack } from "./types"
import clsx from "clsx"

export default function Banner() {
    const workspace = useContext(WorkspaceHolder)
    const { i18n, theme, languages, themes } = workspace
    const { styles: themeStyles } = workspace.themepack as DemoThemepack

    const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        workspace.changeLanguage(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_LANGUAGE, evt.target.value)
    }

    const onChangeTheme = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        workspace.changeTheme(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_THEME, evt.target.value)
    }

    return <div className={clsx(demoStyles.banner, themeStyles.banner)} style={{ gap: 4 }}>
        <Link id="home" href={"/demo"}>{i18n.l('home')}</Link>
        <div className={demoStyles.packing} />
        <select name="theme" className={demoStyles.select} defaultValue={theme} onChange={onChangeTheme}>
            {themes.map(theme => <option key={theme} value={theme}>{i18n.l(`theme.${theme}`)}</option>)}
        </select>
        <select name="language" className={demoStyles.select} defaultValue={i18n.language} onChange={onChangeLanguage}>
            {languages.map(language => <option key={language} value={language}>{i18n.l(`language.${language}`)}</option>)}
        </select>
    </div>
}