"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMic, FiUser, FiMessageSquare, FiSettings, FiGlobe, FiBookOpen, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { RiRobot2Line, RiTranslate } from 'react-icons/ri';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { BsCardText, BsKeyboard } from 'react-icons/bs';
import { FaRobot, FaUserAlt, FaKeyboard, FaMicrophone, FaPaperPlane, FaUser, FaStop, FaCog, FaVolumeUp, FaVolumeOff, FaAccessibleIcon, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { IoGrid } from 'react-icons/io5';
import { MdFavorite, MdStarRate, MdTextFields, MdVoiceChat, MdOutlineHelp, MdOutlineAccessibilityNew, MdDarkMode, MdLightMode, MdFormatSize } from 'react-icons/md';
import { RiDashboardLine, RiTeamFill, RiUserVoiceFill, RiFileTextFill, RiVolumeUpFill } from 'react-icons/ri';
import { AiFillMedicineBox, AiOutlineTranslation } from 'react-icons/ai';
import { BsFillChatSquareTextFill, BsSpeedometer } from 'react-icons/bs';
import { IoIosOptions } from 'react-icons/io';
import Link from 'next/link';
import { TbBrain, TbMessageLanguage } from 'react-icons/tb';
import { BsFillPlusCircleFill, BsChatSquareQuoteFill } from 'react-icons/bs';
import { IoMdHelpCircle } from 'react-icons/io';
import { MdKeyboardVoice, MdSpatialAudio, MdOutlineDashboard, MdOutlineKeyboardAlt } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import { GoBroadcast } from 'react-icons/go';

// Import API services
import { sendMessageToClaude, extractMedicalTerminology, translateText } from '../api/claude';
import { speakText } from '../api/elevenlabs';
import { useSpeechRecognition } from '../api/speech';
import ApiSettings from './ApiSettings';

// Generate a unique ID
const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isProcessing?: boolean;
  medicalTerms?: Array<{term: string, definition: string}>;
  translation?: string;
  translationLanguage?: string;
}

interface ApiKeys {
  claude?: string;
  elevenlabs?: string;
}

// Medical term interface
interface MedicalTerm {
  term: string;
  definition: string;
}

// SVG Wave Component for dividers
const WaveDivider = () => (
  <div className="wave-divider relative z-0">
    <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
      <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="rgba(80, 80, 255, 0.1)"></path>
    </svg>
  </div>
);

const features = [
  { icon: <RiUserVoiceFill size={24} />, name: "Speech Enhancement" },
  { icon: <AiFillMedicineBox size={24} />, name: "Medical Terminology" },
  { icon: <BsFillChatSquareTextFill size={24} />, name: "Visual Communication" },
  { icon: <AiOutlineTranslation size={24} />, name: "Real-time Translation" },
  { icon: <RiFileTextFill size={24} />, name: "Custom Phrasebook" },
  { icon: <BsSpeedometer size={24} />, name: "Impact Dashboard" },
];

const quickActions = [
  { icon: <MdOutlineHelp size={18} />, text: "I need help" },
  { icon: <FaRobot size={18} />, text: "Introduce yourself" },
  { icon: <IoIosOptions size={18} />, text: "What can you do?" },
];

const Parley: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const { isListening, startListening, stopListening, isSpeechRecognitionActive, speechRecognitionSupported } = useSpeechRecognition();

  // Add state for text-to-speech
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Update API keys loading and speech recognition state at the beginning
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get API keys from localStorage
      const claudeKey = localStorage.getItem('CLAUDE_API_KEY');
      const elevenLabsKey = localStorage.getItem('ELEVENLABS_API_KEY');
      const voiceId = localStorage.getItem('ELEVENLABS_VOICE_ID');
      
      console.log('Retrieved API keys from localStorage:', {
        claudeKey: claudeKey ? `Found (starts with: ${claudeKey.substring(0, 3)}...)` : 'Not found',
        elevenLabsKey: elevenLabsKey ? 'Found' : 'Not found',
        voiceId: voiceId ? 'Found' : 'Not found'
      });
      
      // Validate Claude API key format
      const isValidClaudeKey = claudeKey && (claudeKey.startsWith('sk-') || claudeKey.includes('_'));
      
      if (claudeKey && !isValidClaudeKey) {
        console.warn('Invalid Claude API key format detected, clearing from localStorage');
        localStorage.removeItem('CLAUDE_API_KEY');
      }
      
      // Update state with API keys
      setApiKeys({
        claude: isValidClaudeKey ? claudeKey : undefined,
        elevenlabs: elevenLabsKey || undefined
      });
      
      if (voiceId) {
        setSelectedVoiceId(voiceId);
      }
      
      // Check if we should show API key modal on first load when no API keys are set
      if (!isValidClaudeKey) {
        console.log('No valid Claude API key found, showing API settings modal');
        // Delay opening the modal slightly to ensure components are mounted
        setTimeout(() => setShowApiKeyModal(true), 500);
      }
      
      // Add a welcome message if there are no messages
      if (messages.length === 0) {
        setMessages([{
          id: generateId(),
          text: "Hello! I'm Parley, your AI-powered communication assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    }
  }, []);

  // Enhanced speech recognition with feedback
  const { 
    transcript, 
    start: startSpeechRecognition, 
    stop: stopSpeechRecognition, 
  } = useSpeechRecognition({
    language: 'en-US',
    onResult: (result) => {
      if (inputMode === 'voice') {
        setInputValue(result.transcript);
        
        // Auto-submit after final result if in voice mode and after a short delay
        if (result.isFinal) {
          const finalTranscript = result.transcript.trim();
          if (finalTranscript) {
            setTimeout(() => {
              handleSubmit(undefined, finalTranscript);
            }, 800);
          }
        }
      }
    }
  });

  // Toggle input mode and start/stop listening
  useEffect(() => {
    if (inputMode === 'voice') {
      if (speechRecognitionSupported) {
        try {
          startSpeechRecognition();
        } catch (error) {
          console.error('Failed to start speech recognition:', error);
          const errorMsg = 'Failed to start speech recognition. Please make sure your browser has microphone permission.';
          alert(errorMsg);
          setInputMode('text');
        }
      } else {
        console.error('Speech recognition not supported in this browser');
        const errorMsg = 'Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.';
        alert(errorMsg);
        setInputMode('text');
      }
    } else {
      if (isSpeechRecognitionActive) {
        stopSpeechRecognition();
      }
    }
    
    return () => {
      if (isSpeechRecognitionActive) {
        stopSpeechRecognition();
      }
    };
  }, [inputMode, startSpeechRecognition, stopSpeechRecognition, speechRecognitionSupported, isSpeechRecognitionActive]);

  // Bot responses for different user queries
  const getBotResponse = (userMessage: string): string => {
    const lowerCaseMsg = userMessage.toLowerCase();
    
    if (lowerCaseMsg.includes('hello') || lowerCaseMsg.includes('hi')) {
      return "Hello! I'm Parley, your AI-powered communication assistant. How can I help you today?";
    } else if (lowerCaseMsg.includes('help')) {
      return "I'm here to help you communicate more effectively. I can assist with speech enhancement, medical terminology, translation, and more. What specific assistance do you need?";
    } else if (lowerCaseMsg.includes('introduce')) {
      return "I'm Parley, an AI-powered communication assistant designed to help individuals with speech disabilities or language barriers. I can transform speech to text and back, recognize medical terminology, provide a visual communication board, translate in real-time, store your favorite phrases, and track your communication progress.";
    } else if (lowerCaseMsg.includes('what can you do')) {
      return "I can help you with speech-to-text transformation, recognize medical terminology, provide a visual communication board, translate conversations in real-time, store your favorite phrases in a phrasebook, and track your communication improvements over time.";
    } else if (lowerCaseMsg.includes('medical') || lowerCaseMsg.includes('terminology')) {
      return "I'm trained to recognize and explain medical terminology, making healthcare conversations easier. Just say or type the medical term you're unsure about, and I'll help explain it.";
    } else if (lowerCaseMsg.includes('translate')) {
      return "I can translate your communications in real-time to help overcome language barriers. Simply specify which language you want to translate to, and I'll handle the rest.";
    } else {
      return "I'm processing your message. How else can I assist you with communication today?";
    }
  };

  // Toggle text-to-speech function
  const toggleTextToSpeech = () => {
    // Stop any currently playing audio when toggling
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    
    setTextToSpeechEnabled(!textToSpeechEnabled);
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('TEXT_TO_SPEECH_ENABLED', (!textToSpeechEnabled).toString());
    }
  };

  // Load text-to-speech preference on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreference = localStorage.getItem('TEXT_TO_SPEECH_ENABLED');
      if (savedPreference !== null) {
        setTextToSpeechEnabled(savedPreference === 'true');
      }
    }
  }, []);

  // Add a function to handle playing message audio manually
  const handlePlayMessage = async (text: string) => {
    if (!apiKeys.elevenlabs || !selectedVoiceId) {
      return;
    }
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    
    try {
      // Get the audio but don't play it automatically
      const audio = await speakText(
        text,
        selectedVoiceId,
        apiKeys.elevenlabs
      );
      
      // Now manually play it in response to user interaction
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Audio playback started successfully');
          setCurrentAudio(audio);
          
          // Set up ended handler
          audio.addEventListener('ended', () => {
            setCurrentAudio(null);
          });
        }).catch(error => {
          console.error('Error playing audio:', error);
          alert('Failed to play audio. This may be due to browser autoplay restrictions or an error with the audio file.');
        });
      }
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      alert('There was an error generating or playing the audio.');
    }
  };

  // Function to handle TTS for new bot messages
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    
    // Check if we should prepare the latest message audio
    // Note: We no longer auto-play due to browser restrictions
    if (
      textToSpeechEnabled && 
      latestMessage && 
      latestMessage.sender === 'bot' && 
      !latestMessage.isProcessing && 
      apiKeys.elevenlabs && 
      selectedVoiceId
    ) {
      // We'll let the user manually play the message using the button
      // This avoids browser autoplay restrictions
      console.log('Text-to-speech enabled for latest message, user can play it manually');
    }
  }, [messages, textToSpeechEnabled, apiKeys.elevenlabs, selectedVoiceId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on component mount
  useEffect(() => {
    if (inputMode === 'text') {
      inputRef.current?.focus();
    }
  }, [inputMode]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
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
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    exit: { 
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const typingVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Accessibility panel animation
  const accessibilityVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    },
    exit: { 
      opacity: 0,
      y: 10,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  // Ambient background elements - positioned carefully to avoid strange shapes
  const ambientOrbs = [
    { top: '15%', left: '5%', width: '250px', height: '250px', background: 'rgba(60, 60, 200, 0.08)' },
    { bottom: '20%', right: '8%', width: '200px', height: '200px', background: 'rgba(120, 60, 220, 0.06)' },
    { top: '40%', left: '35%', width: '300px', height: '300px', background: 'rgba(40, 80, 180, 0.04)' },
  ];

  // Get proper font size class with more noticeable differences
  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-lg md:text-xl';
      case 'xl': return 'text-xl md:text-2xl';
      default: return 'text-base';
    }
  };

  const getHeaderFontClass = () => {
    switch (fontSize) {
      case 'large': return 'text-3xl md:text-4xl';
      case 'xl': return 'text-4xl md:text-5xl';
      default: return 'text-2xl md:text-3xl';
    }
  };

  const getSubHeaderFontClass = () => {
    switch (fontSize) {
      case 'large': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-sm md:text-base';
    }
  };

  const saveApiKeys = (claudeKey: string, elevenLabsKey: string, voiceId: string) => {
    if (typeof window !== 'undefined') {
      console.log('Saving API keys to localStorage:', {
        claudeKey: claudeKey ? 'Exists (length: ' + claudeKey.length + ')' : 'Empty',
        elevenLabsKey: elevenLabsKey ? 'Exists' : 'Empty',
        voiceId: voiceId || 'None'
      });
      
      // First remove any existing keys to ensure we don't have stale data
      localStorage.removeItem('CLAUDE_API_KEY');
      localStorage.removeItem('ELEVENLABS_API_KEY');
      localStorage.removeItem('ELEVENLABS_VOICE_ID');
      
      // Then save the new keys if they're valid
      if (claudeKey && claudeKey.trim()) {
        localStorage.setItem('CLAUDE_API_KEY', claudeKey.trim());
      }
      
      if (elevenLabsKey && elevenLabsKey.trim()) {
        localStorage.setItem('ELEVENLABS_API_KEY', elevenLabsKey.trim());
      }
      
      if (voiceId && voiceId.trim()) {
        localStorage.setItem('ELEVENLABS_VOICE_ID', voiceId.trim());
      }
      
      // Update state
      const newApiKeys = {
        claude: claudeKey && claudeKey.trim() ? claudeKey.trim() : undefined,
        elevenlabs: elevenLabsKey && elevenLabsKey.trim() ? elevenLabsKey.trim() : undefined
      };
      
      console.log('Setting API keys in state:', {
        claude: newApiKeys.claude ? 'Set' : 'Not set',
        elevenlabs: newApiKeys.elevenlabs ? 'Set' : 'Not set'
      });
      
      setApiKeys(newApiKeys);
      
      if (voiceId && voiceId.trim()) {
        setSelectedVoiceId(voiceId.trim());
      } else {
        setSelectedVoiceId(null);
      }
      
      setShowApiKeyModal(false);

      // Add a system message to indicate settings were updated
      if (claudeKey || elevenLabsKey) {
        const updateMessage: Message = {
          id: generateId(),
          text: 'API settings updated. ' + 
                (claudeKey ? 'Claude AI is now enabled. ' : '') + 
                (elevenLabsKey && voiceId ? 'Text-to-speech is now available.' : ''),
          sender: 'bot',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, updateMessage]);
      }
    }
  };

  // Update handle submit to use Claude API if available
  const handleSubmit = async (e?: React.FormEvent, quickActionText?: string) => {
    if (e) e.preventDefault();
    
    // Use quick action text if provided, otherwise use input value
    const messageText = quickActionText || inputValue;
    
    // Don't do anything if message is empty
    if (!messageText.trim()) return;
    
    // Stop any playing audio when sending a new message
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }

    // Create and add user message
    const userMessage: Message = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // If we're using voice input, stop listening
    if (inputMode === 'voice' && isSpeechRecognitionActive) {
      stopSpeechRecognition();
    }
    
    // Focus the input if in text mode
    if (inputMode === 'text' && inputRef.current) {
      inputRef.current.focus();
    }
    
    // Scroll to bottom after user message
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);

    try {
      // Process with Claude if API key is available
      if (apiKeys.claude) {
        // Add processing message to show typing indicator
        const processingMessage: Message = {
          id: generateId(),
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          isProcessing: true
        };
        
        setMessages(prev => [...prev, processingMessage]);
        
        // Get all previous messages for context
        const messageHistory = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));
        
        // Add the new user message
        messageHistory.push({
          role: 'user',
          content: messageText
        });
        
        // Check for translation requests
        const translationMatch = messageText.match(/translate\s+(?:this\s+)?(?:to\s+)?(\w+)/i);
        const language = translationMatch ? translationMatch[1].toLowerCase() : null;
        
        let botResponse;
        let medicalTerms = null;
        let translatedText = null;
        
        // Handle different request types
        if (language && messages.length > 1) {
          // Get the previous message to translate
          const previousMessage = messages[messages.length - 2];
          
          try {
            console.log('Attempting translation to', language);
            translatedText = await translateText(
              previousMessage.text, 
              language, 
              apiKeys.claude
            );
          } catch (error) {
            console.error('Translation error:', error);
            translatedText = `Sorry, I couldn't translate to ${language}. ${error instanceof Error ? error.message : 'An unknown error occurred.'}`;
          }
          
          botResponse = `Here's the translation to ${language}:\n\n${translatedText}`;
        } else {
          // Regular message response
          console.log('Sending message to Claude API with key:', apiKeys.claude ? 'Key exists' : 'No key');
          try {
            const claudeResponse = await sendMessageToClaude(messageHistory, apiKeys.claude);
            botResponse = claudeResponse.content;
            
            // Look for medical terminology if the message is relevant
            if (
              messageText.toLowerCase().includes('medical') || 
              messageText.toLowerCase().includes('health') ||
              messageText.toLowerCase().includes('condition') ||
              messageText.toLowerCase().includes('symptom') ||
              messageText.toLowerCase().includes('diagnosis') ||
              messageText.toLowerCase().includes('treatment')
            ) {
              try {
                medicalTerms = await extractMedicalTerminology(botResponse, apiKeys.claude);
              } catch (error) {
                console.error('Error extracting medical terms:', error);
                // Continue without medical terms if extraction fails
              }
            }
          } catch (error) {
            console.error('Error getting response from Claude:', error);
            
            let errorMessage = 'I\'m sorry, there was an error communicating with my AI service.';
            
            // Check for authentication errors
            if (error instanceof Error) {
              if (error.message.includes('Authentication error') || 
                  error.message.includes('API key') || 
                  error.message.toLowerCase().includes('invalid')) {
                errorMessage = 'Invalid or missing API key. Please update your API settings.';
                // Show API settings modal
                setTimeout(() => setShowApiKeyModal(true), 1000);
              } else if (error.message.includes('Network error')) {
                errorMessage = 'Network error: Failed to connect to Claude API. Please check your internet connection and API settings.';
              } else {
                errorMessage += ' ' + error.message;
              }
            }
            
            botResponse = errorMessage;
          }
        }
        
        // Replace the processing message with the actual response
        setMessages(prev => 
          prev.map(msg => 
            msg.id === processingMessage.id 
              ? {
                  ...msg,
                  id: generateId(),
                  text: botResponse,
                  isProcessing: false,
                  medicalTerms,
                  translation: translatedText,
                  translationLanguage: language
                }
              : msg
          )
        );
      } else {
        // No API key available - prompt to set up API key
        setTimeout(() => {
          const botMessage: Message = {
            id: generateId(),
            text: "It looks like you haven't set up your Claude API key yet. Would you like to set it up now to enable AI-powered conversations?",
            sender: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          
          // Show API settings modal after a short delay
          setTimeout(() => setShowApiKeyModal(true), 1500);
        }, 1000);
      }
    } catch (error) {
      console.error('Error in message handling:', error);
      
      // Show detailed error message to user
      let errorMessage = "I'm sorry, there was an error processing your message.";
      
      if (error instanceof Error) {
        // Format the error message to be more user-friendly
        if (error.message.includes('Authentication error') || error.message.includes('API key')) {
          errorMessage = "Your API key appears to be invalid. Please update your API settings.";
          // Show API settings modal
          setTimeout(() => setShowApiKeyModal(true), 1000);
        } else if (error.message.includes('Network error')) {
          errorMessage = "Network error: Could not connect to the AI service. Please check your internet connection.";
        } else {
          errorMessage += ' ' + error.message;
        }
      }
      
      const errorResponseMessage: Message = {
        id: generateId(),
        text: errorMessage,
        sender: 'bot',
        timestamp: new Date()
      };
      
      // Replace processing message with error or add new error message
      if (apiKeys.claude && messages.some(msg => msg.isProcessing)) {
        setMessages(prev => 
          prev.map(msg => 
            msg.isProcessing 
              ? errorResponseMessage
              : msg
          )
        );
      } else {
        setMessages(prev => [...prev, errorResponseMessage]);
      }
      
      setIsTyping(false);
    } finally {
      // Always reset typing state after message is processed
      setTimeout(() => {
        setIsTyping(false);
      }, 500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col h-screen w-full overflow-hidden bg-gradient-to-b from-[#050510] to-[#0a0a1a] text-gray-100 relative ${highContrast ? 'high-contrast-mode' : ''}`}
    >
      {/* Ambient background orbs with fixed positioning and z-index */}
      {!highContrast && ambientOrbs.map((orb, index) => (
        <div
          key={index}
          className="ambient-orb fixed pointer-events-none"
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            bottom: orb.bottom,
            width: orb.width,
            height: orb.height,
            background: orb.background,
            zIndex: 0,
            borderRadius: '50%',
          }}
        />
      ))}

      {/* Tech grid lines with proper z-index */}
      {!highContrast && (
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute left-[20%] top-0 bottom-0 w-px tech-line"></div>
          <div className="absolute left-[40%] top-0 bottom-0 w-px tech-line"></div>
          <div className="absolute left-[60%] top-0 bottom-0 w-px tech-line"></div>
          <div className="absolute left-[80%] top-0 bottom-0 w-px tech-line"></div>
          <div className="absolute top-[20%] left-0 right-0 h-px tech-line"></div>
          <div className="absolute top-[40%] left-0 right-0 h-px tech-line"></div>
          <div className="absolute top-[60%] left-0 right-0 h-px tech-line"></div>
          <div className="absolute top-[80%] left-0 right-0 h-px tech-line"></div>
        </div>
      )}

      {/* Header with improved layout and logo */}
      <div className="chat-header flex items-center justify-between py-6 px-8 z-10 glass-panel">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
            className="rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-3 mr-4 shadow-lg"
          >
            <FaRobot size={28} className="text-white" />
          </motion.div>
          <div>
            <h1 className={`${getHeaderFontClass()} font-bold text-gradient-blue`}>Parley</h1>
            <p className={`${getSubHeaderFontClass()} opacity-70 mt-1`}>AI-Powered Communication Assistant</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex space-x-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button 
            className={`p-3 rounded-full transition-all duration-300 ${inputMode === 'voice' ? 'bg-gradient-to-br from-blue-600 to-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInputMode(inputMode === 'voice' ? 'text' : 'voice')}
            title={inputMode === 'voice' ? 'Switch to text input' : 'Switch to voice input'}
            aria-label={inputMode === 'voice' ? 'Switch to text input' : 'Switch to voice input'}
          >
            {inputMode === 'voice' ? (
              <MdTextFields size={24} />
            ) : (
              <MdVoiceChat size={24} />
            )}
          </motion.button>
          
          <motion.button 
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowApiKeyModal(true)}
            title="API Settings"
            aria-label="API Settings"
          >
            <FiSettings size={24} />
          </motion.button>
          
          <motion.button 
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAccessibility(!showAccessibility)}
            title="Accessibility Options"
            aria-label="Accessibility Options"
          >
            <MdOutlineAccessibilityNew size={24} />
          </motion.button>
        </motion.div>
      </div>

      {/* API Key Notification Banner */}
      {!apiKeys.claude && (
        <motion.div 
          className="mx-6 mt-4 p-4 rounded-lg bg-blue-900/50 border border-blue-700 flex flex-col md:flex-row md:items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start md:items-center mb-3 md:mb-0">
            <FiSettings className="text-blue-400 mr-3 mt-1 md:mt-0" size={20} />
            <div>
              <p className="text-white">To enable chat functionality, please set up your Claude API key</p>
              <p className="text-blue-300 text-sm mt-1">Get your API key from the <a href="https://console.anthropic.com/account/keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200">Anthropic Console</a></p>
            </div>
          </div>
          <button 
            onClick={() => setShowApiKeyModal(true)}
            className="ml-0 md:ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
          >
            Set API Key
          </button>
        </motion.div>
      )}
      
      {/* Success notification when API is configured */}
      {apiKeys.claude && (
        <motion.div 
          className="mx-6 mt-4 p-4 rounded-lg bg-green-900/50 border border-green-700 flex items-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <FaCheckCircle className="text-green-400 mr-3 mt-1 flex-shrink-0" size={20} />
          <div>
            <h3 className="text-white font-medium">Claude API Connected</h3>
            <p className="text-green-200 text-sm">
              Your API key is set up and the proxy is configured. You can now use the chat functionality!
            </p>
          </div>
        </motion.div>
      )}

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <ApiSettings
            isOpen={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
            onSave={saveApiKeys}
            initialClaudeKey={apiKeys.claude || ''}
            initialElevenLabsKey={apiKeys.elevenlabs || ''}
            initialVoiceId={selectedVoiceId || ''}
          />
        )}
      </AnimatePresence>

      {/* Accessibility Panel with fixed positioning and z-index */}
      <AnimatePresence>
        {showAccessibility && (
          <motion.div 
            className="accessibility-panel absolute top-24 right-8 z-50 bg-gray-800 bg-opacity-95 backdrop-blur rounded-xl shadow-xl border border-gray-700"
            variants={accessibilityVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="p-5 space-y-5">
              <h3 className={`font-semibold mb-3 ${getFontSizeClass()}`}>Accessibility Options</h3>
              
              <div className="flex items-center justify-between space-x-6">
                <span className={`${fontSize === 'normal' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg'}`}>Font Size</span>
                <div className="font-size-toggle flex space-x-2">
                  <button 
                    className={`font-size-option text-xs p-2 rounded ${fontSize === 'normal' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => setFontSize('normal')}
                  >
                    A
                  </button>
                  <button 
                    className={`font-size-option text-sm p-2 rounded ${fontSize === 'large' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => setFontSize('large')}
                  >
                    A
                  </button>
                  <button 
                    className={`font-size-option text-base p-2 rounded ${fontSize === 'xl' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => setFontSize('xl')}
                  >
                    A
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={`${fontSize === 'normal' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg'}`}>High Contrast</span>
                <div 
                  className={`contrast-toggle w-12 h-6 bg-gray-700 rounded-full relative cursor-pointer ${highContrast ? 'bg-blue-600' : ''}`}
                  onClick={() => setHighContrast(!highContrast)}
                >
                  <div className={`contrast-toggle-handle absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${highContrast ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`${fontSize === 'normal' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg'}`}>Text-to-Speech</span>
                <motion.button
                  className="p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTextToSpeech}
                >
                  {textToSpeechEnabled ? (
                    <FaVolumeUp size={fontSize === 'normal' ? 18 : fontSize === 'large' ? 20 : 22} />
                  ) : (
                    <FaVolumeOff size={fontSize === 'normal' ? 18 : fontSize === 'large' ? 20 : 22} />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features - improved spacing and layout */}
      <motion.div 
        className="flex justify-center space-x-6 py-6 px-8 overflow-x-auto hide-scrollbar relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-icon flex flex-col items-center justify-center min-w-[90px] cursor-pointer p-3"
            whileHover={{ y: -5, scale: 1.05 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="text-blue-300 mb-2">
              {React.cloneElement(feature.icon as React.ReactElement, { 
                size: fontSize === 'normal' ? 26 : fontSize === 'large' ? 30 : 34 
              })}
            </div>
            <span className={`${fontSize === 'normal' ? 'text-xs' : fontSize === 'large' ? 'text-sm' : 'text-base'} text-center font-medium`}>
              {feature.name}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {!highContrast && <WaveDivider />}

      {/* Messages area - improved spacing and z-index */}
      <motion.div 
        className="flex-1 overflow-y-auto p-6 space-y-5 futuristic-scrollbar relative z-10"
        ref={messagesContainerRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div 
                  className={`p-2 rounded-full flex items-center justify-center self-end mb-2 mx-3 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg' 
                      : 'bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <FaUser size={fontSize === 'normal' ? 14 : fontSize === 'large' ? 16 : 18} className="text-white" />
                  ) : (
                    <FaRobot size={fontSize === 'normal' ? 14 : fontSize === 'large' ? 16 : 18} className="text-white" />
                  )}
                </div>
                <div 
                  className={`py-4 px-5 ${
                    message.sender === 'user' 
                      ? 'enhanced-message-user' 
                      : 'enhanced-message-bot'
                  }`}
                >
                  {message.isProcessing ? (
                    <div className="flex space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                    </div>
                  ) : (
                    <>
                      <p className={`${getFontSizeClass()}`}>{message.text}</p>
                      
                      {/* Show translation if available */}
                      {message.translation && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center mb-2 text-blue-300">
                            <AiOutlineTranslation className="mr-2" />
                            <span className="text-sm font-medium">Translation</span>
                          </div>
                          <p className={`${getFontSizeClass()} italic`}>{message.translation}</p>
                        </div>
                      )}
                      
                      {/* Show medical terms if available */}
                      {message.medicalTerms && message.medicalTerms.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-700">
                          <div className="flex items-center mb-2 text-blue-300">
                            <AiFillMedicineBox className="mr-2" />
                            <span className="text-sm font-medium">Medical Terminology</span>
                          </div>
                          <ul className="space-y-2">
                            {message.medicalTerms.map((term, i) => (
                              <li key={i} className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                                <div className={`font-medium text-white ${fontSize === 'normal' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg'}`}>
                                  {term.term}
                                </div>
                                <div className={`text-gray-300 mt-1 ${fontSize === 'normal' ? 'text-xs' : fontSize === 'large' ? 'text-sm' : 'text-base'}`}>
                                  {term.definition}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Text to speech controls for bot messages */}
                      {message.sender === 'bot' && textToSpeechEnabled && apiKeys.elevenlabs && selectedVoiceId && (
                        <div className="mt-3 flex items-center">
                          <button 
                            onClick={() => handlePlayMessage(message.text)}
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center text-xs"
                            aria-label="Play message audio"
                          >
                            <FaVolumeUp className="mr-1" /> 
                            <span>Play message</span>
                          </button>
                        </div>
                      )}
                      
                      <span className={`${fontSize === 'normal' ? 'text-xs' : fontSize === 'large' ? 'text-sm' : 'text-base'} opacity-50 mt-2 block`}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && !messages.some(msg => msg.isProcessing) && (
            <motion.div
              className="flex justify-start"
              variants={typingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex max-w-[80%] flex-row">
                <div className="p-2 rounded-full flex items-center justify-center self-end mb-2 mx-3 bg-gradient-to-br from-indigo-900 to-purple-900 shadow-lg">
                  <FaRobot size={fontSize === 'normal' ? 14 : fontSize === 'large' ? 16 : 18} className="text-white" />
                </div>
                <div className="py-4 px-5 enhanced-message-bot">
                  <div className="flex space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                    <div className="w-3 h-3 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Quick actions with z-index */}
      {messages.length < 1 && (
        <motion.div 
          className="px-8 py-6 flex flex-wrap gap-3 justify-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              className="pill-button flex items-center py-3 px-5"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              onClick={() => handleSubmit(undefined, action.text)}
            >
              <span className="mr-3">
                {React.cloneElement(action.icon as React.ReactElement, { 
                  size: fontSize === 'normal' ? 18 : fontSize === 'large' ? 20 : 22 
                })}
              </span>
              <span className={`${fontSize === 'normal' ? 'text-sm' : fontSize === 'large' ? 'text-base' : 'text-lg'} font-medium`}>
                {action.text}
              </span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {!highContrast && <WaveDivider />}

      {/* Input area with z-index */}
      <motion.div 
        className="p-6 border-t border-gray-800 backdrop-blur-md bg-opacity-30 bg-gray-900 glass-panel border-t relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center space-x-4">
            <textarea
              ref={inputRef}
              className={`enhanced-input flex-1 p-4 pr-12 min-h-[60px] max-h-[150px] resize-none ${getFontSizeClass()}`}
              placeholder={inputMode === 'text' ? "Type your message..." : "Press microphone to speak..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              disabled={inputMode === 'voice'}
            />
            
            <motion.button
              type={inputMode === 'text' ? 'submit' : 'button'}
              className={`button-glow h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-700 text-white flex items-center justify-center focus:outline-none hover:bg-blue-700 transition-all duration-300 shadow-lg ${(inputMode === 'text' && !inputValue.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={inputMode === 'text' && !inputValue.trim() ? {} : { scale: 1.05, boxShadow: "0px 0px 15px rgba(80, 80, 255, 0.5)" }}
              whileTap={inputMode === 'text' && !inputValue.trim() ? {} : { scale: 0.95 }}
              disabled={inputMode === 'text' && !inputValue.trim()}
              onClick={() => {
                if (inputMode === 'voice') {
                  if (isSpeechRecognitionActive) {
                    stopSpeechRecognition();
                    if (inputValue.trim()) {
                      handleSubmit(undefined, inputValue);
                    }
                  } else {
                    startSpeechRecognition();
                  }
                }
              }}
            >
              {inputMode === 'text' ? (
                <FaPaperPlane size={fontSize === 'normal' ? 18 : fontSize === 'large' ? 20 : 22} />
              ) : (
                <FaMicrophone size={fontSize === 'normal' ? 22 : fontSize === 'large' ? 24 : 26} 
                  className={isSpeechRecognitionActive ? 'text-red-400 animate-pulse' : ''} />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Parley; 