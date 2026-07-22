import { createTheme } from "@mui/material/styles";
import { lightPalette, darkPalette } from "./palette";

export function getAppTheme(mode) {
  const palette = mode === "dark" ? darkPalette : lightPalette;

  return createTheme({
    palette,
    shape: {
      borderRadius: 10,
    },
    typography: {
      h4: {
        fontWeight: 600,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "html, body, #root": {
            transition: "background-color 0.25s ease, color 0.25s ease",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            transition: "background-color 0.25s ease, border-color 0.25s ease",
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            transition: "background-color 0.25s ease, border-color 0.25s ease",
            borderRight: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: "background-color 0.25s ease, box-shadow 0.25s ease",
          },
        },
      },
    },
  });
}