# Tablero Kanban — Frontend (Reto Ithaka)

---

## 📋 Por Hacer

### [SETUP-1] Configurar variables de entorno (dotenv)
**Labels:** `easy` `chore`

* **Descripción:** Es una tarea de configuración de tamaño chico. Se define explícitamente que el proyecto debe manejar la URL de la API (y cualquier otra configuración sensible o que cambie entre entornos) a través de variables de entorno, en vez de hardcodearla en el código. Al ser independiente del backend, se puede resolver ya mismo — cuando el backend exponga endpoints reales, solo se actualiza el valor de la variable, no el código que la usa.
* **Tareas específicas:**
   * Configurar el manejo de variables de entorno del proyecto (Vite usa `import.meta.env` de forma nativa con archivos `.env`, no requiere una librería adicional).
   * Crear el archivo `.env.example` con las variables necesarias documentadas (ej: `VITE_API_URL`), sin valores sensibles reales.
   * Confirmar que `.env` esté incluido en `.gitignore` para que nunca se suba al repo.
   * Dejar preparada la lectura de esa variable para cuando se configure el cliente de API.

---

### [SETUP-2] Función global para llamadas al backend (cliente de API)
**Labels:** `mid` `chore`

* **Descripción:** Es una tarea de infraestructura de tamaño mediano. Se define explícitamente que debe existir una única función/cliente base para todas las llamadas HTTP al backend (manejo de la URL base desde la variable de entorno de SETUP-1, headers comunes, manejo centralizado de errores), de forma que cada endpoint específico (Cohortes, Grupos, Tutores, Auth, etc.) se construya a partir de esta base en vez de repetir la lógica de fetch en cada archivo. Por depender de SETUP-1 (variables de entorno), se ubica justo después en el orden de prioridades del Backlog. No depende de que el backend tenga endpoints reales para construirse — se puede armar y probar contra una URL mockeada o un endpoint de prueba.
* **Tareas específicas:**
   * Crear el archivo base del cliente de API (ej: `src/api/client.ts`) usando `fetch` o `axios`, tomando la URL base desde la variable de entorno.
   * Definir el manejo centralizado de errores (por ejemplo, qué pasa ante un 401, 404, 500) para que cada endpoint no tenga que repetir esa lógica.
   * Definir cómo se van a adjuntar los headers de autenticación (token) una vez que exista Auth real.
   * Documentar brevemente (comentario o README corto) cómo se debe crear un nuevo endpoint a partir de esta función base, para que el resto del equipo lo use de forma consistente.

---

### [UI-3] Setup de enrutamiento
**Labels:** `mid` `chore`

* **Descripción:** Es una tarea de configuración base del proyecto. Se define explícitamente que esta tarea debe resolverse antes que cualquier pantalla (Sidebar, Topbar, Login, Register), ya que todas dependen de tener rutas definidas para poder navegar entre ellas. Por ser bloqueante para el resto del equipo, se ubica al principio del Backlog.
* **Tareas específicas:**
   * Configurar React Router con las rutas principales del sistema (login, register, dashboard y una por cada sección del sidebar).
   * Definir qué rutas son públicas (login, register) y cuáles son protegidas (requieren sesión iniciada).
   * Dejar un componente de "ruta protegida" reutilizable para las pantallas que se agreguen después.

---

### [UI-1] Sidebar
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de estructura visual de tamaño chico. Se define explícitamente que el sidebar contendrá únicamente ítems de navegación fijos por ahora, sin lógica de permisos por rol de usuario, ya que esa lógica todavía no está definida del lado de backend. Por depender de que el enrutamiento esté armado, se ubica luego de UI-3 en el orden de prioridades del Backlog.
* **Tareas específicas:**
   * Crear el menú lateral con las secciones principales del sistema (Cohortes, Grupos, Tutores, etc.).
   * Conectar cada ítem del menú a su ruta correspondiente (definida en UI-3).
   * Dejar preparado el componente para que, más adelante, se pueda ocultar/mostrar ítems según el rol del usuario logueado.

---

### [UI-2] Topbar
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de estructura visual de tamaño chico. Se define explícitamente que el usuario mostrado en la topbar será un dato mockeado por ahora, ya que la autenticación real todavía no está conectada al backend. Por depender del enrutamiento, se ubica luego de UI-3 en el orden de prioridades del Backlog.
* **Tareas específicas:**
   * Crear la barra superior con logo/nombre del sistema.
   * Mostrar el nombre de usuario logueado (dato mockeado).
   * Agregar botón de logout (por ahora solo debe limpiar el estado mockeado de sesión).

---

### [AUTH-1] Login con data mock
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de funcionalidad de tamaño mediano. Se define explícitamente que esta pantalla NO debe conectarse al backend todavía, ya que el mismo aún no expone el endpoint de autenticación. La validación de credenciales se simulará con un usuario hardcodeado en el propio frontend. Cuando el backend tenga el endpoint real, se reemplaza únicamente la lógica de submit, sin tocar el formulario ni las validaciones.
* **Tareas específicas:**
   * Armar el formulario de login (usuario/email + contraseña) con sus validaciones correspondientes.
   * Simular la autenticación contra un usuario hardcodeado, guardando el estado de "logueado" en contexto o estado local.
   * Redirigir al dashboard (o pantalla principal) tras un login simulado exitoso.

---

### [AUTH-2] Register con data mock
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de funcionalidad de tamaño mediano. Se define explícitamente que esta pantalla NO debe conectarse al backend todavía, por el mismo motivo que AUTH-1. El alta de usuario se simulará localmente. Cuando el backend tenga el endpoint real, se reemplaza únicamente la lógica de submit.
* **Tareas específicas:**
   * Armar el formulario de registro con sus validaciones correspondientes.
   * Simular el alta de usuario sin conectar a la API real (por ejemplo, guardando el dato en estado local o mostrando un mensaje de éxito simulado).
   * Redirigir al login (o al dashboard, a definir) tras un registro simulado exitoso.

---

---

### [UI-4] Layout general / contenedor de páginas
**Labels:** `mid` `chore`

* **Descripción:** Es una tarea de estructura visual de tamaño mediano. Se define explícitamente que este componente actuará como wrapper de Sidebar + Topbar + área de contenido, para que cada pantalla nueva no tenga que rearmar esa estructura desde cero. Por depender de que Sidebar (UI-1), Topbar (UI-2) y el enrutamiento (UI-3) ya existan, se ubica después de esas tres tarjetas en el orden de prioridades del Backlog.
* **Tareas específicas:**
   * Crear componente `AppLayout` que renderice Sidebar + Topbar + el contenido de cada página (`children`).
   * Definir el comportamiento responsive (qué pasa en pantallas chicas: colapsar sidebar, ocultar labels, etc.).
   * Conectar el layout a las rutas protegidas definidas en UI-3.

---

### [UI-5] Página 404 / Not Found
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de estructura visual de tamaño chico. Se define explícitamente que esta pantalla se mostrará únicamente cuando el usuario navegue a una ruta inexistente, sin depender de ningún dato del backend. Por ser independiente del resto de las tarjetas, puede tomarse en cualquier momento una vez que exista el enrutamiento base (UI-3).
* **Tareas específicas:**
   * Crear el componente de página 404 con mensaje claro y botón para volver al inicio.
   * Configurarla como ruta catch-all (comodín) en React Router.

---

### [UI-6] Estados de carga y error reutilizables
**Labels:** `mid` `chore`

* **Descripción:** Es una tarea de infraestructura visual de tamaño mediano. Se define explícitamente que estos componentes se van a reutilizar en todas las pantallas que luego se conecten a la API real (listados de Cohortes, Grupos, Tutores, etc.), por lo que conviene tenerlos resueltos antes de que arranque esa etapa. No depende del backend para construirse, solo se prueba con datos simulados.
* **Tareas específicas:**
   * Crear componente `LoadingState` (spinner) reutilizable.
   * Crear componente `ErrorState` genérico (mensaje + botón de reintentar).
   * Crear componente `EmptyState` para listados vacíos (ej: "No hay grupos todavía").

---

### [UI-7] Sistema de notificaciones (toasts)
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de feedback visual de tamaño chico. Se define explícitamente que este sistema debe funcionar de forma independiente de si el backend responde de verdad o no, ya que por ahora se va a probar contra las acciones simuladas de Login/Register (AUTH-1, AUTH-2).
* **Tareas específicas:**
   * Elegir e integrar una librería de toasts (o armar una propia simple).
   * Probarla con las acciones simuladas de AUTH-1/AUTH-2 (login exitoso, error de credenciales).

---

### [UI-8] Modal de confirmación reutilizable
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de componente reutilizable de tamaño chico. Se define explícitamente que este modal se va a necesitar más adelante en varias partes del sistema (borrar grupo, desasignar tutor, etc.), pero se puede construir y probar ya mismo con una acción de ejemplo, sin depender de que esas funcionalidades reales existan todavía.
* **Tareas específicas:**
   * Crear componente `ConfirmModal` con props de título, mensaje y acción a confirmar.
   * Probarlo con un botón de ejemplo (ej: "cerrar sesión") antes de que exista la funcionalidad real que lo vaya a usar.

---

### [UI-9] Página de perfil de usuario (con data mock)
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de funcionalidad de tamaño chico. Se define explícitamente que esta pantalla debe construirse con datos mockeados del usuario logueado, siguiendo el mismo criterio que Login (AUTH-1) y Register (AUTH-2), de forma que quede lista para conectar a la API real apenas el backend exponga el endpoint correspondiente.
* **Tareas específicas:**
   * Maquetar la pantalla con nombre, rol y datos básicos del usuario mockeado.
   * Agregar botón de "editar perfil" (puede quedar deshabilitado o simulado por ahora).

---

### [MOCK-1] Tabla de Grupos (con data mock)
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de funcionalidad de tamaño mediano. Se define explícitamente que esta tabla debe construirse con datos mockeados basados en la estructura real que maneja el cliente (columnas: Tipo, Equipo, Temática/nombre, Tutor Técnico, Tutor Negocio, Comienzo, Entrega intermedia, Próxima entrega, Fin, Informe, Pitch, One Pager, Repositorio), sin conectar a la API real todavía. Al no depender del backend, se puede tomar en paralelo con el resto de las tarjetas de UI. Puede sufrir ajustes de columnas una vez confirmado el modelo de datos definitivo con el cliente.
* **Tareas específicas:**
   * Armar el array de datos mockeados con la forma de columnas de la tabla de grupos.
   * Construir la tabla usando el componente Table de MUI, con las columnas mencionadas.
   * Agregar estado vacío (ver UI-6) para cuando no haya grupos cargados.

---

### [BLOCK-1] Pedir CORS al backend antes de conectar cualquier request real
**Labels:** `easy` `chore`

* **Descripción:** Es una tarea de coordinación de tamaño chico pero **bloqueante**. Se define explícitamente que el backend hoy no tiene `CORSMiddleware` configurado, y como Vite corre en `localhost:5173` y el backend en `localhost:8000`, el navegador va a bloquear por política de origen cruzado incluso las llamadas más simples, como `/health`. Sin esto resuelto, ninguna conexión real front-backend puede probarse, ni siquiera el smoke test más básico.
* **Tareas específicas:**
   * Avisar al equipo de backend (o abrir el PR directamente si el equipo de frontend tiene acceso a ese repo) para que agreguen `CORSMiddleware` permitiendo el origen de `localhost:5173` en desarrollo.
   * Una vez resuelto, correr el smoke test de conectividad end-to-end usando `getHealth()` (ya está cableado del lado del frontend) para confirmar que Axios y `VITE_API_URL` funcionan de punta a punta.
   * Documentar en el `CONTRIBUTING.md` o similar qué origen(es) están habilitados, para que quede claro si alguien cambia el puerto local.

---

### [AUTH-3] Terminar el módulo de Auth stub (`endpoints/auth.js`)
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de funcionalidad de tamaño mediano. Se define explícitamente que el backend todavía no implementa autenticación real, por lo que este módulo debe quedar armado contra el contrato de `api-spec-en.md`, no contra lo que se había asumido antes. ⚠️ Corrección importante: el spec real **no incluye `/auth/refresh`** (lo habíamos asumido sin confirmar) — solo define `POST /api/auth/login` y `GET /api/users/me`. `AuthContext`, `ProtectedRoute`, `setAuthToken`/`getAuthToken` y el interceptor `Bearer` ya están resueltos de PRs anteriores — falta la capa de endpoints que los conecte al contrato correcto.
* **Tareas específicas:**
   * Crear `endpoints/auth.js` con `login(email, password)` → `POST /api/auth/login`, devolviendo `{ token, user: { id, name, role } }` (forma exacta del spec).
   * Crear `getCurrentUser()` → `GET /api/users/me`, para poder rehidratar la sesión al refrescar la página (esto reemplaza la idea de "refresh token" que habíamos asumido sin base).
   * Mockear ambas respuestas por ahora (mismo criterio que AUTH-1/AUTH-2), respetando el `role` como uno de los 4 valores reales del enum `UserRole`: `Coordinator`, `BusinessTutor`, `TechnicalTutor`, `Student`.
   * Si el manejo de expiración de token sigue siendo necesario, confirmar con backend cómo lo van a resolver (¿token de larga duración, o hay que agregar `/auth/refresh` al spec?) antes de mockear algo que no está definido.

---

### [MOCK-6] Endpoints de dominio stub (Cohortes, Grupos, Tutores)
**Labels:** `mid` `chore`

* **Descripción:** Es una tarea de infraestructura de tamaño mediano. Se define explícitamente que, dado que el backend hoy no tiene ningún endpoint de dominio implementado, el frontend puede avanzar en paralelo creando estos archivos con la firma esperada y consumiéndolos con datos simulados. **Los mocks deben seguir exactamente la forma de datos definida en `api-spec-en.md`** (nombres de campo en inglés, snake_case: `start_date`, `current_stage_id`, `max_capacity`, etc.), para que cuando el backend implemente los endpoints reales, el único cambio sea apagar el mock — no rehacer los componentes que ya los consuman.
* **Tareas específicas:**
   * Crear `endpoints/cohorts.js`, `endpoints/groups.js`, `endpoints/tutors.js`, `endpoints/students.js`, `endpoints/stages.js`, `endpoints/meetings.js`, `endpoints/deliverables.js` — nombres de archivo en inglés, siguiendo el naming del spec (no "grupos.js"/"cohortes.js").
   * Los mocks de **listados** (`GET /api/groups`, `GET /api/tutors`, etc.) deben devolver el objeto paginado indicado al final del spec: `{ items, total_items, page, page_size }`, no un array suelto — así se evita romper el contrato después.
   * Los mocks de **detalle** deben calzar con los payloads de ejemplo del spec (ej: `Group` incluye `current_stage` anidado y `students` como array de `{id, name}`, no solo IDs sueltos).
   * Elegir e integrar una herramienta de mocking (MSW o `json-server`) para servir estos datos.
   * **Pendiente de confirmar con backend:** el modelo `Assignment` no aparece como endpoint explícito en este spec, pero sí sigue apareciendo como relación de `Group` y `Tutor`. Confirmar si hay que mockear algo específico de asignaciones o si viaja embebido dentro de `Group`/`Tutor`.

---

### [DEV-1] Acordar y manejar el contrato de errores con backend
**Labels:** `mid` `chore`

* **Descripción:** Es una tarea de infraestructura de tamaño mediano, relacionada con `SETUP-2` (cliente de API). Se define explícitamente que hay un riesgo concreto ya detectado: FastAPI devuelve los errores de validación (422) con `detail` como un **array de objetos**, no como string — y el manejo actual de errores (`messageForStatus`) que prioriza `data.detail` mostraría literalmente `[object Object]` en pantalla si no se lo contempla.
* **Tareas específicas:**
   * Confirmar con el equipo de backend el formato exacto de error que van a devolver para validaciones (422) y para otros códigos de error comunes (400, 401, 404, 500).
   * Ajustar `messageForStatus` (o la función equivalente de manejo de errores) para parsear correctamente un `detail` que sea array de objetos, además del caso donde sea string.
   * Agregar un caso de prueba/mock con un error 422 real de FastAPI para validar que el mensaje mostrado al usuario sea legible, no `[object Object]`.

---

### [DASH-1] Dashboard con data mock (según diseño y contrato real)
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de funcionalidad de tamaño mediano. Se define explícitamente que esta pantalla debe construirse con datos mockeados, siguiendo la forma exacta de `GET /api/dashboard/summary` acordada (cálculo al vuelo con agregaciones SQL simples, sin tablas precalculadas — el volumen de Ithaka no lo justifica). El mock final a usar ya está definido en `src/api/mocks/dashboardSummary.js` (ver bloque de código abajo) — no inventar una forma de datos distinta.
* **Mock a usar (copiar tal cual):**
```js
export const mockDashboardSummary = {
  active_groups: 42,
  active_tutors: 18,
  groups_by_stage: [
    { stage: "Ideación", count: 15 },
    { stage: "Anteproyecto", count: 18 },
    { stage: "Proyecto Final", count: 9 },
  ],
  capacity: {
    total_available_hours: 440,
    total_used_hours: 310,
    usage_percentage: 70.5,
  },
  pending_deliverables: 23,
  alerts: [
    { type: "GroupWithoutTutor", group_id: 60, description: "Falta tutor técnico" },
    { type: "OverloadedTutor", tutor_id: 8, description: "104% de capacidad" },
  ],
};
```
* **Tareas específicas:**
   * Armar las 3 tarjetas de métricas con `active_groups`, `active_tutors`, `pending_deliverables`.
   * Gráfico de `groups_by_stage` (barras o dona) — no usar mini-gráfico de tendencia, el dato no es una serie temporal.
   * Tarjeta/barra de capacidad usando `capacity.total_available_hours`, `capacity.total_used_hours`, `capacity.usage_percentage`.
   * Reemplazar la tabla "Entregas Recientes" del diseño original por una tabla de `alerts` (tipo, descripción, grupo/tutor asociado).
   * Reutilizar el Sidebar y Topbar ya existentes.
* **⚠️ Bloqueante a confirmar con backend antes de que esto se implemente de verdad (no bloquea el mock):** los `alerts` de tipo `GroupWithoutTutor` y `OverloadedTutor` dependen de la tabla `assignments`, que vimos eliminada en el PR de backend más reciente. Sin esa tabla, esas dos queries no se pueden escribir. El mock puede avanzar igual, pero el endpoint real no va a poder implementarse hasta que se resuelva esa duda de modelo.

---

### [FRONTEND] Conectar Dashboard al endpoint real (GET /api/dashboard/summary)
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de integración de tamaño chico. Se reemplaza la data mockeada de `mockDashboardSummary` por la llamada HTTP real al endpoint `GET /api/dashboard/summary` que ya se encuentra habilitado y funcional en el backend. Los datos se mapean directamente con el contrato especificado en `api-spec-en.md`.
* **Tareas específicas:**
   * Crear la función `getDashboardSummary()` en `src/api/endpoints/dashboard.js` invocando el cliente HTTP base.
   * Conectar `Dashboard.jsx` reemplazando el import de la data mock.
   * Integrar componentes de `LoadingState` y `ErrorState` mientras se realiza el fetch.
   * Renderizar la lista de alertas devueltas (`GroupWithoutTutor` y `OverloadedTutor`) en la tabla/sección correspondiente.

---

### [FRONTEND] Conectar vista de Cohortes a la API real
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de integración de tamaño mediano. Se conecta la pantalla de gestión de Cohortes a los endpoints expuestos por la API (`GET /api/cohorts`, `POST /api/cohorts`, `GET /api/cohorts/{id}`).
* **Tareas específicas:**
   * Implementar las funciones HTTP en `src/api/endpoints/cohorts.js`.
   * Mapear la respuesta paginada `{ items, total_items, page, page_size }` al listado de la UI.
   * Conectar el formulario de alta de Cohorte (`POST /api/cohorts`) pasando `year`, `semester`, `start_date`, `end_date`, `status`, `notes`.
   * Mostrar notificaciones (toasts) tras creaciones exitosas o fallidas.

---

### [FRONTEND] Conectar tabla y pantallas de Grupos a la API (CRUD + Tutores)
**Labels:** `hard` `feature`

* **Descripción:** Es una tarea de integración principal de tamaño grande. Se conecta el listado, detalle y edición de grupos a la API (`GET /api/groups`, `POST /api/groups`, `GET /api/groups/{id}`, `PATCH /api/groups/{id}/stage`, `PATCH /api/groups/{id}/tutors`).
* **Tareas específicas:**
   * Implementar llamadas en `src/api/endpoints/groups.js`.
   * Mostrar en la tabla los tutores de negocio y técnico asignados directamente (`business_tutor`, `technical_tutor`).
   * Conectar la reasignación de tutores mediante `PATCH /api/groups/{id}/tutors` enviando `business_tutor_id` y/o `technical_tutor_id`.
   * Conectar el avance de etapa mediante `PATCH /api/groups/{id}/stage`.
   * Implementar `GET /api/groups/{id}/documents` y `POST /api/groups/{id}/documents` para adjuntar repositorio/documentación del grupo.

---

### [FRONTEND] Conectar listado y gestión de Tutores a la API
**Labels:** `mid` `feature`

* **Descripción:** Es una tarea de integración de tamaño mediano. Se conecta la sección de Tutores a los endpoints de la API (`GET /api/tutors`, `POST /api/tutors`, `GET /api/tutors/{id}`, `GET /api/tutors/{id}/capacity`).
* **Tareas específicas:**
   * Crear las llamadas HTTP en `src/api/endpoints/tutors.js`.
   * Renderizar la lista de tutores especificando su rol (`Business` o `Technical`), especialidad, disponibilidad y estado.
   * Conectar la consulta de capacidad `GET /api/tutors/{id}/capacity` para mostrar las horas consumidas y grupos asignados.
   * Conectar el formulario de alta de nuevo tutor (`POST /api/tutors`).

---

### [FRONTEND] Conectar sección Materiales (Base de Conocimiento) a la API
**Labels:** `easy` `feature`

* **Descripción:** Es una tarea de integración de tamaño chico. Se conecta la vista de Materiales (Base de Conocimiento) añadida al sidebar con los endpoints de materiales de apoyo (`GET /api/materials`, `POST /api/materials`).
* **Tareas específicas:**
   * Crear `src/api/endpoints/materials.js` con los métodos `getMaterials()` y `createMaterial()`.
   * Renderizar los materiales de apoyo organizados o filtrados por etapa (`stage_id`).
   * Formulario para añadir nuevos materiales enviando `stage_id`, `title` y `url`.

---

### [FRONTEND] Conectar Estudiantes, Entregables y Minutas de Reunión
**Labels:** `hard` `feature`

* **Descripción:** Es una tarea de integración de tamaño grande. Se conectan las áreas operativas finales a los endpoints correspondientes de estudiantes, entregables y reuniones.
* **Tareas específicas:**
   * Implementar las llamadas HTTP en `endpoints/students.js`, `endpoints/deliverables.js` y `endpoints/meetings.js`.
   * Conectar el registro de reuniones (`POST /api/meetings`) enviando el arreglo de tutores participantes `tutor_ids` (`[id1, id2]`), `group_id`, `date`, `participants`, `notes`, `hours_spent`, `links`.
   * Conectar la visualización y adjuntado de documentos en entregables (`GET /api/deliverables/{id}/documents`, `POST /api/deliverables/{id}/documents`).
   * Mostrar filtros de entregables pendientes (`GET /api/deliverables/pending`) y atrasados (`GET /api/deliverables/overdue`).

---

### [SEC-1] Control de Acceso por Roles (RBAC) en el Enrutamiento (Frontend Route Guard)
**Labels:** `mid` `security`

* **Descripción:** Tarea de seguridad y middleware en frontend. Aunque no tengamos el backend completo, contamos con un `AuthContext` y un enum de roles (`Coordinator`, `BusinessTutor`, `TechnicalTutor`, `Student`). Se necesita un middleware/componente de protección de rutas que verifique si el usuario tiene el rol permitido para acceder a ciertas vistas. Si no lo tiene, debe redirigir a una pantalla de "No Autorizado (403)".
* **Tareas específicas:**
   * Crear el componente `RoleProtectedRoute` (o extender el `ProtectedRoute` existente).
   * Definir los roles permitidos en la configuración de rutas de React Router (por ejemplo, la ruta de gestión de cohortes `/cohorts` solo debe ser accesible para `Coordinator`).
   * Diseñar una pantalla de "Acceso Denegado (403)" con una interfaz clara y estética para guiar al usuario de regreso a un área segura.
   * Probar la redirección de manera local cambiando manualmente el rol en el estado del mock de sesión.

---

### [PERF-1] Middleware de Caché en el Cliente para Datos Semiestáticos
**Labels:** `mid` `refactor`

* **Descripción:** Tarea de optimización y middleware. Para evitar llamadas redundantes al backend (o al mock) para catálogos y datos semiestáticos que cambian con muy poca frecuencia durante la sesión (como la lista de etapas del proceso `Stages`, la lista de cohortes disponibles, o la información del perfil del usuario), se debe implementar un mecanismo de caché en memoria o persistente (`localStorage`/`sessionStorage`) con tiempo de expiración (TTL).
* **Tareas específicas:**
   * Diseñar una utilidad de almacenamiento en caché que maneje tiempo de vida (TTL) para invalidación automática.
   * Integrar la caché en el cliente de API base (`src/api/client.js`) o a través de un hook de servicio para interceptar consultas a estos endpoints específicos.
   * Proveer un mecanismo para invalidar o limpiar la caché de forma manual al realizar una acción de mutación (ej. limpiar la caché de cohortes inmediatamente después de crear uno nuevo).

---

### [UI-10] Sistema de Captura de Errores Global (Error Boundary)
**Labels:** `mid` `chore`

* **Descripción:** Tarea de robustez y resiliencia en frontend. Para evitar pantallas en blanco completas cuando un componente de React falla en producción debido a datos inesperados o fallos de renderizado, se debe implementar un componente `ErrorBoundary` global y a nivel de rutas clave.
* **Tareas específicas:**
   * Implementar un componente `ErrorBoundary` usando la API de React (pudiendo usar también `react-error-boundary` si se desea).
   * Diseñar una interfaz de "Fallback" estética y limpia que permita al usuario reintentar/recargar la sección o volver al dashboard principal.
   * Integrar el `ErrorBoundary` en el layout general de la aplicación (`AppLayout`) y alrededor de secciones dinámicas propensas a fallos (como gráficos del dashboard o tablas complejas).

---

### [UI-11] Implementación de Tema Oscuro/Claro (Dark/Light Mode)
**Labels:** `mid` `design`

* **Descripción:** Tarea de diseño y accesibilidad. Diseñar y aplicar un selector de tema (Dark/Light mode) persistiendo la elección del usuario en `localStorage` y usando variables CSS o el ThemeProvider de Material UI (MUI), según lo que use el proyecto.
* **Tareas específicas:**
   * Configurar las paletas de colores armónicas para ambos temas (oscuro y claro) alineadas con la estética premium de Ithaka.
   * Implementar un contexto de tema (`ThemeContext`) y un hook (`useTheme`) para gestionar el estado del tema.
   * Añadir un control interactivo (toggle con microanimaciones) en el `Topbar`.
   * Asegurar que todo el layout y componentes existentes (Sidebar, Dashboard cards, Tablas) respondan correctamente al cambio de tema de forma fluida.

---

### [SEC-2] Sanitización de Inputs y Prevención de XSS en Formularios
**Labels:** `easy` `security`

* **Descripción:** Tarea de seguridad en frontend. Dado que los usuarios introducen URLs de repositorios, links a minutas y texto en notas de reuniones, se requiere asegurar que el contenido ingresado no contenga scripts maliciosos (Cross-Site Scripting) antes de renderizarlo o guardarlo.
* **Tareas específicas:**
   * Integrar o implementar funciones de validación y sanitización seguras en los inputs de formularios dinámicos.
   * Asegurar que cualquier campo donde el usuario ingrese URLs (ej: repositorio de grupo, links de minutas) sea validado con expresiones regulares estrictas en el frontend.
   * En las vistas donde se renderice texto de notas u opiniones (que puedan admitir formato), sanitizar la salida si se usa renderizado HTML directo o Markdown.

---

### [DEV-2] Entorno de Pruebas Unitarias y Componentes (Vitest + React Testing Library)
**Labels:** `mid` `chore`

* **Descripción:** Tarea de infraestructura de desarrollo. El equipo de frontend necesita una base sólida de pruebas para garantizar que el refactor no rompa la interfaz de usuario al momento de realizar la conexión real con el backend.
* **Tareas específicas:**
   * Configurar Vitest y React Testing Library en el proyecto Vite.
   * Escribir pruebas unitarias para las funciones de utilidad, formateadores de fechas, y el cliente de API (manejo de errores de FastAPI, etc.).
   * Escribir pruebas de componentes simples (como el `ConfirmModal`, `Topbar` o las redirecciones de `ProtectedRoute`).

---

## ✅ Hecho

*(vacío)*

---

## Labels del tablero

**Dificultad:** `easy` · `mid` · `hard`
**Tipo:** `feature` · `bug` · `refactor` · `chore` · `docs` · `design`

---

## Tabla de grupos (según planilla real compartida por el cliente)

⚠️ Los datos de esta tabla son los que vienen en el archivo de ejemplo anonimizado del cliente (`Gestión_de_TFG_FIT`). Algunas fechas están mal cargadas en el original (ej. años como 2205 o 2006) — se transcriben tal cual, sin corregir, ya que es una planilla de ejemplo/plantilla y no data productiva real. Útil como referencia de qué columnas maneja Ithaka hoy, para guiar el maquetado de las pantallas de Grupo.

| Tipo | Equipo | Temática/nombre | Tutor Técnico | Tutor Negocio | Comienzo | Entrega intermedia | Próxima entrega | Fin | Informe | Pitch | One pager | Repositorio |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| TFG | Pepito, fulanita, juan | XDXDXD | Pablo x | Maria k | 2205-08-01 | 3° Release (10-Abr): Documento completo de Plan de Negocio, One Pager, Presentación final, Pitch (versión preliminar) | 2026-06-01 | 2026-06-01 | — | — | — | https://docs.google… |
| Ideación/anteproyecto | Maria, felipe, XX | No hay aún | — | — | 2006-06-01 | — | — | — | — | — | — | — |
| Anteproyecto | Juan, fulano, Valentina | ;O) | — | — | 2006-08-01 | — | — | — | — | — | — | — |

**Lectura para maquetado de UI:** confirma que el listado/detalle de Grupo debería contemplar al menos estos campos visibles: tipo/etapa, integrantes, temática, tutor técnico, tutor de negocio, fecha de comienzo, fechas de entrega, y links a Informe/Pitch/One Pager/Repositorio — útil para armar los mocks de MOCK-2 y MOCK-3 con una forma de datos realista.
