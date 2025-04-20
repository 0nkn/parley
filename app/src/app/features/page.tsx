import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">Features</h1>
            
            <p className="text-lg mb-8">
              Parley offers a comprehensive suite of features designed to overcome communication barriers faced by individuals with speech disabilities and language barriers, especially in healthcare settings.
            </p>
            
            {/* Speech-to-Text-to-Speech Section */}
            <section className="mb-16">
              <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-6">Speech-to-Text-to-Speech</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">How it works</h3>
                  <p className="mb-4">
                    Our advanced AI-powered speech transformation system enhances unclear speech and makes it understandable for everyone.
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>You speak into your device's microphone</li>
                    <li>Our AI system processes your speech in real-time</li>
                    <li>The system identifies and clarifies unclear parts while preserving your meaning</li>
                    <li>Clear, understandable speech is played back through your device</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">Key benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Improves clarity of speech for users with speech impairments</li>
                    <li>Preserves the speaker's intended meaning and sentiment</li>
                    <li>Works across a wide range of speech conditions and accents</li>
                    <li>Adjusts to your unique speech patterns over time</li>
                    <li>Provides instant feedback through transcript display</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link href="/communicate">
                    <Button>Try Speech Enhancement</Button>
                  </Link>
                </div>
              </div>
            </section>
            
            {/* Visual Communication Board */}
            <section className="mb-16">
              <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-6">Visual Communication Board</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">How it works</h3>
                  <p className="mb-4">
                    Our intuitive visual communication board offers a tap-to-speak interface for quick and easy communication without typing or speaking.
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Browse through categorized phrases and commonly used expressions</li>
                    <li>Tap on the desired phrase or expression</li>
                    <li>The system instantly speaks the selected phrase</li>
                    <li>Build complex messages by combining multiple phrases</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">Key benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Perfect for non-verbal users or situations where speaking is difficult</li>
                    <li>Organized by categories for intuitive navigation</li>
                    <li>Large, high-contrast buttons for easy accessibility</li>
                    <li>Customizable with your most frequently used phrases</li>
                    <li>Supports healthcare-specific terminology and phrases</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link href="/communicate">
                    <Button>Try Communication Board</Button>
                  </Link>
                </div>
              </div>
            </section>
            
            {/* Medical Terminology */}
            <section className="mb-16">
              <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-6">Medical Terminology Recognition</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">How it works</h3>
                  <p className="mb-4">
                    Our system is specially trained to recognize and correctly interpret medical terminology, critical for accurate communication in healthcare settings.
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>The system identifies medical terms in your speech</li>
                    <li>Special attention is given to pronunciation and accuracy of medical terms</li>
                    <li>Our database includes thousands of medical terms and conditions</li>
                    <li>Context-aware processing ensures appropriate interpretation</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">Key benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Enhanced accuracy for medical discussions with healthcare providers</li>
                    <li>Reduces miscommunication about symptoms, conditions, and medications</li>
                    <li>Supports complex medical terminology and specialized vocabulary</li>
                    <li>Particularly helpful for emergency situations requiring precision</li>
                    <li>Regularly updated with new medical terms and procedures</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link href="/communicate">
                    <Button>Try Medical Terminology</Button>
                  </Link>
                </div>
              </div>
            </section>
            
            {/* Translation Feature */}
            <section className="mb-16">
              <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-6">Real-time Translation</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">How it works</h3>
                  <p className="mb-4">
                    Break down language barriers with our real-time translation feature, allowing effective communication across different languages.
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Select your language and the target language for translation</li>
                    <li>Speak or type your message</li>
                    <li>The system translates your message in real-time</li>
                    <li>The translated message is displayed and can be spoken aloud</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">Key benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Supports multiple languages for diverse communication needs</li>
                    <li>Maintains medical accuracy across languages</li>
                    <li>Enables communication with healthcare providers who speak different languages</li>
                    <li>Includes specialized medical translations for accuracy</li>
                    <li>Bidirectional translation for two-way communication</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link href="/communicate">
                    <Button>Try Translation</Button>
                  </Link>
                </div>
              </div>
            </section>
            
            {/* Custom Phrasebook */}
            <section className="mb-16">
              <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-6">Custom Phrasebook</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">How it works</h3>
                  <p className="mb-4">
                    Your personalized phrasebook allows you to save, organize, and quickly access frequently used expressions and important messages.
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Create and save phrases you use frequently</li>
                    <li>Organize phrases by categories for easy access</li>
                    <li>Mark favorite phrases for immediate access</li>
                    <li>Edit and customize phrases as needed</li>
                    <li>Access your phrases from any device</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">Key benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Speeds up communication for frequently used messages</li>
                    <li>Ensures accuracy for critical medical information</li>
                    <li>Reduces fatigue from repeating the same phrases</li>
                    <li>Personalized to your specific communication needs</li>
                    <li>Saves time in urgent situations</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Link href="/phrasebook">
                    <Button>View Your Phrasebook</Button>
                  </Link>
                </div>
              </div>
            </section>
            
            {/* Impact Dashboard */}
            <section className="mb-16">
              <div className="bg-muted p-8 rounded-lg">
                <h2 className="text-3xl font-semibold mb-6">Impact Dashboard</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">How it works</h3>
                  <p className="mb-4">
                    Track your communication patterns and progress over time with our comprehensive analytics dashboard.
                  </p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>View statistics on your app usage and communication patterns</li>
                    <li>Track improvements in speech clarity over time</li>
                    <li>Monitor which features and phrases you use most frequently</li>
                    <li>Receive personalized suggestions based on your usage patterns</li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-3">Key benefits</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provides insights into your communication patterns</li>
                    <li>Helps demonstrate progress and improvements</li>
                    <li>Identifies opportunities for personalization</li>
                    <li>Offers data that can be shared with healthcare providers</li>
                    <li>Helps continuously improve the app based on usage data</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <Button disabled>Coming Soon</Button>
                </div>
              </div>
            </section>
            
            <div className="bg-primary text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Experience all these features and more</h2>
              <p className="text-lg mb-6">
                Start using Parley today and transform the way you communicate.
              </p>
              <Link href="/communicate">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 touch-target">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 