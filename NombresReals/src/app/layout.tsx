import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SiteShell } from "@/components/site-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "La recta numèrica · Fraccions i irracionals amb Tales i Pitàgores",
  description:
    "Pàgina educativa interactiva: aprèn a representar nombres fraccionaris (4/7) amb el teorema de Tales i nombres irracionals (√2, √5) amb el teorema de Pitàgores, el compàs i el regle.",
  keywords: [
    "recta numèrica",
    "fraccions",
    "nombres irracionals",
    "teorema de Tales",
    "teorema de Pitàgores",
    "arrel quadrada",
    "matemàtiques",
    "compàs",
    "regle",
  ],
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon2.svg`, shortcut: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon2.svg` },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased bg-background text-foreground`}
      >
        <SiteShell>{children}</SiteShell>
        <Toaster />
      </body>
    </html>
  );
}
