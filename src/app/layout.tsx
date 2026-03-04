import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import InteractiveBackground from "@/components/InteractiveBackground";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Louai Soufi — AI Engineer & Full-Stack Developer",
  description:
    "Building intelligent systems from machine learning models to scalable full-stack applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
