import React, { useState, useRef, useEffect } from 'react';
import { content } from '../data';
import { Award, CheckCircle, Shield, Lock, Fingerprint, QrCode, Cpu, ShieldCheck } from 'lucide-react';

// Scramble Text Component for Cyber Effect
const ScrambleText = ({ text, hoverTrigger }: { text: string, hoverTrigger: boolean }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
  const intervalRef = useRef<any>(null);
  
  useEffect(() => {
    if (!hoverTrigger) {
      setDisplay(text);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    let iterations = 0;
    intervalRef.current = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) {
          return text[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));

      if (iterations >= text.length) clearInterval(intervalRef.current);
      iterations += 1 / 2; 
    }, 30);

    return () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hoverTrigger, text]);

  return <span>{display}</span>;
};

// 3D Tilt Card Component
const CredentialCard = ({ cert, index }: { cert: any, index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  // Deterministic pseudo-hash
  const pseudoHash = `0x${cert.id.toUpperCase()}${cert.issuer.substring(0,3).toUpperCase()}7F`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation based on mouse position relative to center
    const rotateX = ((y - centerY) / centerY) * -8; // Max -8 to 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      className="perspective-1000 h-full"
      style={{ perspective: '1000px' }}
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-full transition-transform duration-100 ease-out transform-gpu"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        }}
      >
        {/* Card Content - The "Vault" */}
        <div className="relative h-full bg-[#0b1221] rounded-2xl p-[1px] shadow-2xl ring-1 ring-white/5 overflow-hidden">
            
            {/* Animated Border Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 opacity-50 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r from-primary via-blue-600 to-primary opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-40' : ''}`} style={{ filter: 'blur(8px)' }}></div>

            <div className="relative h-full bg-[#0f172a] rounded-[15px] overflow-hidden flex flex-col backdrop-blur-sm">
               
               {/* Holographic Overlay / Glare */}
               <div 
                 className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
                 style={{
                   background: `radial-gradient(circle at ${50 + rotation.y * 5}% ${50 - rotation.x * 5}%, rgba(56, 189, 248, 0.15) 0%, transparent 60%)`,
                   opacity: isHovered ? 1 : 0
                 }}
               />

               {/* Background Tech Pattern */}
               <div className="absolute inset-0 opacity-20 pointer-events-none" 
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(56,189,248,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.1) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
                    }}>
               </div>

               {/* Header Status Bar */}
               <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-slate-800/50 bg-slate-900/50">
                 <div className="flex items-center gap-2">
                    <div className={`p-1 rounded bg-slate-800 transition-colors duration-300 ${isHovered ? 'bg-primary/20' : ''}`}>
                        <Shield size={12} className={`transition-colors duration-300 ${isHovered ? 'text-primary' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                        ASSET_{index + 101}
                    </span>
                 </div>
                 <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded text-[10px] font-bold uppercase tracking-wide transition-all duration-300 ${isHovered ? 'bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'bg-slate-800/50 border-slate-700 text-slate-500'}`}>
                    {isHovered ? (
                        <span className="flex items-center gap-1">
                            <CheckCircle size={10} /> VERIFIED
                        </span>
                    ) : (
                        <span className="flex items-center gap-1">
                            <Lock size={10} /> ENCRYPTED
                        </span>
                    )}
                 </div>
               </div>

               {/* Main Body */}
               <div className="relative z-10 p-6 flex-grow flex flex-col gap-6">
                 
                 {/* Floating Icon Container */}
                 <div className="relative w-max">
                    <div className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-all duration-500 ease-out ${isHovered ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(56,189,248,0.3)]' : 'bg-slate-800/30 border-slate-700'}`}>
                        <Award size={28} className={`transition-all duration-500 ${isHovered ? 'text-primary scale-110' : 'text-slate-400'}`} />
                    </div>
                    {/* Floating Particles/Decor */}
                    <div className={`absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 shadow-[0_0_8px_#38bdf8] scale-100' : 'opacity-0 scale-0'}`}></div>
                    <div className={`absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-400 rounded-full transition-all duration-300 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}></div>
                 </div>

                 <div className="space-y-3">
                   <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
                      <Cpu size={12} className={isHovered ? 'text-primary animate-[spin_4s_linear_infinite]' : ''} />
                      <span className="uppercase tracking-wider">Issuer Authority</span>
                   </div>
                   
                   <div className={`text-sm text-slate-300 font-medium border-l-2 pl-3 transition-colors duration-300 ${isHovered ? 'border-primary text-white' : 'border-slate-700'}`}>
                      {cert.issuer}
                   </div>
                   
                   <h3 className="text-lg font-bold text-white leading-tight min-h-[3.5rem] flex items-end pb-1 mt-2">
                     <ScrambleText text={cert.name} hoverTrigger={isHovered} />
                   </h3>
                 </div>
               </div>

               {/* Footer / Meta Data */}
               <div className="relative z-10 px-6 py-3 bg-slate-900/80 border-t border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600 transition-colors group-hover:text-primary/70">
                     <Fingerprint size={14} className={isHovered ? 'text-primary' : ''} />
                     <span className="text-[10px] font-mono tracking-wider opacity-70">{pseudoHash}</span>
                  </div>
                  <div className={`text-slate-700 transition-all duration-300 ${isHovered ? 'text-primary scale-110' : ''}`}>
                     <QrCode size={16} />
                  </div>
               </div>
               
               {/* Scan Line Animation */}
               <div 
                className={`absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#38bdf8] transition-opacity duration-300 pointer-events-none z-30 ${isHovered ? 'opacity-100 animate-scan' : 'opacity-0'}`}
               ></div>

            </div>
        </div>
      </div>
    </div>
  );
};

export const Certifications: React.FC = () => {
  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.certifications.map((cert, index) => (
          <CredentialCard key={cert.id} cert={cert} index={index} />
        ))}
      </div>
      
      {/* Styles for custom animations */}
      <style>{`
        .perspective-1000 {
            perspective: 1000px;
        }
        @keyframes scan {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
        }
        .animate-scan {
            animation: scan 2s linear infinite;
        }
      `}</style>
    </div>
  );
};
