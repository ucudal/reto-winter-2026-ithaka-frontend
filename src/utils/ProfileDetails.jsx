import React from 'react';
import { TextField, Box, Chip } from '@mui/material';

export default function ProfileDetails({ user }) {
  if (!user) return null;

  return (
    <Box display="flex" flexDirection="column" gap={2.5}>
      {/* Campos comunes */}
      <TextField
        label="Correo electrónico"
        value={user.email || ''}
        variant="standard"
        fullWidth
        InputProps={{ readOnly: true }}
      />

      {/* Campos para ESTUDIANTES testing*/}
      {user.role === 'Student' && (
        <>
          <TextField
            label="Carrera"
            value={user.major || 'No especificada'}
            variant="standard"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Grupo asignado"
            value={user.groupName || 'Sin grupo'}
            variant="standard"
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </>
      )}

      {/* Campos para TUTORES */}
      {(user.role === 'BusinessTutor' || user.role === 'TechnicalTutor') && (
        <>
          <TextField
            label="Especialidad"
            value={user.specialty || 'General'}
            variant="standard"
            fullWidth
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Disponibilidad"
            value={user.availability || 'A coordinar'}
            variant="standard"
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </>
      )}

      {/* Detalle para COORDINADOR */}
      {user.role === 'Coordinator' && (
        <Box mt={1}>
          <Chip label="Administrador del Sistema" color="primary" variant="outlined" />
        </Box>
      )}
    </Box>
  );
}