// ElevenLabs API service
// This file provides functions to interact with the ElevenLabs API for text-to-speech

import { NextResponse } from 'next/server';

const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

// Interface for text-to-speech parameters
interface TextToSpeechParams {
  text: string;
  voice_id?: string;
  model_id?: string;
  stability?: number;
  similarity_boost?: number;
}

// Interface for speech-to-text parameters
interface SpeechToTextParams {
  audioData: ArrayBuffer;
  language?: string;
}

// Interfaces for API
export interface TextToSpeechOptions {
  text: string;
  voiceId: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface Voice {
  voice_id: string;
  name: string;
  category?: string;
  description?: string;
  preview_url?: string;
}

// Interface for text-to-speech options
interface TTSOptions {
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
  };
}

/**
 * Converts text to speech using ElevenLabs API
 * @param params Text and voice parameters
 * @param apiKey ElevenLabs API key
 * @returns ArrayBuffer of audio data
 */
export async function textToSpeech(
  params: TextToSpeechParams,
  apiKey: string
): Promise<ArrayBuffer> {
  if (!apiKey) {
    throw new Error('ElevenLabs API key is required');
  }

  const { text, voice_id = 'EXAVITQu4vr4xnSDxMaL', model_id = 'eleven_multilingual_v2', stability = 0.5, similarity_boost = 0.75 } = params;

  if (!text || text.trim() === '') {
    throw new Error('Text is required for text-to-speech conversion');
  }

  try {
    console.log(`Converting text to speech using voice ${voice_id}`);
    
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id,
        voice_settings: {
          stability,
          similarity_boost,
        },
      }),
    }).catch(error => {
      console.error('Network error during ElevenLabs API call:', error);
      throw new Error('Network error: Failed to connect to ElevenLabs API');
    });

    if (!response.ok) {
      let errorMessage = 'ElevenLabs API error';
      
      try {
        const errorData = await response.json();
        console.error('ElevenLabs API error:', errorData);
        
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your ElevenLabs API key.';
        } else if (response.status === 422) {
          errorMessage = 'Invalid parameters for text-to-speech conversion.';
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = `ElevenLabs API error: ${response.status}`;
        }
      } catch (e) {
        errorMessage = `ElevenLabs API error: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    throw error instanceof Error ? error : new Error('Unknown error in text-to-speech conversion');
  }
}

/**
 * Converts speech to text using ElevenLabs API
 * @param params Audio data and language parameters
 * @param apiKey ElevenLabs API key
 * @returns Transcribed text
 */
export async function speechToText(
  params: SpeechToTextParams,
  apiKey: string
): Promise<string> {
  const { audioData, language = 'en' } = params;

  const formData = new FormData();
  formData.append('audio', new Blob([audioData]), 'audio.wav');
  formData.append('language', language);

  const response = await fetch(`${ELEVENLABS_API_URL}/speech-to-text`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`ElevenLabs API error: ${response.status} ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.text || '';
}

/**
 * Gets available voices from ElevenLabs
 * @param apiKey ElevenLabs API key
 * @returns Array of available voices
 */
export async function getVoices(apiKey: string): Promise<Voice[]> {
  if (!apiKey) {
    throw new Error('ElevenLabs API key is required');
  }

  try {
    console.log('Fetching voices from ElevenLabs API');
    
    const response = await fetch(`${ELEVENLABS_API_URL}/voices`, {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
    }).catch(error => {
      console.error('Network error during fetch of voices:', error);
      throw new Error('Network error: Failed to connect to ElevenLabs API');
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch voices';
      
      try {
        const errorData = await response.json();
        console.error('ElevenLabs API error when fetching voices:', errorData);
        
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your ElevenLabs API key.';
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }
      } catch (e) {
        errorMessage = `ElevenLabs API error: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw error instanceof Error ? error : new Error('Unknown error fetching voices');
  }
}

/**
 * API route handler for text-to-speech
 */
export async function POST(request: Request) {
  try {
    const { text, voice_id, model_id, stability, similarity_boost } = await request.json();
    
    // Get API key from environment variable
    const apiKey = process.env.ELEVENLABS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }
    
    const audioData = await textToSpeech(
      { text, voice_id, model_id, stability, similarity_boost },
      apiKey
    );
    
    // Convert ArrayBuffer to Base64 for API response
    const buffer = Buffer.from(audioData);
    const base64Audio = buffer.toString('base64');
    
    return NextResponse.json({ audio: base64Audio });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error in text-to-speech conversion'
    }, { status: 500 });
  }
}

/**
 * Convert text to speech using ElevenLabs API and return an audio element
 * @param text The text to convert to speech
 * @param voiceId The ID of the voice to use
 * @param apiKey ElevenLabs API key
 * @param modelId Optional model ID (defaults to eleven_turbo_v2)
 * @returns An HTMLAudioElement that can be played
 */
export async function speakText(
  text: string, 
  voiceId: string, 
  apiKey: string,
  modelId: string = 'eleven_turbo_v2'
): Promise<HTMLAudioElement> {
  if (!apiKey) {
    throw new Error('ElevenLabs API key is required');
  }

  if (!voiceId) {
    throw new Error('Voice ID is required for text-to-speech');
  }

  if (!text || text.trim() === '') {
    throw new Error('Text is required for text-to-speech conversion');
  }

  try {
    console.log(`Converting text to speech using voice ${voiceId} and model ${modelId}`);
    
    const response = await fetch(`${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    }).catch(error => {
      console.error('Network error during ElevenLabs API call:', error);
      throw new Error('Network error: Failed to connect to ElevenLabs API');
    });

    if (!response.ok) {
      let errorMessage = 'ElevenLabs API error';
      
      try {
        const errorData = await response.json();
        console.error('ElevenLabs API error:', errorData);
        
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your ElevenLabs API key.';
        } else if (response.status === 422) {
          errorMessage = 'Invalid parameters for text-to-speech conversion.';
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else {
          errorMessage = `ElevenLabs API error: ${response.status}`;
        }
      } catch (e) {
        errorMessage = `ElevenLabs API error: ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }

    // Get audio blob from response
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create audio element
    const audio = new Audio(audioUrl);
    
    // Set up error handling for the audio element
    audio.onerror = (event) => {
      console.error('Audio playback error:', event);
      URL.revokeObjectURL(audioUrl); // Clean up
      throw new Error('Failed to play the generated audio');
    };
    
    // Don't try to play automatically - browser restrictions will likely block it
    // Instead return the audio element and let the caller handle playback based on user interaction
    
    // Set up cleanup when audio is done
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
    
    return audio;
  } catch (error) {
    console.error('ElevenLabs text-to-speech error:', error);
    throw error instanceof Error ? error : new Error('Unknown error in text-to-speech conversion');
  }
}

/**
 * Get a specific voice by ID
 * @param voiceId The ID of the voice to get
 * @param apiKey ElevenLabs API key
 * @returns Voice data or null if not found
 */
export async function getVoice(voiceId: string, apiKey: string): Promise<Voice | null> {
  try {
    const voices = await getVoices(apiKey);
    return voices.find(voice => voice.voice_id === voiceId) || null;
  } catch (error) {
    console.error('Error fetching specific voice:', error);
    throw error;
  }
}

/**
 * Get default voice (the first available voice)
 * @param apiKey ElevenLabs API key
 * @returns The first available voice or null if none available
 */
export async function getDefaultVoice(apiKey: string): Promise<Voice | null> {
  try {
    const voices = await getVoices(apiKey);
    return voices.length > 0 ? voices[0] : null;
  } catch (error) {
    console.error('Error fetching default voice:', error);
    throw error;
  }
}

/**
 * Play audio from an ArrayBuffer
 * @param audioData - Audio data as ArrayBuffer
 * @returns Promise<HTMLAudioElement> - Audio element that can be controlled
 */
export function playAudio(audioData: ArrayBuffer): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    try {
      // Convert ArrayBuffer to Blob
      const blob = new Blob([audioData], { type: 'audio/mpeg' });
      
      // Create object URL from the blob
      const url = URL.createObjectURL(blob);
      
      // Create and configure audio element
      const audio = new Audio(url);
      
      // When playback ends, revoke the object URL to avoid memory leaks
      audio.addEventListener('ended', () => {
        URL.revokeObjectURL(url);
      });
      
      // Start playing the audio
      audio.play().then(() => {
        resolve(audio);
      }).catch(error => {
        reject(new Error(`Failed to play audio: ${error.message}`));
      });
    } catch (error) {
      reject(new Error(`Error processing audio: ${error}`));
    }
  });
} 