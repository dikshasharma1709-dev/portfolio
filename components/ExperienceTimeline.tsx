import React, { useEffect, useRef, useState } from 'react';
import { content } from '../data';
import { Briefcase, Calendar, Terminal, Hash, ChevronRight } from 'lucide-react';

// Simple Intersection Observer Hook for scroll animations
const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect(); // Trigger once
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isInView] as const;
};

export const ExperienceTimeline: React.FC = () => {
  return (
    <div className="relative container mx-auto px-4 py-16 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 w-[1px] h-full bg-slate-800"></div>
      
      {/* Animated Data Stream (Central Line) */}
      <div className="absolute top-0 left-4 md:left-1/2 -translate-x-1/2 w-[2px] h-full overflow-hidden z-0">
          <div className="w-full h-[50%] bg-gradient-to-b from-transparent via-primary to-transparent animate-stream opacity-50"></div>
      </div>

      <div className="space-y-24 relative z-10">
        {content.experience.map((job, index) => (
          <TimelineItem key={job.id} job={job} index={index} />
        ))}
      </div>
      
      <style>{`
        @keyframes stream {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(200%); }
        }
        .animate-stream {
            animation: stream 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

const TimelineItem = ({ job, index }: { job: any, index: number }) => {
  const isEven = index % 2 === 0;
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
        ref={ref as any}
        className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''} transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
    >
        {/* Spacer for layout balance */}
        <div className="hidden md:block w-1/2" />

        {/* Central Node */}
        <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-20">
            <div className={`
                relative flex items-center justify-center w-12 h-12 rounded-full border-2 bg-[#0f172a] transition-all duration-700 delay-100
                ${isInView ? 'scale-100 border-primary shadow-[0_0_20px_rgba(56,189,248,0.5)]' : 'scale-0 border-slate-700'}
            `}>
                <div className="absolute inset-0 rounded-full border border-primary opacity-50 animate-ping"></div>
                <Briefcase size={20} className="text-primary relative z-10" />
            </div>
        </div>

        {/* Connecting Line (Desktop) */}
        <div 
            className={`
                hidden md:block absolute top-1/2 h-[2px] bg-gradient-to-r from-primary to-primary/10 transition-all duration-1000 delay-300 origin-center
                ${isEven ? 'left-1/2 -translate-x-full origin-right' : 'left-1/2 origin-left'}
                ${isInView ? 'w-12 opacity-100' : 'w-0 opacity-0'}
            `}
        />

        {/* Content Card */}
        <div 
            className={`
                w-full md:w-1/2 pl-12 md:pl-0 
                ${isEven ? 'md:pr-16' : 'md:pl-16'}
                transform transition-all duration-1000 ease-out delay-200
                ${isInView ? 'translate-x-0 opacity-100' : isEven ? '-translate-x-10 opacity-0' : 'translate-x-10 opacity-0'}
            `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative group perspective-1000">
                {/* Card Container */}
                <div className={`
                    relative bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-6 md:p-8 overflow-hidden transition-all duration-300
                    hover:border-primary/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]
                    ${isHovered ? '-translate-y-1' : ''}
                `}>
                    
                    {/* Background Grid Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" 
                        style={{ 
                            backgroundImage: 'linear-gradient(rgba(56,189,248,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.3) 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}>
                    </div>

                    {/* Animated Gradient Bar Top */}
                    <div className={`absolute top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-blue-500 to-primary transition-all duration-700 ${isHovered ? 'w-full' : 'w-0'}`}></div>

                    {/* Header: Date & Meta */}
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 border-b border-slate-800 pb-4 relative z-10">
                        <div className="flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold tracking-wider">
                            <Calendar size={12} />
                            <span>{job.period}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 uppercase tracking-widest">
                             <Hash size={10} />
                             <span>LOG_ENTRY_00{content.experience.length - index}</span>
                        </div>
                    </div>

                    {/* Main Role & Company */}
                    <div className="mb-6 relative z-10">
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                            {job.role}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <Terminal size={14} className="text-slate-500" />
                            <span className="text-slate-300">{job.company}</span>
                            <ChevronRight size={14} className={`text-primary transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                        </div>
                    </div>

                    {/* Description List */}
                    <ul className="space-y-3 relative z-10">
                        {job.description.map((desc: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-sm bg-primary/50 group-hover:bg-primary transition-colors rotate-45 shrink-0"></span>
                                {desc}
                            </li>
                        ))}
                    </ul>

                    {/* Decoration: Corner Bracket */}
                    <div className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-slate-700 transition-colors duration-300 ${isHovered ? 'border-primary' : ''}`}></div>
                </div>
                
                {/* Behind-card Glow Element */}
                <div className={`absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-xl blur-lg opacity-0 transition-opacity duration-500 -z-10 ${isHovered ? 'opacity-10' : ''}`}></div>
            </div>
        </div>
    </div>
  );
};
