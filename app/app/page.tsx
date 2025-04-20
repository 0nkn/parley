'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  // Toggle theme handler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Theme colors
  const theme = {
    bg: isDarkMode ? '#0a0a14' : '#f8f9ff',
    card: isDarkMode ? '#1a1a2e' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a2e',
    subtext: isDarkMode ? '#a0a0b8' : '#4a4a5a',
    border: isDarkMode ? '#2a2a3a' : '#e0e0f0',
    accent: 'linear-gradient(135deg, #4F46E5, #9333EA)',
    highlight: isDarkMode ? '#2a2a4a' : '#f0f0ff',
    shadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : '0 4px 20px rgba(73, 70, 229, 0.1)'
  };
  
  // Features data
  const features = [
    {
      id: 'speech',
      icon: '🔊',
      title: 'Speech Enhancement',
      description: 'Transforms unclear speech into clear, synthesized speech using advanced AI technology.',
      details: 'Our AI-powered speech processing system adapts to different speech patterns and impediments, making communication smooth and natural even with severe disabilities or accents.'
    },
    {
      id: 'medical',
      icon: '⚕️',
      title: 'Medical Terminology',
      description: 'Detects and translates key healthcare-related terms, ensuring accurate communication in medical contexts.',
      details: 'Pre-loaded with over 10,000 medical terms and expressions to help patients precisely communicate symptoms, medication needs, and questions to healthcare providers.'
    },
    {
      id: 'visual',
      icon: '🖼️',
      title: 'Visual Communication Board',
      description: 'Tap-to-speak icons for quick communication — especially helpful for non-verbal or low-mobility users.',
      details: 'Customizable boards with categories like Pain, Needs, Emotions, and Medical Care. Each icon is optimized for quick access during urgent situations.'
    },
    {
      id: 'translation',
      icon: '🌐',
      title: 'Real-Time Translation',
      description: 'Breaks language barriers by translating input/output into different languages.',
      details: 'Supports 40+ languages with specialized medical vocabulary, making communication seamless between patients and healthcare providers who speak different languages.'
    },
    {
      id: 'phrasebook',
      icon: '📝',
      title: 'Custom Phrasebook',
      description: 'Saves frequently used or important phrases for quick access.',
      details: 'Personalized phrase collections that adapt to your communication patterns. Quick access to common needs like "I need water" or "I am in pain".'
    },
    {
      id: 'impact',
      icon: '📊',
      title: 'Impact Dashboard',
      description: 'Tracks app usage, phrase popularity, and language trends.',
      details: 'Visualize communication improvements over time with detailed analytics on most used features, common phrases, and communication efficiency metrics.'
    }
  ];
  
  // Quick phrases data
  const quickPhrases = [
    { text: 'I need help', icon: '🆘', color: '#ff5555' },
    { text: 'I am in pain', icon: '😣', color: '#ff7755' },
    { text: 'I need water', icon: '💧', color: '#55aaff' },
    { text: 'I need bathroom', icon: '🚻', color: '#55ccff' },
    { text: 'Call my doctor', icon: '👨‍⚕️', color: '#55ddaa' },
    { text: 'Call my family', icon: '👪', color: '#aa55ff' }
  ];
  
  return (
    <div style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: theme.bg,
      color: theme.text,
      minHeight: '100vh',
      transition: 'all 0.3s ease',
      paddingBottom: '60px'
    }}>
      {/* Hero Section */}
      <div style={{
        padding: '60px 5%',
        textAlign: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(147, 51, 234, 0.1) 50%, transparent 70%)',
          filter: 'blur(30px)',
          opacity: 0.6,
          zIndex: -1
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          right: '-50px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, rgba(79, 70, 229, 0.1) 50%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: 0.5,
          zIndex: -1
        }}></div>
        
        <h2 style={{ 
          fontSize: '3rem', 
          fontWeight: '800',
          marginBottom: '20px',
          background: theme.accent,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: isDarkMode ? '0 0 30px rgba(79, 70, 229, 0.3)' : 'none',
        }}>
          Breaking Barriers <br /> in Communication
        </h2>

        <p style={{ 
          color: theme.subtext, 
          fontSize: '1.2rem',
          maxWidth: '700px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
        }}>
          An AI-powered communication assistant designed to help individuals with speech disabilities or language barriers communicate effectively in healthcare settings and daily life.
        </p>

        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          marginBottom: '50px'
        }}>
          <Link href="/communicate">
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: theme.accent,
              border: 'none',
              padding: '14px 28px',
              borderRadius: '30px',
              cursor: 'pointer',
              color: 'white',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: isDarkMode ? '0 0 20px rgba(79, 70, 229, 0.5)' : '0 0 15px rgba(79, 70, 229, 0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}>
              <span style={{ fontSize: '20px' }}>🎤</span>
              Start Speaking
            </button>
          </Link>
          <button style={{
            background: 'transparent',
            border: `2px solid ${isDarkMode ? 'rgba(79, 70, 229, 0.6)' : 'rgba(79, 70, 229, 0.4)'}`,
            padding: '14px 28px',
            borderRadius: '30px',
            cursor: 'pointer',
            color: theme.text,
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}>
            How It Works
          </button>
        </div>

        {/* Speech Processing Demo */}
        <div style={{ 
          backgroundColor: theme.card,
          color: theme.text,
          padding: '30px',
          borderRadius: '20px',
          margin: '0 auto 60px',
          boxShadow: theme.shadow,
          maxWidth: '800px',
          border: `1px solid ${theme.border}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated pulse in background */}
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.3) 0%, rgba(147, 51, 234, 0.1) 70%, transparent 100%)',
            filter: 'blur(20px)',
            top: '20px',
            right: '20px',
            opacity: '0.6',
            animation: 'pulse 3s infinite alternate',
            transformOrigin: 'center',
            zIndex: '0'
          }}></div>
          
          <h3 style={{ 
            fontSize: '1.5rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: '1',
            position: 'relative',
            fontWeight: '700'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: theme.accent,
              flexShrink: 0,
              boxShadow: isDarkMode ? '0 0 15px rgba(79, 70, 229, 0.5)' : '0 0 15px rgba(79, 70, 229, 0.3)',
            }}>
              <span style={{color: 'white', fontSize: '20px'}}>🔊</span>
            </span>
            <span style={{
              background: theme.accent,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>AI-Powered Communication</span>
          </h3>
          
          <p style={{ 
            marginBottom: '25px',
            color: theme.subtext,
            position: 'relative',
            zIndex: '1'
          }}>
            Transform unclear speech into clear, understandable communication
          </p>
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
            position: 'relative',
            zIndex: '1'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: theme.accent,
                animation: 'blink 1s infinite'
              }}></div>
              <span style={{color: theme.subtext}}>Processing speech...</span>
            </div>
            <span style={{
              background: theme.accent,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '600'
            }}>67%</span>
          </div>
          
          <div style={{ 
            width: '100%', 
            height: '10px', 
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)', 
            borderRadius: '10px',
            overflow: 'hidden',
            position: 'relative',
            zIndex: '1'
          }}>
            <div style={{ 
              width: '67%', 
              height: '100%', 
              background: theme.accent,
              borderRadius: '10px',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                animation: 'shimmer 2s infinite',
                transform: 'translateX(-100%)'
              }}></div>
            </div>
          </div>
        </div>

        {/* Quick Communication Board */}
        <div style={{
          marginBottom: '60px',
          maxWidth: '850px',
          margin: '0 auto 60px'
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            marginBottom: '25px',
            color: theme.text,
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            justifyContent: 'center'
          }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: theme.accent,
              flexShrink: 0,
              boxShadow: isDarkMode ? '0 0 15px rgba(79, 70, 229, 0.5)' : '0 0 15px rgba(79, 70, 229, 0.3)',
            }}>
              <span style={{color: 'white', fontSize: '16px'}}>💬</span>
            </span>
            Quick Communication
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            {quickPhrases.map((item, index) => (
              <button key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`,
                borderRadius: '12px',
                boxShadow: theme.shadow,
                color: theme.text,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${item.color}80, ${item.color})`,
                  flexShrink: 0,
                  fontSize: '18px'
                }}>{item.icon}</span>
                <span style={{fontWeight: '500'}}>{item.text}</span>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                  opacity: 0.7
                }}></div>
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <h2 style={{ 
          fontSize: '2.2rem', 
          fontWeight: '800',
          marginBottom: '40px',
          background: theme.accent,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Key Features
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '25px',
          marginBottom: '40px'
        }}>
          {features.map((feature) => (
            <div 
              key={feature.id}
              style={{ 
                padding: '25px', 
                border: `1px solid ${theme.border}`,
                borderRadius: '16px',
                backgroundColor: theme.card,
                boxShadow: theme.shadow,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
            >
              <div style={{ 
                display: 'flex',
                alignItems: 'flex-start', 
                marginBottom: '15px',
                gap: '15px' 
              }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: theme.accent,
                  flexShrink: 0,
                  boxShadow: isDarkMode ? '0 0 15px rgba(79, 70, 229, 0.5)' : '0 0 15px rgba(79, 70, 229, 0.3)',
                  fontSize: '24px',
                  color: 'white'
                }}>{feature.icon}</span>
                <div>
                  <h3 style={{ 
                    margin: '0 0 8px 0',
                    color: theme.text,
                    fontSize: '1.2rem',
                    fontWeight: '700'
                  }}>{feature.title}</h3>
                  <p style={{ 
                    color: theme.subtext,
                    margin: 0,
                    fontSize: '0.95rem'
                  }}>{feature.description}</p>
                </div>
              </div>
              
              {selectedFeature === feature.id && (
                <div style={{
                  padding: '15px',
                  background: theme.highlight,
                  borderRadius: '10px',
                  marginTop: '15px',
                  color: theme.text,
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  {feature.details}
                </div>
              )}
              
              {/* Decorative accent line */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: theme.accent,
                opacity: selectedFeature === feature.id ? 0.9 : 0.3,
                transition: 'opacity 0.3s ease'
              }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating button for accessibility */}
      <button style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: theme.accent,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '24px',
        border: 'none',
        cursor: 'pointer',
        boxShadow: isDarkMode ? '0 0 20px rgba(79, 70, 229, 0.5)' : '0 0 15px rgba(79, 70, 229, 0.3)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        zIndex: 100
      }}>
        <span>🎤</span>
      </button>
      
      {/* Global styles */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: ${isDarkMode 
            ? '0 0 25px rgba(79, 70, 229, 0.6)' 
            : '0 0 20px rgba(79, 70, 229, 0.4)'};
        }
      `}</style>
    </div>
  );
} 