// Proprietary ISE Enumeration Algorithm
// Replicates "Matthew's copy.xlsx" Excel workbook exactly
// Source: BioCount.ai proprietary method

import { TestType, TOU_PER_CFU, MIN_RISE_TOU, DEFAULT_FILL_WEIGHT_G } from './constants';

// Calibration version for audit trails
export const CALIBRATION_VERSION = "ISE-v1.0";

// Feature flag for future-proofing (default to direct ΔTOU model)
export const ENUMERATION_MODEL: 'delta' | 'phase' = 'delta';

export interface SampleInput {
  sampleId: string;
  assayType: 'TPC' | 'YM' | 'TAC';
  tou: {
    t0: number;
    t10?: number; t20?: number; t24?: number;
    t40?: number; t48?: number;
  };
  testDilutionDisplay?: string; // not used in math
  testDilution?: number;        // not used in math
  dilutionCoefficient: number;  // grams of original per mL at tested dilution
  fillWeightG?: number;         // default 1.0
}

type DebugInfo = {
  deltaTOU: number;
  chosenTimepoint: 't10'|'t20'|'t24'|'t40'|'t48'|'t0';
  intermediateCfuVial?: number;
  constantsUsed: {
    touPerCfu: number;
    minRiseTOU: number;
    fillWeightG: number;
  };
  calibrationVersion: string;
  enumerationModel: string;
};

export type Result =
  | { kind: 'numeric'; cfuPerG: number; formatted: string; debug?: DebugInfo }
  | { kind: 'lod'; lodCfuPerG: number; formatted: string; debug?: DebugInfo }
  | { kind: 'pending'; message: string; debug?: DebugInfo };

// Input validation function
function validateSampleInput(sample: SampleInput): string | null {
  // Validate sampleId
  if (!sample.sampleId || typeof sample.sampleId !== 'string') {
    return 'Sample ID is required and must be a string';
  }

  // Validate assayType
  if (!['TPC', 'YM', 'TAC'].includes(sample.assayType)) {
    return 'Assay type must be TPC, YM, or TAC';
  }

  // Validate TOU values
  if (sample.tou.t0 == null || !isFinite(sample.tou.t0) || sample.tou.t0 < 0) {
    return 'Baseline TOU (t0) is required, must be finite, and ≥ 0';
  }

  // Validate dilutionCoefficient
  if (!isFinite(sample.dilutionCoefficient) || sample.dilutionCoefficient <= 0) {
    return 'Dilution coefficient must be finite and > 0';
  }

  // Validate fillWeightG if provided
  if (sample.fillWeightG !== undefined && (!isFinite(sample.fillWeightG) || sample.fillWeightG <= 0)) {
    return 'Fill weight must be finite and > 0';
  }

  // Validate that at least one later timepoint exists
  const assay: 'TPC'|'YM' = sample.assayType === 'TAC' ? 'TPC' : sample.assayType;
  const hasLaterTimepoint = assay === 'TPC' 
    ? (sample.tou.t10 !== undefined || sample.tou.t20 !== undefined || sample.tou.t24 !== undefined)
    : (sample.tou.t20 !== undefined || sample.tou.t40 !== undefined || sample.tou.t48 !== undefined);
  
  if (!hasLaterTimepoint) {
    return `${assay} requires at least one later timepoint after t0`;
  }

  // Validate individual TOU values are finite and non-negative
  const timepoints = ['t10', 't20', 't24', 't40', 't48'] as const;
  for (const tp of timepoints) {
    if (sample.tou[tp] !== undefined) {
      if (!isFinite(sample.tou[tp]!) || sample.tou[tp]! < 0) {
        return `TOU value at ${tp} must be finite and ≥ 0`;
      }
    }
  }

  return null; // Validation passed
}

function pickEnd(assay: 'TPC'|'YM', tou: SampleInput['tou']) {
  if (assay === 'TPC') {
    if (typeof tou.t24 === 'number') return ['t24', tou.t24] as const;
    if (typeof tou.t20 === 'number') return ['t20', tou.t20] as const;
    if (typeof tou.t10 === 'number') return ['t10', tou.t10] as const;
  } else {
    if (typeof tou.t48 === 'number') return ['t48', tou.t48] as const;
    if (typeof tou.t40 === 'number') return ['t40', tou.t40] as const;
    if (typeof tou.t20 === 'number') return ['t20', tou.t20] as const;
  }
  return null;
}

/** Direct ΔTOU enumeration model (single source of truth) */
export function computeCfuPerG(sample: SampleInput): Result {
  // Input validation
  const validationError = validateSampleInput(sample);
  if (validationError) {
    return { 
      kind: 'pending', 
      message: validationError,
      debug: {
        deltaTOU: 0,
        chosenTimepoint: 't0',
        constantsUsed: {
          touPerCfu: 0,
          minRiseTOU: MIN_RISE_TOU,
          fillWeightG: sample.fillWeightG ?? DEFAULT_FILL_WEIGHT_G
        },
        calibrationVersion: CALIBRATION_VERSION,
        enumerationModel: ENUMERATION_MODEL
      }
    };
  }

  const assay: 'TPC'|'YM' = sample.assayType === 'TAC' ? 'TPC' : sample.assayType;
  const end = pickEnd(assay, sample.tou);
  if (!end) {
    return { 
      kind: 'pending', 
      message: `${assay} requires at least one later timepoint after t0`,
      debug: {
        deltaTOU: 0,
        chosenTimepoint: 't0',
        constantsUsed: {
          touPerCfu: 0,
          minRiseTOU: MIN_RISE_TOU,
          fillWeightG: sample.fillWeightG ?? DEFAULT_FILL_WEIGHT_G
        },
        calibrationVersion: CALIBRATION_VERSION,
        enumerationModel: ENUMERATION_MODEL
      }
    };
  }

  const [chosenTimepoint, endTOU] = end;
  const deltaTOU = Math.max(0, endTOU - sample.tou.t0); // Clamp negative deltas

  // LOD/no-growth rule
  if (deltaTOU < MIN_RISE_TOU) {
    const fillWeightG = sample.fillWeightG ?? DEFAULT_FILL_WEIGHT_G;
    const gramsInVial = sample.dilutionCoefficient * fillWeightG; // inoculum = 1 mL
    const lodCfuPerG = Math.ceil(1 / Math.max(gramsInVial, Number.EPSILON));
    
    return {
      kind: 'lod',
      lodCfuPerG,
      formatted: `≤ ${lodCfuPerG.toLocaleString()} cfu/g`,
      debug: {
        deltaTOU,
        chosenTimepoint: chosenTimepoint as DebugInfo['chosenTimepoint'],
        constantsUsed: {
          touPerCfu: TOU_PER_CFU[assay === 'TPC' ? TestType.TPC : TestType.YM],
          minRiseTOU: MIN_RISE_TOU,
          fillWeightG
        },
        calibrationVersion: CALIBRATION_VERSION,
        enumerationModel: ENUMERATION_MODEL
      }
    };
  }

  // Direct ΔTOU enumeration (no dilution scaling in vial math)
  const touPerCfu = TOU_PER_CFU[assay === 'TPC' ? TestType.TPC : TestType.YM];
  const cfuVial = deltaTOU / touPerCfu; // <-- direct ΔTOU, no dilution here
  
  const fillWeightG = sample.fillWeightG ?? DEFAULT_FILL_WEIGHT_G;
  const gramsInVial = sample.dilutionCoefficient * fillWeightG; // inoculum = 1 mL

  // Convert to CFU/g using only blue inputs
  const cfuPerG = cfuVial / Math.max(gramsInVial, Number.EPSILON);

  return {
    kind: 'numeric',
    cfuPerG,
    formatted: formatCfuResult({ kind: 'numeric', cfuPerG } as any),
    debug: {
      deltaTOU,
      chosenTimepoint: chosenTimepoint as DebugInfo['chosenTimepoint'],
      intermediateCfuVial: cfuVial,
      constantsUsed: {
        touPerCfu,
        minRiseTOU: MIN_RISE_TOU,
        fillWeightG
      },
      calibrationVersion: CALIBRATION_VERSION,
      enumerationModel: ENUMERATION_MODEL
    }
  };
}

/** Parse "1:1,000,000" -> 1e-6 (optional helper; unchanged) */
export function parseDilutionDisplay(display: string): number {
  const m = display.match(/^1:\s*([\d,]+)\s*$/);
  if (!m) throw new Error(`Invalid dilution display: ${display}`);
  const denom = Number(m[1].replace(/,/g, ''));
  if (!isFinite(denom) || denom <= 0) throw new Error(`Invalid dilution denominator: ${display}`);
  return 1 / denom;
}

/** Calculate grams/mL at tested dilution from sample prep (optional helper; unchanged) */
export function calculateDilutionCoefficient(sampleGrams: number, diluentMl: number, testDilution: number): number {
  const gramsPerMlAtPrimary = sampleGrams / (sampleGrams + diluentMl);
  return gramsPerMlAtPrimary * testDilution;
}

export function formatCfuResult(result: Result): string {
  if (result.kind === 'lod') return `≤ ${result.lodCfuPerG.toLocaleString()} cfu/g`;
  if (result.kind === 'numeric') {
    const n = result.cfuPerG;
    return n >= 1e6 ? `${n.toExponential(2)} cfu/g` : `${n.toLocaleString()} cfu/g`;
  }
  return result.message;
}
