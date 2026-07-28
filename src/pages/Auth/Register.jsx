import { Box, Button, Typography, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Link } from 'react-router-dom'
import logo from '../../assets/img/logo.png'
import './Register.css'

function Register() {
  const theme = useTheme()

  return (
    <Box className="login-container">
      <Paper
        elevation={5}
        className="login-card"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(19, 27, 44, 0.92)'
              : 'rgba(255, 255, 255, 0.96)',
          border: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <div className="login-logo-wrap">
          <img src={logo} alt="ITHAKA" className="login-logo" />
        </div>

        <Typography
          variant="h5"
          className="login-title"
          style={{ color: theme.palette.text.primary }}
        >
          Coming Soon
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', my: 2 }}>
          User self-registration is disabled. New accounts are managed exclusively by system coordinators.
        </Typography>

        <Button
          component={Link}
          to="/login"
          variant="contained"
          fullWidth
          className="login-button"
        >
          BACK TO LOGIN
        </Button>

        <Typography variant="body2" align="center" className="login-register">
          Already have an account?{' '}
          <Link
            to="/login"
            className="login-register-link"
            style={{ color: theme.palette.secondary.main }}
          >
            Log in
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Register
