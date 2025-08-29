import { TestType, VALIDATION_THRESHOLDS } from './constants';

export interface ValidationData {
  sampleId: string;
  plateReportedCfuPerG: number;
  iseCalculatedCfuPerG: number;
  plateLogValue: number;
  iseLogValue: number;
  logDifference: number;
  isWithinThreshold: boolean;
}

export interface ValidationSummary {
  totalSamples: number;
  samplesWithinThreshold: number;
  samplesOutsideThreshold: number;
  averageLogDifference: number;
  maxLogDifference: number;
  minLogDifference: number;
  rSquared: number;
  confidenceLevel: number;
  validationStatus: 'pass' | 'fail' | 'warning';
  notes: string[];
}

/**
 * Validate ISE method performance against plate count results
 * Source: "A ±0.5 log difference between different test method results is considered statistically similar"
 */
export function validateISEMethod(
  validationData: ValidationData[]
): ValidationSummary {
  if (validationData.length === 0) {
    throw new Error('No validation data provided');
  }

  // Calculate log differences
  const validatedData = validationData.map(calculateLogDifference);
  
  // Count samples within threshold
  const samplesWithinThreshold = validatedData.filter(d => d.isWithinThreshold).length;
  const samplesOutsideThreshold = validatedData.length - samplesWithinThreshold;
  
  // Calculate statistics
  const logDifferences = validatedData.map(d => d.logDifference);
  const averageLogDifference = logDifferences.reduce((sum, diff) => sum + diff, 0) / logDifferences.length;
  const maxLogDifference = Math.max(...logDifferences);
  const minLogDifference = Math.min(...logDifferences);
  
  // Calculate R-squared correlation
  const rSquared = calculateRSquared(validatedData);
  
  // Determine confidence level
  const confidenceLevel = calculateConfidenceLevel(validatedData);
  
  // Assess validation status
  const validationStatus = assessValidationStatus(
    samplesWithinThreshold,
    validatedData.length,
    rSquared,
    maxLogDifference
  );
  
  // Generate notes
  const notes = generateValidationNotes(
    validatedData,
    rSquared,
    averageLogDifference,
    maxLogDifference
  );
  
  return {
    totalSamples: validatedData.length,
    samplesWithinThreshold,
    samplesOutsideThreshold,
    averageLogDifference,
    maxLogDifference,
    minLogDifference,
    rSquared,
    confidenceLevel,
    validationStatus,
    notes,
  };
}

/**
 * Calculate log difference for a single sample
 */
function calculateLogDifference(data: Omit<ValidationData, 'plateLogValue' | 'iseLogValue' | 'logDifference' | 'isWithinThreshold'>): ValidationData {
  const plateLogValue = Math.log10(Math.max(data.plateReportedCfuPerG, VALIDATION_THRESHOLDS.MIN_CFU_COUNT));
  const iseLogValue = Math.log10(Math.max(data.iseCalculatedCfuPerG, VALIDATION_THRESHOLDS.MIN_CFU_COUNT));
  const logDifference = Math.abs(iseLogValue - plateLogValue);
  const isWithinThreshold = logDifference <= VALIDATION_THRESHOLDS.LOG_DIFFERENCE_THRESHOLD;
  
  return {
    ...data,
    plateLogValue,
    iseLogValue,
    logDifference,
    isWithinThreshold,
  };
}

/**
 * Calculate R-squared correlation coefficient
 * Source: Manuscript reports R² = 0.9146 demonstrating acceptable value >0.9025
 */
function calculateRSquared(validatedData: ValidationData[]): number {
  if (validatedData.length < 2) return 0;
  
  const plateLogs = validatedData.map(d => d.plateLogValue);
  const iseLogs = validatedData.map(d => d.iseLogValue);
  
  const meanPlateLog = plateLogs.reduce((sum, val) => sum + val, 0) / plateLogs.length;
  const meanIseLog = iseLogs.reduce((sum, val) => sum + val, 0) / iseLogs.length;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < validatedData.length; i++) {
    const plateDiff = plateLogs[i] - meanPlateLog;
    const iseDiff = iseLogs[i] - meanIseLog;
    
    numerator += plateDiff * iseDiff;
    denominator += plateDiff * plateDiff;
  }
  
  if (denominator === 0) return 0;
  
  const correlation = numerator / denominator;
  return correlation * correlation;
}

/**
 * Calculate confidence level based on validation results
 */
function calculateConfidenceLevel(validatedData: ValidationData[]): number {
  const withinThreshold = validatedData.filter(d => d.isWithinThreshold).length;
  const total = validatedData.length;
  
  // Calculate 95% confidence interval
  const proportion = withinThreshold / total;
  const standardError = Math.sqrt((proportion * (1 - proportion)) / total);
  const marginOfError = 1.96 * standardError; // 95% confidence
  
  return Math.max(0, Math.min(1, proportion - marginOfError));
}

/**
 * Assess overall validation status
 */
function assessValidationStatus(
  samplesWithinThreshold: number,
  totalSamples: number,
  rSquared: number,
  maxLogDifference: number
): 'pass' | 'fail' | 'warning' {
  const proportionWithinThreshold = samplesWithinThreshold / totalSamples;
  
  // Check if R² meets minimum threshold
  if (rSquared < VALIDATION_THRESHOLDS.R_SQUARED_THRESHOLD) {
    return 'fail';
  }
  
  // Check if proportion within threshold is acceptable (≥90%)
  if (proportionWithinThreshold < 0.9) {
    return 'fail';
  }
  
  // Check if maximum log difference is acceptable
  if (maxLogDifference > VALIDATION_THRESHOLDS.LOG_DIFFERENCE_THRESHOLD * 2) {
    return 'warning';
  }
  
  return 'pass';
}

/**
 * Generate validation notes
 */
function generateValidationNotes(
  validatedData: ValidationData[],
  rSquared: number,
  averageLogDifference: number,
  maxLogDifference: number
): string[] {
  const notes: string[] = [];
  
  // R-squared assessment
  if (rSquared >= VALIDATION_THRESHOLDS.R_SQUARED_THRESHOLD) {
    notes.push(`R² = ${rSquared.toFixed(4)} - Excellent correlation with plate counts`);
  } else {
    notes.push(`R² = ${rSquared.toFixed(4)} - Below acceptable threshold of ${VALIDATION_THRESHOLDS.R_SQUARED_THRESHOLD}`);
  }
  
  // Log difference assessment
  const withinThreshold = validatedData.filter(d => d.isWithinThreshold).length;
  const total = validatedData.length;
  const percentage = ((withinThreshold / total) * 100).toFixed(1);
  
  notes.push(`${percentage}% of samples within ±${VALIDATION_THRESHOLDS.LOG_DIFFERENCE_THRESHOLD} log threshold`);
  notes.push(`Average log difference: ${averageLogDifference.toFixed(3)}`);
  notes.push(`Maximum log difference: ${maxLogDifference.toFixed(3)}`);
  
  // Performance assessment
  if (rSquared >= 0.91) {
    notes.push('Performance exceeds industry standards (R² > 0.91)');
  } else if (rSquared >= 0.90) {
    notes.push('Performance meets industry standards (R² ≥ 0.90)');
  } else {
    notes.push('Performance below industry standards - investigation recommended');
  }
  
  return notes;
}

/**
 * Check if a single result is within acceptable range
 */
export function isResultWithinThreshold(
  plateCfuPerG: number,
  iseCfuPerG: number
): boolean {
  const plateLog = Math.log10(Math.max(plateCfuPerG, VALIDATION_THRESHOLDS.MIN_CFU_COUNT));
  const iseLog = Math.log10(Math.max(iseCfuPerG, VALIDATION_THRESHOLDS.MIN_CFU_COUNT));
  const logDifference = Math.abs(iseLog - plateLog);
  
  return logDifference <= VALIDATION_THRESHOLDS.LOG_DIFFERENCE_THRESHOLD;
}

/**
 * Generate validation report for a single sample
 */
export function generateSampleValidationReport(
  sampleId: string,
  plateCfuPerG: number,
  iseCfuPerG: number
): ValidationData {
  const plateLogValue = Math.log10(Math.max(plateCfuPerG, VALIDATION_THRESHOLDS.MIN_CFU_COUNT));
  const iseLogValue = Math.log10(Math.max(iseCfuPerG, VALIDATION_THRESHOLDS.MIN_CFU_COUNT));
  const logDifference = Math.abs(iseLogValue - plateLogValue);
  const isWithinThreshold = logDifference <= VALIDATION_THRESHOLDS.LOG_DIFFERENCE_THRESHOLD;
  
  return {
    sampleId,
    plateReportedCfuPerG: plateCfuPerG,
    iseCalculatedCfuPerG: iseCfuPerG,
    plateLogValue,
    iseLogValue,
    logDifference,
    isWithinThreshold,
  };
}
