import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ShieldCheck, Mail, Lock, Loader2, Gavel, Scale, Info } from 'lucide-react';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Verification email sent! Please check your inbox to confirm your chambers account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans overflow-hidden">
      {/* Visual Side */}
      <div className="hidden lg:flex flex-col bg-legal-900 p-20 relative overflow-hidden group">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-legal-gold opacity-[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-400 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-legal-gold opacity-[0.02] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-20">
                <div className="w-12 h-12 bg-legal-gold rounded-2xl flex items-center justify-center shadow-2xl shadow-legal-gold/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <ShieldCheck className="text-legal-900 w-8 h-8" />
                </div>
                <h1 className="text-4xl font-serif font-black text-white tracking-tight italic uppercase">LexiNaija</h1>
            </div>

            <div className="mt-auto max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-legal-gold text-legal-900 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-xl shadow-legal-gold/10">
                    <Scale size={12} /> The Digital Chambers
                </div>
                <h2 className="text-6xl font-serif font-black text-white leading-[1.1] mb-8">
                    Empowering the <span className="text-legal-gold underline decoration-legal-gold/20 underline-offset-8">Future</span> of Nigerian Law.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Automate your practice with AI-powered drafting, secure case management, and authoritative law reports. Built for the modern legal practitioner.
                </p>
                
                <div className="grid grid-cols-2 gap-8 mt-16 pt-16 border-t border-white/5">
                    <div>
                        <p className="text-white text-3xl font-serif font-black mb-1">2,500+</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verified Precedents</p>
                    </div>
                    <div>
                        <p className="text-white text-3xl font-serif font-black mb-1">100%</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Multi-Tenancy</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer Brand */}
        <div className="relative z-10 flex items-center gap-3 mt-12 opacity-30 group-hover:opacity-100 transition-opacity">
            <div className="w-6 h-6 border-2 border-slate-500 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-bold">L</span>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[.4em]">Proprietary Technology</span>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 relative bg-slate-50/50">
        <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center gap-3 mb-12">
                <div className="w-8 h-8 bg-legal-900 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="text-legal-gold w-5 h-5" />
                </div>
                <h1 className="text-2xl font-serif font-black text-legal-900 tracking-tighter uppercase italic">LexiNaija</h1>
            </div>

            <div className="mb-12">
                <h3 className="text-4xl font-serif font-black text-legal-900 mb-4">{isSignUp ? 'Onboard Chambers' : 'Welcome Counsel'}</h3>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                    {isSignUp ? 'Secure Cloud Infrastructure' : 'Authentication Required'}
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span className="text-legal-gold">Enterprise Grade</span>
                </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Practice Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-legal-gold transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200"
                                placeholder="counsel@firm.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 group-focus-within:text-legal-gold transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 shadow-sm rounded-2xl focus:ring-4 focus:ring-legal-gold/5 focus:border-legal-gold outline-none transition-all font-bold text-slate-900 placeholder:text-slate-200"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-slate-100/50 p-4 rounded-2xl flex items-start gap-3 mb-8">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-wider">
                        By proceeding, you agree that your data is stored in a multi-tenant vault protected by Row Level Security (RLS).
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-legal-900 text-white rounded-2xl font-black uppercase tracking-[.2em] shadow-2xl shadow-legal-900/20 hover:bg-legal-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin text-legal-gold" /> : (isSignUp ? 'Initialize Access' : 'Authenticate')}
                </button>
            </form>

            <div className="mt-12 pt-12 border-t border-slate-100 text-center">
                <p className="text-slate-400 text-sm font-bold">
                    {isSignUp ? 'Already registered?' : 'New Chambers?'}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="ml-2 text-legal-gold hover:underline font-black uppercase tracking-widest text-[10px]"
                    >
                        {isSignUp ? 'Login' : 'Create Account'}
                    </button>
                </p>
            </div>
        </div>

        <div className="absolute bottom-12 text-[10px] font-black text-slate-200 uppercase tracking-widest">
            Protocol v2.1.0 • TLS 1.3 Encryption
        </div>
      </div>
    </div>
  );
};
