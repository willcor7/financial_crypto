'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useCryptoHistory } from '@/hooks/useCryptoHistory';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';
import type { TimeRange } from '@/types/crypto';

interface PriceChartProps {
  cryptoId: string;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: '1', label: '24H' },
  { value: '7', label: '7J' },
  { value: '30', label: '1M' },
  { value: '90', label: '3M' },
  { value: '365', label: '1A' },
  { value: 'max', label: 'MAX' },
];

export function PriceChart({ cryptoId }: PriceChartProps) {
  const { currency } = useCurrency();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('7');

  const { data: chartData, isLoading, error } = useCryptoHistory({
    id: cryptoId,
    currency,
    days: selectedRange,
  });

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Erreur lors du chargement du graphique
      </div>
    );
  }

  const formattedData = chartData.prices.map(([timestamp, price]) => ({
    timestamp,
    price,
    date: new Date(timestamp),
  }));

  const isPositive =
    formattedData.length > 0 &&
    formattedData[formattedData.length - 1].price > formattedData[0].price;

  return (
    <div className="space-y-4">
      {/* Sélecteur de période */}
      <div className="flex items-center justify-end space-x-2">
        {timeRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => setSelectedRange(range.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              selectedRange === range.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Graphique */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => {
                const date = new Date(value);
                if (selectedRange === '1') {
                  return date.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                }
                return date.toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                });
              }}
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => formatPrice(value, currency, 2)}
              stroke="#9CA3AF"
              fontSize={12}
              width={80}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {formatDate(data.timestamp)}
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatPrice(data.price, currency)}
                    </p>
                  </div>
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
