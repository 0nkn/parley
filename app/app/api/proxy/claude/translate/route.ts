import { NextRequest, NextResponse } from 'next/server';

// This is a proxy API route that forwards translation requests to Claude API
export async function POST(request: NextRequest) {
  try {
    // Get API key from request headers
    const claudeApiKey = request.headers.get('x-claude-api-key');
    
    if (!claudeApiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Get the request body
    const requestData = await request.json();
    const { text, targetLanguage } = requestData;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required for translation' },
        { status: 400 }
      );
    }
    
    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Target language is required for translation' },
        { status: 400 }
      );
    }
    
    // Prepare request to Claude API
    const claudeRequestBody = {
      messages: [
        {
          role: 'user',
          content: `Translate the following text to ${targetLanguage}. Only provide the translation, no explanations or additional comments: "${text}"`
        }
      ],
      model: 'claude-3-haiku-20240307',
      max_tokens: 500,
      temperature: 0.2,
      system: "You are a professional translator with expertise in multiple languages. Provide accurate, contextually appropriate translations."
    };

    // Forward the request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': claudeApiKey,
      },
      body: JSON.stringify(claudeRequestBody),
    });

    // Handle error response from Claude API
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error(`Claude API error (${claudeResponse.status}):`, errorText);
      return NextResponse.json(
        { error: errorText },
        { status: claudeResponse.status }
      );
    }

    // Parse Claude API response
    const data = await claudeResponse.json();
    const translatedText = data.content[0].text.trim();
    
    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Error in Claude API translation proxy:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-claude-api-key',
    },
  });
} 