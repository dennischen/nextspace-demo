'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */
import { useI18n, useThemepack } from "@nextspace"
import clsx from "clsx"
import Link from "next/link"
import demoStyles from "./demo.module.scss"
import { DemoThemepack } from "./types"

export default function Footer() {
    const i18n = useI18n()
    const { styles, dark } = useThemepack() as DemoThemepack
    return <div className={clsx(demoStyles.footer, styles.footer)} >
        <Link href={"https://github.com/dennischen/nextspace"} target="_blank">Github {i18n.l('project')}</Link>
    </div>
}