import React from 'react';
import { PostCallAnalysis } from '../../types';
import { Card } from '../common';
import { SentimentBadge } from './SentimentBadge';
import { formatPercentage } from '../../utils/formatters';

interface AnalysisPanelProps {
  analysis: PostCallAnalysis;
}

/**
 * Analysis Panel Component
 */
export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  const cooperationConfig = {
    high: { label: 'High', color: 'bg-green-100 text-green-800', emoji: '👍' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', emoji: '👌' },
    low: { label: 'Low', color: 'bg-red-100 text-red-800', emoji: '👎' },
    unknown: { label: 'Unknown', color: 'bg-gray-100 text-gray-800', emoji: '❓' },
  };

  const cooperation = cooperationConfig[analysis.cooperation_level];

  return (
    <Card padding="lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Post-Call Analysis</h3>

      {/* Summary */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
          {analysis.summary}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Sentiment */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Sentiment</p>
          <SentimentBadge sentiment={analysis.sentiment} />
          <p className="text-xs text-gray-500 mt-1">
            {formatPercentage(analysis.sentiment_confidence)} confidence
          </p>
        </div>

        {/* Quality Score */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Quality Score</p>
          <p className="text-2xl font-bold text-gray-900">
            {analysis.quality_score.toFixed(1)}
            <span className="text-sm text-gray-500">/10</span>
          </p>
        </div>

        {/* Goal Achieved */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Goal Achieved</p>
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${
              analysis.goal_achieved
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <span>{analysis.goal_achieved ? '✅' : '❌'}</span>
            <span>{analysis.goal_achieved ? 'Yes' : 'No'}</span>
          </span>
        </div>

        {/* Cooperation Level */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Cooperation</p>
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${cooperation.color}`}
          >
            <span>{cooperation.emoji}</span>
            <span>{cooperation.label}</span>
          </span>
        </div>
      </div>

      {/* Key Topics */}
      {analysis.key_topics && analysis.key_topics.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Topics</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.key_topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};