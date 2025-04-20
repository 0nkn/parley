import Image from "next/image";
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="md:order-2">
                <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/hero-image.svg"
                    alt="Person using Parley to communicate with a healthcare provider"
                    fill
                    style={{ objectFit: 'contain' }}
                    priority
                  />
                </div>
              </div>
              
              <div className="md:order-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                  Breaking Barriers in Communication
                </h1>
                <p className="text-lg mb-8 text-foreground/80">
                  Parley is an AI-powered communication assistant designed to help individuals with speech disabilities or language barriers communicate effectively in healthcare settings and daily life.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/communicate">
                    <Button size="lg" className="touch-target">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                      </svg>
                      Start Communicating
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button size="lg" variant="outline" className="touch-target">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z"></path>
                    <path d="M19.14 19.14a1.5 1.5 0 0 0 2.12 2.12"></path>
                    <path d="M2.74 2.74a1.5 1.5 0 0 0 2.12 2.12"></path>
                    <path d="m21.14 2.74-16.3 16.3"></path>
                    <path d="m2.86 21.26 16.3-16.3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Speech Enhancement</h3>
                <p className="text-foreground/80">
                  Transform unclear speech into clear, understandable communication using AI technology.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                    <path d="M7 21h10"></path>
                    <path d="M12 3v18"></path>
                    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Medical Terminology</h3>
                <p className="text-foreground/80">
                  Specialized vocabulary for healthcare settings, ensuring accurate communication with medical professionals.
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="8" height="8" x="2" y="2" rx="2"></rect>
                    <rect width="8" height="8" x="14" y="2" rx="2"></rect>
                    <rect width="8" height="8" x="2" y="14" rx="2"></rect>
                    <rect width="8" height="8" x="14" y="14" rx="2"></rect>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Visual Communication Board</h3>
                <p className="text-foreground/80">
                  Tap-to-speak icons organized by category for quick, intuitive communication without typing.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/features">
                <Button variant="link" className="touch-target">
                  View All Features
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What People Are Saying</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">JD</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-foreground/70">Stroke Survivor</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "Parley has been life-changing for me after my stroke affected my speech. I can now communicate clearly with my doctors and family without frustration."
                </p>
              </div>
              
              <div className="bg-background p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">DR</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Dr. Sarah Chen</h3>
                    <p className="text-sm text-foreground/70">Neurologist</p>
                  </div>
                </div>
                <p className="text-foreground/80 italic">
                  "I recommend Parley to my patients with speech difficulties. It significantly improves our ability to communicate effectively during appointments."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Break Communication Barriers?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Start using Parley today and experience clearer, more effective communication in healthcare settings and daily life.
            </p>
            <Link href="/communicate">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 touch-target">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
