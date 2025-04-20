import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import { getVoices } from '../api/elevenlabs';
import { motion } from 'framer-motion';

interface ApiSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (claudeKey: string, elevenLabsKey: string, voiceId: string) => void;
  initialClaudeKey?: string;
  initialElevenLabsKey?: string;
  initialVoiceId?: string;
}

interface Voice {
  voice_id: string;
  name: string;
}

export default function ApiSettings({
  isOpen,
  onClose,
  onSave,
  initialClaudeKey = '',
  initialElevenLabsKey = '',
  initialVoiceId = ''
}: ApiSettingsProps) {
  const [claudeKey, setClaudeKey] = useState(initialClaudeKey);
  const [elevenLabsKey, setElevenLabsKey] = useState(initialElevenLabsKey);
  const [selectedVoiceId, setSelectedVoiceId] = useState(initialVoiceId);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loadingVoices, setLoadingVoices] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testingClaudeApi, setTestingClaudeApi] = useState(false);
  const [claudeApiStatus, setClaudeApiStatus] = useState<'none' | 'testing' | 'success' | 'error'>('none');
  const [testMessage, setTestMessage] = useState('');

  // Initialize with values from localStorage if not provided as props
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from localStorage if not provided through props
      if (!initialClaudeKey) {
        const storedClaudeKey = localStorage.getItem('CLAUDE_API_KEY');
        if (storedClaudeKey) setClaudeKey(storedClaudeKey);
      }
      
      if (!initialElevenLabsKey) {
        const storedElevenLabsKey = localStorage.getItem('ELEVENLABS_API_KEY');
        if (storedElevenLabsKey) setElevenLabsKey(storedElevenLabsKey);
      }
      
      if (!initialVoiceId) {
        const storedVoiceId = localStorage.getItem('ELEVENLABS_VOICE_ID');
        if (storedVoiceId) setSelectedVoiceId(storedVoiceId);
      }
    }
  }, [isOpen, initialClaudeKey, initialElevenLabsKey, initialVoiceId]);

  // Fetch voices when ElevenLabs key is provided
  useEffect(() => {
    const fetchVoices = async () => {
      if (!elevenLabsKey) return;
      
      setLoadingVoices(true);
      setError(null);
      
      try {
        console.log('Fetching ElevenLabs voices...');
        const voicesData = await getVoices(elevenLabsKey);
        setVoices(voicesData);
        
        // Set first voice as default if none is selected
        if (!selectedVoiceId && voicesData.length > 0) {
          setSelectedVoiceId(voicesData[0].voice_id);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError('Failed to fetch voices. Please check your ElevenLabs API key.');
      } finally {
        setLoadingVoices(false);
      }
    };

    if (elevenLabsKey) {
      fetchVoices();
    }
  }, [elevenLabsKey, selectedVoiceId]);

  const testClaudeConnection = async () => {
    if (!claudeKey || !claudeKey.trim()) {
      setError('Please enter a Claude API key before testing');
      return;
    }

    setTestingClaudeApi(true);
    setClaudeApiStatus('testing');
    setTestMessage('');
    setError(null);

    try {
      // First check if our test endpoint is working
      const testResponse = await fetch('/api/test');
      if (!testResponse.ok) {
        throw new Error('Server connection test failed. Please refresh the page and try again.');
      }
      
      // Simple test request to Claude API through our proxy
      const response = await fetch('/api/proxy/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-claude-api-key': claudeKey
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hello, this is a test message. Please respond with "API connection successful"' }],
          model: 'claude-3-haiku-20240307',
          max_tokens: 30
        })
      });

      if (response.ok) {
        const data = await response.json();
        setClaudeApiStatus('success');
        setTestMessage('Claude API connection successful! The proxy is working properly.');
      } else {
        let errorMessage = 'API Error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || `API Error (${response.status})`;
        } catch (e) {
          errorMessage = await response.text() || `API Error (${response.status})`;
        }
        
        console.error('Claude API test failed:', errorMessage);
        
        if (response.status === 401) {
          setError('Authentication failed: Invalid API key');
        } else {
          setError(`API Error: ${errorMessage}`);
        }
        setClaudeApiStatus('error');
      }
    } catch (err) {
      console.error('Error testing Claude API:', err);
      setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setClaudeApiStatus('error');
    } finally {
      setTestingClaudeApi(false);
    }
  };

  const handleSave = () => {
    // Validate the API keys
    if (!claudeKey || !claudeKey.trim()) {
      setError('Claude API key is required');
      return;
    }

    // Accept either format of Claude API keys (sk- or the newer format)
    if (!claudeKey.startsWith('sk-') && !claudeKey.includes('_')) {
      setError('Invalid Claude API key format. Keys should start with "sk-" or be in the new format with underscores');
      return;
    }

    // Log the values being saved
    console.log('Saving API keys:', {
      claudeKey: claudeKey ? 'Has value' : 'Empty',
      elevenLabsKey: elevenLabsKey ? 'Has value' : 'Empty',
      selectedVoiceId
    });
    
    onSave(claudeKey, elevenLabsKey, selectedVoiceId);
  };

  const handleClaudeKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClaudeKey(e.target.value.trim());
    setClaudeApiStatus('none');
  };

  const handleElevenLabsKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setElevenLabsKey(e.target.value.trim());
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoiceId(e.target.value);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <motion.div 
        className="w-full max-w-md bg-gray-900 text-white rounded-xl shadow-2xl overflow-hidden"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">API Settings</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-5 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-sm flex items-start">
              <FaExclamationTriangle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {testMessage && (
            <div className="p-3 bg-green-900/50 border border-green-700 rounded-lg text-sm flex items-start">
              <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>{testMessage}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="claude-key" className="block text-sm font-medium text-gray-300 flex items-center">
              Claude API Key <span className="text-red-500 ml-1">*</span>
              <div className="ml-auto flex">
                {claudeApiStatus === 'success' && (
                  <span className="text-green-500 flex items-center text-xs mr-2">
                    <FaCheckCircle className="mr-1" /> Valid
                  </span>
                )}
                {claudeApiStatus === 'error' && (
                  <span className="text-red-500 flex items-center text-xs mr-2">
                    <FaExclamationTriangle className="mr-1" /> Invalid
                  </span>
                )}
                <button
                  onClick={testClaudeConnection}
                  disabled={testingClaudeApi || !claudeKey}
                  className={`text-xs px-2 py-1 rounded ${
                    testingClaudeApi || !claudeKey
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-600 text-white'
                  }`}
                >
                  {testingClaudeApi ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </label>
            <input
              id="claude-key"
              type="password"
              value={claudeKey}
              onChange={handleClaudeKeyChange}
              placeholder="Enter your Claude API key (starts with sk- or uses underscores)"
              className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 flex items-start">
              <FaInfoCircle className="mt-0.5 mr-1 flex-shrink-0" />
              Required for chat functionality. Get one from{' '}
              <a 
                href="https://console.anthropic.com/account/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline ml-1"
              >
                Anthropic Console
              </a>
            </p>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="elevenlabs-key" className="block text-sm font-medium text-gray-300">
              ElevenLabs API Key
            </label>
            <input
              id="elevenlabs-key"
              type="password"
              value={elevenLabsKey}
              onChange={handleElevenLabsKeyChange}
              placeholder="Enter your ElevenLabs API key"
              className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 flex items-start">
              <FaInfoCircle className="mt-0.5 mr-1 flex-shrink-0" />
              Required for text-to-speech. Get one from{' '}
              <a 
                href="https://elevenlabs.io/app/api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline ml-1"
              >
                ElevenLabs Dashboard
              </a>
            </p>
          </div>
          
          {elevenLabsKey && (
            <div className="space-y-2">
              <label htmlFor="voice-select" className="block text-sm font-medium text-gray-300">
                Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoiceId}
                onChange={handleVoiceChange}
                disabled={loadingVoices || voices.length === 0}
                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:outline-none"
              >
                {loadingVoices ? (
                  <option>Loading voices...</option>
                ) : voices.length === 0 ? (
                  <option>No voices available</option>
                ) : (
                  voices.map(voice => (
                    <option key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </option>
                  ))
                )}
              </select>
              <p className="text-xs text-gray-500">
                Select a voice for text-to-speech
              </p>
            </div>
          )}
          
          <div className="pt-2 flex space-x-3">
            <button
              onClick={handleSave}
              disabled={!claudeKey}
              className={`flex-1 py-2.5 px-4 rounded-lg transition-all duration-300 ${
                !claudeKey
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white hover-scale'
              }`}
            >
              Save Settings
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-all duration-300 hover-scale"
            >
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  ) : null;
} 