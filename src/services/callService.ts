import api from './api';
import { Call, CallListResponse, CreateCallRequest, WebCallResponse } from '../types';

/**
 * Call service for API calls
 */
class CallService {
  /**
   * Get all calls with optional filters
   */
  async getCalls(params?: {
    skip?: number;
    limit?: number;
    load_number?: string;
    status?: string;
    sentiment?: string;
  }): Promise<CallListResponse> {
    const response = await api.get<CallListResponse>('/calls', { params });
    return response.data;
  }

  /**
   * Get single call by ID
   */
  async getCall(id: number): Promise<Call> {
    const response = await api.get<Call>(`/calls/${id}`);
    return response.data;
  }

  /**
   * Create phone call
   */
  async createPhoneCall(data: CreateCallRequest): Promise<Call> {
    const response = await api.post<Call>('/calls', data);
    return response.data;
  }

  /**
   * Create web call
   */
  async createWebCall(data: CreateCallRequest): Promise<WebCallResponse> {
    const response = await api.post<WebCallResponse>('/calls/web-call', data);
    return response.data;
  }

  /**
   * Refresh call status from Retell
   */
  async refreshCallStatus(id: number): Promise<Call> {
    const response = await api.get<Call>(`/calls/${id}/refresh`);
    return response.data;
  }
}

export default new CallService();