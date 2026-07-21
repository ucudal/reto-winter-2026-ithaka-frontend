import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import notFoundImg from "../../assets/img/NotFoundTroy.png";

function NotFoundPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: "center",
        justifyContent: "center",
        gap: { xs: 3, sm: 6 },
        minHeight: "100vh",
        px: 4,
        textAlign: isMobile ? "center" : "left",
      }}
    >
      <Box sx={{ maxWidth: 480 }}>
        <Typography variant="h2" color="text.secondary">
          Error 404
        </Typography>
        <Typography variant="h4" sx={{ mt: 1 }}>
          Página no encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          No pudimos encontrar la página que estás buscando.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{ mt: 3 }}
        >
          Volver al inicio
        </Button>
      </Box>

      <Box
        component="img"
        src={notFoundImg}
        alt="Ilustración del caballo de Troya roto en pedazos"
        sx={{ width: "100%", maxWidth: 420 }}
      />
    </Box>
  );
}

export default NotFoundPage;
