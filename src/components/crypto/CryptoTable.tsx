'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import type { Crypto } from '@/types/crypto';
import { formatPrice, formatMarketCap, formatPercentage, getColorClass } from '@/lib/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';

interface CryptoTableProps {
  cryptos: Crypto[];
  onToggleWatchlist?: (id: string) => void;
  watchlist?: string[];
}

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
type SortOrder = 'asc' | 'desc';

export function CryptoTable({ cryptos, onToggleWatchlist, watchlist = [] }: CryptoTableProps) {
  const { currency } = useCurrency();
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedCryptos = [...cryptos].sort((a, b) => {
    const aValue = a[sortField] || 0;
    const bValue = b[sortField] || 0;
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-gray-200 dark:border-gray-800">
          <tr className="text-left text-sm text-gray-600 dark:text-gray-400">
            <th className="pb-3 pl-4 pr-2 w-12"></th>
            <th
              className="pb-3 px-2 cursor-pointer hover:text-gray-900 dark:hover:text-white"
              onClick={() => handleSort('market_cap_rank')}
            >
              #
            </th>
            <th className="pb-3 px-2">Nom</th>
            <th
              className="pb-3 px-2 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white"
              onClick={() => handleSort('current_price')}
            >
              Prix
            </th>
            <th
              className="pb-3 px-2 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white"
              onClick={() => handleSort('price_change_percentage_24h')}
            >
              24h %
            </th>
            <th
              className="pb-3 px-2 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white hidden md:table-cell"
              onClick={() => handleSort('market_cap')}
            >
              Market Cap
            </th>
            <th
              className="pb-3 px-2 text-right cursor-pointer hover:text-gray-900 dark:hover:text-white hidden lg:table-cell"
              onClick={() => handleSort('total_volume')}
            >
              Volume 24h
            </th>
            <th className="pb-3 px-2 hidden xl:table-cell">7j</th>
          </tr>
        </thead>
        <tbody>
          {sortedCryptos.map((crypto) => {
            const isPositive = crypto.price_change_percentage_24h > 0;
            const isInWatchlist = watchlist.includes(crypto.id);

            return (
              <tr
                key={crypto.id}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <td className="py-4 pl-4 pr-2">
                  {onToggleWatchlist && (
                    <button
                      onClick={() => onToggleWatchlist(crypto.id)}
                      className="hover:scale-110 transition"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          isInWatchlist
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  )}
                </td>
                <td className="py-4 px-2 text-gray-600 dark:text-gray-400">
                  {crypto.market_cap_rank}
                </td>
                <td className="py-4 px-2">
                  <Link href={`/crypto/${crypto.id}`} className="flex items-center space-x-3 hover:opacity-80">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {crypto.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 uppercase">
                        {crypto.symbol}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-2 text-right font-medium text-gray-900 dark:text-white">
                  {formatPrice(crypto.current_price, currency)}
                </td>
                <td className="py-4 px-2 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    {isPositive ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`font-medium ${getColorClass(crypto.price_change_percentage_24h)}`}>
                      {formatPercentage(crypto.price_change_percentage_24h)}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-2 text-right text-gray-900 dark:text-white hidden md:table-cell">
                  {formatMarketCap(crypto.market_cap, currency)}
                </td>
                <td className="py-4 px-2 text-right text-gray-900 dark:text-white hidden lg:table-cell">
                  {formatMarketCap(crypto.total_volume, currency)}
                </td>
                <td className="py-4 px-2 hidden xl:table-cell">
                  {crypto.sparkline_in_7d && (
                    <MiniSparkline data={crypto.sparkline_in_7d.price} />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function MiniSparkline({ data }: { data: number[] }) {
  if (!data || data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  const isPositive = data[data.length - 1] > data[0];

  return (
    <svg width="100" height="40" className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={isPositive ? '#10b981' : '#ef4444'}
        strokeWidth="2"
      />
    </svg>
  );
}
