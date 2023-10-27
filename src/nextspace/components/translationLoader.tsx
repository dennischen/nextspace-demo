import lazyWithPreload, { PreloadableComponent } from '@/nextspace/components/lazyWithPreload'



export type TranslationLoaderProps = {
    locale: string
    children?: React.ReactNode
}

export type TranslationLoaderComponent<T extends React.ComponentType<any>> = PreloadableComponent<T> & {

    readonly locale: string

    readonly _nextspace: {
        /**
         * 0 : not loaded yet
         * 1 : loaded
         * -1 : error
         */
        readonly _status: number
        /**
         * error when loading
         */
        readonly _error?: string
    }
}


export default function translationLoader<T extends React.ComponentType<any>>(locale: string, factory: () => Promise<{ default: T }>) {
    let lazyWrap: TranslationLoaderComponent<T>
    const factoryWrap = () => {
        return factory().then((loadedModule) => {
            Object.assign(lazyWrap._nextspace, {
                _status: 1
            })
            return loadedModule
        }).catch((err) => {
            Object.assign(lazyWrap._nextspace, {
                lazyWrap: -1,
                _error: typeof err === 'string' ? err : JSON.stringify(err)
            })
            throw err
        })
    }
    lazyWrap = Object.assign(lazyWithPreload(factoryWrap), {
        locale,
        _nextspace: {
            _status: 0
        }
    })
    return lazyWrap
}


