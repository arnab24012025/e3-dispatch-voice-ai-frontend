import React from 'react';
import { ConversationMessage } from '../../types';
import { Card } from '../common';

interface TranscriptViewerProps {
  messages: ConversationMessage[];
}

/**
 * Transcript Viewer Component
 */
export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <Card padding="lg">
        <div className="text-center text-gray-500">
          <span className="text-4xl block mb-2">💬</span>
          <p>No transcript available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Conversation Transcript</h3>
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-3xl px-4 py-3 rounded-lg ${
                message.role === 'assistant'
                  ? 'bg-blue-50 text-blue-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-semibold">
                  {message.role === 'assistant' ? '🤖 AI Agent' : '👤 Driver'}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};