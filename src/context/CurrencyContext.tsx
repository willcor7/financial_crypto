'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Currency } from '@/types/crypto';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('usd');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCurrency = localStorage.getItem('currency') as Currency | null;
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    // Retourner une valeur par défaut pendant le SSR
    if (typeof window === 'undefined') {
      return {
        currency: 'usd' as Currency,
        setCurrency: () => {},
      };
    }
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
