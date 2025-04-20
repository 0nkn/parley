import { Message } from '@/app/components/Parley';

// Use local proxy endpoints instead of direct API calls
const CLAUDE_PROXY_URL = '/api/proxy/claude';
const CLAUDE_MEDICAL_PROXY_URL = '/api/proxy/claude/medical';
const CLAUDE_TRANSLATE_PROXY_URL = '/api/proxy/claude/translate';

// Interface for API request parameters
interface ClaudeRequestParams {
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  model: string;
  max_tokens: number;
  temperature?: number;
  system?: string;
}

// Interface for API response
interface ClaudeResponse {
  id: string;
  content: [{ type: string; text: string }];
  role: string;
  model: string;
  stop_reason: string;
}

// Add function to check API key validity
const isValidClaudeKey = (apiKey: string): boolean => {
  // Check if the key is a non-empty string and has the format of an Anthropic API key
  // Note: Claude API keys either start with 'sk-' (older) or may have a different format (newer)
  return !!apiKey && 
         typeof apiKey === 'string' && 
         apiKey.trim().length > 0 &&
         (apiKey.startsWith('sk-') || apiKey.includes('_'));
};

/**
 * Sends a message to Claude API through our proxy and returns the response
 * @param messages Array of messages in the conversation
 * @param apiKey Claude API key
 * @returns Promise with the assistant's response
 */
export async function sendMessageToClaude(
  messages: { role: 'user' | 'assistant'; content: string }[],
  apiKey: string
): Promise<{ id: string; content: string }> {
  // Validate API key
  if (!apiKey) {
    throw new Error('Claude API key is required');
  }

  if (!isValidClaudeKey(apiKey)) {
    console.error('Invalid Claude API key format:', apiKey.substring(0, 5) + '...');
    throw new Error('Invalid API key format. Claude API keys should start with "sk-" or be in the new format');
  }

  try {
    console.log('Sending request to Claude API proxy...');
    console.log('Message count:', messages.length);
    
    const requestParams: ClaudeRequestParams = {
      messages: messages,
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      system: "You are Parley, an AI-powered communication assistant designed to help people with speech disabilities or language barriers communicate more effectively. Be concise, helpful, and empathetic."
    };

    console.log('Request params:', JSON.stringify({
      message_count: messages.length,
      model: requestParams.model,
      max_tokens: requestParams.max_tokens,
      temperature: requestParams.temperature,
    }, null, 2));

    // Use our local proxy instead of calling Claude API directly
    const response = await fetch(CLAUDE_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-claude-api-key': apiKey
      },
      body: JSON.stringify(requestParams)
    }).catch(error => {
      console.error('Network error during fetch:', error);
      throw new Error('Network error: Failed to connect to Claude API proxy. Please check your internet connection.');
    });

    if (!response.ok) {
      let errorText;
      try {
        const errorData = await response.json();
        errorText = errorData.error || `Error status: ${response.status}`;
      } catch (e) {
        errorText = await response.text().catch(_ => 'Could not get error details');
      }
      
      console.error(`Claude API proxy error (${response.status}):`, errorText);
      
      // More descriptive errors based on status code
      if (response.status === 401) {
        throw new Error('Authentication error: Your API key may be invalid or expired. Please make sure you\'re using an API key, not a session/secret key.');
      } else if (response.status === 400) {
        throw new Error('Bad request error: The request format may be incorrect or the model specified is invalid.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded: Your account has exceeded its quota. Please check your usage limits.');
      } else if (response.status >= 500) {
        throw new Error('Claude API service error: The API is currently experiencing issues. Please try again later.');
      } else {
        throw new Error(`Claude API error (${response.status}): ${errorText}`);
      }
    }

    const data: ClaudeResponse = await response.json().catch(error => {
      console.error('Error parsing response JSON:', error);
      throw new Error('Failed to parse Claude API response.');
    });
    
    console.log('Successfully received Claude API response via proxy');
    
    return {
      id: data.id,
      content: data.content[0].text
    };
  } catch (error) {
    console.error('Error communicating with Claude API:', error);
    
    // Rethrow with more user-friendly message
    if (error instanceof Error) {
      throw error; // Keep the original error if it's already well-formatted
    } else {
      throw new Error('An unexpected error occurred when communicating with Claude API.');
    }
  }
}

/**
 * Helper function to extract medical terminology from text using our proxy
 * @param text Text to analyze
 * @param apiKey Claude API key
 * @returns Promise with extracted medical terms and their meanings
 */
export async function extractMedicalTerminology(
  text: string,
  apiKey: string
): Promise<{ term: string; definition: string }[]> {
  if (!apiKey) {
    throw new Error('Claude API key is required');
  }

  try {
    // Use our medical terminology proxy
    const response = await fetch(CLAUDE_MEDICAL_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-claude-api-key': apiKey
      },
      body: JSON.stringify({ text })
    }).catch(error => {
      console.error('Network error during fetch:', error);
      throw new Error('Network error: Failed to connect to medical terminology proxy.');
    });

    if (!response.ok) {
      const errorText = await response.text().catch(_ => 'Could not get error details');
      console.error(`Medical terminology extraction error (${response.status}):`, errorText);
      throw new Error(`Claude API error (${response.status}): ${errorText}`);
    }

    // The proxy already handles the JSON parsing
    return await response.json();
  } catch (error) {
    console.error('Error extracting medical terminology:', error);
    return [];
  }
}

/**
 * Translates text to another language using our proxy
 * @param text Text to translate
 * @param targetLanguage Language code or name to translate to
 * @param apiKey Claude API key
 * @returns Promise with translated text
 */
export async function translateText(
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new Error('Claude API key is required');
  }

  try {
    // Use our translation proxy
    const response = await fetch(CLAUDE_TRANSLATE_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-claude-api-key': apiKey
      },
      body: JSON.stringify({ text, targetLanguage })
    }).catch(error => {
      console.error('Network error during translation fetch:', error);
      throw new Error(`Network error: Failed to connect to translation proxy.`);
    });

    if (!response.ok) {
      const errorText = await response.text().catch(_ => 'Could not get error details');
      console.error(`Translation error (${response.status}):`, errorText);
      throw new Error(`Claude API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error translating text:', error);
    throw error;
  }
} 