/*
 * @file-created: 2023-12-25
 * @author: Dennis Chen
 */

import Script from 'next/script'

export default function GaScripts({ measurementId }: { measurementId: string | undefined }) {
    return measurementId && <>
        <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');
`}
        </Script>
    </>
}
