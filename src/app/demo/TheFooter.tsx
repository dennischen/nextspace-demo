'use client'
/*
 * @file-created: 2023-11-14
 * @author: Dennis Chen
 */
import { useI18n, useTheme } from "@nextspace"
import Link from "@nextspace/components/Link"
import clsx from "clsx"
import demoStyles from "./demo.module.scss"
import { DemoThemepack } from "./types"

export default function Footer({ hideProject }: { hideProject?: boolean }) {
    const i18n = useI18n()
    const { styles } = useTheme().themepack as DemoThemepack
    return <div className={clsx(demoStyles.footer, styles.footer)} >
        {!hideProject && <Link href={"https://github.com/dennischen/nextspace"} target="_blank">Github {i18n.l('project')}</Link>}
    </div>
}