import React, { useState, useEffect } from 'react';
import { content } from '../data';
import { Skill3DCloud } from './Skill3DCloud';
import { Cpu, Shield, Database, Terminal, Globe, Users, Server, Zap, LayoutGrid, Code, Lock, Activity, Radio, BarChart3 } from 'lucide-react';

export const SkillHexGrid: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'tech' | 'tool'>('all');
  const [animating, setAnimating] = useState(false);

  const categories = [
    { id: 'all', label: 'SYSTEM_ALL', icon: LayoutGrid },
    { id: 'core', label: 'STRAT_CORE', icon: Cpu },
    { id: 'tech', label: 'SEC_STACK', icon: Shield },
    { id: 'tool', label: 'OPS_TOOLS', icon: Database },
  ];

  const filteredSkills = content.skills.filter(s => activeCategory === 'all' || s.category === activeCategory);

  const handleCategoryChange = (cat: any) => {
    if (cat === activeCategory) return;
    setAnimating(true);
    setActiveCategory(cat);
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div className="flex flex-col gap-16">
      
      {/* 3D Visualization Module */}
      <div className="relative group perspective-1000">
         <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-1000"></div>
         
         {/* Decorative 'Scanner' Bar */}
         <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 z-20"></div>
         
         <div className="relative bg-[#0b1221] rounded-xl border border-slate-800 overflow-hidden shadow-2xl ring-1 ring-white/5 transition-all duration-500 group-hover:border-primary/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.05),transparent_60%)]"></div>
            
            {/* Header Interface */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm relative z-10">
               <div className="flex items-center gap-3">
                 <Globe size={16} className="text-primary animate-pulse" />
                 <span className="text-xs font-mono text-slate-300 tracking-widest">KNOWLEDGE_GRAPH_VISUALIZER</span>
               </div>
               <div className="flex gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-slate-700 animate-pulse delay-75"></div>
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse delay-150"></div>
               </div>
            </div>

            <div className="relative z-10">
                <Skill3DCloud />
            </div>
            
            {/* Footer Interface */}
             <div className="absolute bottom-0 w-full px-6 py-3 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm flex justify-between text-[10px] font-mono text-slate-500 uppercase z-10">
                <div className="flex items-center gap-2">
                    <Activity size={10} />
                    <span>Rendering: WebGL</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    <span>Status: Active</span>
                </div>
             </div>

             {/* Background Grid Animation */}
             <div className="absolute inset-0 z-0 opacity-10" 
                style={{ backgroundImage: 'linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
             </div>
         </div>
      </div>

      {/* Capabilities Matrix Control Deck */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60 relative">
           <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Capabilities Matrix
                <span className="text-primary animate-pulse text-xs font-mono px-2 py-0.5 rounded bg-primary/10 border border-primary/20">LIVE</span>
              </h3>
              <p className="text-slate-400 text-sm font-light">Select a subsystem to filter operational capabilities.</p>
           </div>
           
           {/* HUD Tabs */}
           <div className="flex bg-slate-900/80 p-1 rounded-lg border border-slate-800 relative backdrop-blur-md">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`
                    relative z-10 flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold font-mono tracking-wider transition-all duration-300
                    ${activeCategory === cat.id 
                      ? 'text-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.4)]' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                    }
                  `}
                >
                  <cat.icon size={14} className={activeCategory === cat.id ? 'animate-[spin_1s_ease-out]' : ''} />
                  <span className="hidden sm:inline">{cat.label}</span>
                  {activeCategory === cat.id && (
                     <div className="absolute inset-0 bg-primary rounded-md -z-10 animate-in zoom-in duration-300"></div>
                  )}
                </button>
              ))}
           </div>
        </div>

        {/* The Matrix Grid */}
        <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSkills.map((skill, idx) => (
             <SkillCard key={`${skill.name}-${idx}`} skill={skill} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const SkillCard = ({ skill, index }: { skill: any, index: number }) => {
    const isCore = skill.category === 'core';
    const isTech = skill.category === 'tech';

    const getIcon = () => {
        if (isCore) return Zap;
        if (isTech) return Shield;
        return Terminal;
    };

    const Icon = getIcon();

    // Randomize "load" for visual variety
    const loadLevel = isCore ? 90 + (index % 10) : isTech ? 80 + (index % 15) : 70 + (index % 20);

    return (
        <div 
            className={`
                group relative bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden
                hover:bg-slate-800/60 hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(56,189,248,0.1)]
                animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards
                ${isCore ? 'md:col-span-2' : ''}
            `}
            style={{ animationDelay: `${index * 50}ms` }}
        >
            {/* Hover Scan Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] z-0"></div>

            {/* Content */}
            <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className={`
                        p-2.5 rounded-lg border border-slate-700/50 transition-all duration-500 group-hover:scale-110
                        ${isCore ? 'bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:border-blue-400/50' : 
                          isTech ? 'bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 group-hover:border-amber-400/50' : 
                          'bg-slate-700/30 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-white'}
                    `}>
                        <Icon size={isCore ? 20 : 18} className={isCore ? 'group-hover:animate-pulse' : ''} />
                    </div>
                    
                    <div className="flex flex-col items-end">
                         <div className="flex gap-0.5">
                            {[1,2,3].map(i => (
                                <div key={i} className={`w-1 h-1 rounded-full ${i===3 ? 'bg-slate-700' : 'bg-primary'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                            ))}
                         </div>
                         <span className="text-[9px] font-mono text-slate-600 mt-1 uppercase tracking-wider group-hover:text-primary/70 transition-colors">
                            SYS_RDY
                         </span>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                    <h4 className={`font-bold text-slate-200 group-hover:text-white transition-colors tracking-tight ${isCore ? 'text-lg' : 'text-sm'}`}>
                        {skill.name}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                        {skill.category.toUpperCase()} MODULE
                    </span>
                </div>

                {/* Load Bar / Footer */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase">
                        <span>Proficiency</span>
                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">{loadLevel}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out w-0 group-hover:w-[var(--load-width)] relative
                                ${isCore ? 'bg-blue-500' : isTech ? 'bg-amber-500' : 'bg-slate-400'}
                            `}
                            style={{ '--load-width': `${loadLevel}%` } as any}
                        >
                            {/* Animated Glint inside bar */}
                            <div className="absolute inset-0 bg-white/30 w-full -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                        </div>
                    </div>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 border-t border-r border-primary"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 border-b border-l border-primary"></div>
                </div>

            </div>
            
            <style>{`
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
};
