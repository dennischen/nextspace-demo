import { Themepack } from "@nextspace/types"

export type DemoStyles = {
    banner: string
    footer: string
    layout: string
    homecase: string
}

export type DemoThemepack = {
    readonly styles: DemoStyles
} & Themepack