'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, ExternalLink, Star } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto">
      {/* Bouton retour */}
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Retour au marché</span>
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Image
              src={crypto.image.large}
              alt={crypto.name}
              width={56}
              height={56}
              className="rounded-full"
            />
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {crypto.name}
                </h1>
                <span className="text-xl text-gray-500 dark:text-gray-400 uppercase">
                  {crypto.symbol}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-gray-600 dark:text-gray-400">
                <span>Rang #{crypto.market_cap_rank}</span>
              </div>
            </div>
          </div>

          <button
            onClick={toggleWatchlist}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Star
              className={`h-6 w-6 ${
                isInWatchlist
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {formatPrice(currentPrice, currency)}
            </div>
            <div className="flex items-center space-x-2">
              {isPositive ? (
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-xl font-medium ${getColorClass(priceChange24h)}`}>
                {formatPercentage(priceChange24h)}
              </span>
              <span className="text-gray-600 dark:text-gray-400">24h</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Market Cap</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatMarketCap(marketData?.market_cap?.[currency] || 0, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Volume 24h</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatMarketCap(marketData?.total_volume?.[currency] || 0, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ATH</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(marketData?.ath?.[currency] || 0, currency)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">ATL</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {formatPrice(marketData?.atl?.[currency] || 0, currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Évolution du prix
        </h2>
        <PriceChart cryptoId={cryptoId} />
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Statistiques
          </h2>
          <div className="space-y-3">
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

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Liens
          </h2>
          <div className="space-y-3">
            {crypto.links?.homepage?.[0] && (
              <a
                href={crypto.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-blue-500 hover:text-blue-600 transition"
              >
                <span>Site officiel</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {crypto.links?.blockchain_site?.[0] && (
              <a
                href={crypto.links.blockchain_site[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-blue-500 hover:text-blue-600 transition"
              >
                <span>Explorateur de blockchain</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {crypto.links?.subreddit_url && (
              <a
                href={crypto.links.subreddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-blue-500 hover:text-blue-600 transition"
              >
                <span>Reddit</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      {crypto.description?.en && (
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            À propos de {crypto.name}
          </h2>
          <div
            className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{
              __html: truncate(crypto.description.en, 800),
            }}
          />
        </div>
      )}
    </div>
  );
}
