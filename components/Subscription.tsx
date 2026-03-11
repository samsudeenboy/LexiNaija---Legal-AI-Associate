import React, { useState } from 'react';
import { CreditCard, Zap, Check, ShieldCheck, ArrowRight, Star, Building2, User, HelpCircle } from 'lucide-react';
import { usePaystackPayment } from '../services/paystackService';
import { useLegalStore } from '../contexts/LegalStoreContext';

interface PricingPlan {
  name: string;
  price: number;
  label: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  credits: string;
  id: string;
}

const PLANS: PricingPlan[] = [
  {
    id: 'solo',
    name: 'Solo Practitioner',
    price: 15000,
    label: '₦15,000',
    period: '/month',
    description: 'Perfect for independent lawyers starting their digital practice.',
    credits: '500 AI Credits',
    features: [
      'Single User Access',
      'Unlimited Case Files',
      'Smart Contract Drafter',
      'Basic Legal Research',
      'PWA Mobile Installation',
      'Local Storage Sync'
    ],
    cta: 'Initialize Solo Plan'
  },
  {
    id: 'chambers',
    name: 'Chambers Pro',
    price: 45000,
    label: '₦45,000',
    period: '/month',
    description: 'Designed for small to medium law firms building an empire.',
    credits: '2,000 AI Credits',
    highlighted: true,
    features: [
      'Up to 5 User Accounts',
      'Real-time Collaboration',
      'Advanced IRAC Brief Generator',
      'Full Precedents Library',
      'Custom Letterhead Invoicing',
      'Priority Email Support',
      'Cloud Backup & Sync'
    ],
    cta: 'Scale Your Chambers'
  },
  {
    id: 'enterprise',
    name: 'Enterprise / SAN',
    price: 0,
    label: 'Custom',
    period: '',
    description: 'Scalable solutions for large firms and Senior Advocates.',
    credits: 'Unlimited AI Usage',
    features: [
      'Unlimited User Accounts',
      'White-label Brand Portal',
      'Dedicated Account Manager',
      'On-premise AI Integration',
      'Custom Document Automation',
      '24/7 Phone Support',
      'API Access'
    ],
    cta: 'Contact Strategic Sales'
  }
];

export const Subscription: React.FC = () => {
  const { firmProfile, addCredits } = useLegalStore();
  const { initializePayment } = usePaystackPayment();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = (plan: PricingPlan) => {
    if (plan.price === 0) {
        window.location.href = `mailto:sales@lexinaija.com?subject=Enterprise Inquiry from ${firmProfile.name}`;
        return;
    }

    setLoading(plan.id);
    initializePayment({
        amount: plan.price,
        email: firmProfile.email || 'counsel@lexinaija.com',
        planName: plan.name,
        onSuccess: (ref) => {
            setLoading(null);
            alert(`Payment Successful! Ref: ${ref}. Plan ${plan.name} is now active.`);
            // Credits would be added based on plan
            const creditMap: Record<string, number> = { 'solo': 500, 'chambers': 2000 };
            addCredits(creditMap[plan.id] || 0);
        },
        onClose: () => {
            setLoading(null);
        }
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-24 px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-24 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-legal-gold opacity-[0.03] blur-[120px] rounded-full"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[.5em] mb-6 relative z-10">Revenue Protocol</p>
            <h2 className="text-6xl font-serif font-black text-legal-900 mb-6 italic relative z-10">Select Your <span className="text-legal-gold not-italic">Practice Tier.</span></h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium relative z-10">
                Unlock the full power of LexiNaija. Secure, scalable, and built specifically for the Nigerian legal ecosystem.
            </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`group bg-white rounded-[40px] p-12 border border-slate-100 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] relative flex flex-col h-full overflow-hidden ${
                plan.highlighted ? 'lg:py-20 ring-1 ring-legal-gold/20 shadow-2xl shadow-legal-gold/5' : ''
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 right-0 p-8">
                    <Star className="text-legal-gold fill-current w-6 h-6 animate-pulse" />
                </div>
              )}

              <div className="mb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[.3em] mb-6">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-serif font-black text-legal-900 italic">{plan.label}</span>
                  <span className="text-slate-400 font-bold uppercase text-xs">{plan.period}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed font-medium min-h-[48px]">{plan.description}</p>
                
                <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 transition-colors group-hover:bg-legal-gold group-hover:text-legal-900 group-hover:border-legal-gold">
                    <Zap size={14} className="fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{plan.credits}</span>
                </div>
              </div>

              <div className="space-y-4 mb-16 flex-1">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-green-50 transition-colors shrink-0">
                      <Check size={12} className="text-slate-300 group-hover:text-green-600 transition-colors" />
                    </div>
                    <span className="text-slate-600 text-sm font-medium tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all text-xs flex items-center justify-center gap-3 active:scale-95 ${
                  plan.highlighted
                    ? 'bg-legal-900 text-white shadow-2xl shadow-legal-900/20 hover:bg-legal-800'
                    : 'bg-slate-50 text-slate-400 hover:bg-legal-900 hover:text-white'
                }`}
              >
                {loading === plan.id ? 'Connecting to Gateway...' : plan.cta}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Pay-as-you-go / Custom Section */}
        <div className="mt-32 bg-legal-900 rounded-[50px] p-16 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(10,25,47,0.4)]">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-legal-gold opacity-[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-legal-gold rounded-xl flex items-center justify-center">
                        <CreditCard className="text-legal-900" size={20} />
                    </div>
                    <span className="text-[10px] font-black text-legal-gold uppercase tracking-[.4em]">Credit Infrastructure</span>
                </div>
                <h3 className="text-4xl font-serif font-black italic mb-6 leading-tight">Need Immediate <span className="text-legal-gold not-italic">AI Expansion?</span></h3>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">
                    Top up your chambers with high-speed AI credits at any time. Our Pay-As-You-Go protocol ensures you only pay for the intelligence you use.
                </p>
                <div className="flex gap-12 mt-12">
                    <div className="flex flex-col gap-2">
                        <span className="text-2xl font-serif font-black italic">₦2.5k</span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Per 100 Units</span>
                    </div>
                    <div className="flex flex-col gap-2 text-legal-gold">
                        <span className="text-2xl font-serif font-black italic">Instant</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Provisioning</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col gap-4 w-full lg:w-auto">
                <button className="px-12 py-6 bg-legal-gold text-legal-900 rounded-2xl font-black uppercase tracking-widest hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-legal-gold/20 flex items-center justify-center gap-4">
                    <Zap size={20} /> Provision Credits
                </button>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[.3em] text-center italic">Secured by Paystack</p>
            </div>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-24 pt-12 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-8 opacity-40">
            <div className="flex flex-col items-center">
                <ShieldCheck size={24} className="text-slate-400 mb-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center leading-relaxed">Encrypted <br /> Multi-Tenancy</span>
            </div>
            <div className="flex flex-col items-center">
                <Building2 size={24} className="text-slate-400 mb-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center leading-relaxed">Enterprise <br /> Grade SLA</span>
            </div>
            <div className="flex flex-col items-center">
                <User size={24} className="text-slate-400 mb-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center leading-relaxed">Dedicated <br /> Account Ops</span>
            </div>
            <div className="flex flex-col items-center">
                <HelpCircle size={24} className="text-slate-400 mb-4" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center leading-relaxed">24/7 Priority <br /> Intelligence</span>
            </div>
        </div>
      </div>
    </div>
  );
};
