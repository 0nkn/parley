"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiMic, FiUser, FiMessageSquare, FiSettings, FiGlobe, FiBookOpen, FiBarChart2, FiRefreshCw } from 'react-icons/fi';
import { RiRobot2Line, RiTranslate } from 'react-icons/ri';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import { BsCardText, BsKeyboard } from 'react-icons/bs';
import { FaRobot, FaUserAlt, FaKeyboard, FaMicrophone, FaPaperPlane, FaUser } from 'react-icons/fa';
import { IoGrid } from 'react-icons/io5';
import { MdFavorite, MdStarRate } from 'react-icons/md';
import { RiDashboardLine, RiTeamFill } from 'react-icons/ri';
import { AiFillMedicineBox, AiOutlineTranslation } from 'react-icons/ai';
import { BsFillChatSquareTextFill, BsSpeedometer } from 'react-icons/bs';
import { IoIosOptions } from 'react-icons/io';
import { MdVoiceChat, MdTextFields, MdOutlineHelp } from 'react-icons/md';
import { RiUserVoiceFill, RiFileTextFill } from 'react-icons/ri';

// Generate a unique ID
const generateId = () => `id-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  const handleSubmit = (e?: React.FormEvent, quickAction?: string) => {
    if (e) e.preventDefault();
    
    const messageText = quickAction || inputValue.trim();
    if (!messageText) return;
    
    // Add user message
    const userMessage: Message = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage: Message = {
        id: generateId(),
        text: getBotResponse(messageText),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
  };

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

  // Ambient background elements
  const ambientOrbs = [
    { top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(60, 60, 200, 0.15)' },
    { top: '60%', right: '5%', width: '250px', height: '250px', background: 'rgba(120, 60, 220, 0.1)' },
    { top: '40%', left: '40%', width: '400px', height: '400px', background: 'rgba(40, 80, 180, 0.05)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen w-full bg-gradient-to-b from-[#050510] to-[#0a0a1a] text-gray-100 relative overflow-hidden"
    >
      {/* Ambient background orbs */}
      {ambientOrbs.map((orb, index) => (
        <div
          key={index}
          className="ambient-orb"
          style={{
            top: orb.top,
            left: orb.left,
            right: orb.right,
            width: orb.width,
            height: orb.height,
            background: orb.background,
          }}
        />
      ))}

      {/* Tech grid lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute left-[20%] top-0 bottom-0 w-px tech-line"></div>
        <div className="absolute left-[40%] top-0 bottom-0 w-px tech-line"></div>
        <div className="absolute left-[60%] top-0 bottom-0 w-px tech-line"></div>
        <div className="absolute left-[80%] top-0 bottom-0 w-px tech-line"></div>
        <div className="absolute top-[20%] left-0 right-0 h-px tech-line"></div>
        <div className="absolute top-[40%] left-0 right-0 h-px tech-line"></div>
        <div className="absolute top-[60%] left-0 right-0 h-px tech-line"></div>
        <div className="absolute top-[80%] left-0 right-0 h-px tech-line"></div>
      </div>

      {/* Header */}
      <div className="chat-header flex items-center justify-between py-4 px-6 z-10">
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
            className="rounded-full bg-blue-600 p-2 mr-3"
          >
            <FaRobot size={24} className="text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-gradient-blue">Parley</h1>
            <p className="text-sm opacity-70">AI-Powered Communication Assistant</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button 
            className={`p-2 rounded-full transition-all duration-300 ${inputMode === 'text' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setInputMode('text')}
          >
            <MdTextFields size={20} />
          </button>
          <button 
            className={`p-2 rounded-full transition-all duration-300 ${inputMode === 'voice' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setInputMode('voice')}
          >
            <MdVoiceChat size={20} />
          </button>
        </motion.div>
      </div>

      {/* Features */}
      <motion.div 
        className="flex justify-center space-x-4 py-4 px-6 overflow-x-auto hide-scrollbar"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="feature-icon flex flex-col items-center justify-center min-w-[80px] cursor-pointer"
            whileHover={{ y: -5, scale: 1.05 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            {feature.icon}
            <span className="text-xs mt-2 text-center font-medium">{feature.name}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Messages area */}
      <motion.div 
        className="flex-1 overflow-y-auto p-4 space-y-4 futuristic-scrollbar"
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
                  className={`p-1 rounded-full flex items-center justify-center self-end mb-2 mx-2 ${
                    message.sender === 'user' ? 'bg-blue-600' : 'bg-indigo-900'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <FaUser size={14} className="text-white" />
                  ) : (
                    <FaRobot size={14} className="text-white" />
                  )}
                </div>
                <div 
                  className={`py-3 px-4 ${
                    message.sender === 'user' ? 'message-user' : 'message-bot'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="flex justify-start"
              variants={typingVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex max-w-[80%] flex-row">
                <div className="p-1 rounded-full flex items-center justify-center self-end mb-2 mx-2 bg-indigo-900">
                  <FaRobot size={14} className="text-white" />
                </div>
                <div className="py-3 px-4 message-bot">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400 opacity-70 typing-dot"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </motion.div>

      {/* Quick actions */}
      {messages.length < 1 && (
        <motion.div 
          className="px-6 pb-4 flex flex-wrap gap-2 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {quickActions.map((action, index) => (
            <motion.button
              key={index}
              className="quick-action flex items-center px-4 py-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              onClick={() => handleSubmit(undefined, action.text)}
            >
              <span className="mr-2">{action.icon}</span>
              <span className="text-sm font-medium">{action.text}</span>
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Input area */}
      <motion.div 
        className="p-4 border-t border-gray-800 backdrop-blur-md bg-opacity-30 bg-gray-900"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center space-x-2">
            <textarea
              ref={inputRef}
              className="chat-input flex-1 p-3 pr-10 min-h-[50px] max-h-[150px] resize-none"
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
              className="button-glow h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center focus:outline-none hover:bg-blue-700 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={inputMode === 'text' && !inputValue.trim()}
            >
              {inputMode === 'text' ? (
                <FaPaperPlane size={16} />
              ) : (
                <FaMicrophone size={20} />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Parley; 