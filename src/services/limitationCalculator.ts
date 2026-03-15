/**
 * Statute of Limitations Calculator
 * Nigerian limitation periods for various causes of action
 */

export type LimitationType = 
  | 'Contract'
  | 'Tort'
  | 'Fundamental Rights'
  | 'Land Recovery'
  | 'Defamation'
  | 'Fraud'
  | 'Employment'
  | 'Criminal Summary';

export interface LimitationPeriod {
  type: LimitationType;
  years: number;
  months?: number;
  source: string;
  description: string;
}

/**
 * Nigerian limitation periods by cause of action
 */
export const LIMITATION_PERIODS: Record<LimitationType, LimitationPeriod> = {
  Contract: {
    type: 'Contract',
    years: 6,
    source: 'Limitation Law (Various States)',
    description: 'Simple contract claims must be brought within 6 years from when the cause of action accrued'
  },
  Tort: {
    type: 'Tort',
    years: 3,
    source: 'Limitation Law',
    description: 'Tort claims (negligence, trespass, etc.) must be brought within 3 years'
  },
  'Fundamental Rights': {
    type: 'Fundamental Rights',
    years: 1,
    source: 'Constitution of the Federal Republic of Nigeria 1999 (as amended)',
    description: 'Fundamental rights enforcement must be brought within 1 year (some courts allow reasonable time)'
  },
  'Land Recovery': {
    type: 'Land Recovery',
    years: 12,
    source: 'Limitation Law',
    description: 'Actions to recover land must be brought within 12 years from when the right of action accrued'
  },
  Defamation: {
    type: 'Defamation',
    years: 2,
    source: 'Limitation Law',
    description: 'Defamation (libel/slander) claims must be brought within 2 years'
  },
  Fraud: {
    type: 'Fraud',
    years: 6,
    source: 'Limitation Law',
    description: 'Fraud claims: 6 years from discovery of the fraud'
  },
  Employment: {
    type: 'Employment',
    years: 6,
    source: 'Limitation Law',
    description: 'Employment-related claims: 6 years from breach'
  },
  'Criminal Summary': {
    type: 'Criminal Summary',
    years: 0,
    months: 6,
    source: 'Administration of Criminal Justice Law',
    description: 'Summary criminal offences: 6 months from commission'
  }
};

/**
 * Calculate limitation date from accrual date
 */
export const calculateLimitationDate = (
  accrualDate: Date,
  limitationType: LimitationType
): Date => {
  const period = LIMITATION_PERIODS[limitationType];
  const result = new Date(accrualDate);
  
  if (period.months) {
    result.setMonth(result.getMonth() + period.months);
  } else {
    result.setFullYear(result.getFullYear() + period.years);
  }
  
  return result;
};

/**
 * Calculate days remaining until limitation expires
 */
export const getDaysUntilLimitation = (limitationDate: Date): number => {
  const today = new Date();
  const limit = new Date(limitationDate);
  const diffTime = limit.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Get limitation urgency level
 */
export const getLimitationUrgency = (limitationDate: Date): {
  level: 'critical' | 'warning' | 'attention' | 'safe';
  message: string;
  color: string;
} => {
  const daysLeft = getDaysUntilLimitation(limitationDate);
  
  if (daysLeft < 0) {
    return {
      level: 'critical',
      message: '⚠️ STATUTE-BARRED - Action can no longer be commenced',
      color: 'rose'
    };
  }
  
  if (daysLeft <= 30) {
    return {
      level: 'critical',
      message: `🚨 CRITICAL: Only ${daysLeft} days remaining - File immediately!`,
      color: 'rose'
    };
  }
  
  if (daysLeft <= 60) {
    return {
      level: 'warning',
      message: `⚠️ URGENT: ${daysLeft} days remaining - Prepare filing`,
      color: 'amber'
    };
  }
  
  if (daysLeft <= 90) {
    return {
      level: 'attention',
      message: `⚡ Attention: ${daysLeft} days remaining - Begin preparation`,
      color: 'yellow'
    };
  }
  
  return {
    level: 'safe',
    message: `${daysLeft} days remaining`,
    color: 'emerald'
  };
};

/**
 * Get all cases approaching limitation within threshold
 */
export const getCasesApproachingLimitation = <T extends { limitationDate?: string; title: string; id: string }>(
  cases: T[],
  thresholdDays: number = 90
): Array<T & { daysRemaining: number; urgency: ReturnType<typeof getLimitationUrgency> }> => {
  const today = new Date();
  const thresholdDate = new Date(today.getTime() + thresholdDays * 24 * 60 * 60 * 1000);
  
  return cases
    .filter(c => c.limitationDate)
    .map(c => {
      const limitDate = new Date(c.limitationDate!);
      const daysRemaining = getDaysUntilLimitation(limitDate);
      const urgency = getLimitationUrgency(limitDate);
      
      return {
        ...c,
        daysRemaining,
        urgency
      };
    })
    .filter(c => c.daysRemaining <= thresholdDays)
    .sort((a, b) => a.daysRemaining - b.daysRemaining);
};

/**
 * Format limitation date for display
 */
export const formatLimitationDate = (date: Date): string => {
  return date.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

/**
 * Get limitation period options for dropdown
 */
export const getLimitationTypeOptions = (): { value: LimitationType; label: string; period: string }[] => {
  return Object.values(LIMITATION_PERIODS).map(p => ({
    value: p.type,
    label: p.type,
    period: p.months 
      ? `${p.months} month(s)` 
      : p.years === 1 
        ? '1 year' 
        : `${p.years} years`
  }));
};
