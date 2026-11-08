import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const display = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

export const metadata: Metadata = {
  title: "Calle Café | Menu",
  description: "The Calle Café food and drinks menu.",
  icons: { icon: "/images/branding/calle-logo.webp" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
