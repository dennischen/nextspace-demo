
import acceptLanguageParser from 'accept-language-parser'
import { cookies, headers } from 'next/headers'
import 'server-only'
import { COOKIE_LANGUAGE, COOKIE_THEME, DEFAULT_LANGUAGE, DEFAULT_THEME } from './constants'

export function getUserPreference() {

    const theCookies = cookies()
    const theHeaders = headers()

    const cookieLanguage = theCookies.get(COOKIE_LANGUAGE)?.value || ''
    const cookieTheme = theCookies.get(COOKIE_THEME)?.value || ''


    const acceptLanguage = acceptLanguageParser.pick(['zh', 'en'], theHeaders.get('Accept-Language') || '')
    const userLanguage = cookieLanguage || acceptLanguage || DEFAULT_LANGUAGE
    const userTheme = cookieTheme || DEFAULT_THEME

    return {
        userLanguage,
        userTheme
    }
}