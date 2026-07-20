import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import CircularProgress from '@mui/material/CircularProgress'

function LoadingStateComponent() { 
    return (
        <Stack spacing={5} sx={{ alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
            <CircularProgress size={100} aria-label="Cargando..."/>
            <Typography variant="h4" sx={{ mt: 2 }}>Cargando...</Typography>
        </Stack>
    )
}

export default LoadingStateComponent