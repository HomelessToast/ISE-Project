// ISE Method Constants
// Source: "Matthew's copy.xlsx" Excel workbook - Bacterial/TPC path
// Calibration Version: ISE-v1.0

// Test Types (UI shows TAC/TPC; treat TAC=TPC)
export enum TestType {
  TPC = 'TPC',        // Total Plate Count (Bacterial)
  YM = 'YM',          // Yeast/Mold
}

// TOU → CFU per vial using organism-class constants
// Source: Excel workbook - 0.01 mg CO₂ ≈ 100,000 cfu/mL ≈ 2930 TOU ⇒ 1 cfu ≈ 0.0293 TOU
export const TOU_PER_CFU = {
  [TestType.TPC]: 0.0293,  // Total Plate Count
  [TestType.YM]: 0.0391,   // Yeast/Mold
} as const;

// "No-rise" noise floor for TPC: MIN_RISE_TOU = 20 at 1:10
// Scale linearly by dilution if desired, but simplest is to apply 20 TOU as a flat minimal detectable rise
export const MIN_RISE_TOU = 20;

// Default fill weight in grams
export const DEFAULT_FILL_WEIGHT_G = 1.0;

// Time intervals for each assay type
export const ASSAY_TIME_POINTS = {
  [TestType.TPC]: ['t0', 't10', 't20', 't24'],  // TPC uses {t0,t10,t20,t24}
  [TestType.YM]: ['t0', 't20', 't40', 't48'],   // YM uses {t0,t20,t40,t48}
} as const;

// Calibration version for audit trails
export const CALIBRATION_VERSION = "ISE-v1.0";

// Dilution Coefficients (for reference - not used in core math)
// Source: Table 2 - Based on 10g sample + 90mL diluent = 1:10 dilution
// 1mL from each dilution goes into test vial
export const DILUTION_COEFFICIENTS = {
  '1': 1.0,           // Non-diluted samples (water) or non-dissolved (environmental swabs)
  '1:10': 0.1,        // 1/10th of original cfu/g in test vial
  '1:100': 0.01,      // 1/100th of original cfu/g in test vial
  '1:1000': 0.001,    // 1/1000th of original cfu/g in test vial
  '1:10000': 0.0001,  // 1/10000th of original cfu/g in test vial
  '1:100000': 0.00001, // 1/100000th of original cfu/g in test vial
} as const;

// Legacy constants for backward compatibility (deprecated)
export const TOU_CFU_RATIOS = TOU_PER_CFU;
export const TestType_BACTERIA = TestType.TPC;
export const TestType_YEAST_MOLD = TestType.YM;

// Growth Phase Detection Thresholds
// Source: Manuscript describes three distinct phases: leading, exponential, and lagging
export const PHASE_DETECTION_THRESHOLDS = {
  [TestType.TPC]: {
    LAG_PHASE_THRESHOLD: 0.05,      // TOU change threshold for lag phase
    EXPONENTIAL_PHASE_THRESHOLD: 0.15, // TOU change threshold for exponential phase
    STATIONARY_PHASE_THRESHOLD: 0.05,  // TOU change threshold for stationary phase
    MIN_TOU_CHANGE: 0.01,          // Minimum TOU change to consider growth
  },
  [TestType.YM]: {
    LAG_PHASE_THRESHOLD: 0.08,      // Yeast/Mold typically slower growing
    EXPONENTIAL_PHASE_THRESHOLD: 0.12, // Lower threshold due to slower growth
    STATIONARY_PHASE_THRESHOLD: 0.04,  // Lower threshold for stationary phase
    MIN_TOU_CHANGE: 0.01,          // Minimum TOU change to consider growth
  },
} as const;

// Time Intervals (in hours)
// Source: Manuscript mentions 0hr baseline and time-based calculations
export const TIME_INTERVALS = {
  BASELINE: 0,        // Starting TOU (0 hr) - baseline only, not used in final calculation
  STANDARD: [10, 20, 24, 48], // Standard timepoints for bacteria (24h) and yeast/mold (48h)
  BACTERIA_ASSAY_DURATION: 24, // Total Aerobic Count: 24 hours
  YEAST_MOLD_ASSAY_DURATION: 48, // Yeast/Mold: 48 hours
} as const;

// Validation Thresholds
// Source: Manuscript states ±0.5 log difference is statistically similar
export const VALIDATION_THRESHOLDS = {
  LOG_DIFFERENCE_THRESHOLD: 0.5,    // ±0.5 log difference for method comparison
  MIN_CFU_COUNT: 1,                 // Minimum detectable: 1 cfu/g
  MAX_CFU_COUNT: 4500000,           // Maximum: 4.5 million cfu/g
  R_SQUARED_THRESHOLD: 0.9025,      // Minimum R² for acceptable correlation
} as const;

// Growth Curve Analysis
export const GROWTH_CURVE_ANALYSIS = {
  SHUT_EYE_STAGE_THRESHOLD: 0.02,   // TOU change threshold for shut-eye stage
  FLATLINE_THRESHOLD: 0.005,         // TOU change threshold for flatline detection
  QUICK_RISE_THRESHOLD: 0.1,         // Threshold for quick rise detection
  MIN_GROWTH_TIME: 2,                // Minimum hours for growth detection
} as const;

// Internal Control Projections
export const INTERNAL_CONTROL = {
  PROJECTION_INTERVALS: [6, 12, 18, 24, 36, 48], // Timepoints for projections
  CONFIDENCE_LEVEL: 0.95,            // 95% confidence intervals
  MIN_PROJECTION_SAMPLES: 3,         // Minimum samples for projection
} as const;
