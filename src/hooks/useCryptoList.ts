'use client';

import { useQuery } from '@tanstack/react-query';
import { getCryptoList } from '@/lib/api/coingecko';
import type { Crypto, Currency } from '@/types/crypto';

interface UseCryptoListOptions {
  currency?: Currency;
  perPage?: number;
  page?: number;
  refetchInterval?: number;
}

export function useCryptoList({
  currency = 'usd',
  perPage = 100,
  page = 1,
  refetchInterval = 60000, // 1 minute par défaut
}: UseCryptoListOptions = {}) {
  return useQuery<Crypto[], Error>({
    queryKey: ['cryptoList', currency, perPage, page],
    queryFn: () => getCryptoList(currency, perPage, page),
    staleTime: 30000, // Les données sont fraîches pendant 30s
    refetchInterval, // Auto-refresh toutes les 60s
    refetchOnWindowFocus: true,
  });
}
