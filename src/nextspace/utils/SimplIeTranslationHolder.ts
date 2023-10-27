/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { TranslationHolder } from '@/nextspace/types'

export default class SimpleTranslationHolder implements TranslationHolder {

    private translationMap = new Map<string, any>();
    private locale: string = "";

    register(locale: string, translation: { [key: string]: any }) {
        const { translationMap } = this
        translationMap.set(locale, translation)
    }

    changeLocale(locale: string) {
        this.locale = locale
    }

    l(key: string, args?: { [key: string]: string }) {
        const { locale, translationMap } = this
        const val = translationMap.get(locale)?.[key]
        return val || key
    }
}

