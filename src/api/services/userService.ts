import apiClient from '../apiClient';
import { TokenData } from './tokenService';

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
  bot_username: string;
  ref_username: string;
  ref_percent: number;
  ref_invited?: number;
}

export interface ReferralResponse {
  data: ReferralData;
  success: boolean;
  message?: string;
  detail?: string;
}

export interface OpenPositionResponse {
  data: {
    metadata: {
      description: string;
      name: string;
      symbol: string;
      token_standard: string;
    };
    token_info: {
      address: string;
      decimals: number;
      total_usd_price?: number;
    };
    balance: number;
  }[];
  success: boolean;
  message?: string; 
  detail?: string;
}

export interface ClosedPositionsResponse {
  data: {
    token: TokenData;
    buy_amount_sol: number;
    sell_amount_sol: number;
    pnl_sol: number;
    pnl_percentage: number;
    remaining_tokens: number;
  }[];
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
   * Get referral data for the current user
   * @returns Promise with referral data
   */
  async getReferralData(): Promise<ReferralResponse> {
    const { data } = await apiClient.get<ReferralResponse>('/my/referral');
    return data;
  }

  async getOpenPositions(): Promise<OpenPositionResponse> {
    const { data } = await apiClient.get<OpenPositionResponse>('/my/positions/open');
    return data;
  }

  async getClosedPositions(): Promise<ClosedPositionsResponse> {
    const { data } = await apiClient.get<ClosedPositionsResponse>('/my/positions/closed');
    return data;
  }
}

export const userService = new UserService();
export default userService; 