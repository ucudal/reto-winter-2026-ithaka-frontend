import { Box, Typography, Button, Stack } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useRouteError } from "react-router-dom";

function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 8,
        textAlign: "center",
      }}
    >
      <ErrorIcon
        sx={{
          fontSize: 56,
          color: "error.main",
        }}
      />

      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Algo salió mal
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 420 }}>
        Ocurrió un problema al procesar esta sección. Podés intentar de nuevo o
        volver al resumen.
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => window.location.reload()}
        >
          Reintentar
        </Button>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={() => navigate("/dashboard")}
        >
          Ir al resumen
        </Button>
      </Stack>
    </Box>
  );
}

export default RouteErrorBoundary;
