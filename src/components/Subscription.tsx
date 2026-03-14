import React, { useState } from 'react';
import { Check, Zap, Building2, Users, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import PaystackPop from '@paystack/inline-js';
import { useLegalStore } from '../contexts/LegalStoreContext';
import { useToast } from '../contexts/ToastContext';
import { supabase } from '../services/supabaseClient';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  credits: string;
  amount: number;
  credits_num?: number;
}

const PLANS: PricingPlan[] = [
  {
    name: 'Solo Practice',
    price: '₦5,000',
    period: '/month',
    description: 'Perfect for new wigs and independent practitioners.',
    credits: '500 AI Credits',
    features: [
      'Single User Access',
      'Unlimited Case Files',
      '5 AI Drafts Per Month',
      'Basic Legal Research',
      'Cause List Generation',
      'Local Storage Sync'
    ],
    cta: 'Start Solo',
    amount: 5000,
    credits_num: 500
  },
  {
    name: 'Professional',
    price: '₦15,000',
    period: '/month',
    description: 'The standard for growing firms and active practitioners.',
    credits: 'Unlimited AI Usage',
    highlighted: true,
    features: [
      'Up to 5 User Accounts',
      'Unlimited AI Drafting',
      'Deep Research Suite',
      'Bailiff & Process Tracker',
      'Corporate Filing Automation',
      'Priority Email Support',
      'Cloud Backup & Sync'
    ],
    cta: 'Upgrade Professional',
    amount: 15000,
    credits_num: 999999 // Representing unlimited
  },
  {
    name: 'Firm/Enterprise',
    price: '₦100,000+',
    period: '/month',
    description: 'Scalable solutions for SAN chambers and large institutions.',
    credits: 'Institutional Grade',
    features: [
      'Unlimited User Accounts',
      'Multi-user Case Sync',
      'Custom Precedent Library',
      'Immutable Compliance Audit',
      'Dedicated Account Liaison',
      'High-Concurrency Architecture',
      '24/7 Phone Support'
    ],
    cta: 'Consult Sales',
    amount: 0
  }
];

export const Subscription: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState<string | null>(null);

  const handlePaystackPayment = async (plan: any) => {
    if (plan.price === 'Custom') {
      showToast("Enterprise protocol requires manual consultation.", "info");
      return;
    }

    setLoading(plan.name);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        showToast("Authentication required for payment protocols.", "error");
        return;
      }

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: (import.meta as any).env.VITE_PAYSTACK_PUBLIC_KEY,
        email: session.user.email || '',
        amount: plan.amount * 100, // in kobo
        currency: 'NGN',
        metadata: {
          plan_name: plan.name,
          credits: plan.credits_num,
          user_id: session.user.id
        },
        onSuccess: (transaction: any) => {
          showToast(`Protocol success. Transaction ${transaction.reference} verified.`, "success");
          setLoading(null);
        },
        onCancel: () => {
          showToast("Payment directive cancelled.", "info");
          setLoading(null);
        }
      });
    } catch (error: any) {
      showToast(error.message, "error");
      setLoading(null);
    }
  };
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
              onClick={() => handlePaystackPayment(plan)}
              disabled={loading !== null}
              className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                plan.highlighted
                  ? 'bg-legal-900 text-white hover:bg-legal-800 shadow-lg'
                  : 'bg-white border-2 border-legal-900 text-legal-900 hover:bg-legal-50'
              } disabled:opacity-50`}
            >
              {loading === plan.name ? <Loader2 className="animate-spin" size={20} /> : plan.cta}
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
