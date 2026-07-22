import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import Logout from "@mui/icons-material/Logout";
import ThemeToggle from "./ThemeToggle.jsx";

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
} from "@mui/material";

import logo from "../assets/img/logo-bw.png";
import personFilled from "../assets/img/userFilled.png";

function Topbar({
  userName,
  onMenuClick,
  userMenuAnchor,
  onUserMenuOpen,
  onUserMenuClose,
  onLogout,
}) {
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
        <Toolbar>
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

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ThemeToggle />

            <IconButton
              onClick={onUserMenuOpen}
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
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={onUserMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem disabled sx={{ minWidth: 220, opacity: 1 }}>
          <ListItemText
            primary={userName}
            secondary="Usuario mockeado"
            primaryTypographyProps={{ color: "text.primary" }}
            secondaryTypographyProps={{ color: "text.secondary" }}
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={onUserMenuClose}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Ajustes
        </MenuItem>

        <MenuItem onClick={onUserMenuClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Perfil
        </MenuItem>

        <MenuItem onClick={onLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}

export default Topbar;
