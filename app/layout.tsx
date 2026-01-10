import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { QueryProvider } from "@/lib/query";
import { Toaster } from "@/components/ui/sonner";
import { OfflineIndicator } from "@/components/ui/offline-indicator";
import { OfflineSyncManager } from "@/components/offline-sync-manager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'Management Kost - Kelola Kost Anda dengan Mudah',
    template: '%s | Management Kost',
  },
  description: 'Aplikasi manajemen kost profesional dengan fitur lengkap untuk mengelola kamar, penghuni, tagihan, dan laporan keuangan.',
  keywords: ['manajemen kost', 'kost management', 'boarding house', 'rental management', 'sistem kost', 'aplikasi kost'],
  authors: [{ name: 'Management Kost Team' }],
  creator: 'Management Kost Team',
  applicationName: "Management Kost",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Management Kost",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: 'id_ID',
    siteName: "Management Kost",
    title: "Management Kost - Kelola Kost Anda dengan Mudah",
    description: "Aplikasi manajemen kost profesional dengan fitur lengkap untuk mengelola kamar, penghuni, tagihan, dan laporan keuangan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Management Kost",
    description: "Kelola kost Anda dengan mudah dan profesional",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Kost Management" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize theme before React hydrates
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const theme = savedTheme || (prefersDark ? 'dark' : 'light');
                
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
              
              // Suppress MetaMask extension errors
              window.addEventListener('error', function(e) {
                if (e.message && e.message.includes('MetaMask')) {
                  e.preventDefault();
                  e.stopPropagation();
                  return false;
                }
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <OfflineIndicator />
          <OfflineSyncManager />
          {children}
          <PWAInstallPrompt />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
