import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Galvão Motors — Seminovos",
  description: "Seu próximo carro, sem complicação. Escolha o veículo no site e finalize direto no WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
