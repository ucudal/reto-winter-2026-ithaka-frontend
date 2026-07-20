import { useState } from 'react'
import { Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import ConfirmModal from '../../components/ConfirmModal.jsx'

function Dashboard() {
  const [openLogoutModal, setOpenLogoutModal] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleConfirmLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box>
      <Typography variant="h4">Dashboard</Typography>

      <Button
        variant="outlined"
        color="error"
        sx={{ mt: 2 }}
        onClick={() => setOpenLogoutModal(true)}
      >
        Cerrar sesión
      </Button>

      <ConfirmModal
        open={openLogoutModal}
        title="Cerrar sesión"
        message="¿Seguro que querés cerrar la sesión?"
        confirmText="Salir"
        cancelText="Cancelar"
        onClose={() => setOpenLogoutModal(false)}
        onConfirm={handleConfirmLogout}
      />
    </Box>
  )
}

export default Dashboard
