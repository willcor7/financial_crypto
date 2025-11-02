'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Crypto } from '@/types/crypto';
import { formatPrice, formatPercentage, getColorClass } from '@/lib/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';

interface CryptoCardProps {
  crypto: Crypto;
  onClick?: () => void;
}

export function CryptoCard({ crypto, onClick }: CryptoCardProps) {
  const { currency } = useCurrency();
  const isPositive = crypto.price_change_percentage_24h > 0;

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Image
            src={crypto.image}
            alt={crypto.name}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {crypto.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase">
              {crypto.symbol}
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          #{crypto.market_cap_rank}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPrice(crypto.current_price, currency)}
          </span>
        </div>

        <div className="flex items-center space-x-1">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${getColorClass(crypto.price_change_percentage_24h)}`}>
            {formatPercentage(crypto.price_change_percentage_24h)}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">24h</span>
        </div>
      </div>
    </div>
  );
}
