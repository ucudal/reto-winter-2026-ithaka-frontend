# Tablero Kanban — Frontend (Reto Ithaka)

---

## 🔄 Auditoría 2026-07-28 — Nuevas tareas (solo frontend)

Desde la auditoría del 25/07 el backend avanzó mucho: paginación agregada a Estudiantes/Cohortes/Grupos/Entregables/Tutores/Usuarios, autenticación real en Cohortes (con scoping por rol en `/cohortes/{id}/grupos`), y dos módulos nuevos que antes no existían: **Comentarios** (`/api/deliverables/{id}/comments`) y **Documentos** (`/api/groups/{id}/documents`, `/api/deliverables/{id}/documents`). Del lado frontend, en paralelo ya se resolvieron solos: `[FEAT-4]` (Materiales ya conectado a `/api/materials`, ya no es mock), `[FEAT-7]` (Registro ahora es un "Coming Soon" sin llamada falsa, alineado con que el backend no tiene endpoint de auto-registro) y `[BUG-5]` (`CohortLifecycleConfiguration.jsx` ya usa `apiClient`, no `fetch` crudo) — no se repiten acá. También corregí `[BUG-4]` más abajo: el proyecto usa **PUT como convención de borrado** (no todo pasa por `DELETE`), así que "eliminar tutor" resulta que sí es accionable hoy (vía `status: "Inactive"`) — solo "eliminar etapa" sigue realmente bloqueado, porque `Stage` no tiene ningún campo de estado. Lo demás de abajo es lo que quedó pendiente o apareció nuevo, verificado contra el código real de ambos repos hoy.

### [FRONTEND] [BUG-6] Paginación fantasma: Grupos, Alumnos, Usuarios y Tutores solo muestran los primeros 10 registros, siempre (#169)
**Labels:** `hard` `bug`

* **Descripción:** El backend ya soporta paginación real (`page`/`page_size`) en `/api/groups`, `/api/students`, `/api/users`, `/api/tutors` — pero **ninguna pantalla se lo pide**. `getGroups()`/`getStudents()`/etc. se llaman sin parámetros, así que siempre reciben la página 1 de 10 del backend (su default), y el `TablePagination` que ya está en cada tabla solo re-slicea ese mismo lote de 10 que nunca cambia. Resultado: **si hay más de 10 grupos, alumnos, usuarios o tutores activos, el resto es invisible en la app** — no es un problema de UI, es un problema de datos faltantes. `Cohorts.jsx` está a mitad de camino: sí manda `page`/`page_size` al backend, pero hardcodeado (`page: 1, page_size: 20`) y totalmente desconectado del estado real del control de paginación — clickear "página siguiente" no vuelve a pedir nada, solo re-slicea los mismos 20 de siempre.
* **⚠️ Limitación de backend a tener en cuenta:** ninguno de estos endpoints devuelve el total de registros (ni en el body como `{items, total_items}`, ni en headers) — solo un array plano. Sin eso, no se puede armar un paginador que sepa cuántas páginas hay en total.
* **Detalle confirmado en `Cohorts.jsx` (líneas 96-102, 353, 396-411, 463):** el `TablePagination` usa `count={cohorts.length}` — como mucho 20 (el `page_size` hardcodeado) — así que le **miente** al usuario diciendo que hay 20 cuando podría haber más, y `onPageChange` solo hace `setPage(newPage)` sin volver a pedirle nada al backend. Si hay más de 20 cohortes que matchean el filtro, es imposible verlas.
* **Tareas específicas:**
   * En `Groups.jsx`, `Students.jsx`, `Users.jsx`, `Tutors.jsx`: conectar el estado `page`/`rowsPerPage` del `TablePagination` a la llamada real (`getGroups({ page, page_size: rowsPerPage })`, etc.), sacando el `.slice()` client-side que hoy simula la paginación sobre datos incompletos.
   * En `Cohorts.jsx`: reemplazar los valores hardcodeados `page: 1, page_size: 20` por el estado real del componente, y que `count` refleje algo honesto (ver el punto siguiente sobre el total).
   * Mientras el backend no devuelva un total: pedir `page_size + 1` registros para saber si existe una página siguiente (mostrar "Página X" sin total exacto), o negociar con backend que agregue el conteo — documentarlo como bloqueante conocido, no inventar un total falso en el frontend.

---

### [FRONTEND] [BUG-7] `CommentFeed.jsx`: verbo HTTP equivocado y el componente no está montado en ninguna pantalla (#170)
**Labels:** `mid` `bug`

* **Descripción:** El módulo de comentarios ya existe de verdad en el backend (`GET/PUT /api/deliverables/{id}/comments`, `DELETE /api/comments/{id}`), pero `createDeliverableComment` en `src/api/endpoints/comments.js` todavía llama `POST` a esa ruta — el backend solo define `PUT` ahí, así que hoy tiraría `405 Method Not Allowed` si se llegara a usar. Y de hecho **nunca se usa**: `<CommentFeed />` no está importado en ninguna pantalla (ni `GroupDetail.jsx`, ni ningún otro lado) — es un componente completo y bien hecho que quedó sin montar.
* **⚠️ Antes de conectar esto, avisarle a backend — encontramos 3 bugs reales en `comment_service.py` que van a afectar a quien use esta pantalla:**
   1. **Ni `create` ni `update` validan que `tutor_id`/`deliverable_id` existan** antes de guardar — un ID inválido dispara un `IntegrityError` de Postgres sin manejar (el usuario va a ver un 500 genérico en vez de un mensaje claro).
   2. **El `PUT` de actualizar comentario no verifica dueño ni pertenencia** — no chequea que `comment.tutor_id` sea el mismo que hizo el comentario originalmente, ni que `comment.deliverable_id` coincida con la ruta. Cualquier tutor que sepa el `id` de un comentario ajeno puede editarlo/apropiárselo mandando su propio `tutor_id` en el body. Es un bug de autorización real, no solo de UX.
   3. `GET` de comentarios sobre un `deliverable_id` inexistente devuelve `200 []` en vez de `404` (inconsistente con Documentos, que sí valida) — no rompe nada pero puede confundir "sin comentarios" con "entregable inexistente".
* **Tareas específicas:**
   * Cambiar `createDeliverableComment` para usar `apiClient.put(...)` en vez de `.post(...)`.
   * Montar `<CommentFeed deliverableId={...} />` dentro de la tarjeta de Entregables de `GroupDetail.jsx` (por ejemplo, al expandir un entregable), aprovechando que esa sección ya lista los entregables reales del grupo.
   * Coordinar con backend los 3 puntos de arriba antes (o al mismo tiempo) de exponer esto a usuarios reales — el punto 2 en particular no debería salir a producción sin arreglarse.

---

### [FRONTEND] [FEAT-9] Conectar el módulo de Documentos (ya real en backend) y resolver de una vez el placeholder de `group.links` (#171)
**Labels:** `mid` `feature`

* **Descripción:** Esto resuelve directamente lo que quedó pendiente en `[FEAT-8]`. El backend ahora expone `GET/PUT /api/groups/{id}/documents` y `GET/PUT /api/deliverables/{id}/documents` (subir/listar links a Drive o SharePoint, con `url`, `platform`, `order`) y `DELETE /api/documents/{id}` — pero **el frontend no tiene ni un solo archivo que lo llame**. Hoy `StudentsWorkspace.jsx` sigue mostrando `group.links` (un campo que nunca existió en `Group`), cuando la forma correcta de resolverlo ya está disponible del lado de backend.
* **Tareas específicas:**
   * Crear `src/api/endpoints/documents.js` con `getGroupDocuments(groupId)`, `upsertGroupDocument(groupId, payload)`, `getDeliverableDocuments(deliverableId)`, `upsertDeliverableDocument(deliverableId, payload)`, `deleteDocument(id)`.
   * En `GroupDetail.jsx`: agregar una sección "Documentos" (o integrarla a la tarjeta de datos rápidos) para listar y agregar links (Drive/repo/informe), con `platform` limitado a `Drive`/`SharePoint` (son los únicos valores que acepta el backend hoy).
   * Reemplazar el uso de `group.links` en `StudentsWorkspace.jsx` por `getGroupDocuments(group.id)`, sacando el placeholder que hoy siempre muestra vacío.

---

### [FRONTEND] [FEAT-10] Decidir el destino de `Templates.jsx` (sigue 100% mock, con un endpoint huérfano roto) (#172)
**Labels:** `easy` `feature`

* **Descripción:** `Knowledge.jsx` ya se conectó a `/api/materials` (dejó de ser mock), pero `Templates.jsx` sigue usando `mockTemplates` sin tocar. Además, existe `src/api/endpoints/templates.js` con una función `getTemplates()` que llama a `/deliverables/${id}/documents` — **sin el prefijo `/api`** (path roto, no coincide con ninguna ruta real) — y que además no la usa nadie, ni siquiera `Templates.jsx`.
* **Tareas específicas:**
   * Decidir si "Templates" es en realidad el mismo concepto que "Materiales" (¿se fusiona con `Knowledge.jsx`/`materials.js`?) o si necesita su propio backend — no hay ningún endpoint de templates real hoy, solo materiales.
   * Si se decide que es lo mismo: eliminar `mockTemplates` y conectar `Templates.jsx` a `materials.js`, siguiendo el mismo patrón que ya probó `Knowledge.jsx`.
   * Si se mantiene separado: como mínimo arreglar el path roto de `templates.js` (le falta `/api`) antes de conectarlo a algo.

---

### [FRONTEND] Verificar que las pantallas de Cohortes sigan andando ahora que `/api/cohorts` exige sesión iniciada (#173)
**Labels:** `easy` `chore`

* **Descripción:** `/api/cohorts` (listado, detalle, grupos por cohorte, etapas por cohorte) ahora requiere `Depends(get_current_user)` — cualquier usuario logueado puede consultar, pero ya no es anónimo. Como `apiClient` ya inyecta el header `Authorization: Bearer` en todas las llamadas, esto debería funcionar transparente — pero vale la pena confirmarlo explícitamente, en particular en `CohortLifecycleConfiguration.jsx` (recién migrada a `apiClient` en `[BUG-5]`) y en el flujo completo de `Cohorts.jsx`/`CohortDetail.jsx` con una sesión real.
* **Dato interesante para el equipo:** `GET /api/cohorts/{id}/groups` ahora filtra el resultado por rol **del lado del backend** (Coordinator ve todos los grupos, un tutor solo ve los grupos donde es tutor, un estudiante solo ve su propio grupo) — es exactamente el filtro por tutor que habíamos identificado como falta en `Groups.jsx` hace un tiempo, pero implementado solo para este endpoint puntual, no para el listado general `/api/groups`. Vale la pena confirmar si `CohortDetail.jsx` ya se beneficia de este filtro gratis, y si tiene sentido que `Groups.jsx` eventualmente use esta misma fuente en vez del listado sin filtrar.
* **Tareas específicas:**
   * Probar el flujo de Cohortes de punta a punta con las 4 sesiones de rol distintas, confirmando que no aparezca ningún 401 inesperado.
   * Documentar (o confirmar) qué ve cada rol en `CohortDetail.jsx` hoy, dado el nuevo filtro server-side.

---

### [FRONTEND] [BUG-9] En `GroupDetail.jsx`, cambiar el estado de cualquier entregable vuelve a scrollear al entregable resaltado (#174)
**Labels:** `easy` `bug`

* **Descripción:** El `useEffect` que hace scroll automático al entregable resaltado (`src/pages/sections/GroupDetail.jsx:112-116`) tiene `deliverables` en su array de dependencias. Como `deliverables` es un array nuevo cada vez que se llama `setDeliverables` (por ejemplo dentro de `handleChangeDeliverableStatus`), **cualquier cambio de estado de cualquier entregable del grupo vuelve a disparar el scroll** hacia el entregable resaltado — aunque el usuario ya haya scrolleado a otro lado a propósito. Además `highlightDeliverableId` nunca se limpia, así que esto se repite en cada actualización mientras no se navegue fuera de la página.
* **Tareas específicas:**
   * Sacar `deliverables` del array de dependencias del `useEffect` de scroll (solo debería depender de `highlightDeliverableId`, ejecutándose una vez al entrar con ese estado seteado).
   * Considerar limpiar `highlightDeliverableId` del estado de navegación después del primer scroll, para que no vuelva a intentar scrollear en renders futuros.

---

### [FRONTEND] [BUG-10] Condiciones de carrera al cambiar de filtro/grupo rápido (sin cancelar requests viejos) (#175)
**Labels:** `mid` `bug`

* **Descripción:** Dos lugares distintos tienen el mismo problema: no hay forma de ignorar la respuesta de un fetch viejo si uno más nuevo ya se disparó.
   * **`GroupDetail.jsx:105-110`**: si el usuario navega de `/groups/5` a `/groups/7` rápido (React Router no remonta el componente), y la respuesta de `getGroupById(5)` tarda más que la de `getGroupById(7)`, la respuesta vieja puede pisar el estado — mostrando datos del grupo 5 mientras la URL ya dice `/groups/7`.
   * **`Cohorts.jsx:91-103`**: al tipear en el filtro de año (ej. "2026"), cada carácter dispara un fetch nuevo. Si una respuesta vieja (filtro "202") resuelve después que una más nueva (filtro "2026"), `setCohorts` sobrescribe la tabla con resultados de un filtro que ya no está aplicado — sin ningún indicio de error para el usuario.
* **Tareas específicas:**
   * En ambos casos: agregar un flag tipo `let ignore = false` (con cleanup `return () => { ignore = true }` en el `useEffect`) o un `requestId` incremental, y solo aplicar `setState` si la respuesta corresponde al último request disparado.
   * Alternativa más robusta: usar `AbortController` y cancelar el fetch anterior al disparar uno nuevo.

---

### [FRONTEND] [BUG-11] Diálogos de "Cambiar etapa"/"Asignar tutores" fallan en silencio si no cargan las opciones (#176)
**Labels:** `easy` `bug`

* **Descripción:** En `GroupDetail.jsx`, si `getCohortStages` o `getTutors` fallan al abrir el diálogo correspondiente, solo se hace `console.error` (líneas ~177-222) — no hay `showToast` ni mensaje visible. El diálogo queda abierto con la lista de opciones vacía, pero `selectedStageId` ya viene seteado a la etapa actual del grupo, así que el `<TextField select>` recibe un `value` sin ningún `MenuItem` que lo represente (warning de MUI, combo se ve raro/vacío) — y el botón "Guardar" queda habilitado igual, porque la validación solo chequea que haya *algún* valor seleccionado, no que la lista haya cargado bien.
* **Tareas específicas:**
   * Agregar manejo de error visible (`showToast`) cuando falla la carga de etapas o tutores dentro de los diálogos.
   * Deshabilitar el botón "Guardar" si la carga de opciones falló, no solo si no hay nada seleccionado.

---

### [FRONTEND] [FEAT-11] Los entregables nunca muestran el nombre real de la etapa (siempre cae al fallback "Etapa #N") (#177)
**Labels:** `easy` `feature`

* **Descripción:** `GroupDetail.jsx` y `StudentsWorkspace.jsx` ya están preparados para mostrar `deliverable.stageName`, con fallback a `"Etapa #{stageId}"` cuando no viene — pero el `DeliverableRead` real del backend (`app/core/schemas/deliverable.py`) **no tiene ningún campo `stage_name`**, solo `stage_id`. Es decir, hoy el fallback se activa siempre, en el 100% de los casos — nunca se ve el nombre real de la etapa, a pesar de que el frontend ya tiene el código listo para mostrarlo.
* **Tareas específicas:**
   * Pedirle a backend que agregue `stage_name` a `DeliverableRead` (mismo patrón que ya se usó una vez para esto — hacer `join` con `Stage` y exponer `stage.name`).
   * Una vez que el campo exista, no hace falta tocar nada más del lado frontend — el fallback ya está armado para desaparecer solo apenas el dato llegue.

---

### [FRONTEND] [BUG-12] Dos estados de entregable distintos (`Submitted` y `Delivered`) se muestran con la misma etiqueta (#178)
**Labels:** `easy` `bug`

* **Descripción:** El mapa `DELIVERABLE_STATUS` (`GroupDetail.jsx` y `CohortDetail.jsx`) le pone la misma etiqueta "Entregado" tanto a `Submitted` como a `Delivered` — son dos estados reales y distintos en el backend, pero en la UI son indistinguibles. No es un crash, pero es pérdida de información real: no hay forma de saber desde la pantalla si un entregable fue solo "enviado" o ya "confirmado como recibido".
* **Tareas específicas:**
   * Darle a `Submitted` su propia etiqueta (ej. "Enviado") distinta de `Delivered` ("Entregado"), en los dos archivos que tienen este mapa.

---

### [FRONTEND] Endurecer dos detalles menores de `client.js` y `AuthContext.jsx` (#179)
**Labels:** `easy` `chore`

* **Descripción:** Dos cositas chicas, ninguna rompe nada hoy, pero conviene dejarlas bien:
   * `cachedGet` arma la cache key con `JSON.stringify(config.params)` sin ordenar las claves primero (`src/api/client.js`) — hoy no se manifiesta porque los objetos de filtros se arman siempre igual en el código, pero si en algún momento se arman dinámicamente (spread condicional, etc.), dos llamadas con los mismos filtros podrían generar cache keys distintas y perder el cacheo sin que nadie lo note.
   * `logout()` en `AuthContext.jsx` hace `localStorage.clear()` completo — borra token y cache (lo esperado) pero también cualquier otra preferencia guardada ahí (por ejemplo el tema oscuro/claro), no solo lo de la sesión.
* **Tareas específicas:**
   * Ordenar las claves del objeto de `params` antes de `JSON.stringify` en `cachedGet` (por ejemplo con `Object.keys(params).sort()`).
   * En `logout()`, borrar puntualmente el token y limpiar la cache (`clearCache()`) en vez de `localStorage.clear()` a ciegas.

---

## 🔄 Auditoría 2026-07-25 — Nuevas tareas (solo frontend)

Se verificó el estado real del backend corriendo el router de FastAPI directamente (no contra `api-spec-en.md`, que documenta endpoints "tentativos" no todos implementados) y se comparó contra el código actual del frontend. La mayoría de las tarjetas originales del backlog (`SETUP-1`, `SETUP-2`, `UI-1` a `UI-9`, `AUTH-1/2/3`, `BLOCK-1`, `MOCK-1`, `MOCK-6`, entorno de testing) ya están resueltas en el código actual y no se repiten acá. Las tarjetas de abajo son gaps reales detectados hoy, **accionables 100% desde frontend** (no requieren tocar el repo de backend) — donde algo sí depende de un endpoint que backend todavía no expone, la tarea es mockear/aislar siguiendo el mismo criterio que ya usó el equipo en `DASH-1`/`MOCK-6`, no bloquearse.

### [FRONTEND] [BUG-1] Corregir método HTTP en alta de Cohortes y Grupos (POST inexistente → PUT upsert)
**Labels:** `easy` `bug`

* **Descripción:** El backend expone `PUT /api/cohorts` y `PUT /api/groups` como upsert (`id: null` = crear, `id` seteado = editar) — igual que ya hace correctamente `upsertTutor` en `tutors.js`. Pero `createCohort` (`src/api/endpoints/cohorts.js:11-15`) y `createGroup` (`src/api/endpoints/groups.js:29-33`) llaman `apiClient.post(...)`, ruta que no existe en el backend (`405 Method Not Allowed`). Hoy mismo, crear una cohorte o un grupo desde la UI falla contra el backend real.
* **Tareas específicas:**
   * Cambiar `createCohort` para hacer `apiClient.put("/api/cohorts", { id: null, ...cohortData })`.
   * Cambiar `createGroup` para hacer `apiClient.put("/api/groups", { id: null, ...payload })`, respetando que `student_ids` es obligatorio y no puede ir vacío (`GroupUpsert` lo rechaza con 400).
   * Revisar los formularios de alta (`Cohorts.jsx`, `Groups.jsx`) para confirmar que no dependan de un código de estado `201` específico de `POST`.

---

### [FRONTEND] [BUG-2] Corregir capa de Estudiantes al patrón upsert real y sacar el fallback silencioso a mock
**Labels:** `mid` `bug`

* **Descripción:** `src/api/endpoints/students.js` fue escrito contra un contrato REST clásico que no es el que implementó backend: `createStudent` llama `POST /api/students` (no existe) y `updateStudent` llama `PUT /api/students/${id}` (tampoco existe — el real es `PUT /api/students` con `id` en el body, igual que Cohortes/Grupos/Tutores/Etapas). Además, **todas** las funciones de este archivo atrapan cualquier error y devuelven datos mockeados (`MOCK_STUDENTS`) en silencio — hoy eso significa que un error real de red o un 500 del backend se disfraza de éxito, lo cual ya no tiene sentido porque el módulo de Estudiantes está implementado en backend (`GET`, `GET/{id}`, `PUT`, `DELETE`).
* **Tareas específicas:**
   * Reescribir `createStudent`/`updateStudent` para usar `PUT /api/students` con `id: null` o `id` seteado según corresponda.
   * Quitar el `try/catch` que devuelve `MOCK_STUDENTS` en cualquier error; dejar que el error real se propague (ya existe manejo centralizado en `client.js`/`ErrorState`).
   * Eliminar `MOCK_STUDENTS` del archivo una vez migrado (o dejarlo solo como fixture de tests si se usa en algún `.test.js`).

---

### [FRONTEND] [BUG-3] Parsear correctamente errores 422 de FastAPI (`detail` como array de objetos)
**Labels:** `easy` `bug`

* **Descripción:** Este riesgo ya estaba anotado en `DEV-1` del backlog original pero sigue sin resolverse: `messageForStatus` en `src/api/client.js:39-46` devuelve `data?.detail` tal cual. FastAPI, ante un 422 de validación, devuelve `detail` como un **array de objetos** (`[{loc, msg, type}, ...]`), no un string. Hoy, cualquier error de validación (por ejemplo, crear un grupo sin `student_ids`) se va a mostrar en pantalla como `[object Object]`.
* **Tareas específicas:**
   * Ajustar `messageForStatus` para detectar cuando `data.detail` es un array y unir los `msg` de cada entrada en un mensaje legible (ej: `"idea: field required; student_ids: ensure this list has at least 1 item"`).
   * Mantener el caso actual (`detail` string) sin cambios.
   * Agregar un test en `client.test.js` con un payload 422 real de FastAPI (`{"detail":[{"loc":["body","name"],"msg":"field required","type":"missing"}]}`) para blindar el fix.

---

### [FRONTEND] [BUG-4] No simular acciones que el backend no soporta (Eliminar tutor, Eliminar etapa)
**Labels:** `mid` `bug`

* **Descripción:** Dos controles de la UI le mienten al usuario sobre lo que realmente pasó en el servidor. El botón "Eliminar" de `Tutors.jsx` (línea ~417-423) no tiene `onClick`: es un botón muerto, sin feedback de que no hace nada. Peor aún, `deleteStage` en `CohortLifecycleConfiguration.jsx:166-188` envía un `PUT /api/stages` con body vacío `{}` (que la API va a rechazar por campos faltantes, o en el peor caso, corromper datos si algún día se relajan las validaciones) y luego **igual borra la etapa del estado local**, mostrando éxito aunque el backend no haya eliminado nada.
* **🔄 Corrección (2026-07-28):** el proyecto usa **PUT como convención de borrado** (no `DELETE` para todo), así que "no existe `DELETE /api/tutors/{id}`" no significa que esté bloqueado — depende de si la entidad tiene un campo de estado para soft-delete. Revisando los modelos:
   * **`Tutor` sí tiene `status` (`"Active"`/`"Inactive"`)**, ya actualizable hoy mismo con el `PUT /api/tutors` que existe — "eliminar" un tutor es simplemente hacer `upsertTutor({ id, ...tutor, status: "Inactive" })`. **No está bloqueado por backend, es accionable ya.**
   * **`Stage` no tiene ningún campo de estado** (`app/core/models/stage.py`: solo `id, cohort_id, name, order, key_dates`) — para esta entidad sí sigue sin haber forma real de "borrar" vía PUT, porque no hay ningún campo que represente "inactivo/borrado". Acá sí falta algo del lado de backend (agregar un campo, o confirmar si Ithaka realmente necesita borrar etapas o alcanza con reordenarlas).
* **Tareas específicas:**
   * En `Tutors.jsx`: conectar el botón "Eliminar" (tabla y galería) para que haga `upsertTutor` con `status: "Inactive"` en vez de dejarlo sin `onClick`. Confirmar con el equipo si "Inactivo" debería ocultar al tutor de los selectores de asignación en `GroupDetail.jsx`.
   * En `CohortLifecycleConfiguration.jsx`: como `Stage` no tiene campo de estado, acá sí corresponde deshabilitar el botón con un `Tooltip` ("Baja de etapas no disponible todavía") en vez de simular un borrado con `upsertStage({})` — no tocar el estado local `stages` para no mostrar una eliminación que no ocurrió.
   * Preguntarle a backend si tiene sentido agregar un campo de estado a `Stage` (siguiendo la misma convención que `Tutor`/`Group`), o si borrar etapas no es un caso de uso real para Ithaka.

---

### [FRONTEND] [BUG-5] Migrar `CohortLifecycleConfiguration.jsx` de `fetch` crudo a `apiClient`
**Labels:** `mid` `refactor`

* **Descripción:** Esta pantalla es la única del proyecto que llama a la API con `fetch` directo a una ruta relativa (`"/api/stages"`, `src/pages/sections/CohortLifecycleConfiguration.jsx:20,41,64`), en vez de usar `apiClient` de `src/api/client.js`. Esto la deja afuera del manejo centralizado de errores (`normalizeError`/`messageForStatus`), no le inyecta el header `Authorization: Bearer` (hoy `stage_api.py` no exige auth, pero si en el futuro se protege, esta pantalla se rompe sin aviso) y no respeta `VITE_API_URL` si backend y frontend no comparten origen.
* **Tareas específicas:**
* **Descripción:** Se usa `fetch` directo, ignorando el manejo centralizado de errores y headers de autenticación.
* **Tareas específicas:**
   * Crear `upsertStage(payload)` en `src/api/endpoints/stages.js` usando `apiClient.put`.
   * Reemplazar los usos de `fetch` por funciones de `stages.js`.
   * Quitar la constante `API_BASE` local.

---

### [FRONTEND] [FEAT-3] Construir el Dashboard real (reemplaza el stub vacío)
**Labels:** `mid` `feature`

* **Descripción:** `src/pages/sections/Dashboard.jsx` es un stub vacío. Se debe construir contra un mock en `src/data/mockDashboard.js` hasta que exista `GET /api/dashboard/summary`.
* **Tareas específicas:**
   * Crear `src/api/endpoints/dashboard.js` devolviendo `mockDashboardSummary`.
   * Armar tarjetas de métricas, gráfico de `groups_by_stage` y tabla de `alerts`.
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

---

### [FRONTEND] [FEAT-4] Aislar `Meetings.jsx` detrás de una capa de API mockeada
**Labels:** `mid` `refactor`

   * Definir `src/api/endpoints/materials.js` con `getMaterials(stageId?)`/`createMaterial(payload)` contra un mock persistido (mismo patrón que `[FEAT-4]`), respetando la forma `{ stage_id, title, url }` ya documentada en `MOCK-6`.
   * Conectar `Knowledge.jsx` a esa capa en vez de al array mock inline, sin necesidad de mantener comentado el código real — que quede detrás de un flag o de la propia función mockeada.
   * Decidir si `Templates.jsx` se une al mismo módulo de materiales o se mantiene separado; si se mantiene, conectarlo por fin a `src/api/endpoints/templates.js` (hoy escrito pero sin usar).

---

### [FRONTEND] [FEAT-6] Resolver `CommentFeed` contra un endpoint que hoy no existe
**Labels:** `mid` `bug`

* **Descripción:** A diferencia de `Meetings`/`Knowledge`, este componente **no está mockeado** — `src/api/endpoints/comments.js` llama de verdad a `GET/POST /api/deliverables/{id}/comments` y `DELETE /api/comments/{id}`, rutas que no existen en el backend actual (no hay `deliverables_api.py` ni `comments_api.py`). Hoy, cualquier entregable que muestre `CommentFeed` va a mostrar el estado de error real (`"No se pudieron cargar los comentarios"`), no un mock — funcionalmente roto para el usuario.
* **Tareas específicas:**
   * Decidir: ocultar la sección de comentarios en la vista de entregable mientras no exista backend (opción rápida), o mockear `comments.js` con el mismo patrón persistente de `[FEAT-4]`/`[FEAT-5]` (opción que mantiene la funcionalidad visible para demos).
   * Si se opta por mockear: mover la lógica actual detrás de un flag, conservando la firma de las 3 funciones para no tocar `CommentFeed.jsx`.
   * Si se opta por ocultar: envolver el `<CommentFeed />` donde se use con una condición clara (y un comentario apuntando a por qué), en vez de dejarlo roto en producción.

---

### [FRONTEND] [FEAT-7] Definir el destino de la pantalla de Registro (`Register.jsx`)
**Labels:** `easy` `design`

* **Descripción:** No es un bug de código sino una decisión de producto pendiente. `Register.jsx` simula un alta de usuario y redirige a `/login` sin llamar a ninguna API — pero el contrato real de backend **no tiene un endpoint público de auto-registro**: la única forma de crear usuarios es `POST/PUT /api/users`, restringido al rol `Coordinator`, y ya está resuelto en `Users.jsx`. Es decir, el flujo de "Crear una cuenta" que hoy cuelga del Login no tiene ningún backend al que conectarse, ni lo va a tener con el modelo de permisos actual.
* **Tareas específicas:**
   * Confirmar con Ithaka/coordinador del reto si el alta de usuarios siempre va a ser exclusiva del Coordinador (lo más probable, dado el contrato) o si en algún momento se espera auto-registro.
   * Si se confirma que es exclusiva del Coordinador: quitar el link "¿No tienes cuenta? Regístrate" de `Login.jsx` y la ruta `/register`, dejando la gestión de usuarios solo en `/users`.
   * Si se decide mantenerla como demo: marcarla visualmente como "Próximamente" y no simular un éxito falso.

---

### [FRONTEND] [FEAT-8] Revisar el uso de `group.links` en `StudentsWorkspace.jsx`
**Labels:** `easy` `bug`

* **Descripción:** `StudentsWorkspace.jsx:301` renderiza `group.links`, pero el modelo `Group` del backend no tiene ninguna columna `links` (solo existe la entidad `Document`, polimórfica y sin router propio todavía). Hoy esa sección de la vista del estudiante siempre va a mostrar vacío/`undefined`, no porque no haya links cargados sino porque el campo no existe en la respuesta real de `GET /api/groups/{id}`.
* **Tareas específicas:**
   * Confirmar si "links del grupo" (repositorio, informe, pitch, one pager — ver la tabla de referencia real del cliente al final de este documento) se va a modelar como campos directos en `Group` o como `Document`s asociados, y comunicarlo al equipo de backend.
   * Mientras no esté resuelto, ocultar o marcar como "próximamente" esa sección en `StudentsWorkspace.jsx` en vez de dejarla mostrando datos vacíos sin explicación.

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

### [FRONTEND] Control de Acceso por Roles (RBAC) en el Enrutamiento (Frontend Route Guard)
**Labels:** `mid` `security`

* **Descripción:** Tarea de seguridad y middleware en frontend. Se debe implementar un sistema de control de acceso basado en roles para las distintas vistas de la aplicación. Conforme a `api-spec-en (1).md`, el objeto de usuario autenticado proviene de `POST /api/auth/login` (o se rehidrata con `GET /api/users/me`) con la siguiente estructura:
  ```json
  {
    "id": 8,
    "name": "María Pérez",
    "role": "BusinessTutor" // Rol del usuario
  }
  ```
  Los roles posibles definidos en el enum `UserRole` del contrato son:
  * `Coordinator`: Acceso completo a toda la plataforma (Cohortes, creación/edición de Grupos, asignación de Tutores, etc.).
  * `BusinessTutor` y `TechnicalTutor`: Acceso a ver listados generales de tutores/grupos, ver el detalle de sus grupos asignados, programar reuniones (`Meetings`) y dejar comentarios (`Comments`) en entregables.
  * `Student`: Acceso restringido únicamente a la vista de su propio Grupo (`Group`), sus entregables (`Deliverables`), minutas de reuniones y subir links/documentos de entregas.
  Se necesita un middleware/componente en el frontend que proteja las rutas según estos roles. Si un usuario intenta acceder a una ruta sin el rol permitido (ej. un estudiante queriendo ver `/cohorts`), debe ser redirigido a una vista estética de "Acceso Denegado (403)".
* **Tareas específicas:**
   * Crear el componente `RoleProtectedRoute` (o extender el `ProtectedRoute` existente) que reciba los roles autorizados como propiedad (ej. `allowedRoles={['Coordinator']}`).
   * Definir y mapear los roles permitidos en la configuración de rutas de React Router.
   * Diseñar una pantalla de "Acceso Denegado (403)" (`Forbidden.jsx`) con una interfaz de usuario clara, pulida y un botón de redirección segura a su dashboard o inicio.
   * Probar el flujo de redirecciones alternando manualmente el `role` del usuario en el mock de la sesión.

---

### [FRONTEND] Middleware de Caché en el Cliente para Datos Semiestáticos
**Labels:** `mid` `refactor`

* **Descripción:** Tarea de optimización y middleware. Para evitar llamadas redundantes al backend (o al mock) para catálogos y datos semiestáticos que cambian con muy poca frecuencia durante la sesión (como la lista de etapas del proceso `Stages`, la lista de cohortes disponibles, o la información del perfil del usuario), se debe implementar un mecanismo de caché en memoria o persistente (`localStorage`/`sessionStorage`) con tiempo de expiración (TTL).
* **Tareas específicas:**
   * Diseñar una utilidad de almacenamiento en caché que maneje tiempo de vida (TTL) para invalidación automática.
   * Integrar la caché en el cliente de API base (`src/api/client.js`) o a través de un hook de servicio para interceptar consultas a estos endpoints específicos.
   * Proveer un mecanismo para invalidar o limpiar la caché de forma manual al realizar una acción de mutación (ej. limpiar la caché de cohortes inmediatamente después de crear uno nuevo).

---

### [FRONTEND] Sistema de Captura de Errores Global (Error Boundary)
**Labels:** `mid` `chore`

* **Descripción:** Tarea de robustez y resiliencia en frontend. Para evitar pantallas en blanco completas cuando un componente de React falla en producción debido a datos inesperados o fallos de renderizado, se debe implementar un componente `ErrorBoundary` global y a nivel de rutas clave.
* **Tareas específicas:**
   * Implementar un componente `ErrorBoundary` usando la API de React (pudiendo usar también `react-error-boundary` si se desea).
   * Diseñar una interfaz de "Fallback" estética y limpia que permita al usuario reintentar/recargar la sección o volver al dashboard principal.
   * Integrar el `ErrorBoundary` en el layout general de la aplicación (`AppLayout`) y alrededor de secciones dinámicas propensas a fallos (como gráficos del dashboard o tablas complejas).

---

### [FRONTEND] Implementación de Tema Oscuro/Claro (Dark/Light Mode)
**Labels:** `mid` `design`

* **Descripción:** Tarea de diseño y accesibilidad. Diseñar y aplicar un selector de tema (Dark/Light mode) persistiendo la elección del usuario en `localStorage` y usando variables CSS o el ThemeProvider de Material UI (MUI), según lo que use el proyecto.
* **Tareas específicas:**
   * Configurar las paletas de colores armónicas para ambos temas (oscuro y claro) alineadas con la estética premium de Ithaka.
   * Implementar un contexto de tema (`ThemeContext`) y un hook (`useTheme`) para gestionar el estado del tema.
   * Añadir un control interactivo (toggle con microanimaciones) en el `Topbar`.
   * Asegurar que todo el layout y componentes existentes (Sidebar, Dashboard cards, Tablas) respondan correctamente al cambio de tema de forma fluida.

---

### [FRONTEND] Sanitización de Inputs y Prevención de XSS en Formularios
**Labels:** `easy` `security`

* **Descripción:** Tarea de seguridad en frontend. Dado que los usuarios introducen URLs de repositorios, links a minutas y texto en notas de reuniones, se requiere asegurar que el contenido ingresado no contenga scripts maliciosos (Cross-Site Scripting) antes de renderizarlo o guardarlo.
* **Tareas específicas:**
   * Integrar o implementar funciones de validación y sanitización seguras en los inputs de formularios dinámicos.
   * Asegurar que cualquier campo donde el usuario ingrese URLs (ej: repositorio de grupo, links de minutas) sea validado con expresiones regulares estrictas en el frontend.
   * En las vistas donde se renderice texto de notas u opiniones (que puedan admitir formato), sanitizar la salida si se usa renderizado HTML directo o Markdown.

---

### [FRONTEND] Entorno de Pruebas Unitarias y Componentes (Vitest + React Testing Library)
**Labels:** `mid` `chore`

* **Descripción:** Tarea de infraestructura de desarrollo. El equipo de frontend necesita una base sólida de pruebas para garantizar que el refactor no rompa la interfaz de usuario al momento de realizar la conexión real con el backend.
* **Tareas específicas:**
   * Configurar Vitest y React Testing Library en el proyecto Vite.
   * Escribir pruebas unitarias para las funciones de utilidad, formateadores de fechas, y el cliente de API (manejo de errores de FastAPI, etc.).
   * Escribir pruebas de componentes simples (como el `ConfirmModal`, `Topbar` o las redirecciones de `ProtectedRoute`).

### [FRONTEND] Diseñar e implementar la pantalla de Ajustes (Únicamente Visual)
**Labels:** `easy` `design`

* **Descripción:** Diseñar e implementar la estructura visual de la pantalla de ajustes/configuración del perfil del usuario logueado en el sistema, sin conectar con lógica del backend de momento.
* **Tareas específicas:**
   * Maquetar la interfaz de Ajustes (`Settings.jsx`) incluyendo pestañas para información personal, seguridad (cambio de contraseña) y preferencias visuales.
   * Utilizar componentes estándar de Material UI alineados con la estética premium y soporte para modo oscuro/claro.
   * Conectar la pantalla a las rutas principales de React Router para navegación desde el menú de usuario.

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
