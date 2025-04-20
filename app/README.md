# Parley: AI-Powered Communication Assistant

Parley is an innovative AI-powered communication assistant designed to help individuals with speech disabilities or language barriers. It provides a comprehensive suite of tools for effective communication through an intuitive and visually engaging interface.

![Parley Screenshot](https://via.placeholder.com/800x400?text=Parley+Screenshot)

## Features

- **Speech Enhancement**: Crystal-clear speech transformation for better communication.
- **Medical Terminology Recognition**: Specialized vocabulary for healthcare conversations.
- **Visual Communication Board**: Symbol-based expression for those who prefer visual communication.
- **Real-time Translation**: Breaking language barriers through instant translations.
- **Custom Phrasebook**: Store frequently used phrases for quick access.
- **Impact Dashboard**: Track communication progress and improvements over time.

## Demo

Visit the demo at [parley-demo.vercel.app](https://parley-demo.vercel.app) to experience the features firsthand.

## Tech Stack

- **Next.js 13** with App Router for the frontend framework
- **TypeScript** for type-safe code
- **Tailwind CSS** for styling and responsive design
- **Framer Motion** for smooth animations and transitions
- **React Icons** for high-quality icons
- **Claude API** for natural language processing (coming soon)
- **ElevenLabs API** for high-quality text-to-speech (coming soon)

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/parley.git
   cd parley
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
app/
├── app/
│   ├── components/       # Reusable UI components
│   │   ├── Parley.tsx    # Main chat interface
│   │   └── ...
│   ├── communicate/      # Communicate page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── public/               # Static assets
└── ...
```

## Future Enhancements

- Integration with Claude API for advanced natural language processing
- ElevenLabs API integration for realistic text-to-speech
- Voice analysis and feedback system
- Expanded visual communication board with customizable symbols
- Real-time group conversations with translation capabilities

## Contributing

We welcome contributions to Parley! Please feel free to submit a pull request or open an issue on our GitHub repository.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
