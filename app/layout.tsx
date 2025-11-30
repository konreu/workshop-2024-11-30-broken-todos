import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "A simple todo application for tracking tasks",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 antialiased`}
      >
        <main className="mx-auto w-full max-w-2xl px-4 py-8 md:py-16">{children}</main>
      </body>
    </html>
  );
}
