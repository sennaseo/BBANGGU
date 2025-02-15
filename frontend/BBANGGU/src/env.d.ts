/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 