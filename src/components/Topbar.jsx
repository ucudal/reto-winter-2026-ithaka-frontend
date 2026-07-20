import MenuIcon from "@mui/icons-material/Menu";
import Logout from "@mui/icons-material/Logout";

import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  ListItemText,
} from "@mui/material";

import logo from "../assets/img/logo.png";
import personFilled from "../assets/img/personFilled.png";

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
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={onLogout}>
          <Logout sx={{ mr: 1 }} fontSize="small" />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}

export default Topbar;
