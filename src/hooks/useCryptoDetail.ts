'use client';

import { useQuery } from '@tanstack/react-query';
import { getCryptoDetail } from '@/lib/api/coingecko';
import type { CryptoDetail } from '@/types/crypto';

export function useCryptoDetail(id: string) {
  return useQuery<CryptoDetail, Error>({
    queryKey: ['cryptoDetail', id],
    queryFn: () => getCryptoDetail(id),
    enabled: !!id,
    staleTime: 30000,
    refetchInterval: 60000,
  });
}
