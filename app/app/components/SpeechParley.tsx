'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaPlay, 
  FaPause,
  FaVolumeUp, 
  FaCog, 
  FaGlobe, 
  FaComment, 
  FaCommentMedical,
  FaKeyboard,
  FaVolumeOff,
  FaStop,
  FaComments
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import ApiSettings from './ApiSettings';
import { setupAudioRecording } from '../api/whisper';
import { speakText } from '../api/elevenlabs';
import { useWebSpeechRecognition } from './WebSpeechAPI';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isPlaying?: boolean;
}

interface SpeechParleyProps {
  initialMessages?: Message[];
}

export default function SpeechParley({ initialMessages = [] }: SpeechParleyProps) {
  // API keys and settings
  const [claudeApiKey, setClaudeApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('CLAUDE_API_KEY') || '';
    }
    return '';
  });
  
  const [elevenLabsApiKey, setElevenLabsApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ELEVENLABS_API_KEY') || '';
    }
    return '';
  });
  
  const [voiceId, setVoiceId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ELEVENLABS_VOICE_ID') || '';
    }
    return '';
  });
  
  const [openAiApiKey, setOpenAiApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('OPENAI_API_KEY') || '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';
    }
    return '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';
  });
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  
  // Messages and input state
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // UI state
  const [inputMode, setInputMode] = useState<'voice' | 'text'>('voice');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRecordingRef = useRef<ReturnType<typeof setupAudioRecording> | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
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
  
  // Load API keys from localStorage on component mount
  useEffect(() => {
    const storedClaudeKey = localStorage.getItem('CLAUDE_API_KEY');
    const storedElevenLabsKey = localStorage.getItem('ELEVENLABS_API_KEY');
    const storedVoiceId = localStorage.getItem('ELEVENLABS_VOICE_ID');
    const storedOpenAiKey = localStorage.getItem('OPENAI_API_KEY');
    
    if (storedClaudeKey) setClaudeApiKey(storedClaudeKey);
    if (storedElevenLabsKey) setElevenLabsApiKey(storedElevenLabsKey);
    if (storedVoiceId) setVoiceId(storedVoiceId);
    if (storedOpenAiKey) setOpenAiApiKey(storedOpenAiKey);
    
    // If no API keys are set, open the settings modal
    if (!storedClaudeKey || !storedOpenAiKey) {
      setIsApiSettingsOpen(true);
    }
  }, []);
  
  // Setup audio recording when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRecordingRef.current = setupAudioRecording(
        handleAudioData,
        () => setIsListening(false)
      );
    }
  }, [openAiApiKey]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Initialize welcome message if no messages
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: "Welcome to Speech Parley! I'm your AI assistant ready to help break communication barriers. Tap the microphone to start speaking, or switch to text input if you prefer typing. How can I assist you today?",
          sender: 'assistant',
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Handle audio data from recording
  const handleAudioData = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    setTranscribedText('Processing your speech...');
    
    try {
      // Create FormData to send the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob);
      if (selectedLanguage !== 'en') {
        formData.append('language', selectedLanguage);
      }
      // Add model parameter (use tiny for fastest results)
      formData.append('model', 'tiny');
      
      console.log('Sending audio data for transcription...');
      
      // Try local Whisper endpoint first, fall back to OpenAI if needed
      let response;
      let transcribed = '';
      let usingLocalWhisper = true;
      
      try {
        console.log('Attempting local Whisper transcription');
        response = await fetch('/api/whisper-local', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          usingLocalWhisper = false;
          throw new Error(`Local whisper failed with status ${response.status}`);
        }
        
        const data = await response.json();
        transcribed = data.text || '';
        console.log('Local Whisper transcription result:', transcribed);
        
      } catch (localError) {
        console.log('Local Whisper failed:', localError);
        setTranscribedText('Local processing failed, trying OpenAI API...');
        usingLocalWhisper = false;
        
        // Try the API version
        console.log('Falling back to OpenAI API...');
        try {
          const apiResponse = await fetch('/api/whisper', {
            method: 'POST',
            headers: {
              'x-openai-api-key': openAiApiKey
            },
            body: formData
          });
          
          if (!apiResponse.ok) {
            const errorData = await apiResponse.json();
            throw new Error(errorData.error || 'Failed to transcribe speech');
          }
          
          const data = await apiResponse.json();
          transcribed = data.text || '';
          console.log('OpenAI API transcription result:', transcribed);
        } catch (apiError) {
          console.error('API fallback also failed:', apiError);
          throw apiError;
        }
      }
      
      if (transcribed) {
        setTranscribedText(transcribed);
        handleSendMessage(transcribed);
      } else {
        setTranscribedText('');
        setError('No speech detected. Please try again and speak clearly.');
      }
      
    } catch (error) {
      console.error('Error transcribing speech:', error);
      setError(error instanceof Error ? error.message : 'Failed to transcribe speech');
      setTranscribedText('');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Initialize Web Speech API as fallback
  const webSpeech = useWebSpeechRecognition({
    language: selectedLanguage || 'en-US',
    continuous: false,
    interimResults: true,
    onResult: (transcript, isFinal) => {
      if (isFinal && isListening) {
        // Auto-submit when final result is ready
        setTranscribedText(transcript);
        // Stop listening and send the message
        webSpeech.stop();
        setIsListening(false);
        handleSendMessage(transcript);
      } else if (!isFinal) {
        // Update interim results
        setTranscribedText(`${transcript} (listening...)`);
      }
    },
    onError: (error) => {
      console.error('Web Speech API error:', error);
      setError(`Speech recognition error: ${error}`);
      setIsListening(false);
    },
    onStart: () => {
      console.log('Web Speech API started');
    },
    onEnd: () => {
      console.log('Web Speech API ended');
      setIsListening(false);
    }
  });
  
  // Toggle speech recognition - modified to use all available options
  const toggleListening = async () => {
    if (isListening) {
      // Stop listening
      audioRecordingRef.current?.stopRecording();
      webSpeech.stop();
      setIsListening(false);
    } else {
      // Start listening
      setError(null);
      setTranscribedText('');
      
      // Try Whisper first (if we're not just using Web Speech API)
      if (!useWebSpeechOnly) {
        const success = await audioRecordingRef.current?.startRecording();
        if (success) {
          setIsListening(true);
        } else {
          // If Whisper fails, try Web Speech API
          console.log('Whisper recording failed, trying Web Speech API');
          if (webSpeech.isSupported) {
            webSpeech.start();
            setIsListening(true);
          } else {
            setError('Speech recognition is not available in this browser');
          }
        }
      } else {
        // Use Web Speech API directly
        if (webSpeech.isSupported) {
          webSpeech.start();
          setIsListening(true);
        } else {
          setError('Speech recognition is not available in this browser');
        }
      }
    }
  };
  
  // Add a state to control which speech recognition to use
  const [useWebSpeechOnly, setUseWebSpeechOnly] = useState(false);
  
  // Add UI toggle for Web Speech API
  const toggleSpeechAPI = () => {
    setUseWebSpeechOnly(!useWebSpeechOnly);
  };
  
  // Handle sending messages
  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    if (!claudeApiKey) {
      setIsApiSettingsOpen(true);
      return;
    }
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    try {
      // Create Claude API request
      let promptContent = `${text.trim()}`;
      
      // If language is not English, add translation context
      if (selectedLanguage !== 'en') {
        promptContent = `The user is speaking in ${languages.find(l => l.code === selectedLanguage)?.name || selectedLanguage}. 
        Their message: "${text.trim()}"
        Please respond in the same language. Keep your response clear and concise.`;
      }
      
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-claude-api-key': claudeApiKey
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            { role: 'user', content: promptContent }
          ],
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from Claude');
      }
      
      const data = await response.json();
      const assistantResponse = data.content.trim();
      
      // Add assistant message
      const assistantMessage: Message = {
        id: Date.now().toString(),
        text: assistantResponse,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Play audio response if ElevenLabs is configured
      if (elevenLabsApiKey && voiceId) {
        try {
          const audio = await speakText(assistantResponse, voiceId, elevenLabsApiKey);
          setCurrentAudio(audio);
          
          // Mark message as playing
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, isPlaying: true }
                : msg
            )
          );
          
          // Add event listener for when audio ends
          audio.addEventListener('ended', () => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, isPlaying: false }
                  : msg
              )
            );
            setCurrentAudio(null);
          });
          
          audio.play();
        } catch (error) {
          console.error('Error playing audio response:', error);
        }
      }
    } catch (error) {
      console.error('Error sending message to Claude:', error);
      setError(error instanceof Error ? error.message : 'Failed to get response');
      
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  // Play audio for a specific message
  const playMessageAudio = async (message: Message) => {
    if (!elevenLabsApiKey || !voiceId || message.sender !== 'assistant') return;
    
    try {
      // Stop any current audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      
      const audio = await speakText(message.text, voiceId, elevenLabsApiKey);
      setCurrentAudio(audio);
      
      // Mark message as playing
      setMessages(prev => 
        prev.map(msg => 
          msg.id === message.id 
            ? { ...msg, isPlaying: true }
            : { ...msg, isPlaying: false }
        )
      );
      
      // Add event listener for when audio ends
      audio.addEventListener('ended', () => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === message.id 
              ? { ...msg, isPlaying: false }
              : msg
          )
        );
        setCurrentAudio(null);
      });
      
      audio.play();
    } catch (error) {
      console.error('Error playing audio for message:', error);
      setError(error instanceof Error ? error.message : 'Failed to play audio');
    }
  };
  
  // Stop playing audio
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      
      // Remove playing state from all messages
      setMessages(prev => 
        prev.map(msg => ({ ...msg, isPlaying: false }))
      );
    }
  };
  
  // Handle saving API settings
  const handleSaveApiSettings = (
    claudeKey: string, 
    elevenLabsKey: string, 
    newVoiceId: string,
    openAiKey: string
  ) => {
    setClaudeApiKey(claudeKey);
    setElevenLabsApiKey(elevenLabsKey);
    setVoiceId(newVoiceId);
    setOpenAiApiKey(openAiKey);
    setIsApiSettingsOpen(false);
  };
  
  // Switch between voice and text input modes
  const toggleInputMode = () => {
    setInputMode(prev => prev === 'voice' ? 'text' : 'voice');
    if (isListening) {
      audioRecordingRef.current?.stopRecording();
      setIsListening(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const messageVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', damping: 20, stiffness: 300 }
    }
  };
  
  return (
    <div className="relative h-screen flex flex-col bg-gradient-to-b from-[#050510] to-[#0a0a1a]">
      {/* Ambient background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-80 h-80 bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] right-[15%] w-96 h-96 bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[5%] w-64 h-64 bg-blue-900/20 rounded-full blur-[80px]" />
      </div>
      
      {/* Header */}
      <header className="glassmorphic border-b border-gray-800/50 backdrop-blur-sm p-4 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold gradient-text">Speech Parley</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800/70 border border-gray-700 text-gray-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              className="p-2 bg-gray-800/70 border border-gray-700 rounded-lg hover:bg-gray-700/70 transition-colors text-indigo-400"
              aria-label="API Settings"
            >
              <MdSettings size={22} />
            </button>
            
            {/* Web Speech API Toggle */}
            <button
              onClick={toggleSpeechAPI}
              className={`p-2 rounded-md ${
                useWebSpeechOnly 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-800 text-gray-400'
              }`}
              title={useWebSpeechOnly ? "Using browser's Speech API" : "Using Whisper API"}
            >
              <FaComments size={18} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Add a message when using Web Speech API */}
      {useWebSpeechOnly && (
        <div className="mx-auto my-2 px-4 py-2 bg-blue-900/30 border border-blue-700/50 rounded-full text-sm text-center max-w-md">
          Using browser's Speech API (no server required)
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="container mx-auto h-full flex flex-col p-4 pt-2">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-800">
            <motion.div
              className="space-y-4 py-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={messageVariants}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] md:max-w-[70%] p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-white'
                        : 'glassmorphic border border-gray-800/50 text-white'
                    }`}
                  >
                    <p className="text-base md:text-lg">{message.text}</p>
                    
                    {/* Play button for assistant messages */}
                    {message.sender === 'assistant' && elevenLabsApiKey && voiceId && (
                      <div className="mt-2 flex justify-end">
                        <button
                          onClick={() => message.isPlaying ? stopAudio() : playMessageAudio(message)}
                          className={`p-1.5 rounded-full ${
                            message.isPlaying 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                              : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'
                          } transition-colors`}
                          aria-label={message.isPlaying ? "Stop speaking" : "Speak message"}
                        >
                          {message.isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="glassmorphic border border-gray-800/50 p-4 rounded-2xl max-w-[80%]">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Reference for scrolling to bottom */}
              <div ref={messagesEndRef} />
            </motion.div>
          </div>
          
          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mb-4 p-3 bg-red-900/30 border border-red-800/50 rounded-lg text-red-200 text-sm"
              >
                <p className="flex items-center">
                  <FaMicrophoneSlash className="mr-2" />
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Live transcription display */}
          <AnimatePresence>
            {(isListening || isProcessing || transcribedText) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 overflow-hidden"
              >
                <div className="glassmorphic border border-gray-800/50 p-3 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1 flex items-center">
                    <BiTransfer className="mr-2" />
                    {isListening ? 'Listening...' : isProcessing ? 'Processing...' : 'Transcribed Text'}
                  </div>
                  <p className="text-white">
                    {isListening ? (
                      <span className="inline-flex items-center">
                        <span className="pulse-dot mr-2"></span>
                        Speak now...
                      </span>
                    ) : isProcessing ? (
                      'Processing your speech...'
                    ) : (
                      transcribedText || 'No speech detected'
                    )}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Input Area */}
          <div className="glassmorphic border border-gray-800/50 rounded-xl p-4 backdrop-blur-md">
            {inputMode === 'text' ? (
              <form onSubmit={handleSubmit} className="flex items-end">
                <textarea
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-transparent border-none resize-none p-2 focus:outline-none text-white placeholder-gray-500"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={toggleInputMode}
                    className="p-3 bg-gray-800/70 text-indigo-400 rounded-lg mr-2 hover:bg-gray-700/70 transition-colors"
                    aria-label="Switch to voice input"
                  >
                    <FaMicrophone />
                  </button>
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isTyping}
                    className={`p-3 rounded-lg ${
                      !inputText.trim() || isTyping
                        ? 'bg-gray-800/70 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 hover-scale'
                    } transition-all`}
                    aria-label="Send message"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  disabled={isProcessing}
                  className={`relative p-6 rounded-full shadow-glow-lg ${
                    isListening
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white'
                      : isProcessing
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500'
                  } transition-all duration-300`}
                  aria-label={isListening ? 'Stop listening' : 'Start listening'}
                >
                  {isListening ? (
                    <FaMicrophoneSlash size={28} />
                  ) : isProcessing ? (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  ) : (
                    <FaMicrophone size={28} />
                  )}
                  
                  {/* Pulse animation for listening state */}
                  {isListening && (
                    <>
                      <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-25"></span>
                      <span className="absolute inset-0 rounded-full bg-red-600 animate-pulse opacity-50"></span>
                    </>
                  )}
                </motion.button>
                
                <div className="flex items-center mt-4 text-gray-300">
                  <button
                    onClick={toggleInputMode}
                    className="flex items-center text-sm hover:text-white transition-colors p-2"
                  >
                    <FaKeyboard className="mr-2" />
                    Switch to keyboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* API Settings Modal */}
      <ApiSettings
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
        onSave={handleSaveApiSettings}
        initialClaudeKey={claudeApiKey}
        initialElevenLabsKey={elevenLabsApiKey}
        initialVoiceId={voiceId}
        initialOpenAiKey={openAiApiKey}
      />
    </div>
  );
} 