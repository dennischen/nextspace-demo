'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */

import WorkspaceHolder from "@/nextspace/contexts/workspace"
import { WorkspacePri } from "@/nextspace/types"
import { useContext } from "react"

export type TranslationRegisterProps = {
    locale: string
    translation: { [key: string]: any }
    children?: React.ReactNode
}

export default function TranslationRegister({ locale, translation, children }: TranslationRegisterProps) {
    const workspace = useContext(WorkspaceHolder) as any as WorkspacePri

    if (locale && translation) {
        if (!workspace._registerTranslation) {
            throw 'workspace not found, you should use Workspaceboundary to wrap your layout or page'
        }
        workspace._registerTranslation(locale, translation)
    }

    return children
}