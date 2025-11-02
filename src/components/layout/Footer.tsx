'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                CryptoTracker
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Suivez les prix des cryptomonnaies en temps réel avec des analyses avancées et des données fiables provenant de CoinGecko.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </a>
              <a
                href="mailto:contact@cryptotracker.com"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm">
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
              <li>
                <Link
                  href="/edge"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  Edge
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Ressources
            </h3>
            <ul className="space-y-3 text-sm">
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
              <li>
                <a
                  href="https://docs.coingecko.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://www.coingecko.com/en/api/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
                >
                  API Plans
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} CryptoTracker. Toutes les données sont fournies par CoinGecko.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Confidentialité
              </Link>
              <Link
                href="/terms"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
