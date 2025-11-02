import axios from 'axios';
import type { Crypto, CryptoDetail, MarketChart, GlobalMarketData, TrendingCoin, Currency } from '@/types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

// Configuration axios avec timeout et headers
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter la clé API si disponible
api.interceptors.request.use((config) => {
  const apiKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;
  if (apiKey) {
    config.headers['x-cg-demo-api-key'] = apiKey;
  }
  return config;
});

/**
 * Récupère la liste des cryptomonnaies avec leurs données de marché
 * @param currency - Devise de référence (usd, eur, btc)
 * @param perPage - Nombre de résultats par page
 * @param page - Numéro de page
 */
export async function getCryptoList(
  currency: Currency = 'usd',
  perPage: number = 100,
  page: number = 1
): Promise<Crypto[]> {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: true,
        price_change_percentage: '7d',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto list:', error);
    throw new Error('Failed to fetch cryptocurrency list');
  }
}

/**
 * Récupère les détails complets d'une cryptomonnaie
 * @param id - ID de la crypto (ex: 'bitcoin')
 */
export async function getCryptoDetail(id: string): Promise<CryptoDetail> {
  try {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching crypto detail for ${id}:`, error);
    throw new Error(`Failed to fetch details for ${id}`);
  }
}

/**
 * Récupère l'historique des prix d'une crypto
 * @param id - ID de la crypto
 * @param currency - Devise de référence
 * @param days - Nombre de jours d'historique ('1', '7', '30', '90', '180', '365', 'max')
 */
export async function getCryptoHistory(
  id: string,
  currency: Currency = 'usd',
  days: string = '7'
): Promise<MarketChart> {
  try {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: currency,
        days,
        interval: days === '1' ? 'hourly' : 'daily',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching crypto history for ${id}:`, error);
    throw new Error(`Failed to fetch history for ${id}`);
  }
}

/**
 * Récupère les données globales du marché crypto
 */
export async function getGlobalMarketData(): Promise<GlobalMarketData> {
  try {
    const response = await api.get('/global');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching global market data:', error);
    throw new Error('Failed to fetch global market data');
  }
}

/**
 * Récupère les cryptomonnaies tendances (trending)
 */
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const response = await api.get('/search/trending');
    return response.data.coins;
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    throw new Error('Failed to fetch trending coins');
  }
}

/**
 * Recherche des cryptomonnaies par nom ou symbole
 * @param query - Terme de recherche
 */
export async function searchCryptos(query: string): Promise<any[]> {
  try {
    const response = await api.get('/search', {
      params: { query },
    });
    return response.data.coins;
  } catch (error) {
    console.error('Error searching cryptos:', error);
    throw new Error('Failed to search cryptocurrencies');
  }
}

/**
 * Récupère le prix actuel de plusieurs cryptos
 * @param ids - Liste des IDs de cryptos séparés par virgule
 * @param currency - Devise de référence
 */
export async function getSimplePrices(
  ids: string[],
  currency: Currency = 'usd'
): Promise<{ [key: string]: { [key: string]: number } }> {
  try {
    const response = await api.get('/simple/price', {
      params: {
        ids: ids.join(','),
        vs_currencies: currency,
        include_24hr_change: true,
        include_market_cap: true,
        include_24hr_vol: true,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching simple prices:', error);
    throw new Error('Failed to fetch prices');
  }
}

/**
 * Récupère les taux de change pour convertir entre devises
 */
export async function getExchangeRates(): Promise<any> {
  try {
    const response = await api.get('/exchange_rates');
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates');
  }
}
