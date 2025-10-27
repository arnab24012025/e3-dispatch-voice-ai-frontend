import { format, formatDistance } from 'date-fns';
import { DATE_FORMAT, TIME_FORMAT, DATETIME_FORMAT } from './constants';

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
export const formatDateTime = (date: string | Date): string => {
  try {
    return format(new Date(date), DATETIME_FORMAT);
  } catch {
    return 'Invalid datetime';
  }
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    return formatDistance(new Date(date), new Date(), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

/**
 * Format duration in seconds to MM:SS
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
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

/**
 * Format sentiment with emoji
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