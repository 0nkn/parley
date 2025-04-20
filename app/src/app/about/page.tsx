import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">About Parley</h1>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-lg mb-4">
                Parley is dedicated to breaking down communication barriers for individuals with speech disabilities and language barriers, particularly in healthcare settings where clear communication is critical.
              </p>
              <p className="text-lg mb-4">
                We believe that everyone deserves to be heard and understood, regardless of speech impairments or language differences. Our AI-powered communication assistant makes this possible through innovative technologies that enhance and clarify speech.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">How Parley Works</h2>
              
              <div className="bg-muted p-6 rounded-lg mb-8">
                <h3 className="text-xl font-medium mb-3">Speech-to-Text-to-Speech Transformation</h3>
                <p className="mb-4">
                  Parley uses advanced AI to convert unclear or impaired speech into text, then transforms it into clear, synthesized speech output. This process helps ensure that your message is conveyed accurately and clearly.
                </p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>You speak into your device microphone or select phrases from our communication board</li>
                  <li>Our AI processes your speech, enhancing clarity and preserving your meaning</li>
                  <li>The processed speech is played back in a clear, understandable voice</li>
                </ol>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3">Medical Terminology Recognition</h3>
                  <p>
                    Our system is specially trained to recognize and correctly interpret medical terminology, making it invaluable in healthcare settings where precision is critical.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3">Visual Communication Board</h3>
                  <p>
                    For non-verbal users or situations where speaking is difficult, our visual communication board offers an intuitive, tap-to-speak interface with customizable categories.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3">Real-time Translation</h3>
                  <p>
                    Break down language barriers with our real-time translation features, allowing effective communication even when you don\'t speak the same language as your healthcare provider.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-6">
                  <h3 className="text-xl font-medium mb-3">Custom Phrasebook</h3>
                  <p>
                    Save frequently used phrases for quick access. Your phrasebook is personalized to your needs, making communication faster and more efficient over time.
                  </p>
                </div>
              </div>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Accessibility First</h2>
              <p className="text-lg mb-4">
                Parley is built with accessibility as a core principle, not an afterthought. Our interface features:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>High-contrast mode for users with visual impairments</li>
                <li>Large, clearly labeled touch targets for users with motor control challenges</li>
                <li>Screen reader compatibility for blind and low-vision users</li>
                <li>Keyboard navigation for users who cannot use pointing devices</li>
                <li>Customizable interface to accommodate different needs and preferences</li>
              </ul>
              <p className="text-lg">
                We continually test and improve our accessibility features based on user feedback and the latest best practices.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-lg mb-6">
                Parley was developed by a passionate team committed to using technology for social good. Our diverse team includes experts in:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-background border border-border rounded-lg p-6 text-center">
                  <div className="rounded-full bg-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <path d="M12 19v3"></path>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Speech Recognition</h3>
                  <p className="text-sm">
                    Specialists in advanced speech recognition algorithms and neural networks.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-6 text-center">
                  <div className="rounded-full bg-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">AI & Machine Learning</h3>
                  <p className="text-sm">
                    AI researchers focused on language models and natural language processing.
                  </p>
                </div>
                
                <div className="bg-background border border-border rounded-lg p-6 text-center">
                  <div className="rounded-full bg-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  </div>
                  <h3 className="font-semibold mb-2">Accessibility Design</h3>
                  <p className="text-sm">
                    Experts in inclusive design principles and accessible user interfaces.
                  </p>
                </div>
              </div>
            </section>
            
            <div className="bg-primary text-white rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to experience Parley?</h2>
              <p className="text-lg mb-6">
                Start communicating more effectively today with our AI-powered assistant.
              </p>
              <Link href="/communicate">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 touch-target">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                  </svg>
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