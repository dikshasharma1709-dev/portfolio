import React, { useState, useEffect, useRef } from 'react';
import { content } from '../data';
import { Shield, Fingerprint } from 'lucide-react';

// Animated Counter Hook
const useCounter = (end: number, duration: number = 2000, start = 0) => {
    const [count, setCount] = useState(start);
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!inView) return;
        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(ease * (end - start) + start));
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }, [inView, end, duration, start]);

    return { count, ref };
};

export const ExecutiveProfile: React.FC = () => {
    // 3D Tilt State
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        // Limit tilt to 15 degrees
        setTilt({ x: y * -15, y: x * 15 });
    };

    const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

    // Counters
    const years = useCounter(4);
    const projects = useCounter(15);
    const dedication = useCounter(100);

    return (
        <div className="relative group perspective-container">
             {/* Dynamic Background Glow */}
             <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition duration-1000"></div>

             <div className="relative bg-[#0b1221]/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-12 overflow-hidden shadow-2xl">
                
                {/* Tech Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                <div className="grid lg:grid-cols-12 gap-12 items-center relative z-10">
                    
                    {/* Left Column: Holographic Avatar Card */}
                    <div className="lg:col-span-5 flex justify-center perspective-1000 py-4">
                        <div 
                            ref={cardRef}
                            className="relative w-72 h-96 transition-transform duration-100 ease-out transform-style-3d cursor-crosshair"
                            style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                        >
                             {/* Card Frame */}
                             <div className="absolute inset-0 bg-slate-900/90 border border-slate-600 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col">
                                
                                {/* Holographic Scanner */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#38bdf8] animate-[scan_3s_linear_infinite] z-30 opacity-70"></div>
                                
                                {/* Header */}
                                <div className="h-12 border-b border-slate-700 bg-slate-800/50 flex items-center justify-between px-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                        <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">ID_REF_8829</span>
                                </div>

                                {/* Main Visual */}
                                <div className="flex-1 relative flex items-center justify-center p-6 group-hover:bg-slate-800/30 transition-colors">
                                    <div className="relative w-40 h-40">
                                        {/* Spinning Rings */}
                                        <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                                        <div className="absolute inset-2 border border-t-transparent border-primary/40 rounded-full animate-[spin_8s_linear_infinite_reverse]"></div>
                                        <div className="absolute inset-6 border-2 border-dashed border-primary/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
                                        
                                        {/* Center Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse"></div>
                                                <Shield size={48} className="text-primary relative z-10" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Info */}
                                <div className="p-4 bg-slate-900/90 border-t border-slate-700 space-y-2">
                                    <div className="text-center">
                                        <h3 className="text-white font-bold text-lg tracking-wide">{content.name.toUpperCase()}</h3>
                                        <p className="text-primary text-[10px] font-mono tracking-[0.2em]">SECURE_ACCESS_GRANTED</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-2">
                                        {['STRATEGY', 'DEFENSE', 'ANALYSIS', 'COMPLIANCE'].map((attr, i) => (
                                            <div key={i} className="bg-primary/5 border border-primary/10 p-1 rounded text-[8px] text-center text-primary/80 font-mono font-semibold">
                                                {attr}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Right Column: Narrative & Metrics */}
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                             <div className="flex items-center gap-2 mb-4">
                                <Fingerprint className="text-primary animate-pulse" size={20} />
                                <span className="text-xs font-mono text-primary/80 tracking-[0.3em] uppercase">Identity_Verified_v2.0</span>
                             </div>
                             
                             <h3 className="text-3xl md:text-4xl font-light text-white mb-6 leading-tight">
                                Architecting <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-semibold animate-pulse">Resilient Futures</span> for Global Enterprise
                             </h3>
                             
                             <p className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
                                {content.summary}
                             </p>
                             
                             <div className="p-4 bg-slate-800/30 border-l-2 border-primary rounded-r-lg backdrop-blur-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-primary/5 -translate-x-full animate-[shimmer_2s_infinite]"></div>
                                <p className="text-slate-400 text-sm leading-relaxed relative z-10">
                                    My journey began with a Computer Science degree from Visvesvaraya Technological University, 
                                    evolving into a dedicated focus on securing enterprise infrastructures. I specialize in bridging the gap between
                                    technical complexity and business objectives.
                                </p>
                             </div>
                        </div>

                        {/* Animated Metrics Dashboard */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-700/50">
                             <MetricBox label="Years Active" value={years.count} suffix="+" refProp={years.ref} />
                             <MetricBox label="Projects Led" value={projects.count} suffix="+" refProp={projects.ref} />
                             <MetricBox label="Dedication" value={dedication.count} suffix="%" refProp={dedication.ref} isBar />
                        </div>
                    </div>

                </div>
             </div>
             
             <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
             `}</style>
        </div>
    );
};

const MetricBox = ({ label, value, suffix, refProp, isBar }: any) => (
    <div ref={refProp} className="relative p-4 rounded-lg bg-slate-800/20 border border-slate-700/50 hover:border-primary/30 transition-all group overflow-hidden">
        {isBar && (
            <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000 ease-out" style={{ width: `${value}%` }}></div>
        )}
        <div className="flex flex-col items-center sm:items-start relative z-10">
             <div className="text-3xl font-bold text-white mb-1 group-hover:text-primary transition-colors font-mono tracking-tighter">
                {value}{suffix}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                {label}
            </div>
        </div>
    </div>
);
