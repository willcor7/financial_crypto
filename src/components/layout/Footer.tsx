'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* À propos */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              CryptoTracker
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Suivez les prix des cryptomonnaies en temps réel avec des données
              provenant de CoinGecko.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  Marché
                </Link>
              </li>
              <li>
                <Link
                  href="/watchlist"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  Watchlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Sources de données
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.coingecko.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  CoinGecko API
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} CryptoTracker. Données fournies par CoinGecko.
          </p>
        </div>
      </div>
    </footer>
  );
}
