'use client'
//'use client' to prevent build i18n resource into laout.js
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import WorkspaceBoundary from '@nextspace/WorkspaceBoundary'
import { WorkspaceConfig } from '@nextspace/types'
import I18nextTranslationHolder from '@nextspace/utils/I18nextTranslationHolder'
import { useContext, useMemo } from 'react'
import demoStyles from "./demo.module.scss"

import translationLoader from '@nextspace/components/translationLoader'
import NProgressIndicator from '@nextspace/utils/NProgressIndicator'
import i18next from 'i18next'
import Banner from "./Banner"
import Footer from './Footer'

import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

import themepackLoader from '@nextspace/components/themepackLoader'
import WorkspaceHolder from '@nextspace/contexts/workspace'
import clsx from 'clsx'
import "./global.scss"
import { DemoThemepack } from './types'

//the default translation
import fallbackTranslation from "./i18n/en.json"
const fallbackLanguage = "en"

const EnTranslationLoader = translationLoader("en", () => import('./i18n/EnTranslationLoader'))
const ZhTranslationLoader = translationLoader("zh", () => import('./i18n/ZhTranslatioLoader'))
const translations = [EnTranslationLoader, ZhTranslationLoader]

const LightblueThemepackLoader = themepackLoader("lightblue", () => import('./themes/LightblueThemepackLoader'))
const DarkredThemepackLoader = themepackLoader("darkred", () => import('./themes/DarkredThemepackLoader'))
const themepacks = [LightblueThemepackLoader, DarkredThemepackLoader]

export type WorkspaceLayoutProps = {
    defaultLanguage?: string,
    defaultTheme?: string,
    children: React.ReactNode
}

export default function WorkspaceLayout({ defaultLanguage, defaultTheme, children }: WorkspaceLayoutProps) {

    defaultLanguage = translations.find((l) => l.language === defaultLanguage)?.language || translations[0].language
    defaultTheme = themepacks.find((t) => t.theme === defaultTheme)?.theme || themepacks[0].theme

    const config = useMemo(() => {
        return {
            translationHolder: new I18nextTranslationHolder(i18next.createInstance(), {
                fallbackLng: fallbackLanguage,
                fallbackTranslation: fallbackTranslation
            }),
            progressIndicator: new NProgressIndicator(nProgress)
        } as WorkspaceConfig
    }, [])

    return <WorkspaceBoundary
        defaultLanguage={defaultLanguage} translations={translations}
        defaultTheme={defaultTheme} themepacks={themepacks}
        config={config} >
        <Layout>
            <Banner />
            {children}
            <div className={demoStyles.flexpadding} />
            <Footer />
        </Layout>
    </WorkspaceBoundary >
}

// a internal component to using theme in WorkspaceBoundary
function Layout({ children }: { children: React.ReactNode }) {
    const workspace = useContext(WorkspaceHolder)
    const { styles: themeStyles } = workspace.themepack as DemoThemepack
    return <div className={clsx(demoStyles.layout, themeStyles.layout)} >{children}</div>
}