/**
 * Settings related types
 */

export type LLMProvider = 'groq' | 'openai';

export interface LLMProviderResponse {
  llm_provider: LLMProvider;
  message?: string;
}

export interface AvailableLLMsResponse {
  providers: LLMProvider[];
  default: LLMProvider;
}

export interface UpdateLLMProviderRequest {
  llm_provider: LLMProvider;
}