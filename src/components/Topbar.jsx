import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

import {
  AppBar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  ListItemText,
  Typography,
} from "@mui/material";

import logo from "../assets/img/logo-bw.png";
import personFilled from "../assets/img/userFilled.png";
import UserProfileDrawer from "./UserProfileDrawer";
import { usersMock } from "../utils/userData";

function Topbar({ onMenuClick, onLogout }) {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  const currentUser = user || usersMock?.tutor;

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenProfileDrawer = () => {
    handleCloseUserMenu();
    setIsDrawerOpen(true);
  };

  const handleCloseProfileDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "primary.dark",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={onMenuClick}
              aria-label="Abrir menú lateral"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component="img"
              src={logo}
              alt="Ithaka"
              sx={{
                display: "block",
                height: 34,
                width: "auto",
              }}
            />
          </Box>

          <IconButton
            onClick={handleOpenUserMenu}
            aria-label="Abrir menú de usuario"
            sx={{
              bgcolor: "grey.300",
              borderRadius: "50%",
              width: 32,
              height: 32,
              "&:hover": {
                bgcolor: "grey.400",
              },
            }}
          >
            <Box
              component="img"
              src={personFilled}
              alt="Usuario"
              sx={{
                width: 20,
                height: 20,
              }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleCloseUserMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 220, mt: 1 },
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" fontWeight="bold">
            {currentUser?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {currentUser?.email}
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleCloseUserMenu}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Ajustes"/>
        </MenuItem>

        <MenuItem onClick={handleOpenProfileDrawer}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Perfil"/>
        </MenuItem>

        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión"/>
        </MenuItem>
      </Menu>

      <UserProfileDrawer
        user={currentUser}
        open={isDrawerOpen}
        onClose={handleCloseProfileDrawer}
      />
    </>
  );
}

export default Topbar;