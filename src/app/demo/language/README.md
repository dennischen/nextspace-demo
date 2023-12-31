# Client Component I18n Support

In the current official documentation of Next.js (App Router), the user's language is determined based on the segments in the route path (e.g., /{lang}/post/{post_id}). The language loading is then determined through async/wait layout/page. While this approach is friendly and reasonable for Server Pages/Components and SEO on content platforms, it becomes less convenient for applications/expert systems with multilingual support based on user preferences (e.g., stored in cookies or headers). This is particularly true for the aspect of supporting multiple languages in client pages/components.

The purpose of the `I18n` feature is to address how to make it more convenient for Client/Server Components to use `I18n` for multilingual support in a consistent manner and to allow the language to be loaded when needed. (The usage of I18n in Server Components is explained differently and is outlined in [TODO]().)



## Obtaining Multilingual Strings
[Source](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/language/page.tsx)
Use `useI18n()` to obtain `I18n`.
```tsx
const i18n = useI18n()
```

Utilize `i18n.l(key)` to retrieve the string corresponding to the given key.
```tsx
i18n.l('key1')
// by subkey (when using i18next)
i18n.l('key2.sub-key')
// with args (when using i18next)
i18n.l('key3', {unit:'x'})
// or in component
<span>{i18n.l('key4')}</span>
```

## Providing User Language Preferences
Use `i18n.changeLanguage(language)` to set the current language. `i18n.languages` represents the available languages, and `i18n.language`` indicates the current language.
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

# Configuration
Your application must provide multilingual support through the configuration of language files (JSON).

## Define TranslationLoader and WorkspaceBoundary in Layout
[[DemoLayout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/DemoLayout.tsx)]


In the Layout module, use `translationLoader(language, loader-module)` to provide dynamically loaded multilingual content. This approach allows each translation to be encapsulated in separate files.
```tsx
const EnTranslationLoader = translationLoader("en", () => import('./i18n/enTranslationRegister'))
const ZhTranslationLoader = translationLoader("zh", () => import('./i18n/zhTranslatioRegister'))
const translationLoaders = [EnTranslationLoader, ZhTranslationLoader]
```

In the Layout Component, use `WorkspaceBoundary` and configure `translationHolder`, specifying the implementation as `I18nextTranslationHolder` (you can also make no configuration, but the default TranslationHolder provides a simple key-value map for multilingual content).
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

## Define Language Modules
In the language modules, use export default `translationRegister(translation)` to export the translation.

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

## Use Layout Component
In [layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx), use the Layout component.
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