"use server";

import { invalidateSession, validateRequest } from "@/auth";
import { authenticatedAction } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function signOutAction() {
  const { session } = await validateRequest();

  if (!session) {
    redirect("/sign-in");
  }

  await invalidateSession(session.id);
  redirect("/signed-out");
}
