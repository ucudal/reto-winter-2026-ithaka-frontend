import { Box, Button, Typography, TextField, Paper } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/img/logo.png'
import './Register.css'

function Register() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'name' && /\d/.test(value)) return // Validación para que el campo de nombre no acepte números

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
    const fullNamePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/ // Validación para que el nombre completo tenga al menos dos palabras y no contenga números
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Validación para correo electrónico

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
      >
        <div className="login-logo-wrap">
          <img src={logo} alt="ITHAKA" className="login-logo" />
        </div>

        <Typography variant="h5" className="login-title">
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
        />

        <Button type="submit" variant="contained" fullWidth className="login-button">
          CONTINUAR
        </Button>

        <Typography variant="body2" align="center" className="login-register">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="login-register-link">
            Iniciar sesión
          </Link>
        </Typography>
      </Paper>
    </Box>
  )
}

export default Register
