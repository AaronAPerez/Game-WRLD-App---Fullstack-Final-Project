/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_RAWG_API_KEY: string
    readonly VITE_ENVIRONMENT: 'development' | 'production' | 'test'
    readonly VITE_ENABLE_MOCKS: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }