import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SkipLink } from "@/components/layout/SkipLink";
import { MuiProvider } from "@/components/layout/MuiProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Neopse",
    template: "%s | Neopse",
  },
  description: "Plateforme de gestion collaborative pour les collectivités.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}