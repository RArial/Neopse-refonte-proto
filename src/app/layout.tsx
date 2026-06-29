import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SkipLink } from "@/components/layout/SkipLink";
import { MuiProvider } from "@/components/layout/MuiProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SkipLink />
        <MuiProvider>
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
