'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Star, ArrowLeft } from 'lucide-react';
import { CryptoTable } from '@/components/crypto/CryptoTable';
import { getSimplePrices } from '@/lib/api/coingecko';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCryptoList } from '@/hooks/useCryptoList';

export default function WatchlistPage() {
  const { currency } = useCurrency();
  const [watchlist, setWatchlist] = useLocalStorage<string[]>('watchlist', []);

  // Récupérer toutes les cryptos pour filtrer celles dans la watchlist
  const { data: allCryptos, isLoading } = useCryptoList({
    currency,
    perPage: 250,
    page: 1,
  });

  const toggleWatchlist = (id: string) => {
    setWatchlist((prev) => prev.filter((item) => item !== id));
  };

  // Filtrer les cryptos qui sont dans la watchlist
  const watchlistCryptos = allCryptos?.filter((crypto) =>
    watchlist.includes(crypto.id)
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour au marché</span>
        </Link>

        <div className="flex items-center space-x-3 mb-2">
          <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Ma Watchlist
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Suivez vos cryptomonnaies préférées en un seul endroit
        </p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && watchlist.length === 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Votre watchlist est vide
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ajoutez des cryptomonnaies à votre watchlist en cliquant sur l'étoile
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Explorer le marché
          </Link>
        </div>
      )}

      {!isLoading && watchlistCryptos && watchlistCryptos.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <CryptoTable
            cryptos={watchlistCryptos}
            onToggleWatchlist={toggleWatchlist}
            watchlist={watchlist}
          />
        </div>
      )}
    </div>
  );
}
