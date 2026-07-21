import { Navigate, createBrowserRouter } from 'react-router-dom'

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
import Knowledge from '../pages/sections/Knowledge.jsx'
import NotFoundPage from '../pages/sections/NotFoundPage.jsx'

import RoleProtectedRoute from "./RoleProtectedRoute.jsx";
import ForbiddenPage from "../pages/sections/ForbiddenPage.jsx";

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
          { 
            path: '/dashboard',
            element: (
              <RoleProtectedRoute
                allowedRoles={[
                  "Coordinator",
                  "BusinessTutor",
                  "TechnicalTutor",
                  "Student",
                ]}
              >
                <Dashboard />
              </RoleProtectedRoute>
            ),
          },
          { 
            path: '/students',
            element: (
              <RoleProtectedRoute
                allowedRoles={["Coordinator"]}
              >
                <Students />
              </RoleProtectedRoute>
            ),
          },
          { 
            path: '/cohorts',
            element: (
              <RoleProtectedRoute
                allowedRoles={["Coordinator"]}
              >
                <Cohorts />
              </RoleProtectedRoute>
            ),
          },
          { 
            path: '/groups',
           element: (
              <RoleProtectedRoute
                allowedRoles={[
                  "Coordinator",
                  "BusinessTutor",
                  "TechnicalTutor",
                ]}
              >
                <Groups />
              </RoleProtectedRoute>
            ),
          },
          { 
            path: '/templates',
            element: (
              <RoleProtectedRoute
                allowedRoles={["Coordinator"]}
              >
                <Templates />
              </RoleProtectedRoute>
            ),
          },
          { 
            path: '/tutors',
            element: (
              <RoleProtectedRoute
                allowedRoles={[
                  "Coordinator",
                  "BusinessTutor",
                  "TechnicalTutor",
                ]}
              >
                <Tutors />
              </RoleProtectedRoute>
            ),
          },
          { 
            path: '/knowledge',
            element: (
              <RoleProtectedRoute
                allowedRoles={[
                  "Coordinator",
                  "BusinessTutor",
                  "TechnicalTutor",
                ]}
              >
                <Knowledge />
              </RoleProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
  
  {
  path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])

export default appRouter
