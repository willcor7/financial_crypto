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
  Area,
  AreaChart,
} from 'recharts';
import { useCryptoHistory } from '@/hooks/useCryptoHistory';
import { formatPrice, formatDate } from '@/lib/utils/formatters';
import { useCurrency } from '@/context/CurrencyContext';
import type { TimeRange } from '@/types/crypto';
import { TrendingUp, TrendingDown } from 'lucide-react';

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

  const priceChange = formattedData.length > 0
    ? ((formattedData[formattedData.length - 1].price - formattedData[0].price) / formattedData[0].price) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Stats et Sélecteur de période */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Stats de variation */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
            isPositive
              ? 'bg-green-500/10 text-green-500 border border-green-500/20'
              : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="font-bold text-lg">
              {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Sélecteur de période */}
        <div className="flex items-center space-x-2 p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                selectedRange === range.value
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphique avec effet de gradient */}
      <div className="relative h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6 shadow-xl">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? '#10b981' : '#ef4444'}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#6b7280"
              opacity={0.1}
              vertical={false}
            />
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
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => formatPrice(value, currency, 2)}
              stroke="#9CA3AF"
              fontSize={11}
              width={90}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="glass p-4 rounded-xl shadow-2xl border border-white/20 backdrop-blur-xl">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-medium">
                      {formatDate(data.timestamp)}
                    </p>
                    <p className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPrice(data.price, currency)}
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? '#10b981' : '#ef4444'}
              strokeWidth={3}
              fill="url(#colorPrice)"
              dot={false}
              activeDot={{
                r: 8,
                fill: isPositive ? '#10b981' : '#ef4444',
                stroke: '#fff',
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
