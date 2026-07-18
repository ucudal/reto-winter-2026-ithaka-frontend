import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

import Login from '../pages/Auth/Login.jsx'
import Register from '../pages/Auth/Register.jsx'
import Dashboard from '../pages/sections/Dashboard.jsx'
import Students from '../pages/sections/Students.jsx'
import Cohorts from '../pages/sections/Cohorts.jsx'
import Groups from '../pages/sections/Groups.jsx'
import Templates from '../pages/sections/Templates.jsx'
import Tutors from '../pages/sections/Tutors.jsx'
import NotFoundPage from '../pages/sections/NotFoundPage.jsx'

const appRouter = createBrowserRouter([
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
          { path: '/alumnos', element: <Students /> },
          { path: '/cohortes', element: <Cohorts /> },
          { path: '/grupos', element: <Groups /> },
          { path: '/templates', element: <Templates /> },
          { path: '/tutores', element: <Tutors /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default appRouter
