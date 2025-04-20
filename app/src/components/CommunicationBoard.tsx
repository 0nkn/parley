import React, { useState } from 'react';
import { Button } from './ui/Button';

type CategoryType = 'needs' | 'feelings' | 'medical' | 'activities' | 'people' | 'custom';

interface PhraseItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  category: CategoryType;
}

const defaultPhrases: PhraseItem[] = [
  // Needs
  {
    id: 'need-water',
    text: 'I need water',
    category: 'needs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
      </svg>
    )
  },
  {
    id: 'need-food',
    text: 'I am hungry',
    category: 'needs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
    )
  },
  {
    id: 'need-bathroom',
    text: 'I need to use the bathroom',
    category: 'needs',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22V12a8 8 0 0 1 16 0v10"></path>
        <path d="M4 16h16"></path>
      </svg>
    )
  },
  
  // Feelings
  {
    id: 'feeling-pain',
    text: 'I am in pain',
    category: 'feelings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="15" x2="16" y2="15"></line>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    )
  },
  {
    id: 'feeling-happy',
    text: 'I am happy',
    category: 'feelings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    )
  },
  {
    id: 'feeling-tired',
    text: 'I am tired',
    category: 'feelings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="8" y1="15" x2="16" y2="15"></line>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    )
  },
  
  // Medical
  {
    id: 'med-medicine',
    text: 'I need my medicine',
    category: 'medical',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 15V8a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v7"></path>
        <polyline points="17 21 12 16 7 21"></polyline>
        <line x1="12" y1="12" x2="12" y2="16"></line>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </svg>
    )
  },
  {
    id: 'med-doctor',
    text: 'I need to see a doctor',
    category: 'medical',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
      </svg>
    )
  },
  {
    id: 'med-nurse',
    text: 'I need to see a nurse',
    category: 'medical',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8"></path>
        <path d="M12 2v20"></path>
        <path d="M8 22h8"></path>
        <path d="M2 12h20"></path>
        <path d="M2 7h5"></path>
        <path d="M2 17h5"></path>
        <path d="M17 17h5"></path>
        <path d="M17 7h5"></path>
      </svg>
    )
  },
];

export default function CommunicationBoard() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>('needs');
  const [message, setMessage] = useState<string>('');
  const [lastSpoken, setLastSpoken] = useState<string | null>(null);
  
  const categories: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'needs',
      label: 'Basic Needs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      )
    },
    {
      id: 'feelings',
      label: 'Feelings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      )
    },
    {
      id: 'medical',
      label: 'Medical',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6v0a6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"></path>
          <path d="M8 15v1a6 6 0 006 6v0a6 6 0 006-6v-4"></path>
          <line x1="2" y1="2" x2="22" y2="22"></line>
        </svg>
      )
    },
    {
      id: 'activities',
      label: 'Activities',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: 'people',
      label: 'People',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    {
      id: 'custom',
      label: 'Custom',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      )
    },
  ];
  
  const filteredPhrases = selectedCategory
    ? defaultPhrases.filter(phrase => phrase.category === selectedCategory)
    : defaultPhrases;
  
  const speakPhrase = (text: string) => {
    setLastSpoken(text);
    setMessage(prev => prev ? `${prev}. ${text}` : text);
    
    // Use the Web Speech API for text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower rate for better clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const clearMessage = () => {
    setMessage('');
    setLastSpoken(null);
  };
  
  const speakFullMessage = () => {
    if (message && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };
  
  return (
    <div className="bg-background p-4 rounded-lg shadow-sm border border-border">
      <h2 className="text-2xl font-bold mb-6">Communication Board</h2>
      
      {/* Category selection */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2" role="tablist" aria-label="Communication categories">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-none flex items-center gap-2 px-4 py-2 rounded-md touch-target transition-colors ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-muted hover:bg-muted/80'
            } focus-ring`}
            role="tab"
            aria-selected={selectedCategory === category.id}
            aria-controls={`panel-${category.id}`}
            id={`tab-${category.id}`}
          >
            {category.icon}
            <span>{category.label}</span>
          </button>
        ))}
      </div>
      
      {/* Message display */}
      <div 
        className="mb-6 p-4 min-h-[80px] bg-muted rounded-md border border-border"
        aria-live="polite"
        aria-atomic="true"
      >
        {message ? (
          <p className="text-lg">{message}</p>
        ) : (
          <p className="text-foreground/60 text-lg">Your message will appear here...</p>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-4 mb-8">
        <Button 
          onClick={speakFullMessage} 
          disabled={!message}
          className="flex-1"
          aria-label="Speak full message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          Speak
        </Button>
        <Button 
          onClick={clearMessage} 
          variant="secondary"
          className="flex-1"
          aria-label="Clear message"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          Clear
        </Button>
      </div>
      
      {/* Phrases grid */}
      <div
        role="tabpanel"
        id={`panel-${selectedCategory}`}
        aria-labelledby={`tab-${selectedCategory}`}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {filteredPhrases.map(phrase => (
          <button
            key={phrase.id}
            onClick={() => speakPhrase(phrase.text)}
            className={`p-4 bg-background border-2 ${
              lastSpoken === phrase.text ? 'border-primary' : 'border-border'
            } rounded-lg shadow-sm hover:shadow transition-all flex flex-col items-center justify-center min-h-[120px] touch-target focus-ring`}
            aria-label={`Say: ${phrase.text}`}
          >
            <div className="text-primary mb-2">{phrase.icon}</div>
            <span className="text-center">{phrase.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 