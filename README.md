# Parley - AI-Powered Speech Assistant

Parley is an assistive communication tool designed to help people with speech difficulties communicate more effectively. By leveraging AI technology, Parley transcribes speech, clarifies unclear portions, and provides natural-sounding audio responses.

## Features

- Speech Recognition: Captures and transcribes spoken words
- AI Clarification: Uses Claude AI to improve and clarify transcribed speech
- Text-to-Speech: Converts clarified text to natural-sounding speech using ElevenLabs
- Medical Terminology Identification: Identifies and explains medical terms
- Translation Support: Translates conversations into different languages
- Accessible Interface: Clean, responsive design that works on multiple devices

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- API keys for:
  - Claude AI
  - ElevenLabs (for text-to-speech)
  - OpenAI (optional, for alternative speech recognition)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/parley.git
   cd parley
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your API keys:
   ```
   NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_api_key
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Tap the microphone button to begin recording speech
2. Speak clearly - the app will transcribe what you say
3. After you finish speaking (or tap the button again), Parley will:
   - Display the original transcription
   - Process the text with Claude AI to clarify it
   - Show the clarified text
   - Provide a play button to hear the text spoken aloud

## Architecture

Parley is built using:

- Next.js: React framework for the frontend
- TypeScript: For type safety and code reliability
- TailwindCSS: For styling
- Framer Motion: For animations and transitions
- Web Speech API: For browser-based speech recognition
- Claude API: For text clarification and analysis
- ElevenLabs API: For high-quality text-to-speech
- Whisper API: For enhanced speech recognition

## Project Structure

```
app/
├── api/             # API routes for proxying to external services
├── components/      # React components
├── pages/           # Next.js pages
├── public/          # Static assets
└── styles/          # CSS styles
```

## Privacy and Data Handling

Parley processes speech data through various API services. No data is permanently stored on our servers. API calls are made directly from the client or through minimal server-side proxies to add authentication headers.

User settings (like API keys) are stored in the browser's localStorage and remain on the user's device.

## Roadmap

- Support for more languages and dialects
- Phrasebook feature for commonly used expressions
- Mobile app versions
- Offline mode for limited connectivity situations
- Customizable voice options
- Integration with messaging platforms
- Analytics dashboard for communication patterns

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Claude AI by Anthropic for text processing capabilities
- ElevenLabs for text-to-speech technology
- OpenAI for Whisper speech recognition technology