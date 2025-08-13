import { database } from "@/db";
import { NewWebhookEvent, webhookEvents } from "@/db/schema";
import { UserId } from "@/use-cases/types";
import { eq } from "drizzle-orm";

export async function createWebhookEvent(
  id: number,
  eventName: string,
  body: NewWebhookEvent["body"],
) {
  const webhookEvent = await database
    .insert(webhookEvents)
    .values({
        id,
        eventName,
        processed: false,
        body,
      })
    .onConflictDoNothing()
    .returning();
  return webhookEvent;
}

export async function updateWebhookEvent(
    id: number,
    updateWebhookEvent: Partial<NewWebhookEvent>
  ) {
    await database
      .update(webhookEvents)
      .set(updateWebhookEvent)
      .where(eq(webhookEvents.id, id));
  }

export async function getWebhookEvent(id: number) {
  const webhookEvent = await database.query.webhookEvents.findFirst({
    where: eq(webhookEvents.id, id),
  });

  return webhookEvent;
}