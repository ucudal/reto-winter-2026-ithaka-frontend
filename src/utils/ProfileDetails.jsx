import React from 'react';
import { Box, Typography } from '@mui/material';

function ProfileField({ label, value }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.primary" fontWeight={500}>
        {value || '-'}
      </Typography>
    </Box>
  );
}

export default function ProfileDetails({ user }) {
  if (!user) return null;

  return (
    <Box>
      <ProfileField label="Correo electrónico" value={user.email} />

      {user.password && <ProfileField label="Contraseña" value={user.password} />}
      {user.tel && <ProfileField label="Teléfono" value={user.tel} />}
      {user.linkedin && <ProfileField label="Linkedin" value={user.linkedin} />}

      {user.role === 'Student' && (
        <>
          <ProfileField label="Carrera" value={user.major} />
          <ProfileField label="Grupo asignado" value={user.groupName} />
        </>
      )}

      {(user.role === 'BusinessTutor' || user.role === 'TechnicalTutor') && (
        <>
          <ProfileField label="Especialidad" value={user.specialty} />
          <ProfileField label="Disponibilidad" value={user.availability} />
        </>
      )}
    </Box>
  );
}