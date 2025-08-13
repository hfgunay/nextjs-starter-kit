import { redirect } from "next/navigation";
import { assertAuthenticated } from "@/lib/session";

export default async function DashboardPage() {
  await assertAuthenticated();
  redirect("/generate-image/from-text");
}
