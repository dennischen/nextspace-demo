'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import TranslationRegister from "@nextspace/components/TranslationRegister"
import { TranslationLoaderProps } from "@nextspace/components/translationLoader"
import translation from "./zh.json"

export default function ZhTranslationLoader({ language, children }: TranslationLoaderProps) {
    return <TranslationRegister language={language} translation={translation} >{children}</TranslationRegister>
}