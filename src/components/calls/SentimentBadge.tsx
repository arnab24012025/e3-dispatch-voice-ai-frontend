import React from 'react';
import { SentimentType } from '../../types';
import { formatSentiment } from '../../utils/formatters';

interface SentimentBadgeProps {
  sentiment: SentimentType;
}

/**
 * Sentiment Badge Component
 */
export const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const sentimentConfig: Record<SentimentType, string> = {
    positive: 'bg-green-100 text-green-800',
    negative: 'bg-red-100 text-red-800',
    neutral: 'bg-gray-100 text-gray-800',
    unknown: 'bg-gray-100 text-gray-500',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${sentimentConfig[sentiment]}`}
    >
      {formatSentiment(sentiment)}
    </span>
  );
};