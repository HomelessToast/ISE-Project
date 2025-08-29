import { z } from 'zod';

// ISE API input validation schemas
export const ISEComputeInputSchema = z.object({
  dilutionDisplay: z.string().optional(),
  dilutionCoeff: z.number().optional(),
  tou: z.object({
    h0: z.number().finite().min(0, 'TOU h0 must be ≥ 0'),
    h10: z.number().finite().min(0, 'TOU h10 must be ≥ 0'),
    h20: z.number().finite().min(0, 'TOU h20 must be ≥ 0'),
    h24: z.number().finite().min(0, 'TOU h24 must be ≥ 0'),
  }),
  requiredDilutionSpec: z.string().min(1, 'Required dilution spec is required'),
  fillWeight_g: z.number().finite().positive('Fill weight must be > 0'),
});

export const ISEBatchInputSchema = z.array(ISEComputeInputSchema);

// Validation function for dilution display format
export function validateDilutionDisplay(display: string): boolean {
  // Accept formats: "1:10", "1:1,000", "1:1000", or decimal strings like "0.001"
  if (display.includes(':')) {
    // Ratio format: "1:10", "1:1,000", "1:1000"
    const match = display.match(/^1:\s*([\d,]+)\s*$/);
    if (!match) return false;
    
    const denom = Number(match[1].replace(/,/g, ''));
    return isFinite(denom) && denom > 0;
  } else {
    // Decimal format: "0.001", "0.1", etc.
    const num = Number(display);
    return isFinite(num) && num > 0;
  }
}

// Validation function for TOU values
export function validateTOUValues(tou: { h0: number; h10: number; h20: number; h24: number }): string | null {
  if (!isFinite(tou.h0) || tou.h0 < 0) {
    return 'TOU h0 must be a finite number ≥ 0';
  }
  if (!isFinite(tou.h10) || tou.h10 < 0) {
    return 'TOU h10 must be a finite number ≥ 0';
  }
  if (!isFinite(tou.h20) || tou.h20 < 0) {
    return 'TOU h20 must be a finite number ≥ 0';
  }
  if (!isFinite(tou.h24) || tou.h24 < 0) {
    return 'TOU h24 must be a finite number ≥ 0';
  }
  return null;
}

// Validation function for fill weight
export function validateFillWeight(fillWeight_g: number): string | null {
  if (!isFinite(fillWeight_g)) {
    return 'Fill weight must be a finite number';
  }
  if (fillWeight_g <= 0) {
    return 'Fill weight must be > 0';
  }
  return null;
}

// Main validation function for ISE compute input
export function validateISEInput(input: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate TOU values
  if (input.tou) {
    const touError = validateTOUValues(input.tou);
    if (touError) errors.push(touError);
  } else {
    errors.push('TOU values are required');
  }

  // Validate fill weight
  if (input.fillWeight_g !== undefined) {
    const weightError = validateFillWeight(input.fillWeight_g);
    if (weightError) errors.push(weightError);
  } else {
    errors.push('Fill weight is required');
  }

  // Validate required dilution spec
  if (!input.requiredDilutionSpec || typeof input.requiredDilutionSpec !== 'string') {
    errors.push('Required dilution spec is required and must be a string');
  }

  // Validate dilution display if provided
  if (input.dilutionDisplay && !validateDilutionDisplay(input.dilutionDisplay)) {
    errors.push('Invalid dilution display format. Use "1:1000", "1:1,000", or "0.001"');
  }

  // Validate dilution coefficient if provided
  if (input.dilutionCoeff !== undefined) {
    if (!isFinite(input.dilutionCoeff) || input.dilutionCoeff <= 0) {
      errors.push('Dilution coefficient must be a finite number > 0');
    }
  }

    return {
    valid: errors.length === 0,
    errors
  };
}

// Type exports
export type ISEComputeInput = z.infer<typeof ISEComputeInputSchema>;
export type ISEBatchInput = z.infer<typeof ISEBatchInputSchema>;
