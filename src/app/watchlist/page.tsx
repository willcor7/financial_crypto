'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ArrowLeft, Sparkles } from 'lucide-react';
import { CryptoTable } from '@/components/crypto/CryptoTable';
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Bouton retour */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Retour au marché</span>
      </Link>

      {/* Header avec gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 animate-gradient p-8 md:p-12 shadow-2xl animate-slide-up">
        {/* Grille de fond */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Effets de lumière */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm animate-pulse-glow border border-white/30">
              <Star className="h-10 w-10 text-white fill-white" />
            </div>
            <div className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-white/90 text-sm font-bold flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>{watchlist.length} favoris</span>
              </span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">Ma Watchlist</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Suivez vos cryptomonnaies préférées en un seul endroit
          </p>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-500 border-t-transparent absolute inset-0"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Chargement de votre watchlist...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && watchlist.length === 0 && (
        <div className="bg-gradient-to-br from-white via-white to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-12 text-center shadow-xl animate-scale-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full"></div>
            <Star className="relative h-24 w-24 text-yellow-500 mx-auto" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Votre watchlist est vide
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            Ajoutez des cryptomonnaies à votre watchlist en cliquant sur l'étoile ⭐
          </p>
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <Star className="h-5 w-5" />
            <span>Explorer le marché</span>
          </Link>
        </div>
      )}

      {/* Watchlist table */}
      {!isLoading && watchlistCryptos && watchlistCryptos.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
