import { format, formatDistance } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from './constants';

/**
 * Utility functions for formatting data
 */

/**
 * Format date to readable string
 */
export const formatDate = (date: string | Date): string => {
  try {
    return format(new Date(date), DATE_FORMAT);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format time to readable string
 */
export const formatTime = (date: string | Date): string => {
  try {
    return format(new Date(date), TIME_FORMAT);
  } catch {
    return 'Invalid time';
  }
};

/**
 * Format datetime to readable string
 */
export const formatDateTime = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid datetime';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string | Date): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} min${diffMin !== 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  } catch {
    return 'Unknown';
  }
};

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format phone number (US format)
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number): string => {
  return `${Math.round(value * 100)}%`;
};

/**
 * Format sentiment type to display string with emoji
 */
export const formatSentiment = (sentiment: string): string => {
  const sentimentMap: Record<string, string> = {
    positive: '😊 Positive',
    negative: '😞 Negative',
    neutral: '😐 Neutral',
    unknown: '❓ Unknown',
  };
  
  return sentimentMap[sentiment.toLowerCase()] || sentiment;
};

/**
 * Format quality score with color
 */
export const getQualityScoreColor = (score: number): string => {
  if (score >= 8) return 'text-green-600';
  if (score >= 6) return 'text-yellow-600';
  return 'text-red-600';
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};