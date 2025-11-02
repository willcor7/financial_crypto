'use client';

import React from 'react';
import { MarketOverview } from '@/components/crypto/MarketOverview';
import { CryptoTable } from '@/components/crypto/CryptoTable';
import { useCryptoList } from '@/hooks/useCryptoList';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function HomePage() {
  const { currency } = useCurrency();
  const [watchlist, setWatchlist] = useLocalStorage<string[]>('watchlist', []);

  const { data: cryptos, isLoading, error } = useCryptoList({
    currency,
    perPage: 100,
    page: 1,
  });

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Marché des Cryptomonnaies
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Suivez les prix et les tendances des principales cryptomonnaies en temps réel
        </p>
      </div>

      <MarketOverview />

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400">
          Erreur lors du chargement des données. Veuillez réessayer.
        </div>
      )}

      {cryptos && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CryptoTable
            cryptos={cryptos}
            onToggleWatchlist={toggleWatchlist}
            watchlist={watchlist}
          />
        </div>
      )}
    </div>
  );
}
