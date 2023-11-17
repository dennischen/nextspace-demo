'use client'
/* a layout client component to prevent build loader resource into laout.js
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import WorkspaceBoundary from '@nextspace/WorkspaceBoundary'
import { WorkspaceConfig } from '@nextspace/types'
import I18nextTranslationHolder from '@nextspace/utils/I18nextTranslationHolder'
import { useMemo } from 'react'
import demoStyles from "./demo.module.scss"

import translationLoader from '@nextspace/components/translationLoader'
import NProgressIndicator from '@nextspace/utils/NProgressIndicator'
import i18next from 'i18next'
import Banner from "./Banner"
import Footer from './Footer'

import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

import themepackLoader from '@nextspace/components/themepackLoader'
import clsx from 'clsx'
import "./global.scss"
import { DemoThemepack } from './types'

import { useTheme } from '@nextspace'

//the default translation
import fallbackTranslation from "./i18n/en.json"
const fallbackLanguage = "en"

const EnTranslationLoader = translationLoader("en", () => import('./i18n/enTranslationRegister'))
const ZhTranslationLoader = translationLoader("zh", () => import('./i18n/zhTranslatioRegister'))
const translationLoaders = [EnTranslationLoader, ZhTranslationLoader]

const LightblueThemepackLoader = themepackLoader("lightblue", () => import('./themes/lightblueThemepackRegister'))
const DarkredThemepackLoader = themepackLoader("darkred", () => import('./themes/darkredThemepackRegister'))
const themepackLoaders = [LightblueThemepackLoader, DarkredThemepackLoader]

export type WorkspaceLayoutProps = {
    defaultLanguage?: string,
    defaultTheme?: string,
    children: React.ReactNode
}

export default function WorkspaceLayout({ defaultLanguage, defaultTheme, children }: WorkspaceLayoutProps) {

    defaultLanguage = translationLoaders.find((l) => l.language === defaultLanguage)?.language || translationLoaders[0].language
    defaultTheme = themepackLoaders.find((t) => t.code === defaultTheme)?.code || themepackLoaders[0].code

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
        defaultLanguage={defaultLanguage} translationLoaders={translationLoaders}
        defaultTheme={defaultTheme} themepackLoaders={themepackLoaders}
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
    const { styles: themeStyles } = useTheme().themepack as DemoThemepack
    return <div className={clsx(demoStyles.layout, themeStyles.layout)} >{children}</div>
}