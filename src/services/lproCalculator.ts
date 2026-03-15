/**
 * LPRO 2023 Calculator
 * Legal Practitioners (Remuneration for Legal Documentation and Other Land Matters) Order 2023
 * 
 * Automatically calculates statutory legal fees based on transaction type and value
 */

export type TransactionType = 'Sale' | 'Lease' | 'Mortgage' | 'Assignment' | 'Sublease';

export interface LPROConfig {
  transactionType: TransactionType;
  propertyValue: number;
  location?: 'Lagos' | 'Abuja' | 'Other';
  isCommercial?: boolean;
}

export interface LPROResult {
  professionalFee: number;
  vat: number;
  stampDuty: number;
  registrationFee: number;
  total: number;
  breakdown: string[];
  statutoryMinimum: number;
  warning?: string;
}

/**
 * Calculate LPRO 2023 compliant fees
 */
export const calculateLPROFee = (config: LPROConfig): LPROResult => {
  const { transactionType, propertyValue, isCommercial = false } = config;
  const breakdown: string[] = [];
  
  let professionalFee = 0;
  
  // LPRO 2023 Scale for Sale of Property
  if (transactionType === 'Sale') {
    if (propertyValue <= 50_000_000) {
      professionalFee = propertyValue * 0.10; // 10%
      breakdown.push(`10% on first ₦50M: ₦${(propertyValue * 0.10).toLocaleString()}`);
    } else if (propertyValue <= 200_000_000) {
      const firstTier = 50_000_000 * 0.10; // ₦5M
      const secondTier = (propertyValue - 50_000_000) * 0.05; // 5% on excess
      professionalFee = firstTier + secondTier;
      breakdown.push(`10% on first ₦50M: ₦${firstTier.toLocaleString()}`);
      breakdown.push(`5% on ₦${(propertyValue - 50_000_000).toLocaleString()}: ₦${secondTier.toLocaleString()}`);
    } else {
      const firstTier = 50_000_000 * 0.10; // ₦5M
      const secondTier = 150_000_000 * 0.05; // ₦7.5M
      const thirdTier = (propertyValue - 200_000_000) * 0.03; // 3% on excess
      professionalFee = firstTier + secondTier + thirdTier;
      breakdown.push(`10% on first ₦50M: ₦${firstTier.toLocaleString()}`);
      breakdown.push(`5% on next ₦150M: ₦${secondTier.toLocaleString()}`);
      breakdown.push(`3% on ₦${(propertyValue - 200_000_000).toLocaleString()}: ₦${thirdTier.toLocaleString()}`);
    }
  }
  
  // LPRO 2023 Scale for Lease
  else if (transactionType === 'Lease' || transactionType === 'Sublease') {
    if (isCommercial) {
      professionalFee = propertyValue * 0.10; // 10% of annual rent (commercial)
      breakdown.push(`10% of annual rent (Commercial): ₦${professionalFee.toLocaleString()}`);
    } else {
      professionalFee = propertyValue * 0.075; // 7.5% of annual rent (residential)
      breakdown.push(`7.5% of annual rent (Residential): ₦${professionalFee.toLocaleString()}`);
    }
  }
  
  // LPRO 2023 Scale for Mortgage
  else if (transactionType === 'Mortgage') {
    if (propertyValue <= 10_000_000) {
      professionalFee = propertyValue * 0.05; // 5%
      breakdown.push(`5% on ₦${propertyValue.toLocaleString()}: ₦${professionalFee.toLocaleString()}`);
    } else if (propertyValue <= 50_000_000) {
      professionalFee = 500_000 + (propertyValue - 10_000_000) * 0.025;
      breakdown.push(`5% on first ₦10M: ₦500,000`);
      breakdown.push(`2.5% on ₦${(propertyValue - 10_000_000).toLocaleString()}: ₦${((propertyValue - 10_000_000) * 0.025).toLocaleString()}`);
    } else {
      professionalFee = 1_500_000 + (propertyValue - 50_000_000) * 0.01;
      breakdown.push(`5% on first ₦10M: ₦500,000`);
      breakdown.push(`2.5% on next ₦40M: ₦1,000,000`);
      breakdown.push(`1% on ₦${(propertyValue - 50_000_000).toLocaleString()}: ₦${((propertyValue - 50_000_000) * 0.01).toLocaleString()}`);
    }
  }
  
  // LPRO 2023 Scale for Assignment
  else if (transactionType === 'Assignment') {
    professionalFee = propertyValue * 0.075; // 7.5%
    breakdown.push(`7.5% on ₦${propertyValue.toLocaleString()}: ₦${professionalFee.toLocaleString()}`);
  }
  
  // Calculate additional costs
  const vat = professionalFee * 0.075; // 7.5% VAT
  const stampDuty = propertyValue * 0.005; // 0.5% stamp duty (typical)
  const registrationFee = propertyValue * 0.003; // 0.3% registration (typical)
  
  const total = professionalFee + vat + stampDuty + registrationFee;
  
  // Statutory minimum (LPRO 2023)
  const statutoryMinimum = 50_000;
  
  // Apply minimum if fee is too low
  let finalProfessionalFee = professionalFee;
  if (professionalFee < statutoryMinimum && propertyValue > 0) {
    finalProfessionalFee = statutoryMinimum;
    breakdown.unshift(`Statutory Minimum Fee applied: ₦${statutoryMinimum.toLocaleString()}`);
  }
  
  // Warning if user is undercharging
  let warning: string | undefined;
  if (professionalFee < statutoryMinimum && propertyValue > 0) {
    warning = `⚠️ Property value too low. Minimum statutory fee of ₦${statutoryMinimum.toLocaleString()} applies.`;
  }
  
  return {
    professionalFee: finalProfessionalFee,
    vat,
    stampDuty,
    registrationFee,
    total: finalProfessionalFee + vat + stampDuty + registrationFee,
    breakdown,
    statutoryMinimum,
    warning
  };
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Get LPRO reference text for fee note
 */
export const getLPROReference = (config: LPROConfig, result: LPROResult): string => {
  return `Professional fees calculated in accordance with the Legal Practitioners (Remuneration for Legal Documentation and Other Land Matters) Order 2023.
  
Transaction: ${config.transactionType}
Property Value: ${formatCurrency(config.propertyValue)}
Statutory Fee: ${formatCurrency(result.professionalFee)}
VAT @ 7.5%: ${formatCurrency(result.vat)}
Stamp Duty (est.): ${formatCurrency(result.stampDuty)}
Registration Fee (est.): ${formatCurrency(result.registrationFee)}
TOTAL: ${formatCurrency(result.total)}

This fee is computed based on the LPRO 2023 statutory scale and represents the minimum recommended remuneration for legal services in this transaction.`;
};
