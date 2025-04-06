import apiClient from '../apiClient';

export interface WalletData {
  address: string;
  balance: number;
}

export interface TransactionResponse {
  id: string;
  status: string;
  amount: number;
  timestamp: number;
}

/**
 * Service for handling wallet-related API calls
 */
class WalletService {
  /**
   * Fetch wallet data for the current user
   * @returns Promise with wallet data
   */
  async getWalletData(): Promise<WalletData> {
    const { data } = await apiClient.get<WalletData>('/my/wallet');
    return data;
  }

  /**
   * Send SOL to another wallet
   * @param recipientAddress - Recipient wallet address
   * @param amount - Amount of SOL to send
   * @returns Promise with transaction information
   */
  async sendSol(recipientAddress: string, amount: number): Promise<TransactionResponse> {
    const { data } = await apiClient.post<TransactionResponse>('/my/wallet/send', {
      recipientAddress,
      amount
    });
    return data;
  }

  /**
   * Generate a deposit address or link
   * @returns Promise with deposit information
   */
  async getDepositInfo(): Promise<{ address: string; qrCode?: string }> {
    const { data } = await apiClient.get('/my/wallet/deposit');
    return data;
  }

  /**
   * Get transaction history for the current wallet
   * @param limit - Optional limit for number of transactions
   * @param offset - Optional offset for pagination
   * @returns Promise with transaction list
   */
  async getTransactionHistory(limit = 10, offset = 0): Promise<TransactionResponse[]> {
    const { data } = await apiClient.get('/my/wallet/transactions', {
      params: { limit, offset }
    });
    return data;
  }

  /**
   * Export wallet (e.g., get private key, mnemonic, etc.)
   * @returns Promise with export information
   */
  async exportWallet(): Promise<{ privateKey?: string; mnemonic?: string; qrCode?: string }> {
    const { data } = await apiClient.get('/my/wallet/export');
    return data;
  }
}

export const walletService = new WalletService();
export default walletService; 