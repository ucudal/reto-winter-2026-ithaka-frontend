import React, { useState } from 'react';
import { 
  Drawer, 
  Avatar, 
  IconButton, 
  Box, 
  Typography, 
  Button, 
  TextField 
} from '@mui/material';

import { userData } from './userData';

export default function UserProfileDrawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <Box sx={{ p: 2 }}>
      <IconButton onClick={toggleDrawer(true)} sx={{ p: 0 }}>
        <Avatar 
          alt={userData.name} 
          src={userData.avatarUrl} 
          sx={{ width: 48, height: 48, cursor: 'pointer' }}
        />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
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
          <Typography variant="h6" component="h2" fontWeight="bold" mb={3}>
            Mi Perfil
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Avatar 
              alt={userData.name} 
              src={userData.avatarUrl} 
              sx={{ width: 64, height: 64 }}
            />
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '1.1rem' }}>
                {userData.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
              alt={userData.role}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="Correo electrónico"
              value={userData.email}
              variant="standard"
              fullWidth
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Contraseña"
              value={userData.password}
              type="password"
              variant="standard"
              fullWidth
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Teléfono"
              value={userData.tel}
              variant="standard"
              fullWidth
              InputProps={{ readOnly: true }}
            />

            <TextField
              label="Linkedin"
              value={userData.linkedin}
              variant="standard"
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
          <Button 
            variant="text" 
            onClick={toggleDrawer(false)}
            sx={{ color: '#1976d2', fontWeight: 'bold' }}
          >
            CERRAR
          </Button>
          <Button 
            variant="contained" 
            disableElevation
            sx={{ borderRadius: 1, textTransform: 'uppercase', px: 3 }}
          >
            EDITAR
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}