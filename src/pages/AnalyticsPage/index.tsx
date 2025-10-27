import React, { useState, useEffect } from 'react';
import { Card, Alert } from '../../components/common';
import analyticsService from '../../services/analyticsService';
import { DashboardAnalytics, SentimentTrendResponse } from '../../types';

const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [trends, setTrends] = useState<SentimentTrendResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [analyticsData, trendsData] = await Promise.all([
        analyticsService.getDashboardAnalytics(),
        analyticsService.getSentimentTrends(30),
      ]);
      setAnalytics(analyticsData);
      setTrends(trendsData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert type="error" message={error} onClose={() => fetchData()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Detailed insights into your call performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Total Calls</p>
          <p className="text-3xl font-bold text-gray-900">{analytics?.total_calls || 0}</p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
          <p className="text-3xl font-bold text-green-600">
            {analytics?.total_calls
              ? Math.round(((analytics.completed_calls || 0) / analytics.total_calls) * 100)
              : 0}
            %
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Avg Quality Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {analytics?.avg_quality_score?.toFixed(1) || 'N/A'}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-sm text-gray-600 mb-1">Goal Achievement</p>
          <p className="text-3xl font-bold text-purple-600">
            {analytics?.goal_achievement_rate
              ? `${Math.round(analytics.goal_achievement_rate)}%`
              : 'N/A'}
          </p>
        </Card>
      </div>

      {analytics && (
        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sentiment Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-4xl">😊</span>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-1">
                {analytics.sentiment_distribution.positive}
              </p>
              <p className="text-sm text-gray-600">Positive Calls</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-4xl">😐</span>
              </div>
              <p className="text-2xl font-bold text-gray-600 mb-1">
                {analytics.sentiment_distribution.neutral}
              </p>
              <p className="text-sm text-gray-600">Neutral Calls</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-4xl">😞</span>
              </div>
              <p className="text-2xl font-bold text-red-600 mb-1">
                {analytics.sentiment_distribution.negative}
              </p>
              <p className="text-sm text-gray-600">Negative Calls</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-4xl">❓</span>
              </div>
              <p className="text-2xl font-bold text-gray-500 mb-1">
                {analytics.sentiment_distribution.unknown}
              </p>
              <p className="text-sm text-gray-600">Unknown</p>
            </div>
          </div>
        </Card>
      )}

      {analytics && analytics.top_topics && analytics.top_topics.length > 0 && (
        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Discussed Topics</h2>
          <div className="space-y-3">
            {analytics.top_topics.map((topic, index) => {
              const maxCount = Math.max(...analytics.top_topics.map((t) => t.count));
              const percentage = (topic.count / maxCount) * 100;
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                    <span className="text-sm text-gray-600">{topic.count} mentions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Call Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Completed Calls</span>
                <span className="font-bold text-gray-900">{analytics.completed_calls}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Recent Activity (7d)</span>
                <span className="font-bold text-gray-900">{analytics.recent_calls_7_days}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Emergency Calls</span>
                <span className="font-bold text-red-600">{analytics.emergency_calls}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Avg Duration</span>
                <span className="font-bold text-gray-900">
                  {analytics.avg_duration_seconds
                    ? `${Math.floor(analytics.avg_duration_seconds / 60)}m ${Math.floor(analytics.avg_duration_seconds % 60)}s`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quality Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Average Quality Score</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {analytics.avg_quality_score?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                {analytics.avg_quality_score && (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{ width: `${(analytics.avg_quality_score / 10) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Goal Achievement Rate</span>
                  <span className="text-2xl font-bold text-green-600">
                    {analytics.goal_achievement_rate
                      ? `${Math.round(analytics.goal_achievement_rate)}%`
                      : 'N/A'}
                  </span>
                </div>
                {analytics.goal_achievement_rate && (
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{ width: `${analytics.goal_achievement_rate}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;