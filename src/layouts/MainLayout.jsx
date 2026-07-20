import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}

export default MainLayout
