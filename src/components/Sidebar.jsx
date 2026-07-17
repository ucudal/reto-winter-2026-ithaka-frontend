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

import { Link } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <List
        subheader={
          <ListSubheader component="div">
            Proyectos
          </ListSubheader>
        }
      >
       
        <ListItemButton component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>

          <ListItemText primary="Resumen" />
        </ListItemButton>

        <ListItemButton component={Link} to="/teams">
          <ListItemIcon>
            <GroupsIcon />
          </ListItemIcon>

  
          <ListItemText primary="Grupos" />
        </ListItemButton>
      </List>

      <List
        subheader={
          <ListSubheader component="div">
            Equipo
          </ListSubheader>
        }
      >
        <ListItemButton component={Link} to="/tutors">
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>

          <ListItemText primary="Tutores" />
        </ListItemButton>

        <ListItemButton component={Link} to="/students">
          <ListItemIcon>
            <SchoolIcon />
          </ListItemIcon>

          <ListItemText primary="Alumnos" />
        </ListItemButton>
      </List>

      <List
        subheader={
          <ListSubheader component="div">
            Herramientas
          </ListSubheader>
        }
      >
        <ListItemButton component={Link} to="/templates">
          <ListItemIcon>
            <AssignmentOutlinedIcon />
          </ListItemIcon>

          <ListItemText primary="Templates" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}