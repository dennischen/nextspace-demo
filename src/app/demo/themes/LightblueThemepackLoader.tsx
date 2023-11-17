'use client'
/*
 * @file-created: 2023-11-06
 * @author: Dennis Chen
 */
import ThemepackRegister from "@nextspace/components/ThemepackRegister"
import { ThemepackLoaderProps } from "@nextspace/components/themepackLoader"

import { DemoThemepack } from "@/app/demo/types"
import styles from './lightblue.module.scss'

const themepack: DemoThemepack = {
    colorScheme: 'light',
    variables: {
        bgColor: styles.bgColor,
        fgColor: styles.fgColor,
        primaryColor: styles.primaryColor,
        shadowColor: styles.shadowColor
    },
    styles: {
        banner: styles.banner,
        footer: styles.footer,
        layout: styles.layout,
        homecase: styles.homecase
    }
}

export default function ThemepackLoader({ code, children }: ThemepackLoaderProps) {
    return <ThemepackRegister code={code} themepack={themepack} >{children}</ThemepackRegister>
}