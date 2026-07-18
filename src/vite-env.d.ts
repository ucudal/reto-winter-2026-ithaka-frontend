/// <reference types="vite/client" />

// Tipado de las variables de entorno del proyecto.
// Da autocompletado y chequeo sobre `import.meta.env` en el editor.
interface ImportMetaEnv {
  /** URL base de la API del backend (sin barra final). */
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
