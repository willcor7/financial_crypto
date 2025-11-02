'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ExternalLink, Star, BarChart3 } from 'lucide-react';
import { useCryptoDetail } from '@/hooks/useCryptoDetail';
import { PriceChart } from '@/components/charts/PriceChart';
import { formatPrice, formatMarketCap, formatPercentage, formatSupply, getColorClass, truncate } from '@/lib/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function CryptoDetailPage() {
  const params = useParams();
  const cryptoId = params?.id as string;
  const { currency } = useCurrency();
  const [watchlist, setWatchlist] = useLocalStorage<string[]>('watchlist', []);

  const { data: crypto, isLoading, error } = useCryptoDetail(cryptoId);

  const toggleWatchlist = () => {
    setWatchlist((prev) =>
      prev.includes(cryptoId) ? prev.filter((item) => item !== cryptoId) : [...prev, cryptoId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-700 dark:text-red-400">
          Erreur lors du chargement des détails de la cryptomonnaie.
        </div>
      </div>
    );
  }

  const marketData = crypto.market_data;
  const currentPrice = marketData?.current_price?.[currency] || 0;
  const priceChange24h = marketData?.price_change_percentage_24h || 0;
  const isPositive = priceChange24h > 0;
  const isInWatchlist = watchlist.includes(cryptoId);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Bouton retour avec style amélioré */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Retour au marché</span>
      </Link>

      {/* Header avec gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-2xl animate-slide-up">
        {/* Grille de fond */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Effet de lumière */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <Image
                  src={crypto.image.large}
                  alt={crypto.name}
                  width={80}
                  height={80}
                  className="relative rounded-full ring-4 ring-white dark:ring-gray-900 shadow-xl"
                />
              </div>
              <div>
                <div className="flex items-center space-x-4 mb-2">
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                    {crypto.name}
                  </h1>
                  <span className="text-2xl font-bold text-gray-500 dark:text-gray-400 uppercase px-4 py-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                    {crypto.symbol}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-semibold shadow-lg">
                    <span>Rang #{crypto.market_cap_rank}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={toggleWatchlist}
              className="group p-4 rounded-2xl hover:bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-transparent hover:border-yellow-500 dark:hover:border-yellow-500 transition-all duration-300 hover:scale-110"
            >
              <Star
                className={`h-8 w-8 transition-all ${
                  isInWatchlist
                    ? 'fill-yellow-500 text-yellow-500 scale-110'
                    : 'text-gray-400 group-hover:text-yellow-500'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Prix principal */}
            <div className="space-y-4">
              <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {formatPrice(currentPrice, currency)}
              </div>
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl ${
                isPositive
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                  : 'bg-gradient-to-r from-red-500 to-rose-500'
              } shadow-lg`}>
                {isPositive ? (
                  <ArrowUpRight className="h-6 w-6 text-white" />
                ) : (
                  <ArrowDownRight className="h-6 w-6 text-white" />
                )}
                <span className="text-2xl font-bold text-white">
                  {formatPercentage(priceChange24h)}
                </span>
                <span className="text-white/90 font-semibold">24h</span>
              </div>
            </div>

            {/* Stats compactes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">Market Cap</div>
                <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  {formatMarketCap(marketData?.market_cap?.[currency] || 0, currency)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Volume 24h</div>
                <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {formatMarketCap(marketData?.total_volume?.[currency] || 0, currency)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
                <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2">ATH</div>
                <div className="text-xl font-bold text-green-900 dark:text-green-100">
                  {formatPrice(marketData?.ath?.[currency] || 0, currency)}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800">
                <div className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-2">ATL</div>
                <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
                  {formatPrice(marketData?.atl?.[currency] || 0, currency)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-xl hover:shadow-2xl transition-shadow animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
            <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Évolution du prix
          </h2>
        </div>
        <PriceChart cryptoId={cryptoId} />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-xl hover:shadow-2xl transition-shadow animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Statistiques
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Circulating Supply</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatSupply(marketData?.circulating_supply || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Supply</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatSupply(marketData?.total_supply || null)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Max Supply</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {formatSupply(marketData?.max_supply || null)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-xl hover:shadow-2xl transition-shadow animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Liens
          </h2>
          <div className="space-y-3">
            {crypto.links?.homepage?.[0] && (
              <a
                href={crypto.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/30 dark:hover:to-cyan-900/30 border border-blue-200 dark:border-blue-800 transition-all"
              >
                <span className="font-semibold text-blue-600 dark:text-blue-400">Site officiel</span>
                <ExternalLink className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
            {crypto.links?.blockchain_site?.[0] && (
              <a
                href={crypto.links.blockchain_site[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 border border-purple-200 dark:border-purple-800 transition-all"
              >
                <span className="font-semibold text-purple-600 dark:text-purple-400">Explorateur blockchain</span>
                <ExternalLink className="h-5 w-5 text-purple-500 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
            {crypto.links?.subreddit_url && (
              <a
                href={crypto.links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/30 dark:hover:to-red-900/30 border border-orange-200 dark:border-orange-800 transition-all"
              >
                <span className="font-semibold text-orange-600 dark:text-orange-400">Reddit</span>
                <ExternalLink className="h-5 w-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {crypto.description?.en && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-8 shadow-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            À propos de {crypto.name}
          </h2>
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: truncate(crypto.description.en, 800),
            }}
          />
        </div>
      )}
    </div>
  );
}
