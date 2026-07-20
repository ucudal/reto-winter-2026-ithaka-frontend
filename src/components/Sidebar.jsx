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

import { Link, useLocation } from "react-router-dom";
import { DRAWER_WIDTH } from "../theme/constants";

export default function Sidebar() {
  const location = useLocation();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List
        subheader={<ListSubheader component="div">Proyectos</ListSubheader>}
      >
        <ListItemButton
          component={Link}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>

          <ListItemText primary="Resumen" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/cohorts"
          selected={location.pathname === "/cohorts"}
        >
          <ListItemIcon>
            <CalendarMonthIcon />
          </ListItemIcon>

          <ListItemText primary="Cohortes" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/groups"
          selected={location.pathname === "/groups"}
        >
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>

          <ListItemText primary="Grupos" />
        </ListItemButton>
      </List>

      <List subheader={<ListSubheader component="div">Equipo</ListSubheader>}>
        <ListItemButton
          component={Link}
          to="/tutors"
          selected={location.pathname === "/tutors"}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>

          <ListItemText primary="Tutores" />
        </ListItemButton>

        <ListItemButton
          component={Link}
          to="/students"
          selected={location.pathname === "/students"}
        >
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>

          <ListItemText primary="Alumnos" />
        </ListItemButton>
      </List>

      <List
        subheader={<ListSubheader component="div">Herramientas</ListSubheader>}
      >
        <ListItemButton
          component={Link}
          to="/templates"
          selected={location.pathname === "/templates"}
        >
          <ListItemIcon>
            <AssignmentOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Templates" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
