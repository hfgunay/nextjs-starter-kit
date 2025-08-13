import { ProfileImage } from "@/app/(main)/dashboard/settings/profile/profile-image";
import { ProfileName } from "@/app/(main)/dashboard/settings/profile/profile-name";
import { assertAuthenticated } from "@/lib/session";
import { Suspense, cache } from "react";
import { getUserProfileUseCase } from "@/use-cases/users";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfigurationPanel } from "@/components/configuration-panel";
import { ModeToggle } from "@/components/mode-toggle";

export const getUserProfileLoader = cache(getUserProfileUseCase);

export default async function SettingsPage() {
  return (
    <div className="space-y-8">
      {/*
      <ConfigurationPanel title="Burası Flex Clip'in My Account sayfası gibi olacak">
        <Suspense fallback={<Skeleton className="w-full h-[400px] rounded" />}>
        </Suspense>
      </ConfigurationPanel>*/}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <ProfileImage />
        <ProfileName />
      </div>

      <ConfigurationPanel title="Theme">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <span className="mb-2 sm:mb-0">Toggle dark mode</span>
          <ModeToggle />
        </div>
      </ConfigurationPanel>
    </div>
  );
}
