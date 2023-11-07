/*
 * Server Component layout for getting information from cookie
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { Metadata } from 'next'
import { cookies } from 'next/headers'
import WorkspaceLayout from "./WorkspaceLayout"
import { COOKIE_LANGUAGE, COOKIE_THEME } from './constants'

const defaultLanguage = "en"
const defaultTheme = "lightblue"

//force no-static page (use cookies() did the same thing in nextjs)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Nextspace Demo'
}

export type LayoutProps = {
    children: React.ReactNode
}

export default function DemoLayout({ children }: LayoutProps) {
    const cookieStore = cookies()
    const cookieLanguage = cookieStore.get(COOKIE_LANGUAGE)?.value || defaultLanguage
    const cookieTheme = cookieStore.get(COOKIE_THEME)?.value || defaultTheme


    //to make default theme load before html render, has to load it in server component first.
    //this make layout.css contains both css
    // switch (cookieTheme) {
    //     case 'darkred':
    //         import("./themes/darkred.module.scss")
    //         break;
    //     case 'lightblue':
    //     default:
    //         import("./themes/lightblue.module.scss")
    //         break;
    // }

    return <WorkspaceLayout defaultLanguage={cookieLanguage} defaultTheme={cookieTheme}>
        {children}
    </WorkspaceLayout >
}
