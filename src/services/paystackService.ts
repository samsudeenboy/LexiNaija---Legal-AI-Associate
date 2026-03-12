import React from 'react';
import { useLegalStore } from '../contexts/LegalStoreContext';

interface PaystackProps {
  amount: number;
  email: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
  planName: string;
}

// In a real environment, this would use @paystack/inline-js
// We are building the logic to trigger the Paystack popup
export const usePaystackPayment = () => {
  const { addCredits, updateFirmProfile } = useLegalStore();

  const initializePayment = (config: PaystackProps) => {
    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
      email: config.email,
      amount: config.amount * 100, // Convert to kobo
      currency: 'NGN',
      ref: `LX-${Date.now()}`,
      metadata: {
        custom_fields: [
          {
            display_name: "Plan",
            variable_name: "plan",
            value: config.planName
          }
        ]
      },
      callback: function(response: any) {
        console.log('Payment complete! Reference: ' + response.reference);
        config.onSuccess(response.reference);
      },
      onClose: function() {
        config.onClose();
      }
    });
    handler.openIframe();
  };

  return { initializePayment };
};
