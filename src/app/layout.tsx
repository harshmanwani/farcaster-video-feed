import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import AppHeader from "@/components/AppHeader";

export const metadata: Metadata = {
  title: "Farcaster Video Feed",
  description: "TikTok-style vertical video feed for Farcaster",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://imagedelivery.net" />
        <link rel="dns-prefetch" href="https://imagedelivery.net" />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system" storageKey="fartok-theme">
          <Providers>
            <SidebarProvider>
              <AppSidebar />
              <AppHeader />
              {children}
            </SidebarProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
