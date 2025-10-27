import api from './api';
import { AgentConfiguration, CreateAgentRequest, UpdateAgentRequest } from '../types';

/**
 * Agent service for API calls
 */
class AgentService {
  /**
   * Get all agents
   */
  async getAgents(): Promise<AgentConfiguration[]> {
    const response = await api.get<AgentConfiguration[]>('/agents');
    return response.data;
  }

  /**
   * Get single agent by ID
   */
  async getAgent(id: number): Promise<AgentConfiguration> {
    const response = await api.get<AgentConfiguration>(`/agents/${id}`);
    return response.data;
  }

  /**
   * Create new agent
   */
  async createAgent(data: CreateAgentRequest): Promise<AgentConfiguration> {
    const response = await api.post<AgentConfiguration>('/agents', data);
    return response.data;
  }

  /**
   * Update existing agent
   */
  async updateAgent(id: number, data: UpdateAgentRequest): Promise<AgentConfiguration> {
    const response = await api.put<AgentConfiguration>(`/agents/${id}`, data);
    return response.data;
  }

  /**
   * Delete agent
   */
  async deleteAgent(id: number): Promise<void> {
    await api.delete(`/agents/${id}`);
  }

  /**
   * Toggle agent active status
   */
  async toggleAgentStatus(id: number, isActive: boolean): Promise<AgentConfiguration> {
    const response = await api.put<AgentConfiguration>(`/agents/${id}`, { is_active: isActive });
    return response.data;
  }
}

export default new AgentService();