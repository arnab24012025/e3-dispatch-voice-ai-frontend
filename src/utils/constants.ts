/**
 * Application constants
 */

// API Base URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Local storage keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';

// Call status options
export const CALL_STATUS = {
  INITIATED: 'initiated',
  RINGING: 'ringing',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  NO_ANSWER: 'no_answer',
} as const;

// Sentiment types
export const SENTIMENT_TYPES = {
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  NEUTRAL: 'neutral',
  UNKNOWN: 'unknown',
} as const;

// Scenario types
export const SCENARIO_TYPES = {
  CHECK_IN: 'check-in',
  EMERGENCY: 'emergency',
  CUSTOM: 'custom',
} as const;

// LLM providers
export const LLM_PROVIDERS = {
  GROQ: 'groq',
  OPENAI: 'openai',
} as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 1;

// Date format
export const DATE_FORMAT = 'MMM dd, yyyy';
export const TIME_FORMAT = 'hh:mm a';
export const DATETIME_FORMAT = 'MMM dd, yyyy hh:mm a';