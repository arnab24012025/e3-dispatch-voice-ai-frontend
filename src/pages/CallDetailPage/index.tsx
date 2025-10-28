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
      const data = await callService.getCallById(callId);
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
  <div className="mt-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-2">
        <span className="text-xl">🎧</span>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Call Recording</p>
      </div>
      
      <a 
        href={call.recording_url} 
        download
        className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
      >
        ⬇️ Download
      </a>
    </div>
    
    <audio 
      controls 
      className="w-full"
      preload="metadata"
    >
      <source src={call.recording_url} type="audio/mpeg" />
    </audio>
    
    {call.duration && (
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Duration: {Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, '0')}
      </p>
    )}
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
  <>
    {/* Emergency Status Card - Show if emergency */}
    {call.structured_results.emergency && (
      <Card padding="lg">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              🚨 Emergency Status
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                call.structured_results.escalation_status === "Connected to Human Dispatcher"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              }`}
            >
              {call.structured_results.escalation_status === "Connected to Human Dispatcher"
                ? "✅ Dispatcher Connected"
                : "⏳ Escalation Required"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emergency Type */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                Emergency Type
              </p>
              <p className="text-sm text-red-900 dark:text-red-100 font-semibold capitalize">
                {call.structured_results.emergency_type || "Unknown"}
              </p>
            </div>

            {/* Location */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                Emergency Location
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold">
                {call.structured_results.emergency_location || "Not provided"}
              </p>
            </div>

            {/* Safety Status */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                Safety Status
              </p>
              <p className="text-sm text-green-900 dark:text-green-100">
                {call.structured_results.safety_status || "Not provided"}
              </p>
            </div>

            {/* Injury Status */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                Injury Status
              </p>
              <p className="text-sm text-purple-900 dark:text-purple-100">
                {call.structured_results.injury_status || "Not provided"}
              </p>
            </div>

            {/* Load Secure */}
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">
                Load Security
              </p>
              <p className="text-sm text-orange-900 dark:text-orange-100 font-semibold">
                {call.structured_results.load_secure === true
                  ? "✅ Load Secure"
                  : call.structured_results.load_secure === false
                  ? "❌ Load Not Secure"
                  : "Unknown"}
              </p>
            </div>

            {/* Description */}
            {call.structured_results.description && (
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Description
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {call.structured_results.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    )}

    {/* Check-in Data Card - Show if NOT emergency */}
    {!call.structured_results.emergency && call.structured_results.delivery_status && (
      <Card padding="lg">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          📦 Delivery Status Update
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Delivery Status */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
              Status
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold capitalize">
              {call.structured_results.delivery_status}
            </p>
          </div>

          {/* Current Location */}
          {call.structured_results.current_location && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                Current Location
              </p>
              <p className="text-sm text-green-900 dark:text-green-100">
                {call.structured_results.current_location}
              </p>
            </div>
          )}

          {/* ETA */}
          {call.structured_results.eta && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">
                ETA
              </p>
              <p className="text-sm text-purple-900 dark:text-purple-100">
                {call.structured_results.eta}
              </p>
            </div>
          )}

          {/* Delay Reason */}
          {call.structured_results.delay_reason && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium mb-1">
                Delay Reason
              </p>
              <p className="text-sm text-yellow-900 dark:text-yellow-100">
                {call.structured_results.delay_reason}
              </p>
            </div>
          )}

          {/* Notes */}
          {call.structured_results.notes && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                Notes
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {call.structured_results.notes}
              </p>
            </div>
          )}
        </div>
      </Card>
    )}

    {/* Raw JSON (Developer View) */}
    <Card padding="lg">
      <details>
        <summary className="text-lg font-bold text-gray-900 dark:text-white mb-4 cursor-pointer hover:text-primary-600">
          🔍 Raw Extracted Data (Developer View)
        </summary>
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
          <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
            {JSON.stringify(call.structured_results, null, 2)}
          </pre>
        </div>
      </details>
    </Card>
  </>
)}
    </div>
  );
};

export default CallDetailPage;