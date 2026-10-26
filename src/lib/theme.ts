"use client";

import { createTheme, type PaletteColor, type Theme, type ThemeOptions } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";

declare module "@mui/material/styles" {
  interface Palette {
    primaryStrong: PaletteColor;
  }
  interface PaletteOptions {
    primaryStrong?: PaletteColor;
  }
}

// ─────────────────────────────────────────────────────────────
// Primitives de marque Neopse (échelles brutes, issues de Figma)
// ─────────────────────────────────────────────────────────────
const teal = {
  50: "#f1fdff", 100: "#effcff", 200: "#c4eef7", 300: "#9bd7e3", 400: "#6ebdcc",
  500: "#47a5b6", 600: "#298c9d", 700: "#0f707f", 800: "#005561", 900: "#003b44",
};
const blue = {
  50: "#eaeef4", 100: "#dfe4ee", 200: "#c9d0df", 300: "#acb7cb", 400: "#8e9bb4",
  500: "#75839e", 600: "#5e6b85", 700: "#465269", 800: "#303a4d", 900: "#182339",
};
const neutral = {
  0: "#ffffff", 50: "#f8faff", 100: "#f1f3f9", 200: "#e5e8ed", 300: "#d8dbe0",
  400: "#c4c7cd", 500: "#a1a5ac", 600: "#7c8088", 700: "#60636a", 800: "#44484e", 900: "#1f2228",
};

// Tokens centralisés Neopse — modifier ici pour propager sur tous les composants MUI
const BRAND = {
  primary: teal[500],     // teal Neopse #47a5b6
  secondary: blue[900],   // bleu nuit Neopse #182339
  error: "#d32f2f",       // red.500
  warning: "#ed9c00",     // amber.500
  success: "#2e7d5b",     // green.500
  info: teal[500],        // teal (feedback.info)
} as const;

// Variante contrastée du primaire : texte blanc sur teal[500] = 2,87:1, sous le seuil RGAA.
// Utilisée pour l'instant dans la seule médiathèque ; la bascule globale de `primary` reste à décider.
const PRIMARY_STRONG_LIGHT: PaletteColor = {
  main: "#00696b", // 6,5:1 avec du blanc
  dark: teal[800],
  light: teal[200],
  contrastText: "#ffffff",
};
// En sombre, #00696b sur le fond papier tombe à ~2,3:1 : on inverse (teal clair, texte foncé).
const PRIMARY_STRONG_DARK: PaletteColor = {
  main: teal[300],
  dark: teal[400],
  light: teal[200],
  contrastText: blue[900],
};

// Options partagées entre le thème clair et le thème sombre — seule la palette diffère.
const baseOptions: Omit<ThemeOptions, "palette"> = {
  typography: {
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    fontSize: 14,
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
          minWidth: 44, // touch target
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
};

export const theme = createTheme(
  {
    ...baseOptions,
    palette: {
      mode: "light",
      primary: {
        main: BRAND.primary,
        dark: teal[700],
        light: teal[300],
        contrastText: "#ffffff",
      },
      secondary: {
        main: BRAND.secondary,
        dark: blue[900],
        light: blue[700],
        contrastText: "#ffffff",
      },
      error: { main: BRAND.error },
      warning: { main: BRAND.warning },
      success: { main: BRAND.success },
      info: { main: BRAND.info },
      background: {
        default: "#f6fbfa", // surface "app" Neopse
        paper: "#ffffff",
      },
      primaryStrong: PRIMARY_STRONG_LIGHT,
      grey: neutral,
      divider: "rgba(0, 0, 0, 0.12)",
    },
  },
  frFR // locale française pour les composants MUI
);

// Thème sombre — recréé depuis les options brutes (et non depuis `theme` déjà résolu) pour que
// MUI dérive correctement les couleurs de texte, la divider et les états `action.*` propres au mode sombre.
export const darkTheme = createTheme(
  {
    ...baseOptions,
    palette: {
      mode: "dark",
      primary: {
        main: BRAND.primary,
        dark: teal[700],
        light: teal[300],
        contrastText: "#ffffff",
      },
      secondary: {
        main: BRAND.secondary,
        dark: blue[900],
        light: blue[700],
        contrastText: "#ffffff",
      },
      error: { main: BRAND.error },
      warning: { main: BRAND.warning },
      success: { main: BRAND.success },
      info: { main: BRAND.info },
      background: {
        default: "#111827",
        paper: "#1f2937",
      },
      primaryStrong: PRIMARY_STRONG_DARK,
      grey: neutral,
    },
  },
  frFR
);

// À passer à un ThemeProvider imbriqué : les composants MUI du sous-arbre (boutons, radios,
// curseurs, focus) prennent la variante contrastée sans surcharge composant par composant.
export function withStrongPrimary(outer: Theme): Theme {
  return { ...outer, palette: { ...outer.palette, primary: outer.palette.primaryStrong } };
}
