import Link from 'next/link';

export default function AboutPage() {
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
            <Link href="/about" className="font-medium text-indigo-600">About</Link>
            <Link href="/features" className="font-medium text-slate-600 hover:text-indigo-600 transition-colors">Features</Link>
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
          <h1 className="text-4xl font-bold mb-8 text-slate-900">About Parley</h1>
          
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-8">
            <div className="prose prose-slate lg:prose-lg max-w-none">
              <p className="text-lg text-slate-700 mb-6">
                Parley is dedicated to breaking down communication barriers for individuals with speech disabilities and 
                language barriers, particularly in healthcare settings where clear communication is critical.
              </p>
              
              <p className="text-lg text-slate-700 mb-8">
                Our AI-powered platform helps translate unclear speech into clear, comprehensible communication, 
                enabling users to express themselves effectively with healthcare providers, family members, and in everyday interactions.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">How Parley Works</h2>
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-1">
                  <p className="text-slate-700">
                    Parley uses advanced AI to convert unclear or impaired speech into text, then transforms 
                    it into clear, synthesized speech output. This process helps ensure that your message is 
                    conveyed accurately and understood by others.
                  </p>
                </div>
                <div className="flex-1 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Speech Input</h3>
                      <p className="text-sm text-slate-600">Your speech is captured via microphone</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">AI Processing</h3>
                      <p className="text-sm text-slate-600">Advanced AI clarifies and enhances speech</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">Clear Output</h3>
                      <p className="text-sm text-slate-600">Clear speech is delivered to your listener</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Accessibility Features</h2>
              <p className="text-slate-700 mb-4">
                Parley is built with accessibility as a core principle, not an afterthought. Our interface features:
              </p>
              
              <ul className="space-y-2 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-slate-700">High contrast mode for users with visual impairments</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-slate-700">Customizable text size and spacing</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-slate-700">Screen reader compatibility throughout the application</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-slate-700">Touch-friendly interface with large tap targets</span>
                </li>
              </ul>
              
              <h2 className="text-2xl font-semibold mb-4 text-slate-900">Our Team</h2>
              <p className="text-slate-700 mb-4">
                Parley was developed by a passionate team committed to using technology for social good. Our diverse team includes experts in:
              </p>
              
              <ul className="space-y-2 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <span className="text-slate-700">Speech therapy and pathology</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <span className="text-slate-700">Artificial intelligence and machine learning</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <span className="text-slate-700">Healthcare communication and accessibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-indigo-600 mt-1 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  <span className="text-slate-700">User experience design and accessibility</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-indigo-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to experience Parley?</h2>
            <p className="mb-6 text-indigo-100">Start breaking communication barriers today</p>
            <Link href="/communicate">
              <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
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