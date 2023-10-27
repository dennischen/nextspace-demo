'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import { useContext } from "react"
import demoStyles from "@/app/demo/demo.module.scss"
import WorkspaceHolder from "@nextspace/contexts/workspace"


type PageProps = {
}

export default function NextspacePage({ }: PageProps) {
    const workspace = useContext(WorkspaceHolder)
    const { i18n } = workspace

    return <main className={demoStyles.main}>
        TODO
    </main>
}