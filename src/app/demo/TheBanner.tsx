'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */
import { useI18n, useTheme, useWorkspace } from "@nextspace"
import Link from "@nextspace/components/Link"
import clsx from "clsx"
import Cookies from "universal-cookie"
import { COOKIE_LANGUAGE, COOKIE_THEME } from "./constants"
import demoStyles from "./demo.module.scss"
import { BannerState, DemoThemepack } from "./types"
import BannerStore, { BANNER_STORE, initBannerStore } from "./stores/BannerStore"
import { useSyncExternalStore } from "react"


export default function TheBanner({ defaultBannerState }: { defaultBannerState?: BannerState }) {

    const workspace = useWorkspace();
    const i18n = useI18n()
    const theme = useTheme()
    const { styles: themeStyles } = theme.themepack as DemoThemepack

    const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        i18n.changeLanguage(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_LANGUAGE, evt.target.value)
    }

    const onChangeTheme = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        theme.changeTheme(evt.target.value)

        const cookies = new Cookies(null, { path: '/' })
        cookies.set(COOKIE_THEME, evt.target.value)
    }

    //init the banner store form defaultBannerState (which is from server request) if there is not
    const bannerStore = workspace.getStore(BANNER_STORE, initBannerStore(defaultBannerState)) as BannerStore
    const bannerState = useSyncExternalStore(bannerStore.subscribe, bannerStore.snapshot, bannerStore.snapshot)
    

    return <div className={clsx(demoStyles.banner, themeStyles.banner)} style={{ gap: 4 }}>
        <Link id="home" href={"/demo"}>{i18n.l('home')}</Link>

        <div className={demoStyles.flexpadding} />
        {bannerState.showTheme && <select name="theme" defaultValue={theme.code} onChange={onChangeTheme}>
            {theme.codes.map(theme => <option key={theme} value={theme}>{i18n.l(`theme.${theme}`)}</option>)}
        </select>}
        {bannerState.showLanguage && <select name="language" defaultValue={i18n.language} onChange={onChangeLanguage}>
            {i18n.languages.map(language => <option key={language} value={language}>{i18n.l(`language.${language}`)}</option>)}
        </select>}
    </div>
}