'use client'

import { useContext } from "react"
import demoStyles from "./demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"
import Link from "next/link"
import Cookies from "universal-cookie"
import { COOKIE_LANGUAGE } from "./constants"

export default function Banner() {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        workspace.changeLanguage(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_LANGUAGE, evt.target.value)
    }

    return <div className={demoStyles.banner} >
        <Link href={"/demo"}>{i18n.l('home')}</Link>
        <div className={demoStyles.packing} />
        <select name="language" className={demoStyles.select} defaultValue={i18n.language} onChange={onChangeLanguage}>
            {workspace.languages.map(language => <option key={language} value={language}>{i18n.l(`language.${language}`)}</option>)}
        </select>
    </div>
}