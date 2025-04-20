import { NextRequest, NextResponse } from 'next/server';

// This is a proxy API route that forwards requests to Claude API
export async function POST(request: NextRequest) {
  try {
    // Get API key either from request headers or environment variables
    const claudeApiKey = request.headers.get('x-claude-api-key');
    
    if (!claudeApiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();
    
    console.log('Proxying request to Claude API:', {
      messageCount: body.messages?.length,
      model: body.model,
    });

    // Forward the request to Claude API
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': claudeApiKey,
      },
      body: JSON.stringify(body),
    });

    // If response is not ok, throw an error
    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error(`Claude API error (${claudeResponse.status}):`, errorText);
      
      // Return the same error status and message
      return NextResponse.json(
        { error: errorText },
        { status: claudeResponse.status }
      );
    }

    // Return the successful response
    const data = await claudeResponse.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Claude API proxy:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Also handle OPTIONS requests for CORS preflight
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