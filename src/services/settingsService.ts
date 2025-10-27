import api from './api';
import { LLMProviderResponse, AvailableLLMsResponse, UpdateLLMProviderRequest } from '../types';

/**
 * Settings service for API calls
 */
class SettingsService {
  /**
   * Get current LLM provider
   */
  async getCurrentProvider(): Promise<LLMProviderResponse> {
    const response = await api.get<LLMProviderResponse>('/settings/llm');
    return response.data;
  }

  /**
   * Get available LLM providers
   */
  async getAvailableProviders(): Promise<AvailableLLMsResponse> {
    const response = await api.get<AvailableLLMsResponse>('/settings/llms/available');
    return response.data;
  }

  /**
   * Update LLM provider
   */
  async updateProvider(data: UpdateLLMProviderRequest): Promise<LLMProviderResponse> {
    const response = await api.put<LLMProviderResponse>('/settings/llm', data);
    return response.data;
  }
}

export default new SettingsService();