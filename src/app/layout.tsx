import "@/app/globals.css";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { ReactNode, Suspense } from "react";
import { Providers } from "@/providers/providers";
import { applicationName, appConfig } from "@/app-config";
import PostHogPageView from "@/components/posthog-page-view";
import { CookieBanner } from '@/components/cookie-banner';
import { env } from "@/env";

import { Archivo } from "next/font/google";
import { Libre_Franklin } from "next/font/google";
import { BreakpointOverlay } from "@/components/breakpoint-overlay";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});
const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

const { mode } = appConfig;

export const metadata: Metadata = {
  metadataBase: new URL(env.HOST_NAME),
  title: {
    default: `${applicationName} - AI Image Generation Tool`,
    template: `%s`,
  },
  description:
    `Create stunning AI-generated images with ${applicationName}. Transform your ideas into beautiful visuals using advanced AI technology. Fast, easy, and professional results.`,
  keywords: [
    "AI image generation",
    "artificial intelligence art",
    "AI art creator",
    "AI image generator",
    "AI art generation",
    "digital art AI",
    "AI artwork",
    "creative AI tools",
    "AI design generator",
    "AI visual content",
  ],
  openGraph: {
    title: `${applicationName} - AI Image Generation Tool`,
    description:
      `Create stunning AI-generated images with ${applicationName}. Transform your ideas into beautiful visuals using advanced AI technology.`,
    url: env.HOST_NAME,
    siteName: applicationName,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${applicationName} Logo`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: `${applicationName} - AI Image Generation Tool`,
    card: "summary_large_image",
    images: ["/logo.png"],
  },
  icons: {
    icon: [
      { url: "/logo.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" }
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/logo.ico"
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }} suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          archivo.variable + " " + libre_franklin.variable
        )}
      >
        <Providers>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <div>{children}</div>
        </Providers>
        <Toaster />
        <CookieBanner />
        <BreakpointOverlay />
      </body>
    </html>
  );
}
