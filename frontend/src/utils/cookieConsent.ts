export const COOKIE_CONSENT_KEY = "cookie_consent";

export type CookieConsent = "accepted" | "rejected";

export const getCookieConsent = (): CookieConsent | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY) as CookieConsent | null;
};

export const setCookieConsent = (value: CookieConsent) => {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
};