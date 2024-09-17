import Providers from "@/components/layout/providers";
import { Toaster } from "@/components/ui/toaster";
import "@uploadthing/react/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Platven LTD',
  description: 'Real estate platform',
  openGraph: {
    title: 'Platven LTD',
    description: 'Explore real estate opportunities',
    images: [
      {
        url: '/app/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Platven Real Estate',
      },
    ],
    type: 'website',
    siteName: 'Platven',
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
