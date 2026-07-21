import { Box, Typography, Button, Stack } from "@mui/material";
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
        py: 6,
        textAlign: "center",
      }}
    >
      <Typography variant="h6">Algo salió mal en esta sección</Typography>
      <Typography variant="body2" color="text.secondary">
        {error?.message || "Ocurrió un error inesperado."}
      </Typography>
      <Stack direction="row" spacing={2}>
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
          Ir al dashboard
        </Button>
      </Stack>
    </Box>
  );
}

export default RouteErrorBoundary;
