/*
 * @file-created: 2023-11-21
 * @author: Dennis Chen
 */
import demoStyles from "@/app/demo/demo.module.scss"
import { cookies } from 'next/headers'
import { COOKIE_LANGUAGE, DEFAULT_LANGUAGE } from "@/app/demo/constants"
import { getI18n } from "@/app/demo/i18n/serverTranslation"

// dynaimc for searchParams
// Dynamic server usage: Page couldn't be rendered statically because it used `searchParams.key
export const dynamic = 'force-dynamic'

export default async function ServerPage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {


    const cookieStore = cookies()
    const cookieLanguage = cookieStore.get(COOKIE_LANGUAGE)?.value || DEFAULT_LANGUAGE

    const i18n = await getI18n(cookieLanguage)

    let timeout = parseInt(searchParams?.timeout || '3000') || 3000

    await new Promise<string>((resolve) => {
        setTimeout(() => {
            resolve("done")
        }, timeout)
    })
    return <main className={demoStyles.main}>
        <div className={demoStyles.vlayout} style={{ gap: 8 }}>

            <p id="timeout">{timeout} ms</p>

            <ul>
                <li>{i18n.l('slowRoute.hint')}</li>
                <li>{i18n.l('slowRoute.hint2')}</li>
            </ul>

        </div>
    </main>
}