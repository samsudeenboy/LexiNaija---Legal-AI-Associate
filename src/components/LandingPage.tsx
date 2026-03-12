import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Scale, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  MessageSquare,
  PenTool,
  Calendar,
  Share2,
  Archive,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#fafafa] text-slate-900 font-sans selection:bg-legal-gold/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-legal-gold w-6 h-6" />
            </div>
            <span className="text-2xl font-serif font-black italic tracking-tighter uppercase text-legal-900">LexiNaija</span>
          </div>
          <div className="hidden md:flex items-center gap-10 bg-white/50 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 shadow-sm">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-legal-900 transition-colors">Intelligence</a>
            <a href="#suite" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-legal-900 transition-colors">The Vault</a>
            <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-legal-900 transition-colors">Tiers</a>
          </div>
          <div>
            <button 
              onClick={onGetStarted}
              className="px-8 py-4 bg-legal-900 text-white rounded-full text-[10px] font-black uppercase tracking-[.2em] shadow-[0_10px_40px_-10px_rgba(26,35,46,0.5)] hover:bg-legal-gold hover:text-legal-900 transition-all active:scale-95 flex items-center gap-2 group"
            >
              Access System <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm mb-8 animate-in slide-in-from-bottom flex-wrap">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-legal-gold/20 text-legal-gold">
                  <Zap size={12} className="animate-pulse" />
                </span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">LexiNaija Pro OS is Live</span>
                <div className="w-px h-3 bg-slate-300 mx-2 hidden sm:block"></div>
                <span className="text-[10px] font-bold text-legal-gold uppercase tracking-widest hidden sm:inline">Agentic capabilities engaged</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-[85px] font-serif font-black text-legal-900 leading-[0.95] tracking-tighter mb-8 animate-in slide-in-from-bottom delay-100">
                The <span className="text-legal-gold italic">Digital</span><br />
                Associate <br />
                For Legal Pros.
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-lg mb-10 animate-in slide-in-from-bottom delay-200">
                Automate drafting, accelerate research, and manage your chambers with institutional precision. The definitive AI Operating System for the Nigerian legal landscape.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-bottom delay-300">
                <button 
                  onClick={onGetStarted}
                  className="w-full sm:w-auto px-10 py-5 bg-legal-900 text-white rounded-full font-black uppercase tracking-[.2em] text-[11px] shadow-2xl hover:bg-legal-gold hover:text-legal-900 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                  Deploy AI Associate
                </button>
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-legal-900 border border-slate-200 rounded-full font-black uppercase tracking-[.2em] text-[11px] hover:border-legal-900 transition-all flex items-center justify-center gap-3 group">
                  <Play size={14} className="group-hover:text-legal-gold transition-colors" /> Watch Demo
                </button>
              </div>
            </div>

            {/* Right Images */}
            <div className="relative z-10 animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-legal-gold/20 rounded-full blur-[100px] -z-10"></div>
              
              <div className="relative rounded-[40px] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200" 
                  alt="Legal scale" 
                  className="w-full object-cover aspect-[4/5] group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-legal-900/80 via-transparent to-transparent"></div>
                
                {/* Floating Glass Widget */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-legal-gold flex items-center justify-center shrink-0">
                      <Zap size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] text-legal-gold font-black uppercase tracking-widest mb-1">AI Action Running</p>
                      <p className="text-white font-bold text-sm">Drafting Statement of Claim...</p>
                    </div>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-legal-gold w-2/3 h-full rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Secondary Floating Image */}
              <div className="absolute -bottom-10 -left-10 w-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white hidden md:block animate-bounce-slow bg-white">
                <img 
                   src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600" 
                   alt="Document review" 
                   className="w-full object-cover aspect-video"
                />
                <div className="p-4 bg-white border-t border-slate-100">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Insight Captured</p>
                   <p className="text-sm font-bold text-legal-900">Clause 4(a) contradicts the initial plea.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-slate-200 bg-white overflow-hidden relative">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
        <div className="flex gap-16 items-center whitespace-nowrap animate-marquee">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
               <ShieldCheck size={28} className="text-legal-900" />
               <span className="text-2xl font-serif font-black italic tracking-tighter text-legal-900">Partner Firm {i}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 px-6 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[10px] font-black text-legal-gold uppercase tracking-widest px-4 py-1 border border-legal-gold/30 rounded-full bg-legal-gold/5 mb-6 inline-block">App Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black text-legal-900 italic tracking-tighter leading-tight">Everything a modern firm needs, integrated into one core.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Item 1 */}
            <div className="md:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-legal-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10 w-full md:w-2/3">
                <div className="w-14 h-14 bg-legal-gold/10 text-legal-gold rounded-2xl flex items-center justify-center mb-6">
                  <PenTool size={24} />
                </div>
                <h3 className="text-3xl font-serif font-black text-legal-900 mb-4 tracking-tight">AI Drafting Engine</h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-8">Generate high-fidelity contracts, tenancy agreements, and court processes. LexiNaija adapts strictly to Nigerian forms and precedents instantly.</p>
                <button className="text-[10px] font-black uppercase tracking-widest text-legal-900 flex items-center gap-2 group/btn">
                  Explore Capabilities <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800" alt="Office" className="hidden md:block absolute right-0 bottom-0 w-1/2 object-cover rounded-tl-[40px] border-t-8 border-l-8 border-white shadow-2xl translate-y-8 translate-x-8 group-hover:translate-y-4 transition-transform duration-700 h-full" />
            </div>

            {/* Bento Item 2 */}
            <div className="bg-legal-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
              <div className="w-14 h-14 bg-white/10 text-legal-gold rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                <Scale size={24} />
              </div>
              <h3 className="text-3xl font-serif font-black mb-4 tracking-tight italic">Deep Law Research</h3>
              <p className="text-slate-400 leading-relaxed font-medium mb-8">Instant insights into the Evidence Act, CAMA 2020, and Supreme court rulings.</p>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-legal-gold opacity-20 blur-[50px]"></div>
            </div>

            {/* Bento Item 3 */}
            <div className="bg-slate-200 rounded-[40px] p-10 relative overflow-hidden group">
              <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=600" alt="Meeting" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-1000" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white text-legal-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-3xl font-serif font-black text-legal-900 mb-4 tracking-tight">Conflict Detection</h3>
                <p className="text-legal-900/70 font-bold leading-relaxed">Automated scan of adverse parties.</p>
              </div>
            </div>

            {/* Bento Item 4 */}
            <div className="md:col-span-2 bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex flex-col md:flex-row gap-10 items-center h-full">
                  <div className="flex-1">
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                      <FileText size={24} />
                    </div>
                    <h3 className="text-3xl font-serif font-black text-legal-900 mb-4 tracking-tight italic">Automated Billing</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">Generate LPRO compliant Fee Notes instantly, track retainers, and calculate your firm's total active revenue.</p>
                  </div>
                  <div className="flex-1 w-full bg-slate-50 rounded-[30px] p-6 border border-slate-100">
                     <div className="space-y-4">
                        {[1, 2].map(i => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-50">
                             <div>
                               <div className="w-20 h-2 bg-slate-200 rounded-full mb-2"></div>
                               <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                             </div>
                             <div className="text-emerald-500 font-black">₦{i * 150},000</div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2000" alt="Office Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-legal-900/95 backdrop-blur-sm"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center text-white">
          <ShieldCheck className="w-20 h-20 text-legal-gold mx-auto mb-8" />
          <h2 className="text-5xl md:text-7xl font-serif font-black italic leading-tight mb-8">
            The Future of Nigerian Law is <span className="text-legal-gold not-italic">Agentic.</span>
          </h2>
          <p className="text-xl text-slate-300 font-medium mb-12 leading-relaxed max-w-2xl mx-auto">
            Stop acting as your own secretary. Provision your AI Associate today and reclaim your billable hours.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-12 py-6 bg-legal-gold text-legal-900 rounded-full font-black uppercase tracking-[.2em] shadow-2xl shadow-legal-gold/20 hover:bg-white hover:-translate-y-1 transition-all active:scale-95"
            >
              Get Started Now
            </button>
            <button 
              className="w-full sm:w-auto px-12 py-6 bg-white/10 text-white border border-white/20 rounded-full font-black uppercase tracking-[.2em] hover:bg-white/20 transition-all font-medium"
            >
              Consult Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-legal-950 py-16 px-6 relative z-10 border-t border-legal-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-900 rounded-xl flex items-center justify-center border border-white/10">
              <ShieldCheck className="text-legal-gold w-6 h-6" />
            </div>
            <span className="text-xl font-serif font-black italic tracking-tighter uppercase text-white">LexiNaija</span>
          </div>
          <div className="flex items-center gap-12 text-white/70">
            <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Privacy Protocol</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Firm Licensing</a>
            <a href="#" className="text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">Security Ops</a>
          </div>
          <p className="text-[10px] font-black text-white/50 uppercase tracking-widest">© 2026 LexiNaija AI. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Tailwind specific custom animations mapped in global css or class based */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 30s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
