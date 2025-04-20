'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, 
  FaMicrophoneSlash,
  FaPlay, 
  FaPause,
  FaStop,
  FaVolumeUp, 
  FaGlobe,
  FaVolumeMute,
  FaLanguage,
  FaSpinner,
  FaCog
} from 'react-icons/fa';
import { MdSettings, MdClose } from 'react-icons/md';
import { speakText } from '../api/elevenlabs';
import { sendMessageToClaude } from '../api/claude';
import ApiSettings from './ApiSettings';

// Interface for messages
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  isPlaying?: boolean;
}

// Interface for voice configuration
interface VoiceConfig {
  enableTTS: boolean;
  selectedVoice: string | null;
}

export default function SimpleParley() {
  // State management
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    text: "Welcome to Parley! I'm your AI assistant ready to help break communication barriers. Tap the microphone to start speaking. How can I assist you today?",
    sender: 'assistant',
    timestamp: new Date().toISOString()
  }]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [claudeApiKey, setClaudeApiKey] = useState<string>('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [voiceConfig, setVoiceConfig] = useState<VoiceConfig>({
    enableTTS: true,
    selectedVoice: null,
  });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  
  // DOM References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRecordingRef = useRef<any>(null);
  const currentAudio = useRef<HTMLAudioElement | null>(null);
  
  // Load API keys from localStorage
  useEffect(() => {
    const storedClaudeKey = localStorage.getItem('CLAUDE_API_KEY') || localStorage.getItem('claudeApiKey');
    const storedElevenLabsKey = localStorage.getItem('ELEVENLABS_API_KEY') || localStorage.getItem('elevenLabsApiKey');
    const storedVoiceId = localStorage.getItem('selectedVoiceId');
    
    if (storedClaudeKey) {
      setClaudeApiKey(storedClaudeKey);
    }
    
    if (storedElevenLabsKey) {
      setElevenLabsApiKey(storedElevenLabsKey);
    }
    
    if (storedVoiceId) {
      setVoiceConfig(prev => ({ ...prev, selectedVoice: storedVoiceId }));
    }
    
    // If no Claude API key, show settings modal
    if (!storedClaudeKey) {
      setIsApiSettingsOpen(true);
    }
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle stopping recording
  const stopRecording = () => {
    setIsRecording(false);
    if (audioRecordingRef.current) {
      audioRecordingRef.current.stopRecording();
    }
  };
  
  // Handle recording toggle
  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
      return;
    }
    
    setTranscribedText('Preparing microphone...');
    setIsRecording(true);
    
    try {
      // Get audio stream with improved quality
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        }
      });
      
      // Create a MediaRecorder instance
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      // Collect data
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      // When recording stops, process the audio
      mediaRecorder.onstop = async () => {
        // Stop all tracks to turn off the microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Create a blob from the audio chunks
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Handle the audio data
        handleAudioData(audioBlob);
      };
      
      // Start recording
      mediaRecorder.start();
      audioRecordingRef.current = {
        stopRecording: () => {
          if (mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
          }
        }
      };
      
      // Set a timeout to automatically stop recording after 10 seconds
      setTimeout(() => {
        if (isRecording && audioRecordingRef.current) {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Microphone access error. Please check permissions.');
      setIsRecording(false);
    }
  };
  
  // Function to handle audio data processing
  const handleAudioData = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);
      setTranscribedText('Processing your speech...');
      setError(null);
      
      // Check if the audio blob is too small
      if (audioBlob.size < 1000) {
        setTranscribedText('No speech detected. Please try again.');
        setIsProcessing(false);
        return;
      }
      
      // Create form data for the API request
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');
      if (selectedLanguage) formData.append('language', selectedLanguage);
      
      try {
        const response = await fetch('/api/whisper-local', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `Server error: ${response.status}`;
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }
        
        if (!data.text || data.text.trim() === '') {
          setTranscribedText('No speech detected. Please try again.');
          setIsProcessing(false);
          return;
        }
        
        // Update UI with transcribed text
        setTranscribedText(data.text);
        
        // Process the transcribed text to get AI response
        handleProcessTranscript(data.text);
      } catch (error) {
        setError(`Speech recognition failed: ${error instanceof Error ? error.message : 'Please try again.'}`);
        setIsProcessing(false);
      }
    } catch (error) {
      setError(`Speech processing error: ${error instanceof Error ? error.message : 'Please try again.'}`);
      setIsProcessing(false);
    }
  };
  
  // Process transcribed text through Claude
  const handleProcessTranscript = async (transcript: string) => {
    if (!transcript.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: transcript,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setTranscribedText('');
    
    try {
      // Check if we have Claude API key
      if (!claudeApiKey) {
        setError('Claude API key is required. Please add it in settings.');
        return;
      }
      
      // Show typing indicator
      setIsBotTyping(true);
      
      try {
        // Get response from Claude
        const response = await sendMessageToClaude(
          [
            ...messages.slice(-5).map(msg => ({
              role: msg.sender === 'user' ? 'user' as const : 'assistant' as const, 
              content: msg.text
            })),
            { role: 'user', content: transcript }
          ],
          claudeApiKey
        );
        
        // Add bot message
        const botMessage: Message = {
          id: `bot-${Date.now()}`,
          text: response.content,
          sender: 'assistant',
          timestamp: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Speak response if TTS is enabled
        if (voiceConfig.enableTTS && elevenLabsApiKey && voiceConfig.selectedVoice) {
          try {
            await speakText(response.content, voiceConfig.selectedVoice, elevenLabsApiKey);
          } catch (error) {
            console.error('TTS error:', error);
          }
        }
      } catch (error) {
        setError('Failed to get a response. Please try again.');
      }
    } catch (error) {
      setError('Failed to get response. Please check your API keys and try again.');
    } finally {
      setIsBotTyping(false);
      setIsProcessing(false);
    }
  };
  
  // Play message audio
  const playMessageAudio = async (message: Message) => {
    try {
      if (!elevenLabsApiKey || !voiceConfig.selectedVoice) {
        setError('ElevenLabs API key and voice selection are required for text-to-speech');
        return;
      }
      
      // Update message playing state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, isPlaying: true } : msg
        )
      );
      
      // Play the speech
      await speakText(message.text, voiceConfig.selectedVoice, elevenLabsApiKey);
      
      // Reset playing state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, isPlaying: false } : msg
        )
      );
    } catch (error) {
      console.error('Error playing message audio:', error);
      setError(`Failed to play audio: ${error instanceof Error ? error.message : String(error)}`);
      
      // Reset playing state on error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id ? { ...msg, isPlaying: false } : msg
        )
      );
    }
  };
  
  // Function to stop any playing audio
  const stopAudio = () => {
    if (typeof window !== 'undefined') {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    }
    
    // Reset playing state for all messages
    setMessages(prev => 
      prev.map(msg => msg.isPlaying ? { ...msg, isPlaying: false } : msg)
    );
  };
  
  // Save API settings
  const handleSaveApiSettings = (
    claudeKey: string, 
    elevenLabsKey: string, 
    openAiKey: string, 
    voiceId: string | null
  ) => {
    setClaudeApiKey(claudeKey);
    setElevenLabsApiKey(elevenLabsKey);
    setVoiceConfig(prev => ({ ...prev, selectedVoice: voiceId }));
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('CLAUDE_API_KEY', claudeKey);
      localStorage.setItem('ELEVENLABS_API_KEY', elevenLabsKey);
      if (voiceId) {
        localStorage.setItem('selectedVoiceId', voiceId);
      }
    }
    
    setIsApiSettingsOpen(false);
  };
  
  // Languages list
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
  ];
  
  return (
    <div className="relative h-screen flex flex-col bg-gradient-to-b from-[#0a0a20] to-[#131335] overflow-hidden">
      {/* Header with glassmorphic effect */}
      <header className="relative z-10 glassmorphic-dark border-b border-white/10 backdrop-blur-lg p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Parley
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="glassmorphic-dark border border-white/10 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Select language"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <FaGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" />
            </div>
            
            {/* Settings Button */}
            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="p-2 glassmorphic-dark border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-indigo-400"
              aria-label="API Settings"
            >
              <MdSettings size={22} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content split into two columns */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left column - Live Transcript */}
        <div className="w-full md:w-1/3 p-4 overflow-y-auto">
          <div className="glassmorphic-dark p-4 rounded-lg border border-white/10 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-2 flex items-center">
              <FaMicrophone className="mr-2 text-indigo-400" />
              Live Transcript
            </h2>
            
            {/* Error message if any */}
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                <p className="flex items-center">
                  <span className="mr-2">⚠️</span>
                  {error}
                </p>
                <button 
                  onClick={() => setError(null)}
                  className="ml-auto text-xs text-red-300 hover:text-red-100"
                >
                  <MdClose />
                </button>
              </div>
            )}
            
            {/* Transcribed text */}
            <div className="flex-1 mb-4">
              {isRecording ? (
                <div className="mb-4 p-4 glassmorphic-dark border border-red-500/30 rounded-xl text-white animate-pulse">
                  <div className="flex items-center font-medium text-red-400 mb-2">
                    <FaMicrophone className="mr-2" />
                    <span>Recording...</span>
                  </div>
                </div>
              ) : isProcessing ? (
                <div className="mb-4 p-4 glassmorphic-dark border border-yellow-500/30 rounded-xl text-white">
                  <div className="flex items-center font-medium text-yellow-400 mb-2">
                    <span className="mr-2">⏳</span>
                    <span>Processing your speech...</span>
                  </div>
                </div>
              ) : transcribedText ? (
                <div className="mb-4 p-4 glassmorphic-dark border border-indigo-500/30 rounded-xl text-white">
                  <div className="flex items-center font-medium text-indigo-400 mb-2">
                    <span className="mr-2">📝</span>
                    <span>Transcribed Speech</span>
                  </div>
                  <p className="text-white/90">{transcribedText}</p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                  <p>Tap the microphone to start speaking</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right column - Claude Responses */}
        <div className="w-full md:w-2/3 p-4 overflow-y-auto">
          <div className="glassmorphic-dark p-4 rounded-lg border border-white/10 h-full flex flex-col">
            <h2 className="text-lg font-semibold text-white mb-2">
              <span className="mr-2">💬</span>
              Assistant Responses
            </h2>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4 py-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-white'
                        : 'glassmorphic-dark border border-white/10 text-white/90'
                    }`}
                  >
                    <p className="text-base md:text-lg">{message.text}</p>
                    
                    {/* Play button for assistant messages */}
                    {message.sender === 'assistant' && elevenLabsApiKey && voiceConfig.selectedVoice && (
                      <div className="mt-2 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => message.isPlaying ? stopAudio() : playMessageAudio(message)}
                          className={`p-2 rounded-full ${
                            message.isPlaying 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                          } transition-colors`}
                          aria-label={message.isPlaying ? "Stop speaking" : "Speak message"}
                        >
                          {message.isPlaying ? <FaStop size={12} /> : <FaPlay size={12} />}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="glassmorphic-dark border border-white/10 p-4 rounded-2xl max-w-[85%]">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Large Mic Button (Bottom Center) */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isRecording ? {
            boxShadow: ['0 0 0 0 rgba(124, 58, 237, 0.7)', '0 0 0 20px rgba(124, 58, 237, 0)'],
            transition: { repeat: Infinity, duration: 1.5 }
          } : {}}
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`relative p-7 rounded-full shadow-lg ${
            isRecording
              ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-glow-md shadow-red-900/50'
              : isProcessing
                ? 'glassmorphic-dark text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-glow-md shadow-indigo-900/30 hover:shadow-glow-lg'
          } transition-all duration-300`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          {isRecording ? (
            <FaMicrophoneSlash size={30} />
          ) : (
            <FaMicrophone size={30} />
          )}
          
          {/* Pulse animation for recording state */}
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-red-600/50"></span>
              <motion.span 
                className="absolute inset-0 rounded-full bg-red-600/30"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </>
          )}
        </motion.button>
      </div>
      
      {/* API Settings Modal */}
      <ApiSettings
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        onSave={handleSaveApiSettings}
        initialClaudeKey={claudeApiKey}
        initialElevenLabsKey={elevenLabsApiKey}
        initialVoiceId={voiceConfig.selectedVoice}
        initialOpenAiKey={''}
      />
      
      {/* Global styles */}
      <style jsx global>{`
        .glassmorphic-dark {
          background: rgba(15, 15, 35, 0.5);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          backdrop-filter: blur(8px);
        }
        
        .shadow-glow-md {
          box-shadow: 0 0 25px 2px rgba(124, 58, 237, 0.25);
        }
        
        .shadow-glow-lg {
          box-shadow: 0 0 35px 5px rgba(124, 58, 237, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 15, 35, 0.2);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.5);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.7);
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .typing-indicator span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #a855f7;
          border-radius: 50%;
          display: inline-block;
          opacity: 0.4;
        }
        
        .typing-indicator span:nth-child(1) {
          animation: bounce 1s infinite;
        }
        
        .typing-indicator span:nth-child(2) {
          animation: bounce 1s infinite 0.2s;
        }
        
        .typing-indicator span:nth-child(3) {
          animation: bounce 1s infinite 0.4s;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
} 