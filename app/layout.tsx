import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zahav Meeting OS",
  description: "Da reunião à implantação, com IA.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
