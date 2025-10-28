import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Alert } from '../../components/common';
import { useAppSelector } from '../../redux/hooks';
import { useAgents } from '../../hooks/useAgents';
import callService from '../../services/callService';

/**
 * New Call Page - Supports both Web Calls and Phone Calls
 */
const NewCall: React.FC = () => {
  const navigate = useNavigate();
  const { agents, isLoading: agentsLoading } = useAgents();
  const { user } = useAppSelector((state) => state.auth);

  // Call Type: 'web' or 'phone'
  const [callType, setCallType] = useState<'web' | 'phone'>('web');

  // Form fields
  const [driverName, setDriverName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loadNumber, setLoadNumber] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);

  // UI state
  const [isInitiating, setIsInitiating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get active agents only
  const activeAgents = agents.filter((agent) => agent.is_active);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!driverName.trim()) {
      setError('Driver name is required');
      return;
    }

    if (!loadNumber.trim()) {
      setError('Load number is required');
      return;
    }

    if (!selectedAgentId) {
      setError('Please select an agent');
      return;
    }

    // Phone-specific validation
    if (callType === 'phone' && !phoneNumber.trim()) {
      setError('Phone number is required for phone calls');
      return;
    }

    // Phone number format validation (basic)
    if (callType === 'phone' && !/^\+?[1-9]\d{1,14}$/.test(phoneNumber.replace(/[\s\-()]/g, ''))) {
      setError('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }

    setIsInitiating(true);

    try {
      if (callType === 'web') {
        // Web Call Flow
        const response = await callService.initiateWebCall({
          driver_name: driverName,
          phone_number: phoneNumber || 'web-call',
          load_number: loadNumber,
          agent_configuration_id: selectedAgentId,
        });

        // Navigate to web call interface
        navigate('/calls/web-call-interface', {
          state: {
            callData: response,
            driverName,
            loadNumber,
          },
        });
      } else {
        // Phone Call Flow
        const response = await callService.initiatePhoneCall({
          driver_name: driverName,
          phone_number: phoneNumber,
          load_number: loadNumber,
          agent_configuration_id: selectedAgentId,
        });

        // Show success message and redirect to call detail
        alert(`Phone call initiated to ${phoneNumber}!\n\nCall ID: ${response.id}\nStatus: ${response.status}`);
        navigate(`/calls/${response.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to initiate call');
      setIsInitiating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Start New Call</h1>
        <p className="mt-1 text-sm text-gray-500">
          Initiate a voice call with a driver using AI agent
        </p>
      </div>

      {/* Call Type Selector */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Call Type</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Web Call Option */}
          <button
            type="button"
            onClick={() => setCallType('web')}
            className={`p-6 border-2 rounded-lg transition-all ${
              callType === 'web'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <span className="text-4xl">🌐</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900">Web Call</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Test call in browser (microphone required)
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    ✓ Test Mode
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Instant Start
                  </span>
                </div>
              </div>
            </div>
          </button>

          {/* Phone Call Option */}
          <button
            type="button"
            onClick={() => setCallType('phone')}
            className={`p-6 border-2 rounded-lg transition-all ${
              callType === 'phone'
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <span className="text-4xl">📞</span>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900">Phone Call</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Real phone call to driver's number
                </p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    Production
                  </span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    Requires Setup
                  </span>
                </div>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Call Form */}
      <Card padding="lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Call Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Driver Name */}
          <Input
            label="Driver Name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            placeholder="John Doe"
            required
          />

          {/* Phone Number (Only for Phone Calls) */}
          {callType === 'phone' && (
            <Input
              label="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+1234567890"
              helperText="Enter with country code (e.g., +1 for US)"
              required
            />
          )}

          {/* Load Number */}
          <Input
            label="Load Number"
            value={loadNumber}
            onChange={(e) => setLoadNumber(e.target.value)}
            placeholder="LOAD-12345"
            required
          />

          {/* Agent Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Agent
            </label>
            {agentsLoading ? (
              <div className="text-sm text-gray-500">Loading agents...</div>
            ) : activeAgents.length === 0 ? (
              <Alert type="warning" message="No active agents available. Please create an agent first." />
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {activeAgents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgentId(agent.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedAgentId === agent.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                        {agent.description && (
                          <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                        )}
                        {agent.scenario_type && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {agent.scenario_type}
                          </span>
                        )}
                      </div>
                      {selectedAgentId === agent.id && (
                        <span className="text-primary-600 text-xl ml-4">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

          {/* Submit Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isInitiating}
              disabled={!selectedAgentId || isInitiating || (callType === 'phone' && !phoneNumber)}
              className="flex-1"
            >
              {isInitiating ? (
                <>Starting {callType === 'web' ? 'Web' : 'Phone'} Call...</>
              ) : (
                <>
                  {callType === 'web' ? '🌐 Start Web Call' : '📞 Initiate Phone Call'}
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => navigate('/calls')}
              disabled={isInitiating}
            >
              Cancel
            </Button>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <span className="text-blue-600 text-xl flex-shrink-0">ℹ️</span>
              <div className="text-sm text-blue-800">
                {callType === 'web' ? (
                  <>
                    <strong>Web Call:</strong> Opens in your browser. Make sure to allow microphone access.
                    Perfect for testing agents before deploying to production.
                  </>
                ) : (
                  <>
                    <strong>Phone Call:</strong> Initiates a real phone call to the driver's number via Retell AI.
                    Requires a configured Retell phone number in your account settings.
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default NewCall;