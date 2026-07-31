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
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile, changeMyPassword } from '../../api/endpoints/users';

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (currentTab === 1) {
      if (newPassword !== confirmPassword) {
        setErrorMessage('La confirmación no coincide con la nueva contraseña.');
        return;
      }
      try {
        setSaving(true);
        await changeMyPassword({
          current_password: currentPassword,
          new_password: newPassword,
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('Contraseña actualizada exitosamente.');
      } catch (err) {
        setErrorMessage(err?.response?.data?.detail || err?.message || 'No se pudo cambiar la contraseña.');
      } finally {
        setSaving(false);
      }
      return;
    }

    if (currentTab !== 0) {
      setSuccessMessage('¡Cambios guardados exitosamente!');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateMyProfile({ name, email });
      updateUser({ name: updated.name, email: updated.email });
      setSuccessMessage('¡Cambios guardados exitosamente!');
    } catch (err) {
      setErrorMessage(err?.response?.data?.detail || err?.message || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
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

      {errorMessage && (
        <Alert severity="error" sx={{ width: '100%' }}>
          {errorMessage}
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
              <TextField
                label="Nombre Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              <TextField
                label="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                size="small"
              />
              <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </>
          )}

          {currentTab === 1 && (
            <>
              <Typography variant="h6" fontWeight="600">Cambiar Contraseña</Typography>
              <TextField
                label="Contraseña Actual"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                label="Nueva Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Mínimo 8 caracteres"
                inputProps={{ minLength: 8 }}
              />
              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" variant="contained" disabled={saving} sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                {saving ? 'Actualizando...' : 'Actualizar Contraseña'}
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
