import { RouterProvider } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeModeProvider } from "./context/ThemeContext.jsx";
import { ToastProvider } from "./ToastContext.jsx";

import ThemeToggle from "./components/ThemeToggle";
import router from "./routes/AppRouter.jsx";

export default function App() {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}