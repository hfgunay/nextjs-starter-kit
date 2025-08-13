import { ComingSoon } from "@/app/(main)/(coming-soon)/coming-soon";
import { HeroSection } from "@/app/(main)/(landing)/_sections/hero";
import PricingSection from "@/app/(main)/(landing)/_sections/pricing";
import { appConfig, applicationName } from "@/app-config";
import { Metadata } from "next";
import Script from "next/script";
import { env } from "@/env";

export const metadata: Metadata = {
  title: `${applicationName} - AI Image Generation Tool`,
  description: "Transform your ideas into stunning visuals with our AI image generation tool. Create unique, professional-quality images using DALL-E 2 and DALL-E 3. Start generating for free.",
  keywords: [
    "AI image generation",
    "AI art creator",
    "DALL-E",
    "text to image",
    "AI artwork",
    "AI image generator",
    "artificial intelligence art",
    "custom AI images"
  ],
  alternates: {
    canonical: env.HOST_NAME
  }
};

export default async function Home() {
  if (appConfig.mode === "comingSoon") {
    return <ComingSoon />;
  }

  if (appConfig.mode === "maintenance") {
    return (
      <div>
        <h1>Maintenance</h1>
      </div>
    );
  }
  
  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": applicationName,
            "applicationCategory": "MultimediaApplication",
            "description": "AI-powered image generation tool using DALL-E models",
            "operatingSystem": "Any",
            "url": env.HOST_NAME,
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "description": "Free tier available - Generate your first 10 images free"
            },
            "featureList": [
              "Multiple AI Models (DALL-E 2, DALL-E 3)",
              "Various Artistic Styles",
              "High-Resolution Output",
              "User-Friendly Interface"
            ]
          })
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": applicationName,
            "url": env.HOST_NAME,
            "logo": "/logo.png"
          })
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": applicationName,
            "url": env.HOST_NAME
          })
        }}
      />
      <div>
        <HeroSection />
        <PricingSection />
      </div>
    </>
  );
}
