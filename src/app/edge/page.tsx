'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, TrendingDown, Flame, Zap, Activity, Clock } from 'lucide-react';
import { getCryptoList, getTrendingCoins } from '@/lib/api/coingecko';
import { useCurrency } from '@/context/CurrencyContext';
import { formatPrice, formatPercentage, getColorClass } from '@/lib/utils/formatters';
import Image from 'next/image';
import Link from 'next/link';

export default function EdgePage() {
  const { currency } = useCurrency();

  const { data: allCryptos, isLoading: isLoadingAll } = useQuery({
    queryKey: ['allCryptos', currency],
    queryFn: () => getCryptoList(currency, 250, 1),
    refetchInterval: 60000,
  });

  const { data: trending, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trending'],
    queryFn: getTrendingCoins,
    refetchInterval: 60000,
  });

  // Calculer les gainers et losers
  const topGainers = allCryptos
    ?.filter((c) => c.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 10) || [];

  const topLosers = allCryptos
    ?.filter((c) => c.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 10) || [];

  const highestVolume = allCryptos
    ?.sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 10) || [];

  const recentlyAdded = allCryptos
    ?.sort((a, b) => new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime())
    .slice(0, 10) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
        <div className="absolute inset-0 bg-grid-white/10"></div>
        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Edge</h1>
              <p className="text-blue-100">Analyses avancées et tendances du marché crypto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Top Gainer 24h</span>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          {topGainers?.[0] && (
            <>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPercentage(topGainers[0].price_change_percentage_24h)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {topGainers[0].name}
              </div>
            </>
          )}
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Top Loser 24h</span>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          {topLosers?.[0] && (
            <>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {formatPercentage(topLosers[0].price_change_percentage_24h)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {topLosers[0].name}
              </div>
            </>
          )}
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Trending</span>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {trending?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Cryptos populaires
          </div>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Activité</span>
            <Activity className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {allCryptos?.length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Marchés actifs
          </div>
        </div>
      </div>

      {/* Grille de sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <Section
          title="Top Gainers 24h"
          icon={TrendingUp}
          iconColor="text-green-500"
          isLoading={isLoadingAll}
          data={topGainers}
          currency={currency}
          type="gainer"
        />

        {/* Top Losers */}
        <Section
          title="Top Losers 24h"
          icon={TrendingDown}
          iconColor="text-red-500"
          isLoading={isLoadingAll}
          data={topLosers}
          currency={currency}
          type="loser"
        />

        {/* Trending */}
        <Section
          title="Trending"
          icon={Flame}
          iconColor="text-orange-500"
          isLoading={isLoadingTrending}
          data={trending?.slice(0, 10) || []}
          currency={currency}
          type="trending"
        />

        {/* Highest Volume */}
        <Section
          title="Volume le plus élevé"
          icon={Activity}
          iconColor="text-blue-500"
          isLoading={isLoadingAll}
          data={highestVolume}
          currency={currency}
          type="volume"
        />
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  icon: React.ElementType;
  iconColor: string;
  isLoading: boolean;
  data: any[];
  currency: any;
  type: 'gainer' | 'loser' | 'trending' | 'volume' | 'recent';
}

function Section({ title, icon: Icon, iconColor, isLoading, data, currency, type }: SectionProps) {
  if (isLoading) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-2 mb-4">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => {
          if (type === 'trending') {
            const coin = item.item;
            return (
              <Link
                key={coin.id}
                href={`/crypto/${coin.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition group"
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                  #{index + 1}
                </span>
                <Image
                  src={coin.small}
                  alt={coin.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition">
                    {coin.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                    {coin.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    #{coin.market_cap_rank}
                  </div>
                </div>
              </Link>
            );
          } else {
            return (
              <Link
                key={item.id}
                href={`/crypto/${item.id}`}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition group"
              >
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                  #{index + 1}
                </span>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatPrice(item.current_price, currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getColorClass(item.price_change_percentage_24h)}`}>
                    {formatPercentage(item.price_change_percentage_24h)}
                  </div>
                </div>
              </Link>
            );
          }
        })}
      </div>
    </div>
  );
}
