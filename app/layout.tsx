import type { Metadata } from "next";
import { montserrat, conso } from "./fonts";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import SmoothScroll from "../components/SmoothScroll";
import "lenis/dist/lenis.css";
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
      <body>
        <SmoothScroll>
          <SiteNav />
          {children}
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
