'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getCookie, setCookie } from '@/client/cookies';
import Link from 'next/link';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user has already made a choice
    const hasPreferences = getCookie('cookie-preferences');
    if (!hasPreferences) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      authentication: true,
      analytics: true,
      payment: true
    };

    setCookie('cookie-preferences', JSON.stringify(preferences), {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/'
    });

    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const preferences = {
      authentication: true, // Required
      analytics: false,    // Optional
      payment: true        // Required
    };

    setCookie('cookie-preferences', JSON.stringify(preferences), {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/'
    });

    setIsVisible(false);
  };

  // Don't render anything until component is mounted
  if (!mounted) return null;
  
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg z-50">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              Some cookies are essential for the website to function and can't be disabled.
              {' '}
              <Link href="/dashboard/settings/cookies" className="underline underline-offset-4">
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRejectNonEssential}
            >
              Reject Non-Essential
            </Button>
            <Button
              size="sm"
              onClick={handleAcceptAll}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 