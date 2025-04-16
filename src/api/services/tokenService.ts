import apiClient from '../apiClient';

export interface TokenData {
  id: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number | null;
  image_uri: string;
  status: string;
  tx_hash: string;
  created_at: string;
  updated_at: string;
}

export interface PoolData {
  id: number;
  address: string;
  token_id: number;
  base_mint: string;
  quote_mint: string;
  base_reserve: number | null;
  price_quote_per_base: number | null;
  liquidity_in_quote: number | null;
  k_value: number | null;
  created_at: string;
  updated_at: string;
}

export interface VolumeData {
  h1: number;
  h6: number;
  m5: number;
  h24: number;
}

export interface LiquidityData {
  usd: number;
  base: number;
  quote: number;
}

export interface TransactionData {
  buys: number;
  sells: number;
}

export interface TransactionsData {
  h1: TransactionData;
  h6: TransactionData;
  m5: TransactionData;
  h24: TransactionData;
}

export interface MetricsData {
  id: number;
  token_id: number;
  pair_address: string;
  timestamp: string;
  price_sol: number;
  price_usd: number;
  market_cap: number;
  volume: VolumeData;
  liquidity: LiquidityData;
  txns: TransactionsData;
}

export interface TokenInfo {
  token: TokenData;
  pool: PoolData | null;
  metrics: MetricsData | null;
}

export interface TokensResponse {
  data: TokenInfo[];
}

/**
 * Service for handling trading-related API calls
 */
class TokenService {
  /**
   * Get a list of tokens
   * @returns Promise with tokens data
   */
  async getTokens(): Promise<TokensResponse> {
    const { data } = await apiClient.get<TokensResponse>('/token/list');
    return data;
  }
}

export const tokenService = new TokenService();
export default tokenService; 