import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BahisTahmin - Futbol Tahminleri",
  description: "Günlük futbol bahis tahminleri, maç oranları ve istatistikler",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
