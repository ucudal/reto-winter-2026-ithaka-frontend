import { Box } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginBackground from '../../assets/login-background.jpg'
import ithakaLogo from '../../assets/ithaka-ucu.png'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'


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
        backgroundRepeat: 'no-repeat',/*  */
        backgroundSize: 'cover',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
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
        <Button type="submit" variant="contained" sx={{ mt: 2, height: 45}} fullWidth>
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
