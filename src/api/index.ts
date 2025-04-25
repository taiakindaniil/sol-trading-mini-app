import apiClient, { setInitData } from './apiClient';
import walletService from './services/walletService';
import type { WalletData, TransactionResponse } from './services/walletService';
import userService from './services/userService';
import type { UserProfile, UserSettings, ReferralResponse } from './services/userService';
import tradingService from './services/tradingService';
import tokenService from './services/tokenService';
import type { TokenTxHistoryResponse } from './services/tokenService';
import type { 
  MarketData, 
  Order, 
  OrderParams, 
  TradeHistory 
} from './services/tradingService';
import useApi from './hooks/useApi';
import createApiService from './createService';
// Export services
export {
  // API client
  apiClient,
  setInitData,
  
  // Wallet service
  walletService,
  
  // User service
  userService,
  
  // Trading service
  tradingService,

  // Token service
  tokenService,
  
  // Hooks
  useApi,
  
  // Helpers
  createApiService,
};

// Export types
export type {
  // Wallet types
  WalletData,
  TransactionResponse,
  
  // User types
  UserProfile,
  UserSettings,
  ReferralResponse,
  
  // Trading types
  MarketData,
  Order,
  OrderParams,
  TradeHistory,

  // Token types
  TokenTxHistoryResponse,
};

// Create a single API object that contains all services
const api = {
  wallet: walletService,
  user: userService,
  trading: tradingService,
  token: tokenService,
  setInitData,
};

export default api; 