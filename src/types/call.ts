/**
 * Call related types
 */


export type CallStatus = 
  | 'initiated'
  | 'ringing'
  | 'in_progress'
  | 'completed'
  | 'failed'
  | 'no_answer';

export type SentimentType = 'positive' | 'negative' | 'neutral' | 'unknown';

export type CallType = 'web' | 'phone';

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface PostCallAnalysis {
  sentiment: SentimentType;
  sentiment_confidence: number;
  quality_score: number;
  summary: string;
  key_topics: string[];
  goal_achieved: boolean;
  cooperation_level: 'high' | 'medium' | 'low' | 'unknown';
  analysis_timestamp?: string;
}

export interface Call {
  id: number; // Your database primary key
  driver_name: string;
  phone_number: string;
  load_number: string;
  agent_configuration_id: number; // Foreign key to your agents table
  retell_call_id: string | null; // Retell's call ID (string)
  status: CallStatus;
  duration: number | null;
  raw_transcript: string | null;
  conversation_history: ConversationMessage[] | null;
  structured_results: Record<string, any> | null;
  post_call_analysis: PostCallAnalysis | null;
  recording_url: string | null;
  error_message: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string | null;
}

/**
 * Payload for creating a call (both web and phone)
 * Used by frontend to send to backend
 */
export interface CallCreatePayload {
  driver_name: string;
  phone_number: string;
  load_number: string;
  agent_configuration_id: number; 
}

/**
 * Web Call Response from Backend
 * Backend returns after creating web call
 */
export interface WebCallResponse {
  call_id: number; // Your database ID
  retell_call_id: string; // Retell's ID
  access_token: string; // For Retell SDK
  sample_rate: number;
  driver_name: string;
  load_number: string;
  status: string;
}

/**
 * Phone Call Response from Backend
 * Backend returns after initiating phone call
 */
export interface PhoneCallResponse {
  id: number; // Your database ID
  retell_call_id: string; // Retell's ID
  driver_name: string;
  phone_number: string;
  load_number: string;
  status: string;
  agent_configuration_id: number;
  created_at: string;
}

/**
 * Get Calls List Response
 */
export interface CallsResponse {
  calls: Call[];
  total: number;
}

/**
 * Retell API - Web Call Request
 * Used when backend calls Retell API
 */
export interface RetellWebCallRequest {
  agent_id: string; // Retell's agent ID (string)
  metadata?: Record<string, any>;
  retell_llm_dynamic_variables?: Record<string, any>;
}

/**
 * Retell API - Web Call Response
 * What Retell API returns
 */
export interface RetellWebCallResponse {
  call_id: string; // Retell's call ID (always string)
  access_token: string;
  agent_id: string;
  sample_rate: number;
  call_status?: string;
}

/**
 * Retell API - Phone Call Request
 * Used when backend calls Retell API
 */
export interface RetellPhoneCallRequest {
  from_number: string; // Your Retell phone number
  to_number: string; // Driver's phone number
  agent_id: string; // Retell's agent ID (string)
  metadata?: Record<string, any>;
  retell_llm_dynamic_variables?: Record<string, any>;
}

/**
 * Retell API - Phone Call Response
 */
export interface RetellPhoneCallResponse {
  call_id: string; // Retell's call ID (always string)
  agent_id: string;
  call_status: string;
  from_number: string;
  to_number: string;
}


export interface CreateCallRequest {
  driver_name: string;
  phone_number: string;
  load_number: string;
  agent_configuration_id: number;
}


export interface CallListResponse {
  calls: Call[];
  total: number;
}