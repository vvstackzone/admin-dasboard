/// <reference types="vite/client" />

interface ImportMetaEnv { readonly VITE_API_URL?: string }

declare module "*.jpg" { const s: string; export default s }
