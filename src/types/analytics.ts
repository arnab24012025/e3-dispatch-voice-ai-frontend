/**
 * Analytics related types
 */

export interface DashboardAnalytics {
  total_calls: number;
  completed_calls: number;
  avg_duration_seconds: number;
  sentiment_distribution: {
    positive: number;
    negative: number;
    neutral: number;
    unknown: number;
  };
  avg_quality_score: number;
  goal_achievement_rate: number;
  emergency_calls: number;
  recent_calls_7_days: number;
  top_topics: Array<{
    topic: string;
    count: number;
  }>;
}

export interface SentimentTrendData {
  date: string;
  sentiment: string;
  quality_score: number;
}

export interface SentimentTrendResponse {
  trend_data: SentimentTrendData[];
}