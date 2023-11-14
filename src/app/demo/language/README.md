# 

```tsx
const workspace = useContext(WorkspaceHolder)
const { i18n } = workspace
```


```tsx
<select name="language" defaultValue={i18n.language} onChange={onChangeLanguage}>
    {workspace.languages.map(language => <option key={language} value={language}>{i18n.l(`language.${language}`)}</option>)}
</select>
```


```tsx
const onChangeLanguage = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    workspace.changeLanguage(evt.target.value)

    const cookies = new Cookies(null, { path: '/' })
    cookies.set(COOKIE_LANGUAGE, evt.target.value)
}
```


```tsx

```