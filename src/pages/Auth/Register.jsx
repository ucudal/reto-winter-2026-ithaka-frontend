import { Box, Button, Typography, TextField, Paper, Alert } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/logo.png'
import { registerUser } from '../../api/endpoints/auth'
import { useAuth } from '../../AuthContext'
import { useToast } from '../../ToastContext'
import './Register.css'

const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: 'action.hover',
  },
  '& .MuiOutlinedInput-input': {
    color: 'text.primary',
  },
  '& .MuiOutlinedInput-input:-webkit-autofill': {
    WebkitTextFillColor: (theme) => theme.palette.text.primary,
    WebkitBoxShadow: (theme) =>
      `0 0 0 1000px ${theme.palette.background.paper} inset`,
    transition: 'background-color 5000s ease-in-out 0s',
  },
}

function Register() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { login: setAuthContext } = useAuth()
  const { showToast } = useToast()
  
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'name' && /\d/.test(value)) return 

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }))
    setSubmitError('')
  }

  const validateForm = () => {
    const newErrors = {}
    const fullNamePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/ 
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 

    if (!fullNamePattern.test(formValues.name.trim())) {
      newErrors.name = 'Debes ingresar un nombre completo válido.'
    }
    if (!emailPattern.test(formValues.email.trim())) {
      newErrors.email = 'Debes ingresar un correo electrónico válido.'
    }
    if (formValues.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSubmitError('')

    try {
      const data = await registerUser(
        formValues.name.trim(),
        formValues.email.trim(),
        formValues.password,
        'Student'
      )

      if (data?.token && data?.user) {
        setAuthContext(data.token, data.user)
        showToast('¡Cuenta creada e inicio de sesión exitoso!', 'success')
        
        const targetRoute = data.user.role === 'Student' ? '/workspace' : '/dashboard'
        navigate(targetRoute, { replace: true })
      } else {
        navigate('/login')
      }
    } catch (err) {
      const msg = err?.message || 'Error al registrar el usuario'
      setSubmitError(msg)
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box className="login-container">
      <Paper
        component="form"
        onSubmit={handleSubmit}
        noValidate
        className="login-card"
        elevation={5}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(19, 27, 44, 0.92)'
              : 'rgba(255, 255, 255, 0.96)',
          border: '1px solid',
          borderColor: 'divider',
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
          Crear una cuenta
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {submitError}
          </Alert>
        )}

        <TextField
          name="name"
          label="Nombre completo"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          sx={inputSx}
          disabled={loading}
        />

        <TextField
          name="email"
          label="Correo electrónico"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          sx={inputSx}
          disabled={loading}
        />

        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          sx={inputSx}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="login-button"
          disabled={loading}
        >
          {loading ? 'REGISTRANDO...' : 'CONTINUAR'}
        </Button>

        <Typography variant="body2" align="center" className="login-register">
          ¿Ya tienes una cuenta?{' '}
          <Link
            to="/login"
            className="login-register-link"
            style={{ color: theme.palette.secondary.main }}
          >
            Iniciar sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Register
