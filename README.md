# reto-winter-2026-ithaka-frontend

Interfaz web del proyecto Ithaka: una **SPA** hecha con **React + Vite**, usando
**Material UI** (componentes), **React Router** (navegación) y **Axios** (llamadas al
backend). Esta guía es para todo el equipo, no hace falta saber de DevOps.

---

## 1. Desarrollo local

Forma habitual para programar, con recarga automática en el navegador.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear tu archivo de entorno (copia del ejemplo)
cp .env.example .env

# 3. Levantar el servidor de desarrollo
npm run dev
```

Queda corriendo en http://localhost:5173.

> **Importante:** la app **exige** la variable `VITE_API_URL` (ver
> [`src/config/env.js`](src/config/env.js)). Si no creás el `.env`, la app tira un error
> al arrancar avisando que falta. Por eso el paso 2 no es opcional.

---

## 2. Scripts disponibles

| Comando           | Qué hace                                                            |
| ----------------- | ------------------------------------------------------------------ |
| `npm run dev`     | Servidor de desarrollo con recarga automática (http://localhost:5173). |
| `npm run build`   | Genera la versión optimizada para producción en `dist/`.           |
| `npm run preview` | Sirve localmente lo que generó `build`, para revisarlo antes de subir. |

---

## 3. Con Docker

Prueba la app tal cual corre en producción: se buildea y se sirve con **nginx** (misma
imagen que arma el CI).

```bash
docker compose up --build
```

- App en http://localhost:8080
- El puerto se cambia con `WEB_PORT` (ej. `WEB_PORT=3000 docker compose up`).

> Las variables `VITE_*` se **incrustan al momento del build** (no se leen en tiempo de
> ejecución). Si cambiás `VITE_API_URL`, hay que volver a buildear la imagen.

---

## 4. Variables de entorno

Se configuran en `.env` (copiá `.env.example`). **Nunca** subas tu `.env` al repo.

| Variable       | Para qué sirve                          | Ejemplo                   |
| -------------- | --------------------------------------- | ------------------------- |
| `VITE_API_URL` | URL base del backend al que le pega.    | `http://localhost:8000`   |

---

## 5. Cómo llamar al backend

Toda comunicación con la API pasa por un **único cliente Axios** centralizado en
[`src/api/client.js`](src/api/client.js) (maneja la URL base, el token de auth y los
errores en un solo lugar). El patrón para crear llamadas nuevas está documentado en
detalle en **[`src/api/README.md`](src/api/README.md)** — leelo antes de agregar un endpoint.

Regla de oro: **no uses `fetch` ni `axios.create` por fuera de `client.js`**. Creá tus
funciones en `src/api/endpoints/<dominio>.js` usando `apiClient`.

---

## 6. Cómo agregar una página / ruta

La navegación está definida en [`src/routes/AppRouter.jsx`](src/routes/AppRouter.jsx)
(React Router v6). Para sumar una pantalla:

1. Creá el componente en `src/pages/...` (ej. `src/pages/sections/MiSeccion.jsx`).
2. Registralo en `src/routes/AppRouter.jsx`. Las rutas privadas van dentro del bloque
   protegido por [`ProtectedRoute`](src/routes/ProtectedRoute.jsx) y el layout
   [`MainLayout`](src/layouts/MainLayout.jsx); las públicas (login/register) van sueltas.

```jsx
// dentro de children de MainLayout, en AppRouter.jsx
{ path: '/mi-seccion', element: <MiSeccion /> },
```

---

## 7. CI/CD — qué pasa cuando hacés push

Hay un pipeline automático en GitHub Actions. **No tenés que correr nada a mano**; se
dispara solo en cada push y en cada Pull Request. Hace:

1. **Escaneo de secretos** (Gitleaks) — falla si subís credenciales por accidente.
2. **Build de la imagen Docker** + **escaneo de vulnerabilidades** (Trivy).
3. **Publica la imagen** en el registro de Azure **solo** cuando el cambio llega a `main`.

Si tu PR queda "en rojo", abrí los logs de la Action para ver qué falló. Para reproducir
el build localmente:

```bash
docker compose up --build
```

---

## 8. Flujo de trabajo (Git)

Trabajamos con ramas `feature/*` → `testing` → `main`. El paso a paso completo está en
[CONTRIBUTING.md](CONTRIBUTING.md). En resumen: tu rama sale de `testing`, y tu PR
vuelve a `testing` (nunca directo a `main`).
