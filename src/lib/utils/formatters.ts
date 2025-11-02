import type { Currency } from '@/types/crypto';

/**
 * Formate un prix avec la devise appropriée
 * @param price - Prix à formater
 * @param currency - Devise (usd, eur, btc)
 * @param decimals - Nombre de décimales (auto par défaut)
 */
export function formatPrice(
  price: number,
  currency: Currency = 'usd',
  decimals?: number
): string {
  if (price === null || price === undefined) return 'N/A';

  // Déterminer le nombre de décimales automatiquement si non spécifié
  let autoDecimals = decimals;
  if (autoDecimals === undefined) {
    if (price >= 1000) autoDecimals = 0;
    else if (price >= 1) autoDecimals = 2;
    else if (price >= 0.01) autoDecimals = 4;
    else if (price >= 0.0001) autoDecimals = 6;
    else autoDecimals = 8;
  }

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: autoDecimals,
    maximumFractionDigits: autoDecimals,
  }).format(price);

  // Symboles de devise
  const symbols: Record<Currency, string> = {
    usd: '$',
    eur: '€',
    btc: '₿',
  };

  return `${symbols[currency]}${formatted}`;
}

/**
 * Formate une market cap ou un volume en millions/milliards
 * @param value - Valeur à formater
 * @param currency - Devise
 */
export function formatMarketCap(value: number, currency: Currency = 'usd'): string {
  if (value === null || value === undefined) return 'N/A';

  const symbols: Record<Currency, string> = {
    usd: '$',
    eur: '€',
    btc: '₿',
  };

  const symbol = symbols[currency];

  if (value >= 1_000_000_000_000) {
    return `${symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
  } else if (value >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(2)}K`;
  } else {
    return `${symbol}${value.toFixed(2)}`;
  }
}

/**
 * Formate un pourcentage avec couleur (pour variation de prix)
 * @param percentage - Pourcentage à formater
 * @param includeSign - Inclure le signe + pour les positifs
 */
export function formatPercentage(
  percentage: number,
  includeSign: boolean = true
): string {
  if (percentage === null || percentage === undefined) return 'N/A';

  const sign = includeSign && percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
}

/**
 * Retourne la classe CSS pour la couleur basée sur la variation
 * @param value - Valeur de variation (positive ou négative)
 */
export function getColorClass(value: number): string {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
}

/**
 * Formate une date au format lisible
 * @param timestamp - Timestamp en millisecondes ou date ISO
 */
export function formatDate(timestamp: number | string): string {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Formate une date au format court (ex: "2 jours")
 * @param timestamp - Timestamp en millisecondes
 */
export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  if (months > 0) return `Il y a ${months} mois`;
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  return 'À l\'instant';
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @param value - Nombre à formater
 * @param decimals - Nombre de décimales
 */
export function formatNumber(value: number, decimals: number = 0): string {
  if (value === null || value === undefined) return 'N/A';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Formate un supply de tokens
 * @param supply - Nombre de tokens
 */
export function formatSupply(supply: number | null): string {
  if (supply === null || supply === undefined) return 'N/A';

  if (supply >= 1_000_000_000) {
    return `${(supply / 1_000_000_000).toFixed(2)}B`;
  } else if (supply >= 1_000_000) {
    return `${(supply / 1_000_000).toFixed(2)}M`;
  } else if (supply >= 1_000) {
    return `${(supply / 1_000).toFixed(2)}K`;
  }

  return formatNumber(supply, 0);
}

/**
 * Tronque une chaîne avec ellipse
 * @param str - Chaîne à tronquer
 * @param length - Longueur maximale
 */
export function truncate(str: string, length: number = 50): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}
