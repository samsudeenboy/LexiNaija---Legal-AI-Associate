import React from 'react';
import { Check, Zap, Building2, Users, ShieldCheck, CreditCard } from 'lucide-react';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  credits: string;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Solo Practitioner',
    price: '₦15,000',
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
    cta: 'Start Solo'
  },
  {
    name: 'Chambers Pro',
    price: '₦45,000',
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
    cta: 'Upgrade Chambers'
  },
  {
    name: 'Enterprise / SAN',
    price: 'Custom',
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
    cta: 'Contact Sales'
  }
];

export const Subscription: React.FC = () => {
  return (
    <div className="bg-gray-50 py-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-serif font-bold text-legal-900 mb-4">Choose Your Practice Tier</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Scale your legal practice with AI-powered efficiency. Select the plan that fits your chambers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 hover:shadow-xl flex flex-col ${
              plan.highlighted 
                ? 'border-legal-gold ring-4 ring-legal-gold/10 scale-105 relative' 
                : 'border-gray-200'
            }`}
          >
            {plan.highlighted && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-legal-gold text-legal-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                Most Popular
              </span>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-legal-900 mb-2">{plan.name}</h3>
              <p className="text-gray-500 text-sm h-12">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-legal-900">{plan.price}</span>
                <span className="text-gray-500 font-medium">{plan.period}</span>
              </div>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-legal-50 text-legal-700 rounded-lg text-sm font-bold">
                <Zap size={14} className="text-legal-gold fill-current" />
                {plan.credits}
              </div>
            </div>

            <div className="space-y-4 flex-1 mb-8">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 rounded-full p-0.5">
                    <Check size={14} className="text-green-600" />
                  </div>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={`w-full py-4 rounded-xl font-bold transition-all ${
                plan.highlighted
                  ? 'bg-legal-900 text-white hover:bg-legal-800 shadow-lg'
                  : 'bg-white border-2 border-legal-900 text-legal-900 hover:bg-legal-50'
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto mt-20 bg-legal-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-legal-gold opacity-10 rounded-full translate-x-20 -translate-y-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2 flex items-center gap-3">
              <CreditCard className="text-legal-gold" /> Pay-As-You-Go Credits
            </h3>
            <p className="text-gray-300 max-w-md">
              Need extra power? Top up your account with AI credits at any time. Credits never expire for active subscribers.
            </p>
          </div>
          <button className="bg-legal-gold text-legal-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors whitespace-nowrap">
            View Credit Packs
          </button>
        </div>
      </div>
    </div>
  );
};
