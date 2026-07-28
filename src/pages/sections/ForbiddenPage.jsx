import { Box, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getHomePathForRole } from "../../routes/roleHome";

function ForbiddenPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f8f9fa",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          maxWidth: 500,
          p: 5,
        }}
      >
        <LockOutlinedIcon
          sx={{
            fontSize: 90,
            color: "error.main",
            mb: 2,
          }}
        />

        <Typography variant="h2" fontWeight="bold">
          403
        </Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>
          Acceso denegado
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 2, mb: 4 }}>
          No tienes permisos para acceder a esta página.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate(getHomePathForRole(user?.role))}
        >
          Volver al inicio
        </Button>
      </Box>
    </Box>
  );
}

export default ForbiddenPage;
