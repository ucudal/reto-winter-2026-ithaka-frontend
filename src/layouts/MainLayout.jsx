import { Box,Toolbar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from "../components/Sidebar.jsx";
import { DRAWER_WIDTH } from "../theme/constants";

function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${DRAWER_WIDTH}px)` }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout
