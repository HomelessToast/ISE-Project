import { DILUTION_COEFFICIENTS } from '@/alg/ise/constants';

export type DilutionType = keyof typeof DILUTION_COEFFICIENTS;

/**
 * Get the dilution coefficient for a given dilution
 * @param dilution - The dilution string (e.g., '1:10', '1:100')
 * @returns The dilution coefficient
 */
export function getDilutionCoefficient(dilution: DilutionType): number {
  return DILUTION_COEFFICIENTS[dilution];
}

/**
 * Check if a dilution coefficient is valid
 * @param coefficient - The dilution coefficient to validate
 * @returns True if the coefficient is valid
 */
export function isValidDilutionCoefficient(coefficient: number): boolean {
  const validCoefficients = Object.values(DILUTION_COEFFICIENTS);
  return validCoefficients.includes(coefficient as any);
}

/**
 * Get all available dilution types
 * @returns Array of available dilution types
 */
export function getAvailableDilutions(): DilutionType[] {
  return Object.keys(DILUTION_COEFFICIENTS) as DilutionType[];
}

/**
 * Calculate the original cfu/g from cfu/vial using dilution coefficient
 * @param cfuPerVial - CFU per vial count
 * @param dilutionCoefficient - The dilution coefficient
 * @returns Original cfu/g count
 */
export function calculateOriginalCfuPerG(cfuPerVial: number, dilutionCoefficient: number): number {
  if (dilutionCoefficient <= 0) {
    throw new Error('Dilution coefficient must be greater than 0');
  }
  return cfuPerVial / dilutionCoefficient;
}

/**
 * Calculate cfu/vial from original cfu/g using dilution coefficient
 * @param cfuPerG - Original cfu/g count
 * @param dilutionCoefficient - The dilution coefficient
 * @returns CFU per vial count
 */
export function calculateCfuPerVial(cfuPerG: number, dilutionCoefficient: number): number {
  if (dilutionCoefficient <= 0) {
    throw new Error('Dilution coefficient must be greater than 0');
  }
  return cfuPerG * dilutionCoefficient;
}

/**
 * Get dilution description for display
 * @param dilution - The dilution type
 * @returns Human-readable description
 */
export function getDilutionDescription(dilution: DilutionType): string {
  const descriptions: Record<DilutionType, string> = {
    '1': 'Non-diluted (as is) - Water or non-dissolved samples',
    '1:10': '1:10 dilution - Dissolved samples',
    '1:100': '1:100 dilution - Dissolved samples',
    '1:1000': '1:1,000 dilution - Dissolved samples',
    '1:10000': '1:10,000 dilution - Dissolved samples',
    '1:100000': '1:100,000 dilution - Dissolved samples',
  };
  return descriptions[dilution];
}
