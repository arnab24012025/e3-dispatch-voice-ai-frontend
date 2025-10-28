import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Alert } from '../../components/common';
import { CallTable } from '../../components/calls/CallTable';
import { useCalls } from '../../hooks/useCalls';

/**
 * Calls Page Component
 */
const CallsPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');

  // Fetch calls with filters
  const { calls, total, isLoading, error, refreshCalls } = useCalls({
    limit: 100,
    status: statusFilter || undefined,
    sentiment: sentimentFilter || undefined,
  });

  const filteredCalls = calls.filter((call) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      call.driver_name.toLowerCase().includes(search) ||
      call.load_number.toLowerCase().includes(search) ||
      call.phone_number.toLowerCase().includes(search)
    );
  });

  /**
   * Clear filters
   */
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setSentimentFilter('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call History</h1>
          <p className="text-gray-600 mt-2">
            View and analyze all your voice calls
          </p>
        </div>
        <Button
          onClick={() => navigate('/calls/new')}
          variant="primary"
          size="md"
        >
          <span className="mr-2">📞</span>
          New Call
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" message={error} onClose={() => refreshCalls()} />
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div  className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
             <Input
                label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search driver, load, or phone..."
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="completed">✅ Completed</option>
                <option value="in_progress">🔄 In Progress</option>
                <option value="failed">❌ Failed</option>
                <option value="no_answer">📵 No Answer</option>
              </select>
            </div>

            {/* Sentiment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sentiment
              </label>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Sentiments</option>
                <option value="positive">😊 Positive</option>
                <option value="neutral">😐 Neutral</option>
                <option value="negative">😞 Negative</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center space-x-4">
           
           <Button 
  type="button" 
  variant="secondary" 
  size="sm"
  onClick={clearFilters}
>
  Clear Filters
</Button>
           <div className="text-sm text-gray-500 ml-auto">
  {filteredCalls.length} of {total} call{total !== 1 ? 's' : ''}
  {searchTerm && ` (filtered)`}
</div>
          </div>
        </div>
      </div>

      {/* Calls Table */}
      {filteredCalls.length === 0  ? (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <span className="text-6xl block mb-4">📞</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
  {searchTerm ? 'No calls found' : 'No calls yet'}
</h3>
<p className="text-gray-600 mb-6">
  {searchTerm 
    ? `No results matching "${searchTerm}"`
    : 'Start your first test call to see it appear here'
  }
</p>
          {!searchTerm && (
  <Button
    onClick={() => navigate('/calls/new')}
    variant="primary"
  >
    Start Test Call
  </Button>
)}
        </div>
      ) : (
        <CallTable calls={filteredCalls} />
      )}
    </div>
  );
};

export default CallsPage;