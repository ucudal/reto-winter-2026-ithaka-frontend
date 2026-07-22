import { Box, Button, Typography, TextField, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/logo.png'
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
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

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

  const handleSubmit = (event) => {
    event.preventDefault()

    if (validateForm()) {
      navigate('/login')
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

        <TextField
          name="name"
          label="Nombre"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formValues.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name}
          sx={inputSx}
        />

        <TextField
          name="email"
          label="Usuario"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={formValues.email}
          onChange={handleChange}
          error={Boolean(errors.email)}
          helperText={errors.email}
          sx={inputSx}
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
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          className="login-button"
          style={{ color: '#FFFFFF' }}
        >
          CONTINUAR
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
