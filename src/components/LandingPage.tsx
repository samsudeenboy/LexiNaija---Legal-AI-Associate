import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Scale, 
  FileText, 
  Gavel, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Lock, 
  ChevronRight,
  BrainCircuit,
  MessageSquare,
  Globe,
  Star,
  Library,
  PenTool
} from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-legal-gold/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-legal-gold w-6 h-6" />
            </div>
            <span className="text-xl font-serif font-black italic tracking-tighter uppercase">LexiNaija</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-legal-900 transition-colors">Intelligence</a>
            <a href="#suite" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-legal-900 transition-colors">The Suite</a>
            <a href="#pricing" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-legal-900 transition-colors">Practice Tiers</a>
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-legal-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[.2em] shadow-xl shadow-legal-900/20 hover:bg-legal-800 transition-all active:scale-95"
            >
              Initialize Session
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-legal-gold opacity-[0.03] blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-legal-gold/10 rounded-full border border-legal-gold/20 mb-8">
              <Zap size={14} className="text-legal-gold animate-pulse" />
              <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest">v2.5 Artificial Intelligence Now Live</span>
            </div>
            <h1 className="text-7xl md:text-8xl font-serif font-black text-legal-900 leading-[1.05] italic mb-8">
              The AI <span className="text-legal-gold not-italic">COO</span> <br />
              For Your Chambers.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mb-12">
              LexiNaija is the hyper-intelligent associate suite designed specifically for the Nigerian legal landscape. Automate research, draft high-fidelity briefs, and manage your practice with institutional precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-10 py-6 bg-legal-900 text-white rounded-2xl font-black uppercase tracking-[.2em] shadow-2xl shadow-legal-900/30 hover:bg-legal-800 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4"
              >
                Launch Associate Suite <ArrowRight size={18} />
              </button>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">LP</div>)}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Trusted by 200+</span>
                  <span className="text-xs font-bold text-legal-900">Nigerian Counsel</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-900 rounded-[40px] p-2 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 aspect-square overflow-hidden group">
              <div className="bg-legal-900 w-full h-full rounded-[38px] p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-legal-gold opacity-5 rounded-bl-full translate-x-10 -translate-y-10"></div>
                <div>
                  <div className="flex justify-between items-center mb-12">
                    <ShieldCheck className="text-legal-gold w-10 h-10" />
                    <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-legal-gold">SECURE PROTOCOL</div>
                  </div>
                  <h3 className="text-3xl font-serif font-black text-white italic mb-4 leading-tight italic">Intelligence <br /> Provisioning</h3>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-legal-gold animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                      <span>Analyzing Precedents</span>
                      <span>75%</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                  <p className="text-xs text-slate-400 italic">"Draft a Tenancy Agreement for a property in Lekki Phase 1 with a 10% maintenance clause."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-[10px] font-black text-legal-gold uppercase tracking-[.4em] mb-4">Core Intelligence</p>
            <h2 className="text-5xl font-serif font-black text-legal-900 italic">Engineered for the <span className="text-legal-gold not-italic">Nigerian Bar.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Scale, title: "Legal Research", desc: "Access deep insights on the Evidence Act, CAMA 2020, and Supreme Court rulings instantly." },
              { icon: PenTool, title: "Smart Drafter", desc: "Generate high-fidelity contracts, tenancy agreements, and court processes in seconds." },
              { icon: MessageSquare, title: "Brief Generator", desc: "Transform complex facts into structured IRAC-style briefs for superior court appearances." },
              { icon: ShieldCheck, title: "Conflict Check", desc: "Automated institutional scanning to identify potential conflicts of interest across your entire vault." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-10 rounded-[30px] border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-legal-900 group-hover:text-white transition-all duration-500">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-serif font-black text-legal-900 mb-4 italic">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Suite (Detailed Section) */}
      <section id="suite" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-legal-gold/10 rounded-full blur-3xl"></div>
                <div className="bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 p-8 space-y-6">
                  {[
                    { title: "Court Diary", meta: "DOCKET SYNC", icon: Calendar },
                    { title: "Client Portal", meta: "COLLABORATION", icon: Share2 },
                    { title: "Evidence Locker", meta: "VAULT STORAGE", icon: Archive }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl group cursor-pointer hover:bg-legal-900 hover:text-white transition-all duration-500">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-legal-gold shadow-sm">
                          <item.icon size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 group-hover:text-legal-gold uppercase tracking-widest mb-1 transition-colors">{item.meta}</p>
                          <p className="font-serif font-black text-lg italic tracking-tight">{item.title}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-200 group-hover:text-legal-gold" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <p className="text-[10px] font-black text-legal-gold uppercase tracking-[.4em] mb-4">Total Control</p>
              <h2 className="text-6xl font-serif font-black text-legal-900 leading-tight italic mb-8">
                Your Practice, <br />
                <span className="text-legal-gold not-italic">Symmetrically Balanced.</span>
              </h2>
              <div className="space-y-10">
                <div className="flex gap-8">
                  <div className="w-12 h-12 rounded-full bg-legal-gold/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-legal-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-black text-legal-900 italic mb-2">Institutional-Grade Organization</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">LexiNaija organizes every client, case, and document into a unified command center. No more searching through paper folders or email threads.</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="w-12 h-12 rounded-full bg-legal-gold/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-legal-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-black text-legal-900 italic mb-2">Automated Compliance</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">Stay ahead of statutory deadlines with automated reminders for annual returns, hearing dates, and task expirations.</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="w-12 h-12 rounded-full bg-legal-gold/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="text-legal-gold" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-serif font-black text-legal-900 italic mb-2">Seamless Payments</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">Built-in billing infrastructure allows you to generate professional invoices and collect professional fees via Paystack with one click.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-legal-900 rounded-[60px] p-20 text-white relative overflow-hidden shadow-[0_60px_100px_-20px_rgba(10,25,47,0.5)]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-legal-gold opacity-[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-serif font-black italic leading-tight mb-8">
              The Future of Nigerian Law is <span className="text-legal-gold not-italic">Agentic.</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium mb-12 leading-relaxed">
              Stop acting as your own secretary. Provision your AI Associate today and reclaim your billable hours.
            </p>
            <button 
              onClick={onGetStarted}
              className="px-12 py-6 bg-legal-gold text-legal-900 rounded-2xl font-black uppercase tracking-[.2em] shadow-2xl shadow-legal-gold/20 hover:bg-yellow-400 hover:scale-105 transition-all active:scale-95"
            >
              Get Started Now
            </button>
            <p className="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[.3em]">No credit card required for initial session</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-legal-gold w-6 h-6" />
            </div>
            <span className="text-xl font-serif font-black italic tracking-tighter uppercase">LexiNaija</span>
          </div>
          <div className="flex items-center gap-12">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-legal-900 transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-legal-900 transition-colors">Firm Licensing</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-legal-900 transition-colors">Security Ops</a>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 LexiNaija AI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Icons not in the main import
const Calendar = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>
);

const Share2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"></line><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"></line></svg>
);

const Archive = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"></rect><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path><path d="M10 12h4"></path></svg>
);
