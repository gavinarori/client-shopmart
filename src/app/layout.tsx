import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "sonner"
import { ThemeProvider } from "./theme-provider"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kicksvaultke - Your Ultimate Sneaker Destination",
  description: "We don't just sell shoes — we deliver quality, style & trust to every doorstep. Pay on delivery | Nairobi same-day delivery. Tap in. Rock with us. Be the vault.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <Providers>  
      <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Navbar/>
     
          {children}
          <Toaster position="top-right" />
    </ThemeProvider>
    </Providers>
      </body>
    </html>
  );
}
