import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export default function ToastNotification({ open, message, severity, handleClose }) {
  const onCloseHandler = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    if (handleClose) {
      handleClose(event, reason);
    }
  };

  return (
    <Snackbar 
      open={open} 
      autoHideDuration={4000} 
      onClose={onCloseHandler}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
    >
      <Alert 
        onClose={onCloseHandler} 
        severity={severity} 
        variant="filled" 
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
