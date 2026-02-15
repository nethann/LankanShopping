import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../lib/firebase";
import { useAuth } from "./AuthContext";
import {
  DEFAULT_LKR_RATES,
  type CurrencyCode,
  SUPPORTED_CURRENCIES,
  convertFromLkr,
  formatFromLkr,
  getCurrencyFromCountry,
  getCurrencyFromLocale,
  isSupportedCurrency,
} from "../lib/currency";

type CurrencySource = "override" | "auto" | "fallback";

interface CurrencyContextValue {
  currency: CurrencyCode;
  country: string | null;
  loading: boolean;
  source: CurrencySource;
  supportedCurrencies: CurrencyCode[];
  convertPriceFromLkr: (valueInLkr: number) => number;
  formatPriceFromLkr: (valueInLkr: number) => string;
  setCurrencyOverride: (currency: CurrencyCode) => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextValue>(null!);
const OVERRIDE_STORAGE_KEY = "lankan-shopping-currency-override";

function getStoredOverride(): CurrencyCode | null {
  const value = localStorage.getItem(OVERRIDE_STORAGE_KEY);
  return isSupportedCurrency(value) ? value : null;
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<CurrencySource>("fallback");
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(DEFAULT_LKR_RATES);

  async function fetchRatesFromPublicApi() {
    const response = await fetch("https://open.er-api.com/v6/latest/LKR");
    if (!response.ok) {
      throw new Error(`Rate API status ${response.status}`);
    }
    const payload = (await response.json()) as { rates?: Record<string, number> };
    if (!payload.rates) {
      throw new Error("Rate API payload missing rates");
    }

    const next: Record<CurrencyCode, number> = { ...DEFAULT_LKR_RATES };
    for (const code of SUPPORTED_CURRENCIES) {
      if (code === "LKR") continue;
      const value = payload.rates[code];
      if (typeof value === "number" && value > 0) {
        next[code] = value;
      }
    }
    return next;
  }

  async function detectFromPublicIpApi() {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error(`IP API status ${response.status}`);
    }
    const data = (await response.json()) as { country_code?: unknown };
    const country = typeof data.country_code === "string" ? data.country_code.toUpperCase() : null;
    const currency = getCurrencyFromCountry(country);
    return { country, currency };
  }

  useEffect(() => {
    getDoc(doc(db, "appConfig", "exchangeRates"))
      .then(async (snapshot) => {
        if (!snapshot.exists()) return;
        const data = snapshot.data();
        const incoming = data.rates && typeof data.rates === "object" ? data.rates : data;
        const next: Record<CurrencyCode, number> = { ...DEFAULT_LKR_RATES };
        for (const code of SUPPORTED_CURRENCIES) {
          const value = incoming[code];
          if (typeof value === "number" && value > 0) {
            next[code] = value;
          }
        }
        setRates(next);
      })
      .catch(() => {
        // Keep defaults when config is missing or blocked by rules.
      });

    fetchRatesFromPublicApi()
      .then((liveRates) => {
        setRates(liveRates);
      })
      .catch(() => {
        // Keep Firestore/default rates when API fetch fails.
      });
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeCurrency() {
      setLoading(true);
      const localeCurrency = getCurrencyFromLocale();
      const localOverride = getStoredOverride();

      if (active) {
        if (localOverride) {
          setCurrency(localOverride);
          setSource("override");
        } else {
          setCurrency(localeCurrency);
          setSource("fallback");
        }
      }

      if (!user) {
        if (!localOverride) {
          try {
            const detectRegion = httpsCallable(functions, "detectRegion");
            const response = await detectRegion();
            const payload = response.data as { country?: unknown; currency?: unknown };
            const detectedCountry = typeof payload?.country === "string" ? payload.country : null;
            const detectedCurrency = isSupportedCurrency(payload?.currency) ? payload.currency : null;

            if (!active) return;
            if (detectedCountry) {
              setCountry(detectedCountry);
            }
            if (detectedCurrency) {
              setCurrency(detectedCurrency);
              setSource("auto");
            }
          } catch {
            try {
              const detected = await detectFromPublicIpApi();
              if (!active) return;
              if (detected.country) {
                setCountry(detected.country);
              }
              setCurrency(detected.currency);
              setSource("auto");
            } catch {
              // Locale fallback was already set above.
            }
          }
        }
        if (active) {
          setLoading(false);
        }
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const profile = await getDoc(userRef);
        const data = profile.data();

        const profileOverride = isSupportedCurrency(data?.currencyOverride) ? data?.currencyOverride : null;
        const profileCurrency = isSupportedCurrency(data?.currency) ? data?.currency : null;
        const profileCountry = typeof data?.country === "string" ? data.country : null;

        if (!active) return;

        if (profileCountry) {
          setCountry(profileCountry);
        }

        if (profileOverride) {
          setCurrency(profileOverride);
          setSource("override");
          localStorage.setItem(OVERRIDE_STORAGE_KEY, profileOverride);
          return;
        }

        if (localOverride) {
          await setDoc(
            userRef,
            { currencyOverride: localOverride, updatedAt: serverTimestamp() },
            { merge: true }
          );
          setCurrency(localOverride);
          setSource("override");
          return;
        }

        if (profileCurrency) {
          setCurrency(profileCurrency);
          setSource("auto");
          return;
        }

        try {
          const detectRegion = httpsCallable(functions, "detectRegion");
          const response = await detectRegion();
          const payload = response.data as { country?: unknown; currency?: unknown };

          const detectedCountry = typeof payload?.country === "string" ? payload.country : null;
          const detectedCurrency = isSupportedCurrency(payload?.currency) ? payload.currency : null;

          if (!active) return;
          if (detectedCountry) {
            setCountry(detectedCountry);
          }
          if (detectedCurrency) {
            setCurrency(detectedCurrency);
            setSource("auto");
          } else {
            setCurrency(localeCurrency);
            setSource("fallback");
          }
        } catch {
          try {
            const detected = await detectFromPublicIpApi();
            if (!active) return;
            if (detected.country) {
              setCountry(detected.country);
            }
            setCurrency(detected.currency);
            setSource("auto");

            await setDoc(
              userRef,
              {
                country: detected.country,
                currency: detected.currency,
                geoDetectedAt: serverTimestamp(),
              },
              { merge: true }
            );
          } catch {
            if (!active) return;
            setCurrency(localeCurrency);
            setSource("fallback");
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initializeCurrency();
    return () => {
      active = false;
    };
  }, [user]);

  const setCurrencyOverride = useCallback(async (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
    setSource("override");
    localStorage.setItem(OVERRIDE_STORAGE_KEY, nextCurrency);

    if (user) {
      await setDoc(
        doc(db, "users", user.uid),
        { currencyOverride: nextCurrency, updatedAt: serverTimestamp() },
        { merge: true }
      );
    }
  }, [user]);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      country,
      loading,
      source,
      supportedCurrencies: SUPPORTED_CURRENCIES,
      convertPriceFromLkr: (valueInLkr: number) => convertFromLkr(valueInLkr, currency, rates),
      formatPriceFromLkr: (valueInLkr: number) => formatFromLkr(valueInLkr, currency, rates),
      setCurrencyOverride,
    }),
    [country, currency, loading, rates, setCurrencyOverride, source]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}
