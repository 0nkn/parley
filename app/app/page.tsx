'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, 
  FaMicrophoneSlash,
  FaPlay,
  FaStop,
  FaCog
} from 'react-icons/fa';
import { MdSettings, MdWavingHand } from 'react-icons/md';
import { speakText } from './api/elevenlabs';
import { sendMessageToClaude } from './api/claude';
import ApiSettings from './components/ApiSettings';

export default function HomePage() {
  // State management
  const [originalText, setOriginalText] = useState<string>('');
  const [clarifiedText, setClarifiedText] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [claudeApiKey, setClaudeApiKey] = useState<string>('');
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState<string>('');
  const [openAiApiKey, setOpenAiApiKey] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs
  const audioRecordingRef = useRef<any>(null);
  
  // Load API keys from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const envClaudeKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
      const envElevenLabsKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      const envOpenAiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      const storedClaudeKey = localStorage.getItem('CLAUDE_API_KEY') || envClaudeKey || '';
      const storedElevenLabsKey = localStorage.getItem('ELEVENLABS_API_KEY') || envElevenLabsKey || '';
      const storedOpenAiKey = localStorage.getItem('OPENAI_API_KEY') || envOpenAiKey || '';
      const storedVoiceId = localStorage.getItem('selectedVoiceId');
      
      if (storedClaudeKey) {
        setClaudeApiKey(storedClaudeKey);
        localStorage.setItem('CLAUDE_API_KEY', storedClaudeKey);
      }
      
      if (storedElevenLabsKey) {
        setElevenLabsApiKey(storedElevenLabsKey);
        localStorage.setItem('ELEVENLABS_API_KEY', storedElevenLabsKey);
      }
      
      if (storedOpenAiKey) {
        setOpenAiApiKey(storedOpenAiKey);
        localStorage.setItem('OPENAI_API_KEY', storedOpenAiKey);
      }
      
      if (storedVoiceId) {
        setSelectedVoice(storedVoiceId);
      }
      
      // If no Claude API key, show settings modal
      if (!storedClaudeKey || !storedOpenAiKey) {
        setIsApiSettingsOpen(true);
      }
      
      setIsLoading(false);
    }
  }, []);
  
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
    
    setOriginalText('Preparing microphone...');
    setClarifiedText('');
    setIsRecording(true);
    setError(null);
    
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
        
        // Only proceed if we have a decent-sized audio blob
        if (audioBlob.size < 1000) {
          setError("Audio recording was too short. Please try again.");
          setIsRecording(false);
          setOriginalText('');
          return;
        }
        
        setIsProcessing(true);
        
        try {
          // Create form data to send to Whisper API
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('model', 'tiny');
          
          // If you need to specify a language
          // formData.append('language', 'en');
          
          // Call the Whisper API
          const response = await fetch('/api/whisper-local', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Transcription failed: ${response.status}`);
          }
          
          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }
          
          // Use the actual transcribed text
          const transcript = data.text || "Could not detect speech";
          handleTranscription(transcript);
        } catch (error) {
          console.error('Transcription error:', error);
          setError(`Failed to transcribe: ${error instanceof Error ? error.message : String(error)}`);
          setIsRecording(false);
          setIsProcessing(false);
        }
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
  
  // Process transcription
  const handleTranscription = async (transcript: string) => {
    // Update UI with transcribed text
    setOriginalText(transcript);
    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      // Check if we have Claude API key
      if (!claudeApiKey) {
        setError('Claude API key is required. Please add it in settings.');
        setIsProcessing(false);
        return;
      }
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get response from Claude
      const response = await sendMessageToClaude(
        [
          { role: 'user', content: `Please clarify and improve this speech: "${transcript}"` }
        ],
        claudeApiKey
      );
      
      // Update UI with response
      setClarifiedText(response.content);
    } catch (error) {
      setError('Failed to get response. Please check your API keys and try again.');
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
    }
  };
  
  // Play clarified text as audio
  const playAudio = async () => {
    try {
      if (!elevenLabsApiKey || !selectedVoice) {
        setError('ElevenLabs API key and voice selection are required for text-to-speech');
        return;
      }
      
      setIsPlaying(true);
      await speakText(clarifiedText, selectedVoice, elevenLabsApiKey);
      setIsPlaying(false);
    } catch (error) {
      console.error('TTS error:', error);
      setError(`Failed to play audio: ${error instanceof Error ? error.message : String(error)}`);
      setIsPlaying(false);
    }
  };
  
  // Stop audio playback
  const stopAudio = () => {
    if (typeof window !== 'undefined') {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
      setIsPlaying(false);
    }
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
    setOpenAiApiKey(openAiKey);
    setSelectedVoice(voiceId);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('CLAUDE_API_KEY', claudeKey);
      localStorage.setItem('ELEVENLABS_API_KEY', elevenLabsKey);
      localStorage.setItem('OPENAI_API_KEY', openAiKey);
      if (voiceId) {
        localStorage.setItem('selectedVoiceId', voiceId);
      }
    }
    
    setIsApiSettingsOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a20] to-[#131335]">
        <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-xl">Loading Parley...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0a0a20] to-[#131335] text-white">
      {/* Header */}
      <header className="relative z-10 glassmorphic-dark border-b border-white/10 backdrop-blur-lg py-6">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center">
            <div className="relative mr-4">
              <div className="absolute inset-0 bg-indigo-600 blur-lg opacity-50 rounded-full"></div>
              <MdWavingHand className="text-5xl text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 tracking-tighter">
                Parley
              </h1>
              <p className="text-sm text-indigo-300 mt-1">AI-Powered Speech Assistant</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsApiSettingsOpen(true)}
            className="p-3 glassmorphic-dark border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-indigo-400 hover:text-indigo-300"
            aria-label="API Settings"
          >
            <MdSettings size={24} />
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        {/* Error display */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg shadow-lg"
          >
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm text-red-300 hover:text-red-100"
            >
              Dismiss
            </button>
          </motion.div>
        )}
        
        {/* Main interaction area */}
        <div className="flex flex-col gap-10">
          {/* Microphone circle button - centered */}
          <div className="flex justify-center mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isRecording ? {
                boxShadow: ['0 0 0 0 rgba(79, 70, 229, 0.7)', '0 0 0 20px rgba(79, 70, 229, 0)'],
                transition: { repeat: Infinity, duration: 1.5 }
              } : {}}
              onClick={toggleRecording}
              disabled={isProcessing}
              className={`relative p-12 rounded-full shadow-2xl ${
                isRecording
                  ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-glow-indigo'
                  : isProcessing
                    ? 'glassmorphic-dark text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 text-white shadow-glow-indigo hover:shadow-glow-lg-indigo'
              } transition-all duration-300 border-4 border-indigo-400/30`}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              {isRecording ? (
                <FaMicrophoneSlash size={50} className="drop-shadow-lg" />
              ) : (
                <FaMicrophone size={50} className="drop-shadow-lg" />
              )}
              
              {/* Pulse animation for recording state */}
              {isRecording && (
                <>
                  <span className="absolute inset-0 rounded-full animate-ping opacity-25 bg-indigo-600/50"></span>
                  <motion.span 
                    className="absolute inset-0 rounded-full bg-indigo-600/30"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </>
              )}
            </motion.button>
          </div>
          
          {/* Instruction text */}
          <motion.p 
            animate={{ 
              opacity: isRecording || isProcessing ? 1 : 0.7,
              scale: isRecording ? 1.05 : 1
            }}
            className="text-center text-lg text-indigo-200 mb-8 font-medium"
          >
            {isRecording 
              ? "Speaking... tap to stop" 
              : isProcessing 
                ? "Processing..." 
                : "Tap the microphone to start speaking"}
          </motion.p>
          
          {/* Results section */}
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
            {/* Original Speech */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`glassmorphic-dark p-6 rounded-2xl border-2 ${originalText ? 'border-indigo-500/30' : 'border-white/10'} shadow-xl`}
            >
              <h2 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center">
                <span className="mr-2">🎤</span>
                Original Speech
              </h2>
              
              {originalText ? (
                <p className="text-white/90">{originalText}</p>
              ) : (
                <p className="text-gray-500 italic">Your transcribed speech will appear here</p>
              )}
            </motion.div>
            
            {/* Clarified Speech */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`glassmorphic-dark p-6 rounded-2xl border-2 ${clarifiedText ? 'border-purple-500/30' : 'border-white/10'} shadow-xl`}
            >
              <h2 className="text-xl font-semibold text-purple-400 mb-4 flex items-center">
                <span className="mr-2">🧠</span>
                Clarified Speech
              </h2>
              
              {isTyping ? (
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              ) : clarifiedText ? (
                <p className="text-white/90">{clarifiedText}</p>
              ) : (
                <p className="text-gray-500 italic">Clarified response will appear here</p>
              )}
            </motion.div>
          </div>
          
          {/* Audio playback section */}
          {clarifiedText && (
            <div className="mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={isPlaying ? stopAudio : playAudio}
                disabled={!clarifiedText || !elevenLabsApiKey || !selectedVoice}
                className={`px-8 py-4 rounded-full flex items-center gap-3 shadow-2xl ${
                  isPlaying 
                    ? 'bg-gradient-to-r from-red-600 to-pink-500 text-white' 
                    : 'bg-gradient-to-r from-teal-500 to-cyan-400 text-white'
                } shadow-glow-teal transition-all duration-300 ${
                  (!clarifiedText || !elevenLabsApiKey || !selectedVoice) 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                } font-medium border border-white/10`}
              >
                {isPlaying ? (
                  <>
                    <FaStop size={20} /> Stop Audio
                  </>
                ) : (
                  <>
                    <FaPlay size={20} /> Play Audio
                  </>
                )}
              </motion.button>
            </div>
          )}
        </div>
      </main>
      
      {/* API Settings Modal */}
      <ApiSettings
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        onSave={handleSaveApiSettings}
        initialClaudeKey={claudeApiKey}
        initialElevenLabsKey={elevenLabsApiKey}
        initialVoiceId={selectedVoice}
        initialOpenAiKey={openAiApiKey}
      />
      
      {/* Global styles */}
      <style jsx global>{`
        .glassmorphic-dark {
          background: rgba(15, 15, 35, 0.5);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          backdrop-filter: blur(8px);
        }
        
        .shadow-glow-indigo {
          box-shadow: 0 0 30px 5px rgba(79, 70, 229, 0.3);
        }
        
        .shadow-glow-lg-indigo {
          box-shadow: 0 0 45px 8px rgba(79, 70, 229, 0.4);
        }
        
        .shadow-glow-teal {
          box-shadow: 0 0 25px 2px rgba(20, 184, 166, 0.25);
        }
        
        .shadow-glow-lg-teal {
          box-shadow: 0 0 35px 5px rgba(20, 184, 166, 0.3);
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px 0;
        }
        
        .typing-indicator span {
          height: 12px;
          width: 12px;
          margin: 0 4px;
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
            transform: translateY(-7px);
          }
        }
      `}</style>
    </div>
  );
} 