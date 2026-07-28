import type { Metadata } from "next";
import { montserrat, conso } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "OENOFY — From Quiet Cellar To Private Hands",
  description:
    "OENOFY is a private wine concierge working with a limited number of clients on collections, private events and collector objects conceived around wine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${conso.variable}`}>
      <body>{children}</body>
    </html>
  );
}
