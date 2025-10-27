import React, { useState, useEffect } from 'react';
import { Card, Button, Alert } from '../../components/common';
import { useAppSelector } from '../../redux/hooks';
import settingsService from '../../services/settingsService';
import { LLMProvider } from '../../types';

/**
 * Settings Page Component
 */
const SettingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [currentProvider, setCurrentProvider] = useState<LLMProvider | null>(null);
  const [availableProviders, setAvailableProviders] = useState<LLMProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [providerData, availableData] = await Promise.all([
        settingsService.getCurrentProvider(),
        settingsService.getAvailableProviders(),
      ]);
      setCurrentProvider(providerData.llm_provider);
      setSelectedProvider(providerData.llm_provider);
      setAvailableProviders(availableData.providers);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedProvider) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccess(null);
      await settingsService.updateProvider({ llm_provider: selectedProvider });
      setCurrentProvider(selectedProvider);
      setSuccess('LLM provider updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to update LLM provider');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and system preferences</p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* User Profile */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">User Profile</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">
                {user?.is_admin ? '🔑 Administrator' : '👤 User'}
              </p>
            </div>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Status: <span className="text-green-600 font-medium">● Active</span>
            </p>
          </div>
        </div>
      </Card>

      {/* LLM Provider Settings */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">LLM Provider</h2>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Select the language model provider for post-call analysis and AI processing
          </p>

          <div className="space-y-3">
            {availableProviders.map((provider) => (
              <label
                key={provider}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedProvider === provider
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="llm_provider"
                  value={provider}
                  checked={selectedProvider === provider}
                  onChange={(e) => setSelectedProvider(e.target.value as LLMProvider)}
                  className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 capitalize">{provider}</p>
                  <p className="text-xs text-gray-500">
                    {provider === 'groq' && 'Fast inference with Groq LPU'}
                    {provider === 'openai' && 'OpenAI GPT models'}
                  </p>
                </div>
                {currentProvider === provider && (
                  <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Current
                  </span>
                )}
              </label>
            ))}
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t">
            <Button
              onClick={() => setSelectedProvider(currentProvider)}
              variant="secondary"
              disabled={isSaving || selectedProvider === currentProvider}
            >
              Reset
            </Button>
            <Button
              onClick={handleSave}
              variant="primary"
              isLoading={isSaving}
              disabled={selectedProvider === currentProvider}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* System Info */}
      <Card padding="lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Application Version</span>
            <span className="font-medium text-gray-900">v1.0.0</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Environment</span>
            <span className="font-medium text-gray-900">
              {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">API Endpoint</span>
            <span className="font-medium text-gray-900 text-xs">
              {process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;