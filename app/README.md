# Parley - AI-Powered Communication Assistant

Parley is an AI-powered communication assistant designed to help individuals with speech disabilities or language barriers communicate more effectively. It integrates Claude AI for intelligent conversations and ElevenLabs for high-quality text-to-speech.

## Key Features

- **AI-Powered Chat**: Natural conversations powered by Claude AI
- **Text-to-Speech**: High-quality voice synthesis through ElevenLabs API
- **Speech-to-Text**: Voice input for easy communication
- **Medical Terminology Recognition**: Identifies and explains medical terms
- **Real-time Translation**: Translates conversations to different languages
- **Accessibility Options**: Font size adjustments, high contrast mode, and more

## Setup Guide

### Prerequisites

- Node.js 18+ installed
- API keys for Claude and ElevenLabs (optional for TTS)

### Installation

1. Clone the repository and navigate to the app directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### API Keys Setup

#### Claude API Key

1. Go to [Anthropic Console](https://console.anthropic.com/account/keys)
2. Create an API key
3. Enter the API key in the Parley app when prompted or click the settings icon

#### ElevenLabs API Key (Optional for Text-to-Speech)

1. Go to [ElevenLabs Dashboard](https://elevenlabs.io/app/api-key)
2. Generate an API key
3. Enter the API key in the Parley app's settings

## How the Proxy Solution Works

Parley includes a built-in proxy solution to bypass CORS issues when calling the Claude API from a browser. This works as follows:

1. The frontend makes requests to local Next.js API routes in the `/api/proxy` directory
2. These proxy routes forward the requests to the Claude API with the appropriate headers
3. The proxy routes handle the responses and return them to the frontend

This approach eliminates CORS errors and provides a more reliable connection to the Claude API.

## Troubleshooting API Connection Issues

If you're experiencing issues with the API connection:

1. Make sure your API key is entered correctly in the settings
2. Verify that the development server is running properly
3. Try refreshing the page to reset the connection
4. Check the browser console for more detailed error messages

## License

MIT
