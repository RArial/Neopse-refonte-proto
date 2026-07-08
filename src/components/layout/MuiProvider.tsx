"use client";

import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { theme, darkTheme } from "@/lib/theme";

interface MuiProviderProps {
  children: React.ReactNode;
}

function readStoredMode(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return localStorage.getItem("neopse:theme") === "dark" ? "dark" : "light";
}

export function MuiProvider({ children }: MuiProviderProps) {
  // Le panneau de personnalisation (Tweaks) bascule le thème en posant l'attribut
  // data-theme sur <html>, hors de React : on observe cet attribut pour garder le
  // thème MUI synchronisé avec le reste de l'interface (Sidebar, Topbar en CSS brut).
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Lecture initiale d'un système externe (localStorage) indisponible côté serveur :
    // ne peut pas être déplacée dans le rendu sans provoquer une désynchronisation SSR/CSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(readStoredMode());

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setMode(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={mode === "dark" ? darkTheme : theme}>
        {/* CssBaseline normalise les styles de base */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}