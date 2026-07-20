import { Box } from '@mui/material'
import loginBackground from '../../assets/login-background.jpg'
import ithakaLogo from '../../assets/ithaka-ucu.png'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

function Register() {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#56B4EB',
        backgroundImage: `linear-gradient(rgba(86, 180, 235, 0.88), rgba(86, 180, 235, 0.88)), url(${loginBackground})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <Box
        component="section"
        sx={{
          width: '100%',
          maxWidth: 460,
          minHeight: 100,
          backgroundColor: '#FFFFFF',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.18)',
          p: { xs: 3, sm: 5 },
        }}
      >
        <Box
          component="img"
          src={ithakaLogo}
          alt="Ithaka UCU"
          sx={{
            display: 'block',
            width: 250,
            maxWidth: '70%',
            height: 'auto',
            mx: 'auto',
            mb: 3,
          }}
        />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Crear una cuenta
        </Typography>
        <TextField
          label="Nombre"
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Usuario"
          variant="outlined"
          fullWidth
          margin="normal"
        />
        
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
        />
        <Button variant="contained" sx={{ mt: 2, height: 45}} fullWidth>
          Continuar
        </Button>

        <Typography variant="body2" sx={{ mt: 3 }} fontSize={14} textAlign="center" color="text.secondary">
          ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
        </Typography>
        
      </Box>
    </Box>
  )
}

export default Register
