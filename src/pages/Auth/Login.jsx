import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/endpoints/auth";
import { getHomePathForRole } from "../../routes/roleHome";
import "./Login.css";
import logo from "../../assets/img/logo.png";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "action.hover",
  },
  "& .MuiOutlinedInput-input": {
    color: "text.primary",
  },
  "& .MuiOutlinedInput-input:-webkit-autofill": {
    WebkitTextFillColor: (theme) => theme.palette.text.primary,
    WebkitBoxShadow: (theme) =>
      `0 0 0 1000px ${theme.palette.background.paper} inset`,
    transition: "background-color 5000s ease-in-out 0s",
  },
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};

    if (!email) {
      e.email = "Please enter your email";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      e.email = "Invalid email";
    }

    if (!password) {
      e.password = "Please enter your password";
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
      navigate(getHomePathForRole(data.user?.role));
    } catch (err) {
      setLoginError(err?.message || "Incorrect email or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="login-container">
      <Paper
        className="login-card"
        elevation={5}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(19, 27, 44, 0.92)"
              : "rgba(255, 255, 255, 0.96)",
          border: "1px solid",
          borderColor: "divider",
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
          Sign in
        </Typography>

        {loginError && (
          <Alert severity="error" className="login-alert">
            {loginError}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            disabled={submitting}
            sx={inputSx}
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
            disabled={submitting}
            sx={inputSx}
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="login-button"
            disabled={submitting}
          >
            {submitting ? "Loading..." : "CONTINUE"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
