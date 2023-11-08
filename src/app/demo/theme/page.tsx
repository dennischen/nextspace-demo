'use client'
/*
 * @file-created: 2023-11-08
 * @author: Dennis Chen
 */

import { COOKIE_THEME } from "@/app/demo/constants"
import demoStyles from "@/app/demo/demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import { useContext } from "react"
import Cookies from 'universal-cookie'
import { DemoThemepack } from "../types"

type PageProps = {
}

export default function Page({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n, theme } = workspace
    const themepack = workspace.themepack as DemoThemepack

    const onChangeTheme = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        workspace.changeTheme(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_THEME, evt.target.value)
    }

    return <main className={demoStyles.main}>
        <div className={demoStyles.vlayout} style={{ gap: 8 }}>
            {i18n.l('theme')}: {i18n.l(`theme.${theme}`)} ({theme})
            <label>
                {`${i18n.l("theme.selectTheme")} : `}
                <select name="theme" defaultValue={theme} onChange={onChangeTheme}>
                    {workspace.themes.map(theme => <option key={theme} value={theme}>{i18n.l(`theme.${theme}`)}</option>)}
                </select>
            </label>
            <div className={demoStyles.hlayout}>
                <span>bgColor :&nbsp;</span>
                <span id="bgColor">{themepack.variables.bgColor}</span>
            </div>
            <div className={demoStyles.hlayout}>
                <span>bgColor :&nbsp;</span>
                <span id="fgColor">{themepack.variables.fgColor}</span>
            </div>
            <div className={demoStyles.hlayout}>
                <span>primaryColor :&nbsp;</span>
                <span id="primaryColor">{themepack.variables.primaryColor}</span>
            </div>
        </div>
    </main>
}