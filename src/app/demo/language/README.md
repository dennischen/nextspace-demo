

By using `workspace.i18n` utility, Server/Client loads the i18n translation lable resource only when reuqired.
The different from Next.Js is Server/Client can load translation not by the route path segment. i.e. keep same url between users who use different languages.

# General Usage

## Get label in page
[Source](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/language/page.tsx)
Get i18n by `useI18n()`
```tsx
const i18n = useI18n()
```

Use `i18n.l(key)` to get label by key, `1i8n.language` is the current language
```tsx
i18n.l('key1')
// by subkey (when using i18next)
i18n.l('key2.sub-key')
// with args (when using i18next)
i18n.l('key3', {unit:'x'})
// or in component
<span>{i18n.l('key4')}</span>
```

## Provide preference setting for a user
Set current language by `i18n.changeLanguage(language)`. `i18n.languages` are supported languages.
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
# Setup
## Define translation loader and workspace boundary in Layout component
[Source](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/WorkspaceLayout.tsx)


Use `translationLoader` in Layout module to load a translation by register components.
```tsx
const EnTranslationLoader = translationLoader("en", () => import('./i18n/enTranslationRegister'))
const ZhTranslationLoader = translationLoader("zh", () => import('./i18n/zhTranslatioRegister'))
const translationLoaders = [EnTranslationLoader, ZhTranslationLoader]
```


Use `WorkspaceBoundary` in Layout component, set translationHolder to config by I18nextTranslationHolder for better i18n experience
```tsx
export default function WorkspaceLayout({ defaultLanguage, children }: WorkspaceLayoutProps) {

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

## Define translation json in register
Use `translatioinRegister` in register to provide a loader component wrap
```tsx
import translationRegister from "@nextspace/components/translationRegister"
import translation from "./en.json"
export { translation }
export default translationRegister(translation)
```
```tsx
import translationRegister from "@nextspace/components/translationRegister"
import translation from "./zh.json"
export { translation }
export default translationRegister(translation)
```

## Use Layout component in server layout.tsx
Use Layout component in [layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx)
```tsx
const defaultLanguage = "en"

export default function DemoLayout({ children }: LayoutProps) {
    const cookieStore = cookies()
    const cookieLanguage = cookieStore.get(COOKIE_LANGUAGE)?.value || defaultLanguage

    return <WorkspaceLayout defaultLanguage={cookieLanguage}>
        {children}
    </WorkspaceLayout >
}
```