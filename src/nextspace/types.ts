/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

export type Workspace = {
    readonly locales: string[]
    readonly i18n: I18n
    readonly progressIndicator: ProgressIndicator
}

export type WorkspacePri = {
    _registerTranslation(locale: string, translation: { [key: string]: any }): void
}

export type WorkspaceConfig = {
    translationHolder?: TranslationHolder
    progressIndicator?: ProgressIndicator
}

export type I18n = {
    readonly locale: string
    changeLocale(locale: string): void
    l(key: string, args?: { [key: string]: string }): string
}

export type TranslationHolder = {
    register: (locale: string, translation: { [key: string]: any }) => void
    changeLocale: (locale: string) => void
    l(key: string, args?: { [key: string]: string }): string
}

export type ProgressIndicator = {
    start: () => void
    end: (force?: boolean) => void
}

