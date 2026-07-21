import React from 'react';
import { Drawer, Avatar, Box, Typography, Button } from '@mui/material';
import ProfileDetails from "../utils/ProfileDetails";

const ROLE_LABELS = {
  Student: 'Estudiante',
  BusinessTutor: 'Tutor de Negocio',
  TechnicalTutor: 'Tutor Técnico',
  Coordinator: 'Coordinador Ithaka',
};

export default function UserProfileDrawer({ user, open, onClose }) {
  if (!user) return null;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 380,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Mi Perfil
        </Typography>

        {/* Encabezado testing*/}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 64, height: 64 }} />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ROLE_LABELS[user.role] || user.role}
            </Typography>
          </Box>
        </Box>

        {/* Formulario condicional por Rol */}
        <ProfileDetails user={user} />
      </Box>

      {/* Botones */}
      <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
        <Button variant="text" onClick={onClose} sx={{ fontWeight: 'bold' }}>
          CERRAR
        </Button>
        <Button variant="contained" disableElevation>
          EDITAR
        </Button>
      </Box>
    </Drawer>
  );
}