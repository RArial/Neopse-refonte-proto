"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/lib/theme";

interface MuiProviderProps {
  children: React.ReactNode;
}

export function MuiProvider({ children }: MuiProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline normalise les styles de base */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
