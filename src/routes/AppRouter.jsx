import { Navigate, createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RouteErrorBoundary from "./RouteErrorBoundary.jsx";

import Login from "../pages/Auth/Login.jsx";
import Dashboard from "../pages/sections/Dashboard.jsx";
import StudentWorkspace from "../pages/sections/StudentsWorkspace.jsx";
import Students from "../pages/sections/Students.jsx";
import Cohorts from "../pages/sections/Cohorts.jsx";
import CohortDetail from "../pages/sections/CohortDetail.jsx";
import Groups from "../pages/sections/Groups.jsx";
import GroupDetail from "../pages/sections/GroupDetail.jsx";
import Templates from "../pages/sections/Templates.jsx";
import TemplateDetail from "../pages/sections/TemplateDetail.jsx";
import Tutors from "../pages/sections/Tutors.jsx";
import Deliverables from "../pages/sections/Deliverables.jsx";
import Knowledge from "../pages/sections/Knowledge.jsx";
import Users from "../pages/sections/Users.jsx";
import Settings from "../pages/sections/Settings.jsx";
import Meetings from "../pages/sections/Meetings.jsx";
import NotFoundPage from "../pages/sections/NotFoundPage.jsx";
import RoleProtectedRoute from "./RoleProtectedRoute.jsx";
import ForbiddenPage from "../pages/sections/ForbiddenPage.jsx";
import TutorDetail from "../pages/sections/TutorDetail";
import CohortLifecycleConfiguration from "../pages/sections/CohortLifecycleConfiguration.jsx";

const appRouter = createBrowserRouter([
  {
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/login",
        element: <Login />,
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
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <Dashboard />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/workspace",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Student"]}>
                        <StudentWorkspace />
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
                    path: "/cohorts/:id/configuration",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <CohortLifecycleConfiguration />
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
                    path: "/groups/:id",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                        ]}
                      >
                        <GroupDetail />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/templates",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                        ]}
                      >
                        <Templates />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/templates/:id",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                        ]}
                      >
                        <TemplateDetail />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/tutors",
                    element: (
                      <RoleProtectedRoute allowedRoles={["Coordinator"]}>
                        <Tutors />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/deliverables",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                          "Student",
                        ]}
                      >
                        <Deliverables />
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
                          "Student",
                        ]}
                      >
                        <Knowledge />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/tutors/:id",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                        ]}
                      >
                        <TutorDetail />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/settings",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                          "Student",
                        ]}
                      >
                        <Settings />
                      </RoleProtectedRoute>
                    ),
                  },
                  {
                    path: "/meetings",
                    element: (
                      <RoleProtectedRoute
                        allowedRoles={[
                          "Coordinator",
                          "BusinessTutor",
                          "TechnicalTutor",
                          "Student",
                        ]}
                      >
                        <Meetings />
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
