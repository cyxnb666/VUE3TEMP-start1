/// <reference types="vite/client" />

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 添加环境变量的类型声明
interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}