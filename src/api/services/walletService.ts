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

export interface WithdrawResponse {
  status?: string;
  message?: string;
  data?: {
    wallet: string;
    balance: number;
    withdrawals: {
      hash: string;
      amount_sol: number;
      wallet_from: string;
      wallet_to: string;
      created_at: string;
    }[];
  };
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
  async exportWallet(): Promise<{ private_key?: string; address?: string }> {
    const { data } = await apiClient.get('/my/wallet/export');
    return data;
  }


  async getWithdrawals(): Promise<WithdrawResponse> {
    const { data } = await apiClient.get('/my/wallet/withdraw');
    return data;
  }

  /**
   * Withdraw SOL from the wallet
   * @param amount - Amount of SOL to withdraw
   * @param address - Recipient wallet address
   */
  async withdraw(amount: number, address: string): Promise<WithdrawResponse> {
    const { data } = await apiClient.post('/my/wallet/withdraw', {
      amount,
      address
    });
    return data;
  }
}

export const walletService = new WalletService();
export default walletService; 