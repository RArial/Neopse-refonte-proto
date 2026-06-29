"use client";

import { createTheme } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";

// Tokens centralisés Neopse
// Modifier ici pour propager sur tous les composants MUI
const BRAND = {
  primary: "#1E3A5F",    // Navy Neopse
  secondary: "#F5A623",  // Amber Neopse
  error: "#D32F2F",
  warning: "#ED6C02",
  success: "#2E7D32",
  info: "#0288D1",
} as const;

export const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: {
        main: BRAND.primary,
        contrastText: "#ffffff",
      },
      secondary: {
        main: BRAND.secondary,
        contrastText: "#ffffff",
      },
      error: { main: BRAND.error },
      warning: { main: BRAND.warning },
      success: { main: BRAND.success },
      info: { main: BRAND.info },
      background: {
        default: "#F8F9FA",
        paper: "#FFFFFF",
      },
    },
    typography: {
      fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      fontSize: 16,
      body1: { lineHeight: 1.6 },
      body2: { lineHeight: 1.6 },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButtonBase: {
        defaultProps: {
          // Accessibilité : focus visible systématique
          disableRipple: false,
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            minHeight: 44, // touch target WCAG 2.2
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: 44,  // touch target
            minHeight: 44,
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          // Labels toujours visibles — accessibilité formulaires
          root: { fontWeight: 500 },
        },
      },
    },
  },
  frFR // locale française pour les composants MUI
);

export const darkTheme = createTheme(
  {
    ...theme,
    palette: {
      ...theme.palette,
      mode: "dark",
      background: {
        default: "#111827",
        paper: "#1F2937",
      },
    },
  },
  frFR
);
