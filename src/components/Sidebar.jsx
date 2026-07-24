import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import WorkspacesIcon from "@mui/icons-material/Workspaces";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link, useLocation } from "react-router-dom";
import { DRAWER_WIDTH } from "../theme/constants";
import { useAuth } from "../context/AuthContext.jsx";

export default function Sidebar({
  open,
  variant = "permanent",
  onClose,
  onNavigate,
}) {
  const location = useLocation();
  const { user } = useAuth();
  const isTemporary = variant === "temporary";

  const navItem = (to, label, Icon) => (
    <ListItemButton
      component={Link}
      to={to}
      selected={location.pathname === to}
      onClick={onNavigate}
    >
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );

  const content = (
    <>
      <Toolbar />

      <List
        subheader={
          <ListSubheader component="div">
            Proyectos
          </ListSubheader>
        }
      >
        {navItem("/dashboard", "Resumen", DashboardIcon)}
        {user?.role === "Student" && navItem("/workspace", "Mi espacio", WorkspacesIcon)}
        {navItem("/cohorts", "Cohortes", CalendarMonthIcon)}
        {navItem("/groups", "Grupos", GroupsIcon)}
      </List>

      <List
        subheader={
          <ListSubheader component="div">
            Equipo
          </ListSubheader>
        }
      >
        {navItem("/tutors", "Tutores", PeopleIcon)}
        {navItem("/students", "Alumnos", SchoolIcon)}
      </List>

      {user?.role === "Coordinator" ? (
        <List
          subheader={
            <ListSubheader component="div">
              Administración
            </ListSubheader>
          }
        >
          {navItem("/users", "Usuarios", ManageAccountsIcon)}
        </List>
      ) : null}

      <List
        subheader={
          <ListSubheader component="div">
            Herramientas
          </ListSubheader>
        }
      >
        {navItem("/templates", "Templates", AssignmentOutlinedIcon)}
        {navItem("/knowledge", "Materiales", MenuBookIcon)}
      </List>
    </>
  );

  if (isTemporary) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? DRAWER_WIDTH : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? DRAWER_WIDTH : 0,
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "width 0.3s",
          visibility: open ? "visible" : "hidden",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
