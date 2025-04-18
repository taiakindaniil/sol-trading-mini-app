import apiClient from '../apiClient';

export interface UserProfile {
  id: string;
  username: string;
  telegramId: number;
  avatar?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface UserSettings {
  priority_fee_in_sol: number;
  slippage_percent: number;
  buy_amount_in_sol: number;
  sell_amount_percent: number;
  updated_at: string;
}

export interface UserSettingsResponse {
  data: UserSettings;
  success: boolean;
  message?: string;
  detail?: string;
}

export interface ReferralData {
  ref_username: string;
  referral_commission?: number;
  referral_count?: number;
}

export interface ReferralResponse {
  data: ReferralData;
  success: boolean;
  message?: string;
  detail?: string;
}

/**
 * Service for handling user-related API calls
 */
class UserService {
  /**
   * Fetch the current user's profile
   * @returns Promise with user profile data
   */
  async getProfile(): Promise<UserProfile> {
    const { data } = await apiClient.get<UserProfile>('/user/profile');
    return data;
  }

  /**
   * Update the user's profile
   * @param profileData - Partial profile data to update
   * @returns Promise with updated user profile
   */
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    const { data } = await apiClient.put<UserProfile>('/user/profile', profileData);
    return data;
  }

  /**
   * Fetch the current user's settings
   * @returns Promise with user settings
   */
  async getSettings(): Promise<UserSettings> {
    const { data } = await apiClient.get<UserSettingsResponse>('/my/settings');
    return data.data;
  }

  /**
   * Update the user's settings
   * @param settings - Partial settings to update
   * @returns Promise with updated settings
   */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const { data } = await apiClient.post<UserSettings>('/my/settings', settings);
    return data;
  }

  /**
   * Link a new wallet to the user's account
   * @param walletAddress - Wallet address to link
   * @returns Promise with success status
   */
  async linkWallet(walletAddress: string): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.post('/user/wallets/link', { walletAddress });
    return data;
  }

  /**
   * Get referral data for the current user
   * @returns Promise with referral data
   */
  async getReferralData(): Promise<ReferralResponse> {
    const { data } = await apiClient.get<ReferralResponse>('/my/referral');
    return data;
  }
}

export const userService = new UserService();
export default userService; 