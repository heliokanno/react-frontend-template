/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL da API. Definida em 004; opcional nesta fundação. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
