/*
 * Server Component layout for getting information from cookie
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { Metadata } from 'next'
import { cookies } from 'next/headers'
import WorkspaceLayout from "./WorkspaceLayout"
import { COOKIE_LANGUAGE as COOKIE_LANGUAGE } from './constants'

const defaultLanguage = "en"

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
    let cookieLanguage = cookieStore.get(COOKIE_LANGUAGE)?.value || defaultLanguage

    return <WorkspaceLayout defaultLanguage={cookieLanguage}>
        {children}
    </WorkspaceLayout >
}
