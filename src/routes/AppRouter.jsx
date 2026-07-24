import { Navigate, createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RouteErrorBoundary from "./RouteErrorBoundary.jsx";

import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Dashboard from "../pages/sections/Dashboard.jsx";
import Students from "../pages/sections/Students.jsx";
import Cohorts from "../pages/sections/Cohorts.jsx";
import CohortDetail from "../pages/sections/CohortDetail.jsx";
import Groups from "../pages/sections/Groups.jsx";
import Templates from "../pages/sections/Templates.jsx";
import TemplateDetail from "../pages/sections/TemplateDetail.jsx";
import Tutors from "../pages/sections/Tutors.jsx";
import TutorsCapacity from "../pages/sections/TutorsCapacity.jsx";
import Knowledge from "../pages/sections/Knowledge.jsx";
import Users from "../pages/sections/Users.jsx";
import NotFoundPage from "../pages/sections/NotFoundPage.jsx";
import RoleProtectedRoute from "./RoleProtectedRoute.jsx";
import ForbiddenPage from "../pages/sections/ForbiddenPage.jsx";

const appRouter = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <MainLayout />,
            children: [
              {
                errorElement: <RouteErrorBoundary />,
                children: [
                  {
                    path: "/dashboard",
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
                    path: "/users",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <Users />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/students",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <Students />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/cohorts",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <Cohorts />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/cohorts/:id",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <CohortDetail />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/groups",
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
                    path: "/templates",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <Templates />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: '/templates/:id',
                    element: (
                      <RoleProtectedRoute allowedRoles={['Coordinator']}>
                        <TemplateDetail />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/tutors",
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
                    path: "/tutors/capacity",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <TutorsCapacity />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/knowledge",
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
                  {
                    path: "/forbidden",
                    element: <ForbiddenPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default appRouter;
