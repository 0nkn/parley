import React from 'react';
import { Button } from './ui/Button';

export interface PhrasebookItem {
  id: string;
  text: string;
  category: string;
  timestamp: string;
  isFavorite?: boolean;
}

interface PhrasebookCardProps {
  phrase: PhrasebookItem;
  onSpeak: (text: string) => void;
  onEdit?: (phrase: PhrasebookItem) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function PhrasebookCard({
  phrase,
  onSpeak,
  onEdit,
  onDelete,
  onToggleFavorite
}: PhrasebookCardProps) {
  const handleSpeak = () => {
    onSpeak(phrase.text);
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(phrase);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(phrase.id);
    }
  };
  
  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(phrase.id, !phrase.isFavorite);
    }
  };
  
  return (
    <div className="bg-background border border-border rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="inline-block px-2 py-1 text-xs rounded-full bg-muted">
          {phrase.category}
        </span>
        <button
          onClick={handleToggleFavorite}
          className="text-foreground/60 hover:text-primary focus-ring rounded-full p-1"
          aria-label={phrase.isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 24 24" 
            fill={phrase.isFavorite ? "currentColor" : "none"}
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 14l-7 7-7-7M19 10l-7-7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="min-h-[80px] mb-4">
        <p className="text-foreground text-lg">{phrase.text}</p>
      </div>
      
      <div className="text-xs text-foreground/60 mb-4">
        Added on {new Date(phrase.timestamp).toLocaleDateString()}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={handleSpeak}
          size="sm" 
          className="flex-1"
          aria-label={`Speak phrase: ${phrase.text}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
          Speak
        </Button>
        
        {onEdit && (
          <Button 
            onClick={handleEdit}
            size="sm" 
            variant="outline"
            className="flex-1"
            aria-label={`Edit phrase: ${phrase.text}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Edit
          </Button>
        )}
        
        {onDelete && (
          <Button 
            onClick={handleDelete}
            size="sm" 
            variant="outline"
            className="flex-1 hover:text-error hover:border-error"
            aria-label={`Delete phrase: ${phrase.text}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
} 