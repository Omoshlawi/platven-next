import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://platven.ke'),
  title: {
    default: 'Platven LTD',
    template: '%s | Platven LTD',
  },
  description: 'Real estate platform',
  openGraph: {
    title: {
      default: 'Platven LTD',
      template: '%s | Platven LTD',
    },
    description: 'Explore real estate opportunities',
    siteName: 'Platven LTD',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: {
      default: 'Platven LTD',
      template: '%s | Platven LTD',
    },
    description: 'Explore real estate opportunities',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Providers>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
