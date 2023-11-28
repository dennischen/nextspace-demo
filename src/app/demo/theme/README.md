# Client Component Theme Support

The `Theme` functionality provides a structure to import theme objects and allows pages to access theme data. This feature does not overly specify the format of theme object qualifications, whether they are variables, styles, or methods, leaving the design open to your design.

## Obtain Theme
[[page.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/theme/page.tsx)]

Use `useTheme()` to obtain the `Theme`. Access the member variable `themepack` to get your defined theme data.

```tsx
const theme = useTheme()
const themepack = theme.themepack as DemoThemepack
```

Since themepack is designed by you, after obtaining it, you can use the data or methods on this object.
```tsx
themepack.primaryColor
// call function
themepack.utils.spacing(2)
// or in component
<span style={themepack.styles.hbox}/>>
```

## Provide User Theme Preferences
Use `theme.changeTheme(code)` to set the current theme. `theme.codes`` represent the available theme codes, and `theme.code` indicates the current theme code.
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

## Configuration
Your application must be configured with some theme data objects to provide themes.

### Define ThemepackLoader and WorkspaceBoundary in Layout
[[DemoLayout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/DemoLayout.tsx)]

In the Layout module, use `themepackLoader(code, loader-module)` to provide dynamically loaded themes. This approach allows each theme to be encapsulated in separate files and accessed when needed.
```tsx
const LightblueThemepackLoader = themepackLoader("lightblue", () => import('./themes/lightblueThemepackRegister'))
const DarkredThemepackLoader = themepackLoader("darkred", () => import('./themes/darkredThemepackRegister'))
const themepackLoaders = [LightblueThemepackLoader, DarkredThemepackLoader]
```

In the Layout Component, use `WorkspaceBoundary` and provide supported theme loaders.
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

### Define Themes
In the theme module, define theme objects and use `export default themepackRegister(themepack)` to export the theme data.

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

### Use Layout Component
在[layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx)使用Layout.
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

## Problem with Late Loading of CSS Styles
Due to the dynamic loading of themes, during Server Side Rendering (SSR), although the HTML is correctly generated, the CSS is loaded after the HTML rendering. This results in users seeing a flash of unstyled content. There are several ways to address this issue:

### Preloading CSS for the Theme
In this approach, the CSS loading for the theme is during SSR and is generated into the HTML head. This ensures that the CSS is loaded before HTML rendering, preventing a flash of unstyled content. However, the drawback is that the CSS for all themes is loaded initially. The usage is as follows:

[layout.tsx](https://github.com/dennischen/nextspace-demo/blob/master/src/app/demo/layout.tsx)
```txs
import "./themes/darkred.module.scss"
import "./themes/lightblue.module.scss"
```

### Using Initial Mask
In this approach, an initial mask is employed to cover the entire screen. Even if the initial HTML rendering occurs, it remains invisible behind the mask. The mask is then removed once it is ensured that the dynamic CSS has been applied. The usage is as follows:

```txs
TODO
```