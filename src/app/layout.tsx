import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenAuto - AI Car Diagnostics",
  description: "Diagnose your car problems with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
