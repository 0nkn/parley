import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        
        <div className="flex items-center">
          <Link 
            href="/" 
            className="text-2xl font-bold text-primary flex items-center gap-2 focus-ring rounded-md"
            aria-label="Parley - Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span>Parley</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1">
            Home
          </Link>
          <Link href="/communicate" className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1">
            Communication Board
          </Link>
          <Link href="/phrasebook" className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1">
            My Phrasebook
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-1">
            About
          </Link>
          <Link 
            href="/communicate" 
            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition-colors touch-target focus-ring"
            aria-label="Start communicating now"
          >
            Start Now
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden touch-target focus-ring rounded-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div 
            id="mobile-menu"
            className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-50 md:hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/communicate" 
                className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Communication Board
              </Link>
              <Link 
                href="/phrasebook" 
                className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Phrasebook
              </Link>
              <Link 
                href="/about" 
                className="text-foreground hover:text-primary transition-colors focus-ring rounded-md px-2 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/communicate" 
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md transition-colors touch-target focus-ring"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Start communicating now"
              >
                Start Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 