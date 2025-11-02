'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, DollarSign, Activity, Percent } from 'lucide-react';
import { getGlobalMarketData } from '@/lib/api/coingecko';
import { formatMarketCap, formatPercentage, getColorClass } from '@/lib/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';

export function MarketOverview() {
  const { currency } = useCurrency();

  const { data: globalData, isLoading, error } = useQuery({
    queryKey: ['globalMarketData'],
    queryFn: getGlobalMarketData,
    refetchInterval: 60000, // 1 minute
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !globalData) {
    return null;
  }

  const totalMarketCap = globalData.total_market_cap[currency] || 0;
  const totalVolume = globalData.total_volume[currency] || 0;
  const btcDominance = globalData.market_cap_percentage.btc || 0;
  const marketCapChange = globalData.market_cap_change_percentage_24h_usd || 0;

  const stats = [
    {
      icon: DollarSign,
      label: 'Market Cap Total',
      value: formatMarketCap(totalMarketCap, currency),
      change: marketCapChange,
    },
    {
      icon: Activity,
      label: 'Volume 24h',
      value: formatMarketCap(totalVolume, currency),
    },
    {
      icon: TrendingUp,
      label: 'Dominance BTC',
      value: `${btcDominance.toFixed(2)}%`,
    },
    {
      icon: Percent,
      label: 'Cryptomonnaies',
      value: globalData.active_cryptocurrencies.toLocaleString(),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </span>
              <Icon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            {stat.change !== undefined && (
              <div className={`text-sm font-medium ${getColorClass(stat.change)}`}>
                {formatPercentage(stat.change)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
