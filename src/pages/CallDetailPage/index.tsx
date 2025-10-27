import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Alert } from '../../components/common';
import { AnalysisPanel } from '../../components/calls/AnalysisPanel';
import { CallStatusBadge } from "../../components/calls/CallStatusBadge"
import {TranscriptViewer} from "../../components/calls/TranscriptViewer"
import callService from '../../services/callService';
import { Call } from '../../types';
import { formatDateTime, formatDuration, formatPhoneNumber } from '../../utils/formatters';

/**
 * Call Detail Page Component
 */
const CallDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCall(parseInt(id));
    }
  }, [id]);

  /**
   * Fetch call details
   */
  const fetchCall = async (callId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await callService.getCall(callId);
      setCall(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load call details');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh call status from Retell
   */
  const handleRefresh = async () => {
    if (!id) return;

    try {
      setIsRefreshing(true);
      const data = await callService.refreshCallStatus(parseInt(id));
      setCall(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to refresh call status');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading call details...</p>
        </div>
      </div>
    );
  }

  if (error && !call) {
    return (
      <div className="space-y-6">
        <Alert type="error" message={error} />
        <Button onClick={() => navigate('/calls')} variant="secondary">
          ← Back to Calls
        </Button>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="text-center py-12">
        <span className="text-6xl block mb-4">📞</span>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Call not found</h3>
        <Button onClick={() => navigate('/calls')} variant="primary">
          Back to Calls
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/calls')}
          className="text-primary-600 hover:text-primary-700 mb-4 inline-flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Calls
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Call Details</h1>
            <p className="text-gray-600 mt-2">
              Load #{call.load_number} • {call.driver_name}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              variant="secondary"
              size="md"
              isLoading={isRefreshing}
            >
              <span className="mr-2">🔄</span>
              Refresh Status
            </Button>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Call Info Card */}
      <Card padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Status */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Status</p>
            <CallStatusBadge status={call.status} />
          </div>

          {/* Duration */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Duration</p>
            <p className="text-lg font-semibold text-gray-900">
              {call.duration ? formatDuration(call.duration) : 'N/A'}
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Phone Number</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatPhoneNumber(call.phone_number)}
            </p>
          </div>

          {/* Created At */}
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Created</p>
            <p className="text-lg font-semibold text-gray-900">
              {formatDateTime(call.created_at)}
            </p>
          </div>

          {/* Started At */}
          {call.started_at && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Started</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDateTime(call.started_at)}
              </p>
            </div>
          )}

          {/* Ended At */}
          {call.ended_at && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Ended</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDateTime(call.ended_at)}
              </p>
            </div>
          )}

          {/* Retell Call ID */}
          {call.retell_call_id && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Retell Call ID</p>
              <p className="text-sm font-mono text-gray-700 break-all">
                {call.retell_call_id}
              </p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {call.error_message && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Error</p>
            <p className="text-sm text-red-700">{call.error_message}</p>
          </div>
        )}

        {/* Recording */}
        {call.recording_url && (
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Call Recording</p>
            <audio controls className="w-full">
              <source src={call.recording_url} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </Card>

      {/* Post-Call Analysis */}
      {call.post_call_analysis && (
        <AnalysisPanel analysis={call.post_call_analysis} />
      )}

      {/* Transcript */}
      {call.conversation_history && call.conversation_history.length > 0 && (
        <TranscriptViewer messages={call.conversation_history} />
      )}

      {/* Raw Transcript */}
      {call.raw_transcript && (
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Raw Transcript</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {call.raw_transcript}
            </pre>
          </div>
        </Card>
      )}

      {/* Structured Results */}
      {call.structured_results && Object.keys(call.structured_results).length > 0 && (
        <Card padding="lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Extracted Data</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
              {JSON.stringify(call.structured_results, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CallDetailPage;