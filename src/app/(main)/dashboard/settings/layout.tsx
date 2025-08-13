import { getCurrentUser } from "@/lib/session";
import { SettingsTab } from "@/app/(main)/dashboard/settings/tabs-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SquareUser } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/icons";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { headerStyles } from "@/styles/common";
import { cn } from "@/lib/utils";

export default async function SettingsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={cn(headerStyles, "py-8")}>
        <div className="container mx-auto">
          <div className="flex justify-between">
            <h1 className="text-4xl">Account Settings</h1>

            <Suspense
              fallback={<Skeleton className="w-[160px] h-[40px] rounded" />}
            >
            </Suspense>
          </div>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="w-full h-[40px] rounded" />}>
        <SettingsTab />
      </Suspense>

      <div className="container mx-auto py-12">{children}</div>
    </>
  );
}
