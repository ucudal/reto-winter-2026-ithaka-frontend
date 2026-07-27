import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";
import ThemeToggle from "./ThemeToggle.jsx";

import {
  AppBar,
  Badge,
  Box,
  Chip,
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
import { getDashboardSummary } from "../api/endpoints/dashboard";

// severity: clave de theme.palette usada para el color (nunca color-solo: siempre va con label).
const ALERT_META = {
  GroupWithoutTutor: { label: "Grupo sin tutor", severity: "warning" },
  OverloadedTutor: { label: "Tutor sobrecargado", severity: "error" },
  OverdueDeliverable: { label: "Entregable vencido", severity: "error" },
  StaleGroup: { label: "Grupo inactivo", severity: "warning" },
};

function AlertMenuItem({ alert, onNavigate }) {
  const meta = ALERT_META[alert.type] || { label: alert.type, severity: "warning" };
  const Icon = meta.severity === "error" ? ReportProblemIcon : AssignmentLateIcon;
  const href = alert.group_id
    ? `/groups/${alert.group_id}`
    : alert.tutor_id
    ? "/tutors"
    : null;

  const subjectName = alert.group_name || alert.tutor_name;

  return (
    <MenuItem
      onClick={() => href && onNavigate(href, alert)}
      sx={{ alignItems: "flex-start", whiteSpace: "normal", gap: 1.5, py: 1 }}
    >
      <ListItemIcon sx={{ mt: 0.25, minWidth: 28, color: `${meta.severity}.main` }}>
        <Icon fontSize="small" />
      </ListItemIcon>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 0.25 }}>
          <Typography variant="body2" fontWeight="bold" color={`${meta.severity}.main`}>
            {meta.label}
          </Typography>
          {subjectName && (
            <Chip
              label={subjectName}
              size="small"
              variant="outlined"
              sx={{ height: 18, "& .MuiChip-label": { px: 0.75, fontSize: 11 } }}
            />
          )}
        </Box>
        {alert.stage_name && (
          <Typography variant="caption" color="text.secondary" display="block">
            Etapa: {alert.stage_name}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {alert.description}
        </Typography>
      </Box>
    </MenuItem>
  );
}

function Topbar({ onMenuClick, onLogout }) {
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();

  const currentUser = user || usersMock?.tutor;
  const isCoordinator = user?.role === "Coordinator";

  useEffect(() => {
    if (!isCoordinator) return;

    let active = true;
    getDashboardSummary()
      .then((data) => {
        if (active) setAlerts(data?.alerts ?? []);
      })
      .catch(() => {
        if (active) setAlerts([]);
      });

    return () => {
      active = false;
    };
  }, [isCoordinator]);

  const handleOpenUserMenu = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setUserMenuAnchor(null);
  };

  const handleOpenNotifications = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const handleNavigateFromAlert = (href, alert) => {
    handleCloseNotifications();
    const state =
      alert?.type === "OverdueDeliverable" && alert.deliverable_id
        ? { highlightDeliverableId: alert.deliverable_id }
        : undefined;
    navigate(href, { state });
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
            {isCoordinator && (
              <IconButton
                color="inherit"
                onClick={handleOpenNotifications}
                aria-label="Ver alertas del sistema"
              >
                <Badge badgeContent={alerts.length} color="error" max={99}>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            )}

            <ThemeToggle />

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
          </Box>
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

        <MenuItem onClick={() => { handleCloseUserMenu(); navigate("/settings"); }}>
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

      {isCoordinator && (
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleCloseNotifications}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: { width: 340, maxHeight: 420, mt: 1 },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              Alertas del Sistema
            </Typography>
          </Box>

          <Divider />

          {alerts.length === 0 ? (
            <Box sx={{ px: 2, py: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Sin alertas pendientes.
              </Typography>
            </Box>
          ) : (
            alerts.map((alert, idx) => (
              <AlertMenuItem key={idx} alert={alert} onNavigate={handleNavigateFromAlert} />
            ))
          )}
        </Menu>
      )}

      <UserProfileDrawer
        user={currentUser}
        open={isDrawerOpen}
        onClose={handleCloseProfileDrawer}
      />
    </>
  );
}

export default Topbar;