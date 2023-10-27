'use client'
/*
 * @file-created: 2023-10-23
 * @author: Dennis Chen
 */
import TranslationRegister from "@nextspace/components/TranslationRegister"
import { TranslationLoaderProps } from "@nextspace/components/translationLoader"
import translation from "./zh.json"

export default function TranslationLoader({ locale, children }: TranslationLoaderProps) {
    return <TranslationRegister locale={locale} translation={translation} >{children}</TranslationRegister>
}