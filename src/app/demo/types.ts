import { Themepack } from "@nextspace/types"

/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

export type DemoStyles = {
    banner: string
    footer: string
    layout: string
    homecase: string
}
export type DemoVariables = {
    fgColor: string
    bgColor: string
    primaryColor: string
    shadowColor: string
}

export type DemoThemepack = {
    readonly variables: DemoVariables
    readonly styles: DemoStyles
} & Themepack


export type TiktokenCalculation = {
    readonly content?: string
    readonly charNum: number
    readonly tokenNum: number,
    readonly token?: number[]
}


export type BannerState = {
    showLanguage?: boolean
    showTheme?: boolean
}

export type FooterState = {
    hideProject?: boolean
}