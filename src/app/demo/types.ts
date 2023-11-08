import { Themepack } from "@nextspace/types"

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