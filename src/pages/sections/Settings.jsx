import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';

export default function Settings() {
  const [currentTab, setCurrentTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSuccessMessage('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSuccessMessage('¡Cambios guardados exitosamente!');
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        Configuración de la Cuenta
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      )}

      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Información Personal" />
          <Tab label="Seguridad" />
          <Tab label="Preferencias Visuales" />
        </Tabs>

        <Box component="form" onSubmit={handleSave} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {currentTab === 0 && (
            <>
              <Typography variant="h6" fontWeight="600">Información Personal</Typography>
              <TextField label="Nombre Completo" defaultValue="Luca" variant="outlined" fullWidth size="small" />
              <TextField label="Correo Electrónico" defaultValue="luca@example.com" variant="outlined" fullWidth size="small" />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                Guardar Cambios
              </Button>
            </>
          )}

          {currentTab === 1 && (
            <>
              <Typography variant="h6" fontWeight="600">Cambiar Contraseña</Typography>
              <TextField label="Contraseña Actual" type="password" variant="outlined" fullWidth size="small" />
              <TextField label="Nueva Contraseña" type="password" variant="outlined" fullWidth size="small" />
              <TextField label="Confirmar Nueva Contraseña" type="password" variant="outlined" fullWidth size="small" />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                Actualizar Contraseña
              </Button>
            </>
          )}

          {currentTab === 2 && (
            <>
              <Typography variant="h6" fontWeight="600">Preferencias Visuales</Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Activar Modo Oscuro / Tema del Sistema"
              />
              <Divider />
              <FormControlLabel
                control={<Switch />}
                label="Recibir Notificaciones por Correo"
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                Guardar Preferencias
              </Button>
            </>
          )}

        </Box>
      </Paper>
    </Box>
  );
}
