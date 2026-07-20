import { Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = () => {
    login();
    navigate("/dashboard");
  };

  return (
    <Box>
      <Typography variant="h4">Login</Typography>
      <Button variant="contained" onClick={handleDemoLogin} sx={{ mt: 2 }}>
        Iniciar sesión (demo)
      </Button>
    </Box>
  )
}

export default Login
