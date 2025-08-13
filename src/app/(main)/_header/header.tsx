import Link from "next/link";
import { HeaderLinks } from "@/app/(main)/_header/header-links";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings2Icon } from "lucide-react";
import { HeaderActionsFallback } from "@/app/(main)/_header/header-actions-fallback";
import { applicationName } from "@/app-config";
import { SignOutItem } from "@/app/(main)/_header/sign-out-item";
import {getUserProfileUseCase} from "@/use-cases/users";
import { getProfileImageFullUrl } from "@/app/(main)/dashboard/settings/profile/profile-image";
import { MenuButton } from "./menu-button";
import { ModeToggle } from "@/components/mode-toggle";
import { HeaderLogo } from "./header-logo";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <div className="px-5 md:px-6">
      <div className="mx-auto flex w-full max-w-7xl py-4 justify-between">
        <div className="flex justify-between gap-10 items-center">
          <HeaderLogo />

          <HeaderLinks isAuthenticated={!!user} />
        </div>

        <div className="flex items-center justify-between gap-5">
        {user && (
            <>
              <div className="flex items-center gap-2">
                <Button variant="justShow" className="p-0">
                  <span className="text-heading"> {user.credits} Credits Left</span>
                </Button>
              </div>
              <Button 
                asChild
                size="lg"
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/#pricing" className="flex items-center gap-2">
                  BUY CREDITS
                </Link>
              </Button>
            </>
          )}
          
        <ModeToggle />
          <Suspense fallback={<HeaderActionsFallback />}>
            <HeaderActions />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function ProfileAvatar({ userId }: { userId: number }) {
  const profile = await getUserProfileUseCase(userId);

  return (
    <Avatar>
      <AvatarImage src={getProfileImageFullUrl(profile)} />
      <AvatarFallback>
        {profile.displayName?.substring(0, 2).toUpperCase() ?? "AA"}
      </AvatarFallback>
    </Avatar>
  );
}

async function HeaderActions() {
  const user = await getCurrentUser();
  const isSignedIn = !!user;

  return (
    <>
      {isSignedIn ? (
        <>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Suspense
                fallback={
                  <div className="bg-gray-800 rounded-full h-10 w-10 shrink-0 flex items-center justify-center">
                    ..
                  </div>
                }
              >
                <ProfileAvatar userId={user.id} />
              </Suspense>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="space-y-2">
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex gap-2 items-center cursor-pointer text-heading"
                >
                  <Settings2Icon className="w-4 h-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <MenuButton />
          </div>
        </>
      ) : (
        <>
          <Button asChild variant="secondary">
            <Link href="/sign-in" className="text-heading">Sign In</Link>
          </Button>
        </>
      )}
    </>
  );
}