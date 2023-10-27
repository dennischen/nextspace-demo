/*
 * Server Component layout for getting information from cookie
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { Metadata } from 'next'
import { cookies } from 'next/headers'
import WorkspaceLayout from "./WorkspaceLayout"
import { COOKIE_LOCALE } from './constants'

const defaultLocale = "en"

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
    let cookieLocale = cookieStore.get(COOKIE_LOCALE)?.value || defaultLocale

    return <WorkspaceLayout defaultLocale={cookieLocale}>
        {children}
    </WorkspaceLayout >
}
