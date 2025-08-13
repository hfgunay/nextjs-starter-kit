import { Metadata } from "next";
import { CookiePreferencesContent } from "./cookie-preferences-content";

export const metadata: Metadata = {
  title: "Cookie Settings",
  description: "Manage your cookie preferences and privacy settings.",
};

export default function CookiesPage() {
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Cookie Settings</h1>
        <p className="text-muted-foreground">
          Manage how we use cookies to improve your experience.
        </p>
      </div>
      
      <CookiePreferencesContent />
    </div>
  );
} 