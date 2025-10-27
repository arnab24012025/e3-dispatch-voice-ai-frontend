import api from './api';
import { DashboardAnalytics, SentimentTrendResponse } from '../types';

class AnalyticsService {
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    try {
      console.log('Fetching analytics from:', '/analytics/dashboard');
      const response = await api.get<DashboardAnalytics>('/analytics/dashboard');
      console.log('Analytics response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Analytics error:', error.response?.status, error.response?.data);
      throw error;
    }
  }

  async getSentimentTrends(days: number = 30): Promise<SentimentTrendResponse> {
    try {
      const response = await api.get<SentimentTrendResponse>('/analytics/sentiment-trend', {
        params: { days },
      });
      return response.data;
    } catch (error: any) {
      console.error('Sentiment trends error:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();