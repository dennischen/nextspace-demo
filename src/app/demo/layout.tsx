/*
 * Server Component layout for getting information from cookie
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { Metadata } from 'next'
import { cookies } from 'next/headers'
import WorkspaceLayout from "./WorkspaceLayout"
import { COOKIE_LANGUAGE, COOKIE_THEME, DEFAULT_LANGUAGE, DEFAULT_THEME } from './constants'

//force no-static page (use cookies() did the same thing in nextjs)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Nextspace Demo',
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
}

export type LayoutProps = {
    children: React.ReactNode
}

export default function DemoLayout({ children }: LayoutProps) {
    const cookieStore = cookies()
    const cookieLanguage = cookieStore.get(COOKIE_LANGUAGE)?.value || DEFAULT_LANGUAGE
    const cookieTheme = cookieStore.get(COOKIE_THEME)?.value || DEFAULT_THEME


    //to make default theme load before html render, has to load it in server component first. (will render css to layout.css)
    //do this will prevent page flash effect (css loaded after html render), 
    //however this make layout.css contains all theme css
    //use switch theme case by case doesn't help css split (included in build time?)
    switch (cookieTheme) {
        case 'darkred':
            ()=>import("./themes/darkred.module.scss")
            break;
        case 'lightblue':
        default:
            ()=>import("./themes/lightblue.module.scss")
            break;
    }

    return <WorkspaceLayout defaultLanguage={cookieLanguage} defaultTheme={cookieTheme}>
        {children}
    </WorkspaceLayout >
}
