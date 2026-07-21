import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import ErrorFallback from "../components/ErrorFallback.jsx";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const location = useLocation();

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    // TODO: conectar con la lógica real de logout (AuthContext)
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar
        userName="Nombre de usuario"
        onMenuClick={handleSidebarToggle}
        userMenuAnchor={userMenuAnchor}
        onUserMenuOpen={handleUserMenuOpen}
        onUserMenuClose={handleUserMenuClose}
        onLogout={handleLogout}
      />

      <Sidebar open={sidebarOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          resetKeys={[location.pathname]}
        >
          <Outlet />
        </ErrorBoundary>
      </Box>
    </Box>
  );
}

export default MainLayout;
