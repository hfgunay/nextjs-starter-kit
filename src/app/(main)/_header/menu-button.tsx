"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HomeIcon, ImageIcon, MenuIcon, Settings2Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MenuButton() {
  const path = usePathname();
  const isLandingPage = path === "/";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MenuIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-2">
        {!isLandingPage && (
          <DropdownMenuItem asChild>
            <Link
              href="/"
              className="flex gap-2 items-center cursor-pointer"
            >
              <HomeIcon className="w-4 h-4" /> Home
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link
            href="/generate-image/from-text"
            className="flex gap-2 items-center cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" /> Generate Image
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/settings"
            className="flex gap-2 items-center cursor-pointer"
          >
            <Settings2Icon className="w-4 h-4" /> Settings
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
