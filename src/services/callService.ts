import api from './api';
import type { 
  CallCreatePayload, 
  WebCallResponse, 
  PhoneCallResponse,
  CallsResponse 
} from '../types';

class CallService {
  /**
   * Initiate a web call (browser-based)
   */
  async initiateWebCall(payload: CallCreatePayload): Promise<WebCallResponse> {
    const response = await api.post<WebCallResponse>('/calls/web-call', payload);
    return response.data;
  }

  /**
   * Initiate a phone call (real telephony)
   */
  async initiatePhoneCall(payload: CallCreatePayload): Promise<PhoneCallResponse> {
    const response = await api.post<PhoneCallResponse>('/calls/', payload);
    return response.data;
  }

  /**
   * Get list of calls with filters
   */
  async getCalls(params?: {
    skip?: number;
    limit?: number;
    load_number?: string;
    status?: string;
    sentiment?: string;
  }): Promise<CallsResponse> {
    const response = await api.get<CallsResponse>('/calls/', { params });
    return response.data;
  }

  /**
   * Get call by ID
   */
  async getCallById(callId: number) {
    const response = await api.get(`/calls/${callId}`);
    return response.data;
  }

  /**
   * Refresh call status from Retell AI
   */
  async refreshCallStatus(callId: number) {
    const response = await api.get(`/calls/${callId}/refresh`);
    return response.data;
  }
}

export default new CallService();