/*
 * Server Component layout for getting information from cookie
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import { Metadata } from 'next'
import DemoLayout from "./DemoLayout"

//prevent blank flash
import Banner from './banner'
import Footer from './footer'
import { getUserPreference } from './server-utils'
import "./themes/darkred.module.scss"
import "./themes/lightblue.module.scss"

//force no-static page (use cookies() did the same thing in nextjs)
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Nextspace Demo',
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
}

export type LayoutProps = {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    
    const preference = getUserPreference()

    //to make default theme load before html render, has to load it in server component first. (will render css to layout.css)
    //do this will prevent page flash effect (css loaded after html render), 
    //however this make layout.css contains all theme css
    //use switch theme case by case doesn't help css split (included in build time?)
    // switch (cookieTheme) {
    //     case 'darkred':
    //         ()=>import("./themes/darkred.module.scss")
    //         break;
    //     case 'lightblue':
    //     default:
    //         ()=>import("./themes/lightblue.module.scss")
    //         break;
    // }

    const envVariables: {
        [key: string]: string | undefined
    } = {}
    for (var p in process.env) {
        if (p.startsWith('DEMO_PUBLIC_')) {
            envVariables[p] = process.env[p]
        }
    }

    return <DemoLayout defaultLanguage={preference.userLanguage} defaultTheme={preference.userTheme} envVariables={envVariables}
        banner={<Banner />} footer={<Footer/>}>
        {children}
    </DemoLayout >
}
