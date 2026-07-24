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
    setSuccessMessage('Changes saved successfully!');
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h4" fontWeight="bold" color="text.primary">
        Account Settings
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
          <Tab label="Personal Information" />
          <Tab label="Security" />
          <Tab label="Visual Preferences" />
        </Tabs>

        <Box component="form" onSubmit={handleSave} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          
          {currentTab === 0 && (
            <>
              <Typography variant="h6" fontWeight="600">Personal Information</Typography>
              <TextField label="Full Name" defaultValue="Luca" variant="outlined" fullWidth size="small" />
              <TextField label="Email Address" defaultValue="luca@example.com" variant="outlined" fullWidth size="small" />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                Save Changes
              </Button>
            </>
          )}

          {currentTab === 1 && (
            <>
              <Typography variant="h6" fontWeight="600">Change Password</Typography>
              <TextField label="Current Password" type="password" variant="outlined" fullWidth size="small" />
              <TextField label="New Password" type="password" variant="outlined" fullWidth size="small" />
              <TextField label="Confirm New Password" type="password" variant="outlined" fullWidth size="small" />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                Update Password
              </Button>
            </>
          )}

          {currentTab === 2 && (
            <>
              <Typography variant="h6" fontWeight="600">Visual Preferences</Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Dark Mode / System Theme"
              />
              <Divider />
              <FormControlLabel
                control={<Switch />}
                label="Receive Email Notifications"
              />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start', textTransform: 'none' }}>
                Save Preferences
              </Button>
            </>
          )}

        </Box>
      </Paper>
    </Box>
  );
}
