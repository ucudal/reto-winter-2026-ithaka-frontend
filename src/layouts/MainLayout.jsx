import { useEffect, useState } from "react";
import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function MainLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSidebarToggle = () => setSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setSidebarOpen(false);

  const handleUserMenuOpen = (event) => setUserMenuAnchor(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchor(null);

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar
        userName="Usuario"
        onMenuClick={handleSidebarToggle}
        userMenuAnchor={userMenuAnchor}
        onUserMenuOpen={handleUserMenuOpen}
        onUserMenuClose={handleUserMenuClose}
        onLogout={handleLogout}
      />

      <Sidebar
        open={sidebarOpen}
        variant={isMobile ? "temporary" : "permanent"}
        onClose={handleSidebarClose}
        onNavigate={isMobile ? handleSidebarClose : undefined}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
