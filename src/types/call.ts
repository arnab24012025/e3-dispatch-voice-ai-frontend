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
  id: number;
  driver_name: string;
  phone_number: string;
  load_number: string;
  agent_configuration_id: number;
  retell_call_id: string | null;
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

export interface CreateCallRequest {
  driver_name: string;
  phone_number: string;
  load_number: string;
  agent_configuration_id: number;
}

export interface WebCallResponse {
  call_id: number;
  retell_call_id: string;
  access_token: string;
  sample_rate: number;
  driver_name: string;
  load_number: string;
  status: string;
}

export interface CallListResponse {
  calls: Call[];
  total: number;
}