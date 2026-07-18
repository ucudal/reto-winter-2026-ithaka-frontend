import { Outlet } from 'react-router-dom'

// STUB:
// 1. Leer si hay sesión iniciada (context, localStorage, lo que definan).
// 2. Si NO hay sesión -> <Navigate to="/login" replace />
// 3. Si hay sesión -> <Outlet /> (deja pasar a la ruta hija)
function ProtectedRoute() {
  return <Outlet />
}

export default ProtectedRoute
