import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

// Layout que envuelve todas las pantallas "internas" (dashboard, secciones).

function MainLayout() {
  return (
    <Box>
      {/* placeholder: acá van Topbar y Sidebar*/}
      <Outlet />
    </Box>
  )
}

export default MainLayout
