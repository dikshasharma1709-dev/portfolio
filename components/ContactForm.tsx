import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, Send, Lock, Wifi, Globe, Terminal, CheckCircle2, Cpu, Radio, ShieldCheck, Activity } from 'lucide-react';
import { content } from '../data';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'encrypting' | 'transmitting' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString('en-US', {hour12: false, fractionalSecondDigits: 2} as any)}] ${msg}`]);
  };

  const handleSubmit = async (e: React.FormEvent) => { // Added 'async'
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('encrypting');
    setLogs([]);
    addLog("INITIATING SECURE HANDSHAKE...");
    addLog("GENERATING RSA-4096 KEYS...");

    // 1. Prepare the form data for FormSubmit
    const formEndpoint = "https://formsubmit.co/ajax/aayansah17@gmail.com"; // <--- CHANGE THIS EMAIL!

    setTimeout(() => {
      setStatus('transmitting');
      addLog("ENCRYPTION COMPLETE.");
      addLog("ESTABLISHING UPLINK...");
      
      let p = 0;
      const interval = setInterval(async () => { // Added 'async'
        p += Math.random() * 5;
        if (p > 100) {
          p = 100;
          clearInterval(interval);
          
          // 2. Animation is done, now actually send the email
          addLog("UPLINK ESTABLISHED.");
          addLog("TRANSMITTING PAYLOAD...");

          try {
             const response = await fetch(formEndpoint, {
                 method: "POST",
                 headers: { 
                     'Content-Type': 'application/json',
                     'Accept': 'application/json'
                 },
                 body: JSON.stringify({
                     name: formData.name,
                     email: formData.email,
                     message: formData.message,
                     _subject: `New Mission Request from ${formData.name}` // Optional: Custom Subject
                 })
             });

             if (!response.ok) throw new Error("Transmission Failed");

             addLog("PAYLOAD DELIVERED.");
             
             setTimeout(() => {
               setStatus('success');
               setFormData({ name: '', email: '', message: '' });
               setTimeout(() => {
                   setStatus('idle');
                   setProgress(0);
                   setLogs([]);
               }, 4000);
             }, 800);

          } catch (error) {
              addLog("ERROR: CONNECTION REFUSED.");
              addLog("RETRYING...");
              setStatus('idle'); // Or handle error state
          }

        } else {
           if (Math.random() > 0.7) addLog(`UPLOADING PACKET ${(Math.random() * 9999).toFixed(0)}...`);
           setProgress(p);
        }
      }, 100);
    }, 1500);
  };

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Decorative Background Elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Main Container */}
      <div className="grid lg:grid-cols-5 gap-0 bg-[#0b1221] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5 relative">
        
        {/* Animated Border Overlay (Scanline) */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-2xl">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-full animate-[scan_4s_linear_infinite]"></div>
        </div>

        {/* Left Panel: Contact Intelligence */}
        <div className="lg:col-span-2 bg-slate-900/80 p-8 border-r border-slate-800 relative overflow-hidden backdrop-blur-sm">
          
          {/* Dynamic Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ 
                 backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(56, 189, 248, .3) 25%, rgba(56, 189, 248, .3) 26%, transparent 27%, transparent 74%, rgba(56, 189, 248, .3) 75%, rgba(56, 189, 248, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(56, 189, 248, .3) 25%, rgba(56, 189, 248, .3) 26%, transparent 27%, transparent 74%, rgba(56, 189, 248, .3) 75%, rgba(56, 189, 248, .3) 76%, transparent 77%, transparent)', 
                 backgroundSize: '50px 50px' 
               }}>
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2 text-primary font-mono text-xs tracking-widest uppercase">
                    <Globe size={14} className="animate-spin-slow" />
                    <span>NET_RELAY_V4</span>
                </div>
                <div className="flex gap-1">
                   <span className="w-1 h-1 bg-primary rounded-full animate-ping"></span>
                   <span className="w-1 h-1 bg-primary rounded-full"></span>
                </div>
              </div>

              <div className="mb-10 relative group cursor-default">
                 <h3 className="text-3xl font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">Initialize Contact</h3>
                 <div className="h-0.5 w-12 bg-primary rounded-full mb-6 group-hover:w-full transition-all duration-500 ease-out"></div>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   Secure channel open for consulting inquiries, speaking engagements, and strategic collaborations.
                 </p>
              </div>

              <div className="space-y-5">
                <ContactItem icon={Mail} label="Encrypted Mail" value={content.contact.email} href={`mailto:${content.contact.email}`} delay={0} />
                <ContactItem icon={Phone} label="Secure Line" value={content.contact.phone} delay={100} />
                <ContactItem icon={MapPin} label="Base of Operations" value={content.contact.location} delay={200} />
                {content.contact.linkedin && (
                   <ContactItem icon={Linkedin} label="Professional Network" value="LinkedIn Profile" href={content.contact.linkedin} delay={300} />
                )}
              </div>
            </div>

            {/* Radar & Status Module */}
            <div className="mt-12 pt-6 border-t border-slate-800 flex items-center justify-between">
               
               {/* Radar Viz */}
               <div className="relative w-16 h-16 rounded-full border border-slate-700 bg-slate-950 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle,rgba(56,189,248,0.2)_1px,transparent_1px)] bg-[length:4px_4px]"></div>
                  <div className="absolute w-full h-[1px] bg-slate-800/80"></div>
                  <div className="absolute h-full w-[1px] bg-slate-800/80"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-slate-800 rounded-full"></div>
                  <div className="absolute w-[50%] h-[50%] top-0 right-0 bg-gradient-to-t from-transparent via-primary/30 to-transparent origin-bottom-left animate-[spin_3s_linear_infinite] rounded-tr-full"></div>
                  <div className="absolute top-3 right-4 w-1 h-1 bg-green-400 rounded-full shadow-[0_0_8px_#4ade80] animate-pulse"></div>
               </div>

               <div className="flex flex-col items-end gap-1 text-[10px] font-mono text-slate-500 uppercase">
                  <div className="flex items-center gap-1.5 text-green-400">
                    <Activity size={12} />
                    <span>System Nominal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck size={12} />
                    <span>Firewall Active</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Cpu size={12} />
                    <span>Latency: 12ms</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Transmission Interface */}
        <div className="lg:col-span-3 bg-[#0f172a] p-8 lg:p-12 relative">
           
           {/* Transmission Overlay */}
           {status !== 'idle' && (
             <div className="absolute inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 transition-all duration-500">
                
                {status === 'success' ? (
                  <div className="text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 size={48} className="text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">TRANSMISSION SUCCESSFUL</h3>
                    <p className="text-slate-400 font-mono text-sm">Target received payload. Stand by for response.</p>
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-6">
                    {/* Progress Circle & Status */}
                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                         <div className="w-20 h-20 border-4 border-slate-800 rounded-full animate-[spin_3s_linear_infinite]"></div>
                         <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-[spin_1.5s_linear_infinite]"></div>
                         <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-primary">
                            {progress.toFixed(0)}%
                         </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mt-6 animate-pulse">
                        {status === 'encrypting' ? 'ENCRYPTING DATA...' : 'TRANSMITTING TO SERVER...'}
                      </h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className="h-full bg-primary shadow-[0_0_15px_#38bdf8] transition-all duration-100 ease-out relative overflow-hidden" 
                        style={{ width: `${progress}%` }}
                      >
                         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:20px_20px] animate-[pulse_1s_linear_infinite]"></div>
                      </div>
                    </div>

                    {/* Terminal Output */}
                    <div className="bg-black/50 border border-slate-800 rounded-lg p-4 font-mono text-xs text-green-400 h-32 overflow-hidden relative shadow-inner">
                       <div className="absolute top-2 right-2 flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                       </div>
                       <div ref={logContainerRef} className="h-full overflow-y-auto scrollbar-hide space-y-1">
                          {logs.map((log, i) => (
                            <div key={i} className="opacity-80 border-l-2 border-green-500/30 pl-2">{log}</div>
                          ))}
                          <div className="animate-pulse">_</div>
                       </div>
                    </div>
                  </div>
                )}
             </div>
           )}

           {/* Header HUD */}
           <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800/50">
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={18} />
                <span className="text-sm font-mono">/usr/bin/secure_uplink</span>
              </div>
              <div className="flex gap-2 items-center text-xs font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                 <Wifi size={12} className="text-primary" />
                 <span>SIGNAL: STRONG</span>
              </div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup id="name" label="Identity" value={formData.name} onChange={(e: any) => setFormData({...formData, name: e.target.value})} placeholder="ENTER NAME" delay={0} />
                <InputGroup id="email" label="Return Address" value={formData.email} onChange={(e: any) => setFormData({...formData, email: e.target.value})} placeholder="ENTER EMAIL" type="email" delay={100} />
              </div>
              
              <div className="group relative animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-backwards">
                <label htmlFor="message" className="block text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-2 font-mono flex justify-between">
                  <span>Transmission Packet</span>
                  <span className="text-slate-600">MAX: 4096 BYTES</span>
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-[#0b1221] border border-slate-700 rounded-lg p-4 text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#0f172a] outline-none transition-all resize-none placeholder-slate-700 font-mono text-sm relative z-10"
                    placeholder="> INPUT MESSAGE SEQUENCE..."
                  ></textarea>
                  {/* Decor corners */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-600 group-focus-within:border-primary transition-colors z-20"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-600 group-focus-within:border-primary transition-colors z-20"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono uppercase">
                   <Lock size={10} />
                   <span>End-to-End Encrypted</span>
                </div>
                
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className={`
                    relative overflow-hidden group flex items-center gap-3 px-8 py-3 rounded bg-primary text-slate-900 font-bold tracking-wide transition-all
                    hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:bg-sky-300 disabled:opacity-70 disabled:cursor-not-allowed
                  `}
                >
                   <span className="relative z-10 flex items-center gap-2">
                     INITIATE UPLINK <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                   </span>
                   {/* Button Glitch/Scan Effect */}
                   <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700"></div>
                </button>
              </div>
           </form>
        </div>

      </div>
      
      {/* CSS for custom animations (Scanning Line, etc) */}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(500%); }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

const ContactItem = ({ icon: Icon, label, value, href, delay }: { icon: any, label: string, value: string, href?: string, delay: number }) => (
  <a 
    href={href} 
    className={`
      flex items-start gap-4 p-3 rounded-lg border border-transparent transition-all duration-300
      animate-in fade-in slide-in-from-left-4 fill-mode-backwards
      ${href ? 'hover:bg-slate-800 hover:border-slate-700 cursor-pointer group' : ''}
    `}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`p-2.5 rounded-md bg-slate-800 text-slate-400 ${href ? 'group-hover:text-primary group-hover:bg-slate-700' : ''} transition-colors border border-slate-700/50`}>
      <Icon size={18} />
    </div>
    <div>
      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-2">
        {label}
        {href && <div className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>}
      </div>
      <div className={`text-sm font-medium text-slate-200 ${href ? 'group-hover:text-white' : ''} transition-colors font-mono`}>{value}</div>
    </div>
  </a>
);

const InputGroup = ({ id, label, value, onChange, placeholder, type = "text", delay }: any) => (
  <div className="group animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards" style={{ animationDelay: `${delay}ms` }}>
    <label htmlFor={id} className="block text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-2 font-mono">
      {label}
    </label>
    <div className="relative">
       <input
        type={type}
        id={id}
        required
        value={value}
        onChange={onChange}
        className="w-full bg-[#0b1221] border border-slate-700 rounded h-12 px-4 text-slate-300 focus:border-primary focus:ring-1 focus:ring-primary focus:bg-[#0f172a] outline-none transition-all placeholder-slate-700 font-mono text-sm"
        placeholder={placeholder}
      />
      {/* Active Indicator */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-slate-700 group-focus-within:bg-primary transition-colors shadow-[0_0_5px_transparent] group-focus-within:shadow-[0_0_5px_#38bdf8]"></div>
    </div>
  </div>
);
