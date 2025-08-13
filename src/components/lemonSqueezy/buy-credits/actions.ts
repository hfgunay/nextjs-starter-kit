"use server";

import crypto from "node:crypto";
import { getUser, getUserCredits, incrementUserCredits } from "@/data-access/users";
import { createWebhookEvent, getWebhookEvent, updateWebhookEvent } from "@/data-access/webhookEvents";
import { NewWebhookEvent } from "@/db/schema";
import { env } from "@/env";
import { authenticatedAction } from "@/lib/safe-action";
import { PublicError } from "@/use-cases/errors";
import { z } from "zod";
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';
import { configureLemonSqueezy } from "@/components/lemonSqueezy/config";
import { webhookHasMeta, webhookHasData } from "@/lib/typeguards";

const storeId = env.LEMONSQUEEZY_STORE_ID;
const variantId = env.LEMONSQUEEZY_VARIANT_ID;
let webhookUrl = env.LEMONSQUEEZY_WEBHOOK_URL;

const VOLUME_1_MAX_CREDITS = 200;
const VOLUME_2_MAX_CREDITS = 1000;
const VOLUME_3_START_CREDITS = VOLUME_2_MAX_CREDITS;

const VOLUME_1_PRICE = 0.06;
const VOLUME_2_PRICE = 0.05;
const VOLUME_3_PRICE = 0.04;

const lemonSqueezySchema = z.object({
  credits: z.number().min(50, "Minimum credit amount is 50"),
});

export const checkStoreStatusAction = authenticatedAction
  .createServerAction()
  .input(z.void())
  .handler(async ({ ctx: { user } }) => {
    // Allow testing for ME_USER_ID regardless of store status
    if (user.id.toString() === env.ME_USER_ID) {
      return {
        status: "approved",
        isPending: false
      };
    }

    return {
      status: env.LEMONSQUEEZY_STORE_STATUS,
      isPending: env.LEMONSQUEEZY_STORE_STATUS === "pending"
    };
  });

export const generateLemonSqueezySessionAction = authenticatedAction
  .createServerAction()
  .input(lemonSqueezySchema)
  .handler(async ({ input: { credits }, ctx: { user } }) => {
    // Allow testing for ME_USER_ID regardless of store status
    if (user.id.toString() !== env.ME_USER_ID && env.LEMONSQUEEZY_STORE_STATUS === "pending") {
      throw new PublicError("Payment system is not yet available. Please try again later.");
    }

    configureLemonSqueezy();

    const fullUser = await getUser(user.id);

    if (!fullUser) {
      throw new PublicError("no user found");
    }
    const email = fullUser.email;
    const userId = user.id;

    if (!userId) {
      throw new PublicError("no user id found");
    }

    const { totalCost } = calculateTotalCost(credits);
    const priceInCents = Math.round(totalCost * 100);

    try {
      const checkout = await createCheckout(
        storeId,
        variantId,
        {
          customPrice: priceInCents,
          checkoutData: {         
            email: email || undefined,
            custom: {
              user_id: userId.toString(),
              credits: credits.toString(),
            }
          },
          productOptions: {
            redirectUrl: env.HOST_NAME,
            receiptButtonText: 'Go to Dashboard'
          },
          checkoutOptions: {
            embed: true,
            media: true,
            logo: true
          },
          expiresAt: null,
          preview: false,
          testMode: true
        }
      );
      /*
      console.log('Checkout response:', checkout);
      console.log('Checkout response attributes:', checkout.data?.data.attributes);
      */

      if (checkout.statusCode === 422) {
        console.error('Validation error:', checkout.data);
        throw new Error('Invalid checkout data. Please check the console for details.');
      }

      const checkoutUrl = checkout.data?.data?.attributes?.url;
      if (!checkoutUrl) {
        throw new Error('Checkout URL not found in response');
      }
      console.log('Checkout URL:', checkoutUrl);
      return checkoutUrl;
    } catch (error) {
      console.error('Checkout creation failed:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create checkout session: ${error.message}`);
      } else {
        throw new Error('Failed to create checkout session due to an unknown error.');
      }
    }
  });

function calculateTotalCost(credits: number) {
  const tier1Credits = Math.min(credits, VOLUME_1_MAX_CREDITS);
  const tier2Credits = Math.max(0, Math.min(credits - VOLUME_1_MAX_CREDITS, VOLUME_2_MAX_CREDITS - VOLUME_1_MAX_CREDITS));
  const tier3Credits = Math.max(0, credits - VOLUME_3_START_CREDITS);

  const tier1Cost = tier1Credits * VOLUME_1_PRICE;
  const tier2Cost = tier2Credits * VOLUME_2_PRICE;
  const tier3Cost = tier3Credits * VOLUME_3_PRICE;

  const totalCost = tier1Cost + tier2Cost + tier3Cost;

  return {
    totalCost
  };
}

export async function storeWebhookEvent(
  eventName: string,
  body: NewWebhookEvent["body"],
) {

  const id = crypto.randomInt(100000000, 1000000000);

  const returnedValue = await createWebhookEvent(id, eventName, body);

  return returnedValue[0];
}

export async function processWebhookEvent(webhookEvent: NewWebhookEvent) {
  configureLemonSqueezy()

  const dbwebhookEvent = await getWebhookEvent(webhookEvent.id)

  if (!dbwebhookEvent) {
    throw new Error(
      `Webhook event #${webhookEvent.id} not found in the database.`
    )
  }

  if (!webhookUrl) {
    throw new Error(
      'Missing required WEBHOOK_URL env variable. Please, set it in your .env file.'
    )
  }

  let processingError = ''
  const eventBody =   webhookEvent.body

  if (!webhookHasMeta(eventBody)) {
    processingError = "Event body is missing the 'meta' property."
  } else if (webhookHasData(eventBody)) {
  
    if (webhookEvent.eventName.startsWith('order_created')) {
      const userId = Number(eventBody.meta.custom_data.user_id);
      const creditsToAdd = Number(eventBody.meta.custom_data.credits);

      if (isNaN(userId) || isNaN(creditsToAdd)) {
        processingError = "Invalid user_id or credits in custom_data";
      } else {
        const user = await getUser(userId);
        if (user) {
          await incrementUserCredits(user.id, creditsToAdd);
        } else {
          processingError = `User with ID ${userId} not found`;
        }
      }
    }

    // Update the webhook event in the database.
    await updateWebhookEvent(webhookEvent.id, {
      processed: true,
      processingError,
    })
  }
}

export const refreshCreditsAction = authenticatedAction
  .createServerAction()
  .input(z.void())
  .handler(async ({ ctx: { user } }) => {
    const credits = await getUserCredits(user.id);
    return { credits };
  });
