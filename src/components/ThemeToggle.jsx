import { keyframes } from "@emotion/react";
import { IconButton, Tooltip } from "@mui/material";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import { useThemeMode } from "../context/ThemeContext";

const spinIn = keyframes`
  from { opacity: 0; transform: rotate(-90deg) scale(0.5); }
  to { opacity: 1; transform: rotate(0deg) scale(1); }
`;

function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Tooltip title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
      <IconButton
        onClick={toggleMode}
        color="inherit"
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        sx={{
          transition: "transform 0.3s ease",
          "&:hover": { transform: "rotate(15deg)" },
        }}
      >
        {isDark ? (
          <DarkModeRoundedIcon sx={{ animation: `${spinIn} 0.35s ease` }} />
        ) : (
          <LightModeRoundedIcon sx={{ animation: `${spinIn} 0.35s ease` }} />
        )}
      </IconButton>
    </Tooltip>
  );
}

export default ThemeToggle;