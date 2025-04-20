import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CommunicationBoard from '@/components/CommunicationBoard';
import SpeechToText from '@/components/SpeechToText';
import { Button } from '@/components/ui/Button';

export default function CommunicatePage() {
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Communication Assistant</h1>
            
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <div className="md:col-span-3 order-2 md:order-1">
                <div className="bg-background border border-border rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-4">Tools</h2>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 touch-target"
                      aria-label="Adjust accessibility settings"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      Accessibility
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 touch-target"
                      aria-label="Switch to high contrast mode"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      High Contrast
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 touch-target"
                      aria-label="Choose language"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m5 8 6 6"></path>
                        <path d="m4 14 6-6 2-3"></path>
                        <path d="M2 5h12"></path>
                        <path d="M7 2h1"></path>
                        <path d="m22 22-5-10-5 10"></path>
                        <path d="M14 18h6"></path>
                      </svg>
                      Language
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="flex items-center gap-2 touch-target"
                      aria-label="Save to phrasebook"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                      </svg>
                      Save to Phrasebook
                    </Button>
                  </div>
                  
                  <SpeechToText processWithAI={true} />
                </div>
              </div>
              
              <div className="md:col-span-2 order-1 md:order-2">
                <div className="bg-background border border-border rounded-lg p-6">
                  <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <Button 
                      variant="secondary" 
                      fullWidth
                      className="justify-start touch-target"
                      aria-label="I need help"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      I need help
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      fullWidth
                      className="justify-start touch-target"
                      aria-label="I am in pain"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7H2Z"></path>
                        <path d="M6 11V8"></path>
                        <path d="M12 11V9"></path>
                        <path d="M18 11V8"></path>
                      </svg>
                      I am in pain
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      fullWidth
                      className="justify-start touch-target"
                      aria-label="I need water"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v6"></path>
                        <path d="M12 22v-6"></path>
                        <path d="M4.93 10.93l4.24 4.24"></path>
                        <path d="M14.83 8.93l4.24-4.24"></path>
                        <path d="M14.83 19.07l4.24-4.24"></path>
                        <path d="M4.93 17.07l4.24-4.24"></path>
                      </svg>
                      I need water
                    </Button>
                    
                    <Button 
                      variant="secondary" 
                      fullWidth
                      className="justify-start touch-target"
                      aria-label="Call my family"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Call my family
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <CommunicationBoard />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 