import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colorful LP Builder",
  description: "AI-Driven Landing Page Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
