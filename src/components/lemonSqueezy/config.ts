import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js';
import { env } from "@/env";

/**
 * Ensures that required environment variables are set and sets up the Lemon
 * Squeezy JS SDK. Throws an error if any environment variables are missing or
 * if there's an error setting up the SDK.
 */
export function configureLemonSqueezy() {
    const requiredVars = [
      'LEMONSQUEEZY_API_KEY',
      'LEMONSQUEEZY_STORE_ID',
      'LEMONSQUEEZY_VARIANT_ID',
      'LEMONSQUEEZY_WEBHOOK_SECRET',
      'LEMONSQUEEZY_WEBHOOK_URL',
    ]
  
    const missingVars = requiredVars.filter((varName) => !process.env[varName])
  
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required LEMONSQUEEZY env variables: ${missingVars.join(
          ', '
        )}. Please, set them in your .env file.`
      )
    }
  
    lemonSqueezySetup({ apiKey: env.LEMONSQUEEZY_API_KEY })
  }
  