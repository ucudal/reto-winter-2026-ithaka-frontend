import { Navigate, createBrowserRouter } from "react-router-dom";

import MainLayout from "../layouts/MainLayout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RouteErrorBoundary from "./RouteErrorBoundary.jsx";

import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Dashboard from "../pages/sections/Dashboard.jsx";
import Students from "../pages/sections/Students.jsx";
import Cohorts from "../pages/sections/Cohorts.jsx";
import Groups from "../pages/sections/Groups.jsx";
import Templates from "../pages/sections/Templates.jsx";
import Tutors from "../pages/sections/Tutors.jsx";
import Knowledge from "../pages/sections/Knowledge.jsx";
import NotFoundPage from "../pages/sections/NotFoundPage.jsx";

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
                  { path: "/dashboard", element: <Dashboard /> },
                  { path: "/students", element: <Students /> },
                  { path: "/cohorts", element: <Cohorts /> },
                  { path: "/groups", element: <Groups /> },
                  { path: "/templates", element: <Templates /> },
                  { path: "/tutors", element: <Tutors /> },
                  { path: "/knowledge", element: <Knowledge /> },
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
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default appRouter;
