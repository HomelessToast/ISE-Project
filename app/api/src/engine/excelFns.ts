
// Excel-compatible helper functions
// These functions replicate Excel's exact behavior for determinism

export const ROUND = (x: number, decimals: number = 0): number => {
  // Excel uses "half away from zero" rounding
  const factor = Math.pow(10, decimals);
  return Math.sign(x) * Math.round(Math.abs(x) * factor) / factor;
};

export const LOG10 = (x: number): number => Math.log10(x);
export const LOG = (x: number) => Math.log(x);
export const POW = (x: number, y: number) => Math.pow(x, y);
export const POWER = (x: number, y: number) => Math.pow(x, y);

export const IF = (condition: any, trueValue: any, falseValue: any): any => {
  // Excel treats 0, false, "", null, undefined as false
  return condition ? trueValue : falseValue;
};

export const AND = (...conditions: any[]): boolean => {
  return conditions.every(condition => Boolean(condition));
};

export const OR = (...conditions: any[]): boolean => {
  return conditions.some(condition => Boolean(condition));
};

export const MAX = (...values: any[]): number => {
  const nums = values.map(Number).filter(v => !isNaN(v));
  return nums.length > 0 ? Math.max(...nums) : 0;
};

export const MIN = (...values: any[]): number => {
  const nums = values.map(Number).filter(v => !isNaN(v));
  return nums.length > 0 ? Math.min(...nums) : 0;
};

export const ABS = (x: number): number => Math.abs(x);
export const INT = (x: number): number => Math.floor(x);

export const AVERAGE = (...xs: any[]): number => {
  // Excel AVERAGE ignores text and booleans, includes zeros; all non-numeric -> #DIV/0!
  const nums = xs.flat().map(Number).filter(v => typeof v === 'number' && !isNaN(v));
  if (nums.length === 0) return NaN; // mirror #DIV/0! as NaN; most sheets wrap with IFERROR
  return nums.reduce((sum, x) => sum + x, 0) / nums.length;
};

export const SLOPE = (yValues: number[], xValues: number[]): number => {
  if (yValues.length !== xValues.length || yValues.length < 2) return NaN;
  
  const n = yValues.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return NaN;
  
  return (n * sumXY - sumX * sumY) / denominator;
};

export const INTERCEPT = (yValues: number[], xValues: number[]): number => {
  if (yValues.length !== xValues.length || yValues.length < 2) return NaN;
  
  const n = yValues.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  
  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return NaN;
  
  return (sumY * sumX2 - sumX * sumXY) / denominator;
};

export const RSQ = (yValues: number[], xValues: number[]): number => {
  if (yValues.length !== xValues.length || yValues.length < 2) return NaN;
  
  const slope = SLOPE(yValues, xValues);
  if (isNaN(slope)) return NaN;
  
  const n = yValues.length;
  const sumX = xValues.reduce((sum, x) => sum + x, 0);
  const sumY = yValues.reduce((sum, y) => sum + y, 0);
  const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
  const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = yValues.reduce((sum, y) => sum + y * y, 0);
  
  const numerator = (n * sumXY - sumX * sumY) ** 2;
  const denominator = (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY);
  
  if (denominator === 0) return NaN;
  
  return numerator / denominator;
};

// Excel-like guards to prevent NaN cascades
export function IFERROR<T>(value: any, fallback: T): T | number | string {
  return (value === null || value === undefined || Number.isNaN(value)) ? fallback : value;
}

export function DIV(a: any, b: any): number {
  const x = Number(a), y = Number(b);
  if (y === 0) return NaN; // Excel would be #DIV/0!; let IFERROR catch it
  return x / y;
}
