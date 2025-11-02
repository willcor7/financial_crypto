'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Moon, Sun, TrendingUp, Menu, X, Zap } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useCurrency } from '@/context/CurrencyContext';
import { usePathname } from 'next/navigation';
import type { Currency } from '@/types/crypto';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencies: { value: Currency; label: string }[] = [
    { value: 'usd', label: 'USD' },
    { value: 'eur', label: 'EUR' },
    { value: 'btc', label: 'BTC' },
  ];

  const navLinks = [
    { href: '/', label: 'Marché', icon: TrendingUp },
    { href: '/watchlist', label: 'Watchlist', icon: null },
    { href: '/edge', label: 'Edge', icon: Zap },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-200 shadow-lg shadow-blue-500/30">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              CryptoTracker
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <span className="flex items-center space-x-2">
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Sélecteur de devise */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.label}
                </option>
              ))}
            </select>

            {/* Toggle thème */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-5 w-5 text-yellow-500" />
              )}
            </button>

            {/* Menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all
                      ${isActive
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <span className="flex items-center space-x-2">
                      {Icon && <Icon className="h-4 w-4" />}
                      <span>{link.label}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
