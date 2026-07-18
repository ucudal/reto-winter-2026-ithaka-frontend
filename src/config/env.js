// Punto unico de lectura de variables de entorno.
//
// En vez de usar `import.meta.env.VITE_*` disperso por el codigo, todo el
// acceso a configuracion pasa por aqui. Asi tenemos un solo lugar para
// validar valores y para saber que variables necesita la app.
//
// Vite expone en `import.meta.env` unicamente las variables con prefijo VITE_.
// Docs: https://vite.dev/guide/env-and-mode

/**
 * Devuelve el valor de una variable de entorno requerida.
 * Lanza un error temprano y claro si falta, para no fallar mas tarde con
 * un "undefined" silencioso al construir URLs de la API.
 *
 * @param {string} key
 * @returns {string}
 */
function requireEnv(key) {
  const value = import.meta.env[key]
  if (value === undefined || value === '') {
    throw new Error(
      `Falta la variable de entorno "${key}". ` +
        'Copia .env.example a .env y define su valor.',
    )
  }
  return value
}

export const env = {
  /** URL base de la API del backend, sin barra final. */
  apiUrl: requireEnv('VITE_API_URL').replace(/\/+$/, ''),
}
