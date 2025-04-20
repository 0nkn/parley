import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/Button';

interface SpeechToTextProps {
  onTextCaptured?: (text: string) => void;
  placeholder?: string;
  processWithAI?: boolean;
}

export default function SpeechToText({
  onTextCaptured,
  placeholder = "Press the microphone button and speak...",
  processWithAI = false
}: SpeechToTextProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  
  // Initialize the Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const result = event.results[current];
          const transcriptText = result[0].transcript;
          
          setTranscript(transcriptText);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setError('Error recognizing speech. Please try again.');
          setIsListening(false);
        };
        
        recognitionRef.current.onend = () => {
          if (isListening) {
            // Restart recognition if it was manually stopped
            recognitionRef.current.start();
          }
        };
      } else {
        setError('Speech recognition not supported in this browser.');
      }
    }
    
    // Cleanup
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  const handleSubmit = async () => {
    if (!transcript.trim()) return;
    
    if (processWithAI) {
      setIsProcessing(true);
      
      try {
        // In a real implementation, this would call the Claude API
        // For now, we'll just simulate a delay and return the same text
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Process with AI (simulated for now)
        const processedText = transcript;
        
        // Call the callback with the processed text
        if (onTextCaptured) {
          onTextCaptured(processedText);
        }
      } catch (err) {
        console.error('Error processing with AI:', err);
        setError('Error processing with AI. Please try again.');
      } finally {
        setIsProcessing(false);
        setTranscript('');
      }
    } else {
      // No AI processing, just pass the transcript back
      if (onTextCaptured) {
        onTextCaptured(transcript);
      }
      setTranscript('');
    }
  };
  
  return (
    <div className="bg-background p-4 rounded-lg shadow-sm border border-border">
      <div className="mb-4">
        <label htmlFor="transcript-box" className="block text-sm font-medium mb-2">
          Your Speech Input
        </label>
        <div className="relative">
          <textarea
            id="transcript-box"
            className="w-full min-h-[120px] p-3 border border-border rounded-md bg-muted focus:border-primary focus:ring-1 focus:ring-primary focus-ring"
            placeholder={placeholder}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            aria-label="Transcript of your speech"
            readOnly={isListening}
          />
          {isListening && (
            <div className="absolute top-2 right-2 flex items-center gap-2 px-2 py-1 bg-primary text-white text-xs rounded-full animate-pulse">
              <span className="block h-2 w-2 rounded-full bg-white"></span>
              Listening...
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded-md" role="alert">
          {error}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleListening}
          className={`touch-target ${isListening ? 'bg-error hover:bg-error/90' : ''}`}
          aria-label={isListening ? 'Stop listening' : 'Start listening'}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isListening ? (
              <path d="M18 6L6 18M6 6l12 12"></path>
            ) : (
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8"></path>
            )}
          </svg>
          {isListening ? 'Stop' : 'Start'} Listening
        </Button>
        
        <Button
          onClick={handleSubmit}
          disabled={!transcript.trim() || isProcessing}
          variant="secondary"
          aria-label={processWithAI ? "Process speech with AI" : "Submit speech"}
          type="button"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L11 13"></path>
                <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
              </svg>
              {processWithAI ? 'Process with AI' : 'Submit'}
            </>
          )}
        </Button>
      </div>
      
      <p className="mt-4 text-xs text-foreground/70">
        {processWithAI 
          ? "Your speech will be processed by AI to improve clarity and comprehension." 
          : "Your speech will be directly transmitted without AI processing."}
      </p>
    </div>
  );
} 