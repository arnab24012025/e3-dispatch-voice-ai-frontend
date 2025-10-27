/**
 * Agent configuration types
 */

export type ScenarioType = 'check-in' | 'emergency' | 'custom';

export interface VoiceSettings {
  voice_id?: string;
  voice_temperature?: number;
  voice_speed?: number;
  responsiveness?: number;
  interruption_sensitivity?: number;
  enable_backchannel?: boolean;
  backchannel_frequency?: number;
  backchannel_words?: string[];
  ambient_sound?: string;
  language?: string;
  opt_out_sensitive_data_storage?: boolean;
}

export interface AgentConfiguration {
  id: number;
  name: string;
  description: string | null;
  system_prompt: string;
  initial_message: string | null;
  voice_settings: VoiceSettings | null;
  retell_agent_id: string | null;
  is_active: boolean;
  scenario_type: ScenarioType;
  created_by: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface CreateAgentRequest {
  name: string;
  description?: string;
  system_prompt: string;
  initial_message?: string;
  voice_settings?: VoiceSettings;
  scenario_type: ScenarioType;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  system_prompt?: string;
  initial_message?: string;
  voice_settings?: VoiceSettings;
  is_active?: boolean;
  scenario_type?: ScenarioType;
}