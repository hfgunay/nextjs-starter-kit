'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { getCookie, setCookie } from '@/client/cookies';

interface CookiePreference {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface CookiePreferences {
  [key: string]: boolean;
}

const cookiePreferences: CookiePreference[] = [
  {
    id: "authentication",
    title: "Authentication (required)",
    description: "These cookies are essential for authentication and maintaining your login session. They cannot be disabled as they are required for the website to function properly.",
    required: true
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "We use PostHog to understand how visitors interact with our website. This helps us improve our services and user experience. These cookies collect information anonymously.",
    required: false
  },
  {
    id: "payment",
    title: "Payment (required)",
    description: "These cookies are necessary for processing payments.",
    required: true
  }
];

export function CookiePreferencesContent() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<CookiePreferences>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPreferences = getCookie('cookie-preferences');
    if (savedPreferences) {
      try {
        setPreferences(JSON.parse(savedPreferences));
      } catch {
        setPreferences({});
      }
    }
  }, []);

  const handleToggle = (id: string) => {
    if (cookiePreferences.find(pref => pref.id === id)?.required) {
      return;
    }

    setPreferences(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleSave = () => {
    // Ensure required cookies are always enabled
    const finalPreferences = {
      ...preferences,
      ...Object.fromEntries(
        cookiePreferences
          .filter(pref => pref.required)
          .map(pref => [pref.id, true])
      )
    };

    setCookie('cookie-preferences', JSON.stringify(finalPreferences), {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/'
    });

    toast({
      title: "Preferences Saved",
      description: "Your cookie preferences have been updated.",
    });
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <p>
          We use cookies to provide you with the best possible experience on our website.
          Some cookies are essential for the website to function properly and cannot be disabled.
          Others help us improve our services and your experience.
        </p>
      </div>

      <div className="space-y-4">
        {cookiePreferences.map((pref) => (
          <div
            key={pref.id}
            className="p-4 rounded-lg border bg-card"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{pref.title}</h3>
              <Switch
                checked={preferences[pref.id] ?? pref.required}
                onCheckedChange={() => handleToggle(pref.id)}
                disabled={pref.required}
              />
            </div>
            <p className="text-sm text-muted-foreground">{pref.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
} 