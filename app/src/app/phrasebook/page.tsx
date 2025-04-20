import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PhrasebookCard, { PhrasebookItem } from '@/components/PhrasebookCard';
import { Button } from '@/components/ui/Button';

// Sample phrasebook data (in a real app, this would come from a database)
const samplePhrases: PhrasebookItem[] = [
  {
    id: 'phrase-1',
    text: 'I am experiencing chest pain that radiates to my left arm.',
    category: 'Medical',
    timestamp: '2023-11-15T09:30:00Z',
    isFavorite: true,
  },
  {
    id: 'phrase-2',
    text: 'Could you please speak more slowly?',
    category: 'Communication',
    timestamp: '2023-11-10T14:45:00Z',
    isFavorite: false,
  },
  {
    id: 'phrase-3',
    text: 'I need to use the restroom, can someone assist me?',
    category: 'Basic Needs',
    timestamp: '2023-11-08T11:20:00Z',
    isFavorite: true,
  },
  {
    id: 'phrase-4',
    text: 'My medication is due at 2 PM. It\'s the blue pill in my bag.',
    category: 'Medical',
    timestamp: '2023-11-05T16:15:00Z',
    isFavorite: false,
  },
  {
    id: 'phrase-5',
    text: 'Could you please call my daughter? Her number is saved in my phone contacts.',
    category: 'Family',
    timestamp: '2023-11-01T10:30:00Z',
    isFavorite: true,
  },
  {
    id: 'phrase-6',
    text: 'I\'m feeling dizzy and lightheaded.',
    category: 'Medical',
    timestamp: '2023-10-28T09:15:00Z',
    isFavorite: false,
  },
];

export default function PhrasebookPage() {
  // This function would use the Web Speech API in a real implementation
  const speakPhrase = (text: string) => {
    // In a real app, we would use the Web Speech API:
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
    console.log(`Speaking: ${text}`);
  };
  
  return (
    <>
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">My Phrasebook</h1>
              
              <Button className="touch-target">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Phrase
              </Button>
            </div>
            
            <div className="mb-8 flex flex-wrap gap-3">
              <Button variant="outline" className="touch-target">
                All Phrases
              </Button>
              <Button variant="outline" className="touch-target">
                Favorites
              </Button>
              <Button variant="outline" className="touch-target">
                Medical
              </Button>
              <Button variant="outline" className="touch-target">
                Basic Needs
              </Button>
              <Button variant="outline" className="touch-target">
                Communication
              </Button>
              <Button variant="outline" className="touch-target">
                Family
              </Button>
            </div>
            
            {/* Search and sort controls */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-foreground/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </span>
                <input
                  type="search"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus-ring"
                  placeholder="Search phrases..."
                  aria-label="Search phrases"
                />
              </div>
              
              <div className="flex-none">
                <select
                  className="w-full sm:w-auto border border-border rounded-md bg-background py-2 px-4 focus-ring"
                  aria-label="Sort phrases"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="az">A-Z</option>
                  <option value="za">Z-A</option>
                </select>
              </div>
            </div>
            
            {/* Phrases grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {samplePhrases.map((phrase) => (
                <PhrasebookCard
                  key={phrase.id}
                  phrase={phrase}
                  onSpeak={speakPhrase}
                  onEdit={(phrase) => console.log('Edit:', phrase)}
                  onDelete={(id) => console.log('Delete:', id)}
                  onToggleFavorite={(id, isFavorite) => console.log('Toggle favorite:', id, isFavorite)}
                />
              ))}
            </div>
            
            {/* Pagination */}
            <nav className="flex justify-center" aria-label="Pagination">
              <ul className="flex items-center space-x-2">
                <li>
                  <Button variant="outline" size="sm" className="touch-target" aria-label="Previous page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                  </Button>
                </li>
                <li>
                  <Button variant="outline" size="sm" className="touch-target" aria-current="page">1</Button>
                </li>
                <li>
                  <Button variant="outline" size="sm" className="touch-target">2</Button>
                </li>
                <li>
                  <Button variant="outline" size="sm" className="touch-target">3</Button>
                </li>
                <li>
                  <Button variant="outline" size="sm" className="touch-target" aria-label="Next page">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 