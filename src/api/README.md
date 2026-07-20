# Cliente de API

Toda comunicación HTTP con el backend pasa por una única instancia de Axios
definida en [`client.js`](./client.js). Ningún componente ni servicio debe usar
`fetch` o crear su propia instancia de Axios: así centralizamos la URL base, los
headers comunes, la autenticación y el manejo de errores en un solo lugar.

## Qué resuelve el cliente base

- **URL base:** la toma de `env.apiUrl` (variable `VITE_API_URL`, ver
  `src/config/env.js`). Nunca se hardcodea la URL en los endpoints.
- **Headers comunes:** envía `Content-Type: application/json` por defecto.
- **Autenticación:** un *request interceptor* adjunta automáticamente el header
  `Authorization: Bearer <token>` si hay token guardado. El token se lee/guarda
  con `getAuthToken()` / `setAuthToken()` (por ahora en `localStorage`). Cuando
  exista el módulo de Auth real, solo hay que llamar a `setAuthToken(token)` tras
  el login; los endpoints no cambian.
- **Manejo centralizado de errores:** un *response interceptor* convierte
  cualquier fallo en un `ApiError` con forma estable `{ status, message, data }`.
  Ante un `401` además limpia el token guardado. Los mensajes por código
  (`401`, `403`, `404`, `500`, etc.) están en `STATUS_MESSAGES`, y se priorizan
  los mensajes que mande el backend (`detail` / `message`).

## Cómo crear un nuevo endpoint

1. Creá un archivo por dominio dentro de `src/api/endpoints/`
   (ej: `cohortes.js`, `grupos.js`, `tutores.js`, `auth.js`).
2. Importá `apiClient` y exportá funciones que devuelvan solo los datos.

```js
import { apiClient } from '../client'

export async function getCohortes() {
  const { data } = await apiClient.get('/cohortes')
  return data
}

export async function createCohorte(payload) {
  const { data } = await apiClient.post('/cohortes', payload)
  return data
}
```

3. Usalo desde un componente o hook y capturá el `ApiError`:

```js
import { getCohortes } from '../api/endpoints/cohortes'
import { ApiError } from '../api/client'

try {
  const cohortes = await getCohortes()
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.message)
  }
}
```

## Reglas

- No uses `fetch` directo ni `axios.create` fuera de `client.js`.
- No armes URLs absolutas: pasá siempre rutas relativas (`/cohortes`), la base
  la agrega el cliente.
- No captures errores solo para reformatearlos: el interceptor ya entrega un
  `ApiError` consistente.
