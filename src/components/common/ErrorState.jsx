import { Alert, AlertTitle, Box, Button } from '@mui/material'

function ErrorState({
  title = 'Ocurrio un error',
  message = 'No pudimos cargar la informacion. Intenta nuevamente.',
  onRetry,
}) {
  return (
    <Box sx={{ py: 4 }}>
      <Alert
        severity="error"
        action={
          onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Reintentar
            </Button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  )
}

export default ErrorState
