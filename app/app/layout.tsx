import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Parley | AI-Powered Communication Assistant',
  description: 'Breaking communication barriers for individuals with speech disabilities or language barriers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ 
        backgroundColor: '#0a0a14', 
        color: 'white',
        minHeight: '100vh', 
        margin: 0, 
        padding: 0 
      }}>
        <nav className="main-nav">
          <div className="nav-container">
            <div className="logo-container">
              <Link href="/">
                <div className="logo-container">
                  <div className="logo-icon">
                    <span style={{ color: 'white', fontWeight: 600 }}>P</span>
                  </div>
                  <span style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #4F46E5, #9333EA)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>Parley</span>
                </div>
              </Link>
            </div>
            
            <div className="nav-links">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/about" className="nav-link">About</Link>
              <Link href="/communicate" className="action-button">
                Start Parley
              </Link>
            </div>
          </div>
        </nav>
        
        <main style={{ paddingTop: '4rem' }}>
          {children}
        </main>
      </body>
    </html>
  );
} 