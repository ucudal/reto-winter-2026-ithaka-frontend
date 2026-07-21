import { Box, Typography, Button, Stack } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetErrorBoundary();
    navigate("/");
  };

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
          onClick={resetErrorBoundary}
        >
          Reintentar
        </Button>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          onClick={handleGoHome}
        >
          Ir al dashboard
        </Button>
      </Stack>
    </Box>
  );
}

export default ErrorFallback;
