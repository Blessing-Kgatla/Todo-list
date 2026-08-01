import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getSettings } from "@/lib/data";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todo",
  description: "A simple task manager",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en" data-theme={settings.theme}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}