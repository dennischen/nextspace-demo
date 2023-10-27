'use client'
//
/* 'use client' to prevent build i18n resource into laout.js

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
import "./global.scss"
import fallbackTranslation from "./i18n/en.json"

import 'nprogress/nprogress.css'
import nProgress from 'nprogress'

const fallbackLocale = "en"

const EnTranslationLoader = translationLoader("en", () => import('./i18n/EnTranslationLoader'))
const ZhTranslationLoader = translationLoader("zh", () => import('./i18n/ZhTranslatioLoader'))

const translations = [EnTranslationLoader, ZhTranslationLoader]

export type WorkspaceLayoutProps = {
    defaultLocale: string,
    children: React.ReactNode
}

export default function WorkspaceLayout({ defaultLocale, children }: WorkspaceLayoutProps) {

    defaultLocale = translations.find((l) => l.locale === defaultLocale)?.locale || translations[0].locale

    const config = useMemo(() => {
        return {
            translationHolder: new I18nextTranslationHolder(i18next.createInstance(), {
                fallbackLng: fallbackLocale,
                fallbackTranslation: fallbackTranslation
            }),
            progressIndicator: new NProgressIndicator(nProgress)
        } as WorkspaceConfig
    }, [])

    return <WorkspaceBoundary defaultLocale={defaultLocale} translations={translations} config={config} className={demoStyles.layout}>
        <Banner />
        {children}
        <Footer />
    </WorkspaceBoundary >
}