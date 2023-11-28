# Client Component佈景主題支援

`Theme`這個功能, 提供了一個導入佈景主題物件, 及提供頁面存取該主題資料的架構. 這個功能並不制定過多主題資格物件格式, 不論是變數, 樣式或是呼叫方法, 由你自行設計發揮.

## 取得佈景主題
[[page.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/theme/page.tsx)]

使用`useTheme()`取得`Theme`, 存取成員變數`themepack`來取得你定義的佈景主題資料.

```tsx
const theme = useTheme()
const themepack = theme.themepack as DemoThemepack
```

因為themepack就是你設計提供的, 取得themepack後, 就可以使用該物件上的資料或方法
```tsx
themepack.primaryColor
// call function
themepack.utils.spacing(2)
// or in component
<span style={themepack.styles.hbox}/>>
```

## 提供使用者設定佈景主題
使用`theme.changeTheme(code)`來設定目前的佈景主題, `theme.codes`是可使用的佈景主題代碼, `theme.code`是目前的佈景主題代碼
```tsx
const onChangeTheme = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    theme.changeTheme(evt.target.value)

    const cookies = new Cookies(null, { path: '/' })
    cookies.set(COOKIE_THEME, evt.target.value)
}

<select name="theme" defaultValue={theme.code} onChange={onChangeTheme}>
    {theme.codes.map(code => <option key={code} value={code}>{i18n.l(`theme.${code}`)}</option>)}
</select>
```
---

## 設定
你的應用程式必需經由設定一些佈景主題資料物件來提供佈景主題

### 在Layout中定義ThemepackLoader跟WorkspaceBoundary
[[DemoLayout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/DemoLayout.tsx)]

在Layout模組中, 使用`themepackLoader(code, loader-module)`來提供動態載入的佈景主題, 這種方式建立方式能讓該佈景主題被分別封裝在獨立的檔案中, 並在需要時取用
```tsx
const LightblueThemepackLoader = themepackLoader("lightblue", () => import('./themes/lightblueThemepackRegister'))
const DarkredThemepackLoader = themepackLoader("darkred", () => import('./themes/darkredThemepackRegister'))
const themepackLoaders = [LightblueThemepackLoader, DarkredThemepackLoader]
```

在Layout Component中, 使用`WorkspaceBoundary`, 並提供支援的佈景主題
```tsx
export default function DemoLayout({ defaultLanguage, children }: DemoLayoutProps) {

    defaultTheme = themepackLoaders.find((t) => t.code === defaultTheme)?.code || themepackLoaders[0].code    

    return <WorkspaceBoundary
        defaultTheme={defaultTheme} themepackLoaders={themepackLoaders}
        >
        ...
        {children}
        ...
    </WorkspaceBoundary >
}
```

### 定義佈景主題
在佈景主題模組定義佈景主題件物件, 並使用`export default themepackRegister(themepack)`來匯出佈景主題內容

[[lightblueThemepackRegister.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/themes/lightblueThemepackRegister.tsx)]
```tsx
import { themepackRegister } from "@nextspace/components/themepackRegister"

import { DemoThemepack } from "@/app/demo/types"
import styles from './lightblue.module.scss'

const themepack: DemoThemepack = {
    colorScheme: 'light',
    variables: {
        primaryColor: styles.primaryColor
    },
    styles: {
        banner: styles.banner
    },
    ...
}

export default themepackRegister(themepack)
```
[[darkredThemepackRegister.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/i18n/darkredThemepackRegister.tsx)]
```tsx
import { themepackRegister } from "@nextspace/components/themepackRegister"

import { DemoThemepack } from "@/app/demo/types"
import styles from './darkred.module.scss'

const themepack: DemoThemepack = {
    dark: true,
    colorScheme: 'dark',
    variables: {
        primaryColor: styles.primaryColor,
        ...
    },    
    styles: {
        banner: styles.banner,
        ...
    },
    ...
}

export default themepackRegister(themepack)
```

### 使用Layout Component
在[[layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx)]使用Layout.
```tsx
const defaultLanguage = "en"

export default function DemoLayout({ children }: LayoutProps) {
    const cookieStore = cookies()
    const cookieTheme = cookieStore.get(COOKIE_THEME)?.value || DEFAULT_THEME

    return <DemoLayout defaultTheme={cookieTheme}>
        {children}
    </DemoLayout >
}
```

## CSS Style過晚載入問題
因為這個功能使用動態載入Theme的方式, 所以在SSR(Server Side Rendering)時, Html雖然已被正確產生出來, 但CSS部份卻在html 渲染後才被載入, 這樣子會導致使用者看到畫面會有閃現的問題。有幾個方式可以解進這個問題：
### Theme的CSS提前載入
用這種方式, Theme的CSS的載入會在SSR時即產生進html head, 進而提前在html被渲染前就被載入, 進而避免畫面閃現。但缺點是所以Theme的CSS會在一開始就被載入。使用方式如下:

[layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx)
```txs
import "./themes/darkred.module.scss"
import "./themes/lightblue.module.scss"
```

### 利用初始遮罩
用這種方式, 初始時使用遮罩罩住整個畫面, 就算初始html渲染也不會顯現出來, 然後等到確定動態CSS被戴入後才移除遮罩。使用方式如下:
TODO

