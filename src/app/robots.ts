import { MetadataRoute } from 'next';
import { env } from "@/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/dashboard/',
        '/sign-in/',
        '/sign-up/',
        '/*.json$',
      ],
    },
    sitemap: `${env.HOST_NAME}/sitemap.xml`,
  };
} 