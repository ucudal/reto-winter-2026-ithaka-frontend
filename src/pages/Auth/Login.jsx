import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";
import logo from "../../assets/img/logo.png";

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

    if (password === "123456") {
      let role = "Coordinator";
      let name = "Carlos Rodríguez";

      if (email === "tutor@gmail.com") {
        role = "BusinessTutor";
        name = "María Pérez";
      } else if (email === "student@gmail.com") {
        role = "Student";
        name = "Juan Pérez";
      }

      login({
        id: role === "Coordinator" ? 1 : role === "Student" ? 101 : 8,
        name,
        email,
        role,
      });
      navigate("/dashboard");
    } else {
      setLoginError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <Box className="login-container">
      <Paper className="login-card" elevation={5}>
        <div className="login-logo-wrap">
          <img src={logo} alt="ITHAKA" className="login-logo" />
        </div>

        <Typography variant="h5" className="login-title">
          Iniciar sesión
        </Typography>

        {loginError && (
          <Alert severity="error" className="login-alert">
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
            className="login-button"
          >
            CONTINUAR
          </Button>
          <Typography
            variant="body2"
            align="center"
            className="login-register"
          >
            <Link
              to="/register"
              className="login-register-link"
            >
              Registrarse
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
}
