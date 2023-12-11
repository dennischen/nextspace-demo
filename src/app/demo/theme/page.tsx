'use client'
/*
 * @file-created: 2023-11-08
 * @author: Dennis Chen
 */
import Docarea from "@/app/demo/components/Docarea"
import { COOKIE_THEME } from "@/app/demo/constants"
import demoStyles from "@/app/demo/demo.module.scss"
import { DemoThemepack } from "@/app/demo/types"
import { useI18n, useTheme } from "@nextspace"
import Cookies from 'universal-cookie'

import readme_default from './README.md?as_uri'
import readme_zh from './README_zh.md?as_uri'

type PageProps = {
}

export default function Page({ }: PageProps) {
    const i18n = useI18n()
    const theme = useTheme()
    const themepack = theme.themepack as DemoThemepack

    const onChangeTheme = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        theme.changeTheme(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_THEME, evt.target.value)
    }

    let readmeUri = readme_default
    switch (i18n.language) {
        case 'zh':
            readmeUri = readme_zh
    }

    return <main className={demoStyles.main}>
        <Docarea className={demoStyles.docarea} contentSrc={readmeUri} defaultShow={true}>
            <div className={demoStyles.vlayout} style={{ gap: 8 }}>
                {i18n.l('theme')}: {i18n.l(`theme.${theme.code}`)} ({theme.code})
                <label>
                    {`${i18n.l("theme.selectTheme")} : `}
                    <select name="theme" defaultValue={theme.code} onChange={onChangeTheme}>
                        {theme.codes.map(code => <option key={code} value={code}>{i18n.l(`theme.${code}`)}</option>)}
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
        </Docarea>
    </main>
}