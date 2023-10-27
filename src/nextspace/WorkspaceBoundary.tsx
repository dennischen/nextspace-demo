'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import clsx from "clsx"
import { Suspense, useMemo, useState } from "react"
import Modal from "./components/Modal"
import { TranslationLoaderComponent, TranslationLoaderProps } from "./components/translationLoader"
import WorkspaceHolder from "./contexts/workspace"
import styles from "./nextspace.module.scss"
import { I18n, Workspace, WorkspaceConfig, WorkspacePri } from "./types"
import SimpleTranslationHolder from "./utils/SimplIeTranslationHolder"
import SimpleProgressIndicator from "./utils/SimpleProgressIndicator"
import './global.scss'

let defaultConfig: Required<WorkspaceConfig> = {
    translationHolder: new SimpleTranslationHolder(),
    progressIndicator: new SimpleProgressIndicator()
}

export function setDefaultConfig(config: WorkspaceConfig) {
    defaultConfig = Object.assign({}, defaultConfig, config)
}

export type WorkspaceBoundaryProps = {
    children: React.ReactNode
    className?: string
    defaultLocale?: string
    translations?: TranslationLoaderComponent<React.ComponentType<TranslationLoaderProps>>[]
    config?: WorkspaceConfig
}


function assertTranslationLoader(locale: string | undefined,
    translations: TranslationLoaderComponent<React.ComponentType<TranslationLoaderProps>>[]) {
    if (locale) {
        const translation = translations.find((t) => t.locale === locale)
        if (!translation) {
            throw `No ${locale} found in translations [${translations.join(",")}]`
        }
        return translation
    }
}

export default function WorkspaceBoundary(props: WorkspaceBoundaryProps) {
    const { children, className, defaultLocale = "", translations = [] } = props
    let { config = {} } = props

    const mergedConfig = Object.assign({}, defaultConfig, config) as Required<WorkspaceConfig>

    //check defaultLocal in translations
    assertTranslationLoader(defaultLocale, translations)

    const [locale, setLocale] = useState(defaultLocale || translations.find(t => true)?.locale || '')
    // const [refresh, setRefresh] = useState(0);
    // const _refresh = function () {
    //     setRefresh(refresh + 1);
    // }

    const { translationHolder, progressIndicator } = mergedConfig
    translationHolder.changeLocale(locale)

    const workspace = useMemo(() => {
        const translationLocales = translations && translations.map((t) => t.locale) || []
        const i18n: I18n = {
            locale,
            changeLocale: (fnLocale) => {
                const loader = assertTranslationLoader(fnLocale, translations)
                const lstatus = loader?._nextspace._status || 0

                if (locale === fnLocale) {
                    return
                }
                if (lstatus > 0 || !loader) {
                    //loaded, change locale directly
                    translationHolder.changeLocale(fnLocale)
                    setLocale(fnLocale)
                } else {
                    progressIndicator.start()
                    loader.preload().then(() => {
                        translationHolder.changeLocale(fnLocale)
                        setLocale(fnLocale)
                    }).finally(() => {
                        progressIndicator.end()
                    })

                }
            },
            l: (key, args) => {
                return translationHolder.l(key, args) || key
            },

        }
        return {
            locales: translationLocales,
            _registerTranslation: (locale, translation) => {
                translationHolder.register(locale, translation)

                //I did a trick here, since TransationLoader is rendered before children, so it can register language without rerender for
                //1.by _refash(), it will cause setState in rendering error (client)
                //2.by useEffect is not called in server, it will cause hydration warn (html difference between first server-client rendering)

                // _refresh(); 
            },
            i18n: i18n,
            progressIndicator
        } as (Workspace & WorkspacePri)
    }, [locale, translations, translationHolder, progressIndicator])

    const TransationLoader = assertTranslationLoader(locale, translations)

    return <div className={clsx(styles.workspace, className)}>
        <WorkspaceHolder.Provider value={workspace}>
            <Suspense fallback={
                <Modal>
                    <p>Loading</p>
                </Modal>}>
                {TransationLoader ? <TransationLoader locale={locale}>{children}</TransationLoader> : children}
            </Suspense>
        </WorkspaceHolder.Provider>
    </div>
}

