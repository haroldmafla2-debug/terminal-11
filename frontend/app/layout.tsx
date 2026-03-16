import "./globals.css";
import React from "react";

export const metadata = {
  title: "Profe Harold Mafla",
  description: "MVP terminal/IDE Python para colegio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

