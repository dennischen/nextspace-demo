/*
 * @file-created: 2023-12-08
 * @author: Dennis Chen
 */

import { getUserPreference } from "@/app/demo/server-utils"
import { Metadata } from "next"
import ThePage from "./ThePage"
import { getI18n } from "@/app/demo/i18n/serverTranslation"


export async function generateMetadata(
): Promise<Metadata> {

    const preference = getUserPreference()
    const i18n = await getI18n(preference.userLanguage)

    return {
        title: i18n.l('openaiTranslation.title'),
        keywords: ['ai', 'openai', 'markdown', 'translation']
    }
}

export default function page({ }) {
    return <ThePage />
}