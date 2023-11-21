'use client'
/*
 * @file-created: 2023-11-06
 * @author: Dennis Chen
 */
import { themepackRegister } from "@nextspace/components/themepackRegister"

import { DemoThemepack } from "@/app/demo/types"
import styles from './darkred.module.scss'

const themepack: DemoThemepack = {
    dark: true,
    colorScheme: 'dark',
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

export default themepackRegister(themepack)