import { Alert, AlertTitle, Box, Button } from '@mui/material'

/**
 * Estado de error reutilizable: mensaje + boton de reintentar.
 * Pensado para usarse cuando falla el fetch de un listado o un detalle.
 *
 * @param {Object} props
 * @param {string} [props.title='Ocurrio un error']
 * @param {string} [props.message='No pudimos cargar la informacion. Intenta nuevamente.']
 * @param {() => void} [props.onRetry] - Si no se pasa, no se muestra el boton de reintentar
 */
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