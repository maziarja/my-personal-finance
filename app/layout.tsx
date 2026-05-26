import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProviders } from "@/lib/QueryProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Personal Finance",
  description: "Personal finance tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
