"use client";

import { Button } from "@/components/ui/button";
import useMediaQuery from "@/hooks/use-media-query";
import { BookIcon, ImageIcon, SearchIcon, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderLinksProps {
  isAuthenticated: boolean;
}

export function HeaderLinks({ isAuthenticated }: HeaderLinksProps) {
  const path = usePathname();
  const { isMobile } = useMediaQuery();
  const isLandingPage = path === "/";

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isMobile) return null;

  return (
    <>
      {!isLandingPage && isAuthenticated && (
        <div className="hidden md:flex items-center gap-2">
          <Button
            variant={"link"}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" /> Home
            </Link>
          </Button>
          <Button
            variant={"link"}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={"/generate-image/from-text"}>
              <ImageIcon className="w-4 h-4" /> Generate Image
            </Link>
          </Button>
        {/*
          <Button
            variant={"link"}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={"/dashboard"}>
              <SearchIcon className="w-4 h-4" /> Dashboard Generate Caption
            </Link>
          </Button>

          

          <Button
            variant={"link"}
            asChild
            className="flex items-center justify-center gap-2"
          >
            <Link href={"/collection"}>
              <BookIcon className="w-4 h-4" /> Collection
            </Link>
          </Button>
*/}
        </div>
      )}

      {(isLandingPage || !isAuthenticated) && (
        <div className="hidden md:flex gap-4">
          {/*
          <Button variant={"link"} asChild>
            <Link href="/#features">Features</Link>
          </Button>
          */}
          <Button variant={"link"} asChild className="text-lg">
            <Link 
              href="/#content-guidelines" 
              onClick={(e) => scrollToSection(e, 'content-guidelines')}
            >
              Content Guidelines
            </Link>
          </Button>

          <Button variant={"link"} asChild className="text-lg">
            <Link 
              href="/#gallery" 
              onClick={(e) => scrollToSection(e, 'gallery')}
            >
              Gallery
            </Link>
          </Button>

          <Button variant={"link"} asChild className="text-lg">
            <Link 
              href="/#pricing" 
              onClick={(e) => scrollToSection(e, 'pricing')}
            >
              Pricing
            </Link>
          </Button>
        {/*

  <Button variant={"link"} asChild>
    <Link href={"/collection"}>Collection</Link>
  </Button>
*/}
        </div>
      )}
    </>
  );
}
