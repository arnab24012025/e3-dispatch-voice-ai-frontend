import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Alert } from '../../components/common';
import analyticsService from '../../services/analyticsService';
import { DashboardAnalytics } from '../../types';

/**
 * Unified Dashboard - Best of Both Worlds
 * Combines real API data with clean UI and onboarding flow
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await analyticsService.getDashboardAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Analytics fetch error:', err);
      setError(err.response?.data?.detail || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert 
          type="error" 
          message={error} 
          onClose={() => fetchAnalytics()} 
        />
        <Card padding="lg">
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Unable to load analytics data.</p>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Retry
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Stats configuration with real data
  const stats = [
    {
      name: 'Total Calls',
      value: analytics?.total_calls || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      name: 'Completed',
      value: analytics?.completed_calls || 0,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      name: 'Avg Quality',
      value: analytics?.avg_quality_score 
        ? `${analytics.avg_quality_score.toFixed(1)}/10` 
        : 'N/A',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
    {
      name: 'Goal Achievement',
      value: analytics?.goal_achievement_rate 
        ? `${Math.round(analytics.goal_achievement_rate)}%` 
        : 'N/A',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
  ];

  const hasData = analytics && analytics.total_calls > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's an overview of your voice AI operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} padding="md" hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <div className={stat.iconColor}>{stat.icon}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Conditional: Show onboarding if no data, show insights if data exists */}
      {!hasData ? (
        /* Getting Started Guide - Only shown when no data */
        <Card padding="lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Create an Agent</p>
                <p className="text-sm text-gray-600">
                  Configure your first AI voice agent with custom prompts
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Test Web Call</p>
                <p className="text-sm text-gray-600">
                  Try out your agent with a browser-based voice call
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Review Results</p>
                <p className="text-sm text-gray-600">
                  Analyze call transcripts and extracted data
                </p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Analytics Insights - Only shown when data exists */
        <>
          {/* Sentiment Distribution */}
          {analytics.sentiment_distribution && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sentiment Distribution</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-green-600 mb-1">
                    {analytics.sentiment_distribution.positive}
                  </p>
                  <p className="text-sm text-gray-600">Positive</p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-600 mb-1">
                    {analytics.sentiment_distribution.neutral}
                  </p>
                  <p className="text-sm text-gray-600">Neutral</p>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-red-600 mb-1">
                    {analytics.sentiment_distribution.negative}
                  </p>
                  <p className="text-sm text-gray-600">Negative</p>
                </div>

                <div className="text-center p-4 bg-gray-100 rounded-lg">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-gray-500 mb-1">
                    {analytics.sentiment_distribution.unknown}
                  </p>
                  <p className="text-sm text-gray-600">Unknown</p>
                </div>
              </div>
            </Card>
          )}

          {/* Top Topics */}
          {analytics.top_topics && analytics.top_topics.length > 0 && (
            <Card padding="lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Top Discussion Topics</h2>
              <div className="space-y-3">
                {analytics.top_topics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-900 capitalize">{topic.topic}</span>
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {topic.count} {topic.count === 1 ? 'call' : 'calls'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Recent Activity */}
          <Card padding="lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Calls in last 7 days</span>
                <span className="text-xl font-bold text-gray-900">
                  {analytics.recent_calls_7_days}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Average duration</span>
                <span className="text-xl font-bold text-gray-900">
                  {analytics.avg_duration_seconds
                    ? `${Math.floor(analytics.avg_duration_seconds / 60)}:${(analytics.avg_duration_seconds % 60).toString().padStart(2, '0')}`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Emergency calls</span>
                <span className="text-xl font-bold text-red-600">
                  {analytics.emergency_calls}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Quick Actions - Always visible */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/calls/new')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary-50 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Start New Call</p>
            <p className="text-sm text-gray-600 mt-1">Test web call</p>
          </button>

          <button
            onClick={() => navigate('/agents/new')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 group-hover:bg-green-100 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">Create Agent</p>
            <p className="text-sm text-gray-600 mt-1">Configure new agent</p>
          </button>

          <button
            onClick={() => navigate('/calls')}
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center group"
          >
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="font-medium text-gray-900">View Calls</p>
            <p className="text-sm text-gray-600 mt-1">Browse call history</p>
          </button>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;   