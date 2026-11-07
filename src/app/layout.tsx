import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calle Café | Menu",
  description: "The Calle Café food and drinks menu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
