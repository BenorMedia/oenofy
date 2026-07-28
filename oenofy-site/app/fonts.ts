import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

export const conso = localFont({
  src: "./fonts/Conso-Regular.ttf",
  weight: "400",
  style: "normal",
  variable: "--font-conso",
  display: "swap",
});
