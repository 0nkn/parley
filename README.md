# Parley - AI-Powered Speech Assistant

Parley is an assistive communication tool designed to help people with speech disabilities and language barriers communicate effectively, particularly in healthcare and other high-stakes environments. By leveraging AI technology, Parley transcribes speech, automatically detects language, translates when needed, clarifies unclear portions, and provides natural-sounding audio responses - all from a single button press.

## Features

- **Seamless Single-Button Workflow**: Press and hold to speak, then automatically receive clear audio output
- **Automatic Speech Recognition**: Captures and transcribes spoken words using advanced STT technology
- **Language Detection & Translation**: Automatically identifies non-English speech and translates to English
- **AI Clarification**: Uses Claude AI to improve and clarify transcribed speech for better understanding
- **Natural Text-to-Speech**: Converts clarified text to natural-sounding speech using ElevenLabs
- **Medical Terminology Identification**: Identifies and explains medical terms for healthcare settings
- **Glowing Tech Aesthetic**: Beautiful dark mode interface with rounded corners and smooth transitions
- **Impact Dashboard**: Track usage statistics and communication effectiveness metrics
- **Fully Accessible Design**: Intuitive interface optimized for users with various abilities

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- API keys for:
  - Claude AI (for clarification, translation, and language detection)
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

1. Tap the large, glowing microphone button to begin recording speech
2. Speak clearly - the app will show a visual indicator that it's listening
3. Release the button when done speaking
4. Parley will automatically:
   - Display the original transcription
   - Detect language and translate to English if needed
   - Process the text with Claude AI to clarify it
   - Show the clarified text
   - Read the clarified text aloud using ElevenLabs TTS

The entire process happens seamlessly with clear visual feedback at each stage.

## User Interface

- **Dark Mode**: Modern dark theme with glowing accents and soft transitions
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Visual Feedback**: Clear indicators for listening, processing, and speaking states
- **Navigation Bar**: Fixed top navbar with access to the main app and insights page
- **Vertical Flow**: Intuitive layout with content arranged in a clear vertical flow
- **Accessibility**: High-contrast options, keyboard controls, and screen reader support

## Architecture

Parley is built using:

- **Next.js**: React framework for the frontend
- **TypeScript**: For type safety and code reliability
- **TailwindCSS**: For styling the modern, glowing UI
- **Framer Motion**: For smooth animations and transitions
- **Web Speech API**: For browser-based speech recognition
- **Claude API**: For language detection, translation, clarification, and analysis
- **ElevenLabs API**: For high-quality text-to-speech
- **Whisper API**: For enhanced speech recognition

## Project Structure

```
app/
├── api/             # API routes for proxying to external services
├── components/      # React components
├── pages/           # Next.js pages including main app and insights
├── public/          # Static assets
└── styles/          # CSS styles for the glowing tech aesthetic
```

## Impact Dashboard

The insights page provides valuable metrics on:

- Communication effectiveness
- Language detection and translation accuracy
- Most common medical terms identified
- Usage patterns and frequency
- Time saved in communication scenarios

This data helps demonstrate the real-world impact of the application for users with speech disabilities or language barriers.

## Privacy and Data Handling

Parley processes speech data through various AI services. No data is permanently stored on our servers. API calls are made directly from the client or through minimal server-side proxies to add authentication headers.

User settings (like API keys) are stored in the browser's localStorage and remain on the user's device.

## Roadmap

- Support for more languages and dialects
- Enhanced medical terminology database
- Offline mode for limited connectivity situations
- Customizable voice options
- Integration with messaging platforms
- Expanded analytics dashboard for communication patterns
- Voice customization for different scenarios

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Claude AI by Anthropic for language detection, translation, and text clarification
- ElevenLabs for high-quality text-to-speech technology
- OpenAI for Whisper speech recognition technology