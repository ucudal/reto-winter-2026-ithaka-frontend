import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import Login from '../pages/Auth/Login.jsx'
import Register from '../pages/Auth/Register.jsx'
import Dashboard from '../pages/sections/Dashboard.jsx'
import Alumnos from '../pages/sections/Alumnos.jsx'
import Cohortes from '../pages/sections/Cohortes.jsx'
import Grupos from '../pages/sections/Grupos.jsx'
import Templates from '../pages/sections/Templates.jsx'
import Tutores from '../pages/sections/Tutores.jsx'
import Error404 from '../pages/sections/Error404.jsx'

// Rutas públicas: no requieren sesión iniciada.
// Rutas protegidas: van agrupadas bajo ProtectedRoute + MainLayout,
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/alumnos', element: <Alumnos /> },
          { path: '/cohortes', element: <Cohortes /> },
          { path: '/grupos', element: <Grupos /> },
          { path: '/templates', element: <Templates /> },
          { path: '/tutores', element: <Tutores /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Error404 />,
  },
])

export default router
