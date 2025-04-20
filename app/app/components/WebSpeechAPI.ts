/**
 * A simple wrapper around the Web Speech API for speech recognition
 * This provides a fallback option that doesn't require any server setup
 */

type RecognitionCallback = (transcript: string, isFinal: boolean) => void;

interface WebSpeechOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: RecognitionCallback;
  onError?: (error: any) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

interface WebSpeechRecognition {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
  isListening: boolean;
}

export function useWebSpeechRecognition(options: WebSpeechOptions = {}): WebSpeechRecognition {
  // Check if SpeechRecognition is supported
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Speech recognition not supported in this browser');
    return {
      start: () => console.warn('Speech recognition not supported'),
      stop: () => console.warn('Speech recognition not supported'),
      isSupported: false,
      isListening: false
    };
  }

  // Set default options
  const {
    language = 'en-US',
    continuous = false,
    interimResults = true,
    onResult = () => {},
    onError = () => {},
    onStart = () => {},
    onEnd = () => {}
  } = options;

  // Create recognition instance
  let recognition: any = null;
  let isListening = false;

  const start = () => {
    if (isListening) return;

    try {
      // Create new instance each time to avoid stale state
      recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;

      recognition.onresult = (event: any) => {
        const result = event.results[event.resultIndex];
        const transcript = result[0].transcript;
        const isFinal = result.isFinal;
        onResult(transcript, isFinal);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onError(event.error);
      };

      recognition.onstart = () => {
        isListening = true;
        onStart();
      };

      recognition.onend = () => {
        isListening = false;
        onEnd();
      };

      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      onError(error);
    }
  };

  const stop = () => {
    if (!isListening || !recognition) return;
    
    try {
      recognition.stop();
      isListening = false;
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  return {
    start,
    stop,
    isSupported: true,
    isListening
  };
}

export default useWebSpeechRecognition; 