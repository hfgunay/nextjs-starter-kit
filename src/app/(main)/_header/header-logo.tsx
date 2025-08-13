"use client";

import { applicationName } from "@/app-config";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function HeaderLogo() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render light theme version for initial SSR
  if (!mounted) {
    return (
      <Link
        href={isDashboard ? "/dashboard" : "/"}
        className="flex gap-2 items-center"
      >
        <div className="w-8 h-8" /> {/* Placeholder for the image to maintain layout */}
        <span className="text-lg font-medium hidden sm:inline">{applicationName}</span>
        {/* Mobile version - just show icon */}
      </Link>
    );
  }

  return (
    <Link
      href={isDashboard ? "/dashboard" : "/"}
      className="flex gap-2 items-center"
    >
      <Image
        className="rounded w-8 h-8"
        width={50}
        height={50}
        src="/logo.png"
        alt={applicationName}
        priority
      />
      <span className="text-lg font-medium hidden sm:inline">{applicationName}</span>
      {/* Mobile version - just show icon */}
    </Link>
  );
}
