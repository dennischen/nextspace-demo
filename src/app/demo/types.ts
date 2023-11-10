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
}

export type DemoThemepack = {
    readonly variables: DemoVariables
    readonly styles: DemoStyles
} & Themepack