import React, { useState, useEffect } from 'react';
import ThreeHero from './components/ThreeHero';
import { Section } from './components/Section';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { SkillHexGrid } from './components/SkillHexGrid';
import { Certifications } from './components/Certifications';
import { ContactForm } from './components/ContactForm';
import { GlobalBackground } from './components/GlobalBackground';
import { ExecutiveProfile } from './components/ExecutiveProfile';
import { content } from './data';
import { Menu, X, ChevronDown, Download, Loader2, Check } from 'lucide-react';

export default function App() {
  // 1. STATE DECLARATIONS (Only once!)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // 2. EFFECTS
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. HANDLERS
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault(); // Stop default link behavior
    if (downloadStatus !== 'idle') return;

    // Start Loading
    setDownloadStatus('loading');

    setTimeout(() => {
      // Trigger Download
      const link = document.createElement('a');
      link.href = '/resume.pdf'; // Matches your public folder file
      link.download = 'Diksha_Sharma_Resume.pdf'; // Forces this name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show Success
      setDownloadStatus('success');

      // Reset
      setTimeout(() => setDownloadStatus('idle'), 3000);
    }, 1500);
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <div className="relative min-h-screen font-sans text-slate-200 selection:bg-primary selection:text-slate-900">
      
      {/* Global Background */}
      <GlobalBackground />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/90 backdrop-blur-md py-4 border-b border-white/5 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#" className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            DIKSHA SHARMA
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium hover:text-white transition-colors text-slate-400"
              >
                {link.name}
              </a>
            ))}
            
            {/* ANIMATED RESUME BUTTON */}
            <button 
              onClick={handleDownload}
              disabled={downloadStatus !== 'idle'}
              className={`
                relative flex items-center gap-2 px-5 py-2 rounded border text-sm font-semibold transition-all duration-300 overflow-hidden cursor-pointer
                ${downloadStatus === 'idle' ? 'border-slate-600 text-white hover:bg-white hover:text-slate-900 hover:scale-105 active:scale-95' : ''}
                ${downloadStatus === 'loading' ? 'border-sky-400 text-sky-400 cursor-wait bg-sky-400/10' : ''}
                ${downloadStatus === 'success' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : ''}
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                {downloadStatus === 'idle' && (
                  <>
                    <Download size={16} className="group-hover:animate-bounce" /> Resume
                  </>
                )}

                {downloadStatus === 'loading' && (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Preparing...
                  </>
                )}

                {downloadStatus === 'success' && (
                  <>
                    <Check size={16} className="animate-in zoom-in duration-300" /> Saved!
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-slate-700 p-6 flex flex-col gap-4 shadow-2xl">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-lg font-medium text-slate-300 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <ThreeHero />
        
        <div className="container mx-auto px-6 relative z-10 pt-20 pointer-events-none">
          <div className="max-w-4xl pointer-events-auto">
            <h2 className="text-primary font-medium mb-4 text-sm tracking-widest uppercase">
              Presales & Cybersecurity Strategy
            </h2>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight text-white">
              {content.name}
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl leading-relaxed font-light">
              Bridging the gap between complex security technologies and tangible business value.
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-primary text-slate-900 font-semibold rounded hover:bg-sky-300 transition-all shadow-lg shadow-primary/20"
              >
                Schedule Consultation
              </a>
              <a 
                href="#experience" 
                className="px-8 py-3 border border-slate-600 text-white rounded hover:bg-slate-800 transition-all"
              >
                View Portfolio
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-500">
          <ChevronDown size={24} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20">
        <Section id="about" title="Executive Profile">
          <ExecutiveProfile />
        </Section>

        <Section id="experience" title="Career Trajectory" className="bg-surface/30">
          <ExperienceTimeline />
        </Section>

        <Section id="skills" title="Technical Capabilities">
          <SkillHexGrid />
        </Section>

        <Section id="certifications" title="Accreditations" className="bg-surface/30">
          <Certifications />
        </Section>

        <Section id="contact" title="Connect">
          <ContactForm />
        </Section>

        <footer className="py-8 border-t border-slate-800 text-center text-slate-500 text-sm bg-background">
          <p>© {new Date().getFullYear()} Diksha Sharma. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
