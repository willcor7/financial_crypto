'use client';

import { useQuery } from '@tanstack/react-query';
import { getCryptoHistory } from '@/lib/api/coingecko';
import type { MarketChart, Currency } from '@/types/crypto';

interface UseCryptoHistoryOptions {
  id: string;
  currency?: Currency;
  days?: string;
}

export function useCryptoHistory({
  id,
  currency = 'usd',
  days = '7',
}: UseCryptoHistoryOptions) {
  return useQuery<MarketChart, Error>({
    queryKey: ['cryptoHistory', id, currency, days],
    queryFn: () => getCryptoHistory(id, currency, days),
    enabled: !!id,
    staleTime: 60000, // 1 minute
  });
}
