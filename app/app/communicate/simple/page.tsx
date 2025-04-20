'use client';

import React, { useState, useEffect } from 'react';
import SimpleParley from '../../components/SimpleParley';

export default function SimplePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set API keys from .env to localStorage if available 
    // (not critical for functionality, just convenience)
    if (typeof window !== 'undefined') {
      const envClaudeKey = process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
      const envElevenLabsKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
      
      if (envClaudeKey) {
        localStorage.setItem('CLAUDE_API_KEY', envClaudeKey);
      }
      
      if (envElevenLabsKey) {
        localStorage.setItem('ELEVENLABS_API_KEY', envElevenLabsKey);
      }
      
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0a20] to-[#131335]">
          <div className="w-16 h-16 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-xl">Loading Parley...</p>
        </div>
      ) : (
        <SimpleParley />
      )}
    </div>
  );
} 