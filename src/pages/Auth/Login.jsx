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
import { loginUser } from "../../api/endpoints/auth";
import "./Login.css";
import logo from "../../assets/img/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);
      setLoginError("");
      const data = await loginUser(email, password);
      login(data.token, data.user);
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err?.message || "Usuario o contraseña incorrectos");
    } finally {
      setSubmitting(false);
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
            disabled={submitting}
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
            disabled={submitting}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="login-button"
            disabled={submitting}
          >
            {submitting ? "Cargando..." : "CONTINUAR"}
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
