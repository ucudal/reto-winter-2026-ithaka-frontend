import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import {Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";
import logo from "../../assets/logo.png";

const USER = {
  email: "user@gmail.com",
  password: "123456",
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const validate = () => {
    const e = {};

    if (!email) {
      e.email = "Ingrese su email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      e.email = "Email inválido";
    }

    if (!password) {
      e.password = "Ingrese la contraseña";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (!validate()) return;

    if (email === USER.email && password === USER.password) {
      login();
      navigate("/dashboard");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Box className="login-container">
      <Paper className="login-card" elevation={5}>
        <img src={logo} alt="ITHAKA" className="login-logo" />

        <Typography variant="h5" mb={3}>
          Iniciar sesión
        </Typography>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Usuario"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            fullWidth
            type="password"
            label="Contraseña"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 2,
              height: 45,
            }}
          >
            CONTINUAR
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            <Link
              to="/register"
              style={{
                textDecoration: "underline",
                color: "#1976d2",
              }}
            >
              Registrarse
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
