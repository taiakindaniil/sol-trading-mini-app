import apiClient from '../apiClient';

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface OrderParams {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price?: number; // Required for limit orders
}

export interface Order extends OrderParams {
  id: string;
  status: 'open' | 'filled' | 'canceled' | 'partial';
  createdAt: string;
  updatedAt: string;
  filledQuantity: number;
  averagePrice?: number;
}

export interface TradeHistory {
  id: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  executedAt: string;
  fee: number;
}

/**
 * Service for handling trading-related API calls
 */
class TradingService {
  /**
   * Get market data for all available trading pairs
   * @returns Promise with market data
   */
  async getMarkets(): Promise<MarketData[]> {
    const { data } = await apiClient.get<MarketData[]>('/markets');
    return data;
  }

  /**
   * Get detailed market data for a specific symbol
   * @param symbol - Market symbol (e.g. "SOL/USDT")
   * @returns Promise with market data
   */
  async getMarketDetail(symbol: string): Promise<MarketData> {
    const { data } = await apiClient.get<MarketData>(`/markets/${symbol}`);
    return data;
  }

  /**
   * Place a new order
   * @param orderParams - Order parameters
   * @returns Promise with order information
   */
  async placeOrder(orderParams: OrderParams): Promise<Order> {
    const { data } = await apiClient.post<Order>('/trading/orders', orderParams);
    return data;
  }

  /**
   * Get all open orders
   * @param symbol - Optional symbol to filter by
   * @returns Promise with open orders
   */
  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const params = symbol ? { symbol } : undefined;
    const { data } = await apiClient.get<Order[]>('/trading/orders/open', { params });
    return data;
  }

  /**
   * Get order history
   * @param limit - Optional limit for number of orders
   * @param offset - Optional offset for pagination
   * @returns Promise with order history
   */
  async getOrderHistory(limit = 10, offset = 0): Promise<Order[]> {
    const { data } = await apiClient.get<Order[]>('/trading/orders/history', {
      params: { limit, offset }
    });
    return data;
  }

  /**
   * Cancel an order
   * @param orderId - ID of the order to cancel
   * @returns Promise with canceled order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    const { data } = await apiClient.delete<Order>(`/trading/orders/${orderId}`);
    return data;
  }

  /**
   * Get trade history
   * @param limit - Optional limit for number of trades
   * @param offset - Optional offset for pagination
   * @returns Promise with trade history
   */
  async getTradeHistory(limit = 10, offset = 0): Promise<TradeHistory[]> {
    const { data } = await apiClient.get<TradeHistory[]>('/trading/trades', {
      params: { limit, offset }
    });
    return data;
  }
}

export const tradingService = new TradingService();
export default tradingService; 