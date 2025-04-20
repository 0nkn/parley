// Import React at the top of the file
import React from 'react';

// Speech recognition types
interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: Error) => void;
  onEnd?: () => void;
}

/**
 * Class to handle speech recognition using the Web Speech API
 */
export class SpeechRecognizer {
  private recognition: SpeechRecognition | null = null;
  private isRecording = false;
  private options: SpeechRecognitionOptions;

  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      language: 'en-US',
      continuous: true,
      interimResults: true,
      ...options
    };
    
    this.initRecognition();
  }

  /**
   * Initialize the speech recognition object
   */
  private initRecognition(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Check if browser supports SpeechRecognition
      const SpeechRecognitionAPI = 
        window.SpeechRecognition || 
        window.webkitSpeechRecognition || 
        null;
      
      if (!SpeechRecognitionAPI) {
        console.error('Speech recognition not supported in this browser');
        return;
      }
      
      this.recognition = new SpeechRecognitionAPI();
      
      this.recognition.lang = this.options.language || 'en-US';
      this.recognition.continuous = this.options.continuous ?? true;
      this.recognition.interimResults = this.options.interimResults ?? true;
      
      // Set up event handlers
      this.recognition.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        const isFinal = event.results[last].isFinal;
        
        if (this.options.onResult) {
          this.options.onResult({
            transcript,
            isFinal
          });
        }
      };
      
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        
        // Handle specific error types
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
          case 'not-allowed':
            errorMessage = 'Microphone access was denied. Please allow microphone access to use speech recognition.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone was found or microphone is not working.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
          case 'no-speech':
            errorMessage = 'No speech was detected.';
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }
        
        if (this.options.onError) {
          this.options.onError(new Error(errorMessage));
        }
      };
      
      this.recognition.onend = () => {
        // Only call onEnd if we're actually stopping, not just restarting
        if (this.isRecording && this.options.continuous) {
          try {
            this.recognition?.start();
          } catch (error) {
            console.error('Error restarting speech recognition:', error);
            this.isRecording = false;
            if (this.options.onEnd) {
              this.options.onEnd();
            }
          }
        } else {
          this.isRecording = false;
          if (this.options.onEnd) {
            this.options.onEnd();
          }
        }
      };
    } catch (error) {
      console.error('Error initializing speech recognition:', error);
    }
  }

  /**
   * Start speech recognition
   */
  start(): void {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        throw new Error('Speech recognition is not supported in this browser or could not be initialized');
      }
    }
    
    if (!this.isRecording) {
      try {
        this.recognition.start();
        this.isRecording = true;
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        throw error;
      }
    }
  }

  /**
   * Stop speech recognition
   */
  stop(): void {
    if (this.recognition && this.isRecording) {
      try {
        this.recognition.stop();
        this.isRecording = false;
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  }

  /**
   * Check if speech recognition is recording
   */
  isRecording(): boolean {
    return this.isRecording;
  }

  /**
   * Update speech recognition options
   */
  updateOptions(options: Partial<SpeechRecognitionOptions>): void {
    this.options = { ...this.options, ...options };
    
    if (this.recognition) {
      this.recognition.lang = this.options.language || 'en-US';
      this.recognition.continuous = this.options.continuous ?? true;
      this.recognition.interimResults = this.options.interimResults ?? true;
    }
  }
}

/**
 * Check if speech recognition is supported in the current browser
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !!(
    window.SpeechRecognition || 
    window.webkitSpeechRecognition
  );
}

/**
 * React hook for speech recognition
 * @param options Speech recognition options
 * @returns Object with transcript, start, stop, and isListening
 */
export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  if (typeof window === 'undefined') {
    return {
      transcript: '',
      start: () => {},
      stop: () => {},
      isListening: false,
      isSpeechRecognitionActive: false,
      speechRecognitionSupported: false,
      error: new Error('Running in SSR environment')
    };
  }
  
  // Check if the browser supports speech recognition
  const speechRecognitionSupported = isSpeechRecognitionSupported();
  
  // Create a ref to store the recognizer instance
  const recognizerRef = React.useRef<SpeechRecognizer | null>(null);
  const [transcript, setTranscript] = React.useState('');
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeechRecognitionActive, setIsSpeechRecognitionActive] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  
  // Initialize recognition on first render
  React.useEffect(() => {
    if (!speechRecognitionSupported) return;
    
    try {
      const initOptions: SpeechRecognitionOptions = {
        ...options,
        onResult: (result) => {
          options.onResult?.(result);
          if (result.isFinal) {
            setTranscript(prevTranscript => 
              prevTranscript ? `${prevTranscript} ${result.transcript}` : result.transcript
            );
          }
        },
        onError: (err) => {
          options.onError?.(err);
          setError(err);
          setIsListening(false);
          setIsSpeechRecognitionActive(false);
          
          // Alert the user about the error
          console.error('Speech recognition error:', err.message);
        },
        onEnd: () => {
          options.onEnd?.();
          setIsListening(false);
          setIsSpeechRecognitionActive(false);
        }
      };
      
      recognizerRef.current = new SpeechRecognizer(initOptions);
    } catch (error) {
      console.error('Error creating speech recognizer:', error);
      setError(error instanceof Error ? error : new Error('Failed to initialize speech recognition'));
    }
    
    // Cleanup on unmount
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
    };
  }, []);
  
  const start = React.useCallback(() => {
    if (!speechRecognitionSupported) {
      const errorMsg = 'Speech recognition is not supported in this browser';
      setError(new Error(errorMsg));
      alert(errorMsg + '. Please try using Chrome, Edge, or Safari.');
      return;
    }
    
    if (!recognizerRef.current) {
      setError(new Error('Speech recognition could not be initialized'));
      return;
    }
    
    try {
      recognizerRef.current.start();
      setIsListening(true);
      setIsSpeechRecognitionActive(true);
      setError(null);
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(new Error(`Failed to start speech recognition: ${errorMessage}`));
      alert(`Failed to start speech recognition: ${errorMessage}`);
    }
  }, [speechRecognitionSupported]);
  
  const stop = React.useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
    setIsSpeechRecognitionActive(false);
  }, []);
  
  return { 
    transcript, 
    start, 
    stop, 
    isListening, 
    isSpeechRecognitionActive,
    speechRecognitionSupported, 
    error 
  };
}

// Fix TypeScript window declarations
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
} 