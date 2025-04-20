import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Link from 'next/link';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

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
      <body className={`${poppins.className} bg-gradient-to-b from-[#050510] to-[#0a0a1a] text-white min-h-screen`}>
        <nav className="main-nav">
          <div className="nav-container">
            <div className="logo-container">
              <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-glow-sm">
                  <span className="text-white font-semibold text-lg">P</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Parley</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/" className="nav-link relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/about" className="nav-link relative group">
                About
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/communicate" className="pill-button flex items-center gap-2 transform hover:translate-y-[-2px] transition-all duration-300">
                <span>Start Parley</span>
              </Link>
            </div>
          </div>
        </nav>
        
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
} 