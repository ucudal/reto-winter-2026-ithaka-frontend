import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

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
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
