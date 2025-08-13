'use client';

interface CookieOptions {
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (options.maxAge) {
    cookie += `; Max-Age=${options.maxAge}`;
  }
  if (options.path) {
    cookie += `; Path=${options.path}`;
  }
  if (options.domain) {
    cookie += `; Domain=${options.domain}`;
  }
  if (options.secure) {
    cookie += '; Secure';
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite}`;
  }

  document.cookie = cookie;
}

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    if (cookieName === encodeURIComponent(name)) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function deleteCookie(name: string, options: CookieOptions = {}) {
  setCookie(name, '', { ...options, maxAge: -1 });
}

interface CookiePreferences {
  authentication: boolean;
  analytics: boolean;
  payment: boolean;
}

export function getCookiePreferences(): CookiePreferences {
  const defaultPreferences: CookiePreferences = {
    authentication: true, // Required
    analytics: false,    // Optional
    payment: true,       // Required
  };

  const savedPreferences = getCookie('cookie-preferences');
  if (!savedPreferences) return defaultPreferences;

  try {
    const parsed = JSON.parse(savedPreferences);
    return {
      ...defaultPreferences,
      ...parsed,
      authentication: true, // Always true
      payment: true,       // Always true
    };
  } catch {
    return defaultPreferences;
  }
}

export function checkCookieConsent(type: keyof CookiePreferences): boolean {
  const preferences = getCookiePreferences();
  return preferences[type] ?? false;
} 