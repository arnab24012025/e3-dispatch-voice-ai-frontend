import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RetellWebClient } from 'retell-client-js-sdk';

interface TranscriptMessage {
  role: 'agent' | 'user';
  content: string;
  timestamp: number;
}

const WebCallInterface: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { callData, driverName, loadNumber } = location.state || {};
  
  const [status, setStatus] = useState('Initializing...');
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  
  const retellClientRef = useRef<RetellWebClient | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!callData?.access_token) {
      console.error('No access token found');
      navigate('/calls/new');
      return;
    }

    const startCall = async () => {
      try {
        console.log('🚀 Initializing Retell Client...');
        console.log('Access Token:', callData.access_token);
        console.log('Sample Rate:', callData.sample_rate || 24000);
        
        setStatus('Requesting microphone access...');
        
        const retellClient = new RetellWebClient();
        retellClientRef.current = retellClient;

        // Call lifecycle events
        retellClient.on('call_started', () => {
          console.log('✅ Call started');
          setStatus('Connected');
          setIsCallActive(true);
        });

        retellClient.on('call_ended', () => {
          console.log('📴 Call ended');
          setStatus('Call Ended');
          setIsCallActive(false);
          setTimeout(() => {
            navigate(`/calls/${callData.call_id}`);
          }, 2000);
        });

        // Agent speaking events
        retellClient.on('agent_start_talking', () => {
          console.log('🗣️ Agent started talking');
          setIsAgentSpeaking(true);
        });

        retellClient.on('agent_stop_talking', () => {
          console.log('🤫 Agent stopped talking');
          setIsAgentSpeaking(false);
        });

        // User speaking events
        retellClient.on('user_start_talking', () => {
          console.log('👤 User started talking');
          setIsUserSpeaking(true);
        });

        retellClient.on('user_stop_talking', () => {
          console.log('👤 User stopped talking');
          setIsUserSpeaking(false);
        });

        // Transcript updates
        retellClient.on('update', (update: any) => {
          console.log('📝 Update received:', update);
          
          if (update.transcript && Array.isArray(update.transcript)) {
            // Replace entire transcript with new one from Retell
            const newTranscript = update.transcript
              .filter((item: any) => item.content && item.content.trim())
              .map((item: any) => ({
                role: item.role === 'agent' ? 'agent' : 'user',
                content: item.content,
                timestamp: Date.now()
              }));
            
            setTranscript(newTranscript);
          }
        });

        // Metadata updates
        retellClient.on('metadata', (metadata: any) => {
          console.log('📋 Metadata:', metadata);
        });

        // Error handling
        retellClient.on('error', (error: any) => {
          console.error('❌ Call error:', error);
          setStatus(`Error: ${error.message || 'Unknown error'}`);
          setIsCallActive(false);
        });

        // Start the call
        setStatus('Connecting...');
        console.log('📞 Starting call with Retell...');
        
        await retellClient.startCall({
          accessToken: callData.access_token,
          sampleRate: callData.sample_rate || 24000,
          emitRawAudioSamples: false,
        });
        
        console.log('✅ startCall completed');
      } catch (error: any) {
        console.error('💥 Failed to start call:', error);
        setStatus(`Failed: ${error.message || 'Unknown error'}`);
        setIsCallActive(false);
      }
    };

    startCall();

    return () => {
      console.log('🧹 Cleaning up...');
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
    };
  }, [callData, navigate]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const handleEndCall = () => {
    console.log('🛑 User ending call');
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
  };

  const toggleMute = () => {
    console.log('🎤 Toggling mute:', !isMuted);
    setIsMuted(!isMuted);
    // Note: Retell SDK doesn't have built-in mute, 
    // you'd need to implement this with audio context
  };

  if (!callData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{driverName || 'Voice Call'}</h2>
            <p className="text-sm text-gray-600">Load: {loadNumber || 'N/A'}</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCallActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {status}
            </div>
            {isAgentSpeaking && (
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🗣️ Agent Speaking
              </div>
            )}
            {isUserSpeaking && (
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                👤 You're Speaking
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Call Controls - Left Panel */}
        <div className="lg:col-span-1 space-y-4">
          {/* Mic Visualization */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                isCallActive 
                  ? isUserSpeaking 
                    ? 'bg-purple-500 animate-pulse' 
                    : isAgentSpeaking
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-green-500'
                  : 'bg-gray-300'
              }`}>
                <span className="text-white text-5xl">🎙️</span>
              </div>
              <p className="mt-4 text-lg font-semibold text-gray-700">{status}</p>
              {isCallActive && (
                <p className="text-sm text-gray-500 mt-2">
                  {isUserSpeaking ? 'Listening to you...' : isAgentSpeaking ? 'Agent is speaking...' : 'Ready to listen'}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <button
              onClick={handleEndCall}
              disabled={!isCallActive}
              className={`w-full py-3 rounded-lg font-medium transition ${
                isCallActive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              End Call
            </button>
          </div>

          {/* Call Info */}
          <div className="bg-white rounded-lg shadow p-4 text-sm text-gray-600">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Call ID:</span>
                <span className="font-mono text-xs">{callData.call_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium">{status}</span>
              </div>
              <div className="flex justify-between">
                <span>Messages:</span>
                <span className="font-medium">{transcript.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript - Right Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Live Transcript</h3>
              <p className="text-xs text-gray-500 mt-1">Real-time conversation</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {transcript.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <div className="text-4xl mb-4">🎧</div>
                  <p className="font-medium">Waiting for conversation to start...</p>
                  <p className="text-sm mt-2">The agent will greet you first, then you can respond</p>
                </div>
              ) : (
                transcript.map((msg, index) => (
                  <div
                    key={`${msg.role}-${index}`}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.role === 'user' ? 'You' : 'Agent'}
                      </p>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebCallInterface;