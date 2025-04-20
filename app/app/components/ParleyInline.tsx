'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    width: '100%',
    maxWidth: '1024px',
    margin: '0 auto',
    height: 'calc(100vh - 10rem)',
    borderRadius: '0.75rem',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    overflow: 'hidden',
    backgroundColor: '#121219',
  },
  header: {
    background: 'linear-gradient(90deg, #4F46E5 0%, #9333EA 100%)',
    padding: '1.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerButtons: {
    display: 'flex',
    gap: '0.75rem',
  },
  headerButton: {
    height: '2.25rem',
    width: '2.25rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
  },
  messagesArea: {
    position: 'relative' as const,
    flex: 1,
    overflowY: 'auto' as const,
    padding: '1.5rem',
    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  blob1: {
    position: 'absolute' as const,
    width: '16rem',
    height: '16rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    filter: 'blur(60px)',
    opacity: 0.4,
    top: '5rem',
    left: '5rem',
    zIndex: -1,
    animation: 'pulse 10s infinite alternate',
  },
  blob2: {
    position: 'absolute' as const,
    width: '16rem',
    height: '16rem',
    borderRadius: '50%',
    backgroundColor: 'rgba(147, 51, 234, 0.1)',
    filter: 'blur(60px)',
    opacity: 0.4,
    bottom: '10rem',
    right: '2.5rem',
    zIndex: -1,
    animation: 'pulse 10s infinite alternate',
    animationDelay: '-5s',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'rgba(156, 163, 175, 1)',
    gap: '1rem',
  },
  emptyIcon: {
    padding: '1.5rem',
    borderRadius: '9999px',
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    boxShadow: '0 0 5px rgba(79, 70, 229, 0.7), inset 0 0 5px rgba(79, 70, 229, 0.4)',
  },
  messageContainer: {
    display: 'flex',
    marginBottom: '2rem',
  },
  messageContainerUser: {
    justifyContent: 'flex-end',
  },
  messageContainerBot: {
    justifyContent: 'flex-start',
  },
  avatar: {
    height: '2.5rem',
    width: '2.5rem',
    flexShrink: 0,
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  userAvatar: {
    marginLeft: '0.75rem',
  },
  botAvatar: {
    marginRight: '0.75rem',
  },
  userMessage: {
    maxWidth: '20rem',
    background: 'linear-gradient(to right, #4F46E5, #9333EA)',
    color: 'white',
    borderRadius: '1rem',
    borderTopRightRadius: 0,
    padding: '1rem',
    boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)',
  },
  botMessage: {
    maxWidth: '20rem',
    backgroundColor: '#1E1E2D',
    color: 'white',
    borderRadius: '1rem',
    borderTopLeftRadius: 0,
    padding: '1rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  messageText: {
    lineHeight: '1.5',
  },
  messageFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  timestamp: {
    fontSize: '0.75rem',
    opacity: 0.7,
  },
  inputArea: {
    backgroundColor: '#0D0D14',
    padding: '1rem',
    borderTop: '1px solid rgba(75, 85, 99, 0.4)',
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.25rem',
  },
  inputIconButton: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2.75rem',
    width: '2.75rem',
    borderRadius: '9999px',
    backgroundColor: '#2D2D3A',
    color: '#818CF8',
    marginRight: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    transition: 'background-color 0.2s',
  },
  inputWrapper: {
    position: 'relative' as const,
    flex: 1,
  },
  textInput: {
    width: '100%',
    padding: '1rem',
    paddingRight: '3rem',
    backgroundColor: '#2D2D3A',
    border: 'none',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
  },
  sendButton: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '2.75rem',
    width: '2.75rem',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, #4F46E5 0%, #9333EA 100%)',
    color: 'white',
    marginLeft: '0.5rem',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
    transition: 'all 0.2s',
  },
  quickActions: {
    display: 'flex',
    marginTop: '0.75rem',
    gap: '0.75rem',
    overflowX: 'auto' as const,
    paddingBottom: '0.5rem',
  },
  actionButton: {
    whiteSpace: 'nowrap' as const,
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    backgroundColor: '#2D2D3A',
    color: '#818CF8',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s',
  },
};

export default function ParleyInline() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botMessage: Message = {
        text: `Echo: ${inputValue}`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Parley</h2>
          <p style={styles.subtitle}>Your AI communication assistant</p>
        </div>
        <div style={styles.headerButtons}>
          <button style={styles.headerButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
          </button>
          <button style={styles.headerButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button style={styles.headerButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div style={styles.messagesArea}>
        {/* Animated blobs */}
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        
        {messages.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"></path>
                <path d="M19.14 19.14a1.5 1.5 0 0 0 2.12 2.12"></path>
                <path d="M2.74 2.74a1.5 1.5 0 0 0 2.12 2.12"></path>
                <path d="m21.14 2.74-16.3 16.3"></path>
                <path d="m2.86 21.26 16.3-16.3"></path>
              </svg>
            </div>
            <p style={{ fontSize: '1.25rem', color: '#D1D5DB', fontWeight: 500 }}>Start a conversation...</p>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', maxWidth: '24rem', textAlign: 'center' }}>
              Use Parley to communicate effectively in healthcare settings and daily life
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageContainer,
                  ...(message.sender === 'user' ? styles.messageContainerUser : styles.messageContainerBot)
                }}
              >
                {message.sender === 'bot' && (
                  <div style={{ ...styles.avatar, ...styles.botAvatar }}>
                    <span>P</span>
                  </div>
                )}
                <div style={message.sender === 'user' ? styles.userMessage : styles.botMessage}>
                  <p style={styles.messageText}>{message.text}</p>
                  <div style={styles.messageFooter}>
                    <span style={styles.timestamp}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {message.sender === 'user' && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                </div>
                {message.sender === 'user' && (
                  <div style={{ ...styles.avatar, ...styles.userAvatar }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div style={{ ...styles.messageContainer, ...styles.messageContainerBot }}>
                <div style={{ ...styles.avatar, ...styles.botAvatar }}>
                  <span>P</span>
                </div>
                <div style={styles.botMessage}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="typing-dot" style={{ 
                      height: '8px', 
                      width: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#818CF8',
                      animation: 'pulse 1s infinite',
                    }}></div>
                    <div className="typing-dot" style={{ 
                      height: '8px', 
                      width: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#818CF8',
                      animation: 'pulse 1s infinite',
                      animationDelay: '0.2s',
                    }}></div>
                    <div className="typing-dot" style={{ 
                      height: '8px', 
                      width: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#818CF8',
                      animation: 'pulse 1s infinite',
                      animationDelay: '0.4s',
                    }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <form onSubmit={handleSubmit}>
          <div style={styles.inputContainer}>
            <button type="button" style={styles.inputIconButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </button>
            <div style={styles.inputWrapper}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message..."
                style={styles.textInput}
              />
              <button 
                type="button"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  width: '36px',
                  borderRadius: '9999px',
                  backgroundColor: '#3A3A4A',
                  color: '#818CF8',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>
              </button>
            </div>
            <button
              type="submit"
              style={styles.sendButton}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </form>
        
        {/* Quick action buttons */}
        <div style={styles.quickActions}>
          <button 
            type="button" 
            onClick={() => setInputValue("I need help")}
            style={styles.actionButton}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            I need help
          </button>
          <button 
            type="button" 
            onClick={() => setInputValue("I am in pain")}
            style={{ ...styles.actionButton, color: '#F87171' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="m12 14 4 4M19 11V9a7 7 0 0 0-7-7h0a7 7 0 0 0-7 7v7l-3 3v1h18v-1l-1-1ZM12 18v1M12 6v4" />
            </svg>
            I am in pain
          </button>
          <button 
            type="button" 
            onClick={() => setInputValue("I need water")}
            style={{ ...styles.actionButton, color: '#38BDF8' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5s-3 3.5-3 5.5a7 7 0 0 0 7 7z" />
            </svg>
            I need water
          </button>
          <button 
            type="button" 
            onClick={() => setInputValue("Call my family")}
            style={{ ...styles.actionButton, color: '#34D399' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Call my family
          </button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
} 