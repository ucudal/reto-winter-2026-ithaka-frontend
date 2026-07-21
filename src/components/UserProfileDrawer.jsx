import React from 'react';
import { Drawer, Avatar, Box, Typography, Button,Divider} from '@mui/material';
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
          width: 360,
          height: '100vh',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflowY: 'auto', pr: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
          Mi Perfil
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mb={2.5}>
          <Avatar 
            alt={user.name} 
            src={user.avatarUrl} 
            sx={{ width: 64, height: 64 }} 
          />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem', lineHeight: 1.2 }}>
              {user.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {ROLE_LABELS[user.role] || user.role}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#f0f0f0' }} />

        <ProfileDetails user={user} />
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} pt={2} sx={{ backgroundColor: '#fff' }}>
        <Button 
          variant="text" 
          onClick={onClose} 
          sx={{ fontWeight: 'bold', color: '#1976d2' }}
        >
          CERRAR
        </Button>
        <Button 
          variant="contained" 
          disableElevation
          sx={{ textTransform: 'uppercase', px: 3, borderRadius: 1 }}
        >
          EDITAR
        </Button>
      </Box>
    </Drawer>
  );
}