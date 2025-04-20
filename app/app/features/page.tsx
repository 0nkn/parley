import Link from 'next/link';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-9 w-9 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold text-xl">P</span>
            </div>
            <span className="text-xl font-bold">Parley</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="font-medium text-slate-600 hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/about" className="font-medium text-slate-600 hover:text-indigo-600 transition-colors">About</Link>
            <Link href="/features" className="font-medium text-indigo-600">Features</Link>
          </nav>
          
          <div>
            <Link href="/communicate">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
                Start Communicating
              </button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-slate-900">Features</h1>
          
          <p className="text-lg text-slate-700 mb-12 max-w-3xl">
            Parley offers a comprehensive suite of features designed to overcome communication barriers faced by individuals with speech disabilities and language barriers.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Speech Enhancement */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="rounded-full bg-indigo-100 p-3 w-fit mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"></path>
                  <path d="M19.14 19.14a1.5 1.5 0 0 0 2.12 2.12"></path>
                  <path d="M2.74 2.74a1.5 1.5 0 0 0 2.12 2.12"></path>
                  <path d="m21.14 2.74-16.3 16.3"></path>
                  <path d="m2.86 21.26 16.3-16.3"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-slate-900">AI-Powered Speech Enhancement</h2>
              <p className="text-slate-600 mb-4">
                Advanced AI algorithms transform unclear speech into clear, understandable communication, adapting to various speech patterns.
              </p>
            </div>
            
            {/* Visual Communication Board */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="rounded-full bg-emerald-100 p-3 w-fit mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="8" height="8" x="2" y="2" rx="2"></rect>
                  <rect width="8" height="8" x="14" y="2" rx="2"></rect>
                  <rect width="8" height="8" x="2" y="14" rx="2"></rect>
                  <rect width="8" height="8" x="14" y="14" rx="2"></rect>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-slate-900">Visual Communication Board</h2>
              <p className="text-slate-600 mb-4">
                Intuitive tap-to-speak interface with categorized phrases, visual icons, and customizable options for quick communication.
              </p>
            </div>
            
            {/* Medical Vocabulary */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="rounded-full bg-sky-100 p-3 w-fit mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                  <path d="M7 21h10"></path>
                  <path d="M12 3v18"></path>
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-slate-900">Medical Terminology</h2>
              <p className="text-slate-600 mb-4">
                Specialized vocabulary for healthcare settings with medical terms, symptom descriptions, and medication terminology.
              </p>
            </div>
            
            {/* Phrasebook */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="rounded-full bg-amber-100 p-3 w-fit mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 text-slate-900">Personal Phrasebook</h2>
              <p className="text-slate-600 mb-4">
                Create and save personalized phrases for quick access, organized by categories and shareable between devices.
              </p>
            </div>
          </div>
          
          {/* Accessibility Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Accessibility Features</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Visual Accessibility</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">High Contrast Mode</p>
                      <p className="text-sm text-slate-600">Enhanced visibility for users with visual impairments</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Adjustable Text Size</p>
                      <p className="text-sm text-slate-600">Customizable font sizes for comfort and readability</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4 text-slate-800">Motor Accessibility</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Large Touch Targets</p>
                      <p className="text-sm text-slate-600">Generously sized buttons and controls for easier interaction</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-indigo-100 p-1.5 mt-0.5">
                      <svg className="h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Voice Control</p>
                      <p className="text-sm text-slate-600">Navigate the app using voice commands</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Start using Parley today</h2>
            <p className="mb-6 text-indigo-100 max-w-2xl mx-auto">
              Transform the way you communicate in healthcare settings and daily life.
            </p>
            <Link href="/communicate">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                Get Started Now
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-8 px-4 mt-12">
        <div className="container mx-auto text-center">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">P</span>
            </div>
            <span className="text-lg font-bold">Parley</span>
          </Link>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} Parley. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 