"use client";

import React, { useEffect, useState } from 'react';
import Parley from '../components/Parley';

const CommunicatePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Set up API keys from environment variables if they exist
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only run on client-side
      try {
        // Check existing keys
        const existingClaudeKey = localStorage.getItem('CLAUDE_API_KEY');
        const existingElevenLabsKey = localStorage.getItem('ELEVENLABS_API_KEY');
        const existingVoiceId = localStorage.getItem('ELEVENLABS_VOICE_ID');
        
        // Only set from environment if not already set by user
        if (process.env.NEXT_PUBLIC_CLAUDE_API_KEY && !existingClaudeKey) {
          localStorage.setItem('CLAUDE_API_KEY', process.env.NEXT_PUBLIC_CLAUDE_API_KEY);
          console.log('Claude API key set from environment variable');
        }
        
        if (process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY && !existingElevenLabsKey) {
          localStorage.setItem('ELEVENLABS_API_KEY', process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY);
          console.log('ElevenLabs API key set from environment variable');
        }
        
        if (process.env.NEXT_PUBLIC_ELEVENLABS_DEFAULT_VOICE_ID && !existingVoiceId) {
          localStorage.setItem('ELEVENLABS_VOICE_ID', process.env.NEXT_PUBLIC_ELEVENLABS_DEFAULT_VOICE_ID);
          console.log('ElevenLabs voice ID set from environment variable');
        }
      } catch (error) {
        console.error('Error setting API keys from environment variables:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#050510] to-[#0a0a1a] text-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg">Loading Parley...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden">
      <Parley />
    </div>
  );
};

export default CommunicatePage; 