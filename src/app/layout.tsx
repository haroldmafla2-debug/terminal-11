import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Portal Web Escolar",
  description: "Plataforma académica y administrativa para [COLEGIO]",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
