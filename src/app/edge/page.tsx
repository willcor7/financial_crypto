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
      {/* Header avec animations */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>

        {/* Effets de lumière */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>

        <div className="relative z-10 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm animate-pulse-glow border border-white/30">
              <Zap className="h-10 w-10" />
            </div>
            <div className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="text-white/90 text-sm font-bold">Analyses en direct</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3">Edge</h1>
          <p className="text-xl text-white/90 max-w-2xl">Analyses avancées et tendances du marché crypto avec données en temps réel</p>
        </div>
      </div>

      {/* Stats rapides avec animations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-green-700 dark:text-green-300">Top Gainer 24h</span>
            <div className="p-2 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          {topGainers?.[0] && (
            <>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {formatPercentage(topGainers[0].price_change_percentage_24h)}
              </div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300 truncate">
                {topGainers[0].name}
              </div>
            </>
          )}
        </div>

        <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-red-700 dark:text-red-300">Top Loser 24h</span>
            <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          {topLosers?.[0] && (
            <>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                {formatPercentage(topLosers[0].price_change_percentage_24h)}
              </div>
              <div className="text-sm font-medium text-red-700 dark:text-red-300 truncate">
                {topLosers[0].name}
              </div>
            </>
          )}
        </div>

        <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Trending</span>
            <div className="p-2 rounded-xl bg-orange-500/20 group-hover:bg-orange-500/30 transition-colors">
              <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
            {trending?.length || 0}
          </div>
          <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
            Cryptos populaires
          </div>
        </div>

        <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Activité</span>
            <div className="p-2 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {allCryptos?.length || 0}
          </div>
          <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
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
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">Aucune donnée disponible</p>
      </div>
    );
  }

  return (
    <div className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all">
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => {
          if (type === 'trending') {
            const coin = item.item;
            return (
              <Link
                key={coin.id}
                href={`/crypto/${coin.id}`}
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:shadow-md transition-all duration-200 group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-6">
                  {index + 1}
                </span>
                <div className="relative">
                  <Image
                    src={coin.small}
                    alt={coin.name}
                    width={40}
                    height={40}
                    className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {coin.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 uppercase font-semibold">
                    {coin.symbol}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg">
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
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:shadow-md transition-all duration-200 group border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                <span className="text-sm font-bold text-gray-400 dark:text-gray-500 w-6">
                  {index + 1}
                </span>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-500 transition-all"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                    {formatPrice(item.current_price, currency)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold px-3 py-1.5 rounded-lg ${getColorClass(item.price_change_percentage_24h)} ${
                    item.price_change_percentage_24h > 0
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
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
