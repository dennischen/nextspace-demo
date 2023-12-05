# Client Component 多語系功能支援

在nextjs(App Router)目前的[官方文件](https://nextjs.org/docs/app/building-your-application/routing/internationalization)中, 使用route path中的段落來決定目前使用者的語言, (e.g. /{lang}/post/{post_id}), 再經由async/wait layout/page來決定載入的語系.
這對於純內容平台的Server Page/Component及SEO是友善合理的, 但在由使用者的喜好決定的多語系的應用/專家系統, (e.g. 在cookie或header), 就變成不是那麼的方便使用了, 尤其是在Client Page/Component使用多國語系這一方面的支援.

`I18n`這個功能, 其目的是在解決, 如何在讓Client/Server Component能更方便的使用相同用法的`I18n`的多語系功能, 並且讓該語系能在需要時被載入.(Server Component使用I18n的功能方式不同，在[TODO]()展示中說明) 

## 取得多國語系字串
[[Source](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/language/page.tsx)]

使用`useI18n()`取得`I18n`
```tsx
const i18n = useI18n()
```

使用`i18n.l(key)`來取得對應key的字串.
```tsx
i18n.l('key1')
// by subkey (when using i18next)
i18n.l('key2.sub-key')
// with args (when using i18next)
i18n.l('key3', {unit:'x'})
// or in component
<span>{i18n.l('key4')}</span>
```

## 提供使用者設定喜好語系
使用`i18n.changeLanguage(language)`來設定目前的語系, `i18n.languages`是可使用的語系, `1i8n.language`是目前的語系
```tsx
const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(evt.target.value)

    const cookies = new Cookies(null, { path: '/' })
    cookies.set(COOKIE_LANGUAGE, evt.target.value)
}

<select name="language" defaultValue={i18n.language} onChange={onChangeLanguage}>
    {i18n.languages.map(language => 
        <option key={language} value={language}>{i18n.l(`language.${language}`)}</option>)}
</select>
```
---

## 設定
你的應用程式必需經由設定一些語系文件(Json)來提供多國語系

### 在Layout中定義TranslationLoader跟WorkspaceBoundary
[[DemoLayout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/DemoLayout.tsx)]

在Layout模組中, 使用`translationLoader(language, loader-module)`來提供動態載入的多語系內容, 這種方式建立方式能讓該語系內容被分別封裝在獨立的檔案中
```tsx
const EnTranslationLoader = translationLoader("en", () => import('./i18n/enTranslationRegister'))
const ZhTranslationLoader = translationLoader("zh", () => import('./i18n/zhTranslatioRegister'))
const translationLoaders = [EnTranslationLoader, ZhTranslationLoader]
```

在Layout Component中, 使用`WorkspaceBoundary`及設定`translationHolder`並指定`I18nextTranslationHolder`實作.(你也可以不作任何設定, 但預設的TranslationHolder只能提供簡易的key-value map的多語系內容)
```tsx
export default function DemoLayout({ defaultLanguage, children }: DemoLayoutProps) {

    defaultLanguage = translationLoaders.find((l) => l.language === defaultLanguage)?.language || translationLoaders[0].language

    const config = useMemo(() => {
        return {
            translationHolder: new I18nextTranslationHolder(i18next.createInstance()),
        } as WorkspaceConfig
    }, [])    

    return <WorkspaceBoundary
        defaultLanguage={defaultLanguage} translationLoaders={translationLoaders}
        config={config}>
        ...
        {children}
        ...
    </WorkspaceBoundary >
}
```

### 定義語系模組
在語系模組使用`export default translatioinRegister(translation)`來匯出語系內容

[[enTranslationRegister.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/i18n/enTranslationRegister.tsx)]
```tsx
import translationRegister from "@nextspace/components/translationRegister"
import translation from "./en.json"
export { translation }
export default translationRegister(translation)
```
[[zhTranslationRegister.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/i18n/zhTranslationRegister.tsx)]
```tsx
import translationRegister from "@nextspace/components/translationRegister"
import translation from "./zh.json"
export { translation }
export default translationRegister(translation)
```

### 使用Layout Component
在[layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx)使用Layout.
```tsx
const defaultLanguage = "en"

export default function DemoLayout({ children }: LayoutProps) {
    const cookieStore = cookies()
    const cookieLanguage = cookieStore.get(COOKIE_LANGUAGE)?.value || DEFAULT_LANGUAGE

    return <DemoLayout defaultLanguage={cookieLanguage}>
        {children}
    </DemoLayout >
}
```