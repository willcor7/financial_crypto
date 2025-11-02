'use client';

import React from 'react';
import { MarketOverview } from '@/components/crypto/MarketOverview';
import { CryptoTable } from '@/components/crypto/CryptoTable';
import { useCryptoList } from '@/hooks/useCryptoList';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { TrendingUp, Sparkles, BarChart3 } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Hero Section avec animation */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient p-8 md:p-12 shadow-2xl">
        {/* Grille de fond animée */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>

        {/* Particules flottantes */}
        <div className="absolute top-10 right-10 animate-float">
          <Sparkles className="h-12 w-12 text-white/30" />
        </div>
        <div className="absolute bottom-10 left-10 animate-float" style={{ animationDelay: '1s' }}>
          <BarChart3 className="h-16 w-16 text-white/20" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm animate-pulse-glow">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-white/90 text-sm font-semibold">Données en temps réel</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Marché des<br />Cryptomonnaies
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed">
            Suivez les prix et les tendances des principales cryptomonnaies en temps réel
            avec des analyses avancées et des graphiques interactifs
          </p>

          {/* Stats rapides */}
          <div className="mt-8 flex flex-wrap gap-4">
            <div className="glass px-6 py-3 rounded-xl">
              <div className="text-white/70 text-sm mb-1">Cryptos suivies</div>
              <div className="text-white text-2xl font-bold">{cryptos?.length || 0}</div>
            </div>
            <div className="glass px-6 py-3 rounded-xl">
              <div className="text-white/70 text-sm mb-1">Watchlist</div>
              <div className="text-white text-2xl font-bold">{watchlist.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Overview avec animation */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <MarketOverview />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute inset-0"></div>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
            Chargement des données...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="animate-scale-in bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-red-700 dark:text-red-400 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Erreur de chargement</h3>
              <p>Impossible de charger les données. Veuillez réessayer dans quelques instants.</p>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Table avec effets */}
      {cryptos && (
        <div className="animate-slide-up bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300" style={{ animationDelay: '0.2s' }}>
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
