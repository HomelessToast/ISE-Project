// Unit tests for ISE Enumeration Algorithm
// Verifies exact replication of "Matthew's copy.xlsx" Excel workbook
// Source: BioCount.ai proprietary method

import { describe, it, expect } from 'vitest';
import { 
  computeCfuPerG, 
  parseDilutionDisplay, 
  calculateDilutionCoefficient,
  formatCfuResult,
  CALIBRATION_VERSION,
  ENUMERATION_MODEL
} from './compute';

describe('ISE Enumeration Algorithm', () => {
  describe('computeCfuPerG - Core Algorithm', () => {
    it('should handle TPC assay with all timepoints', () => {
      const sample = {
        sampleId: 'TPC-001',
        assayType: 'TPC' as const,
        tou: { t0: 100, t10: 120, t20: 150, t24: 180 },
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('numeric');
      if (result.kind === 'numeric') {
        expect(result.cfuPerG).toBeCloseTo(2730375.43, 0);
        expect(result.formatted).toBe('2.73e+6 cfu/g');
        expect(result.debug?.chosenTimepoint).toBe('t24');
        expect(result.debug?.deltaTOU).toBe(80);
        expect(result.debug?.intermediateCfuVial).toBeCloseTo(2730.38, 0);
        expect(result.debug?.calibrationVersion).toBe(CALIBRATION_VERSION);
        expect(result.debug?.enumerationModel).toBe(ENUMERATION_MODEL);
      }
    });

    it('should handle YM assay with all timepoints', () => {
      const sample = {
        sampleId: 'YM-001',
        assayType: 'YM' as const,
        tou: { t0: 80, t20: 120, t40: 200, t48: 250 },
        dilutionCoefficient: 0.01,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('numeric');
      if (result.kind === 'numeric') {
        expect(result.cfuPerG).toBeCloseTo(434782.61, 0);
        expect(result.formatted).toBe('434,782.609 cfu/g');
        expect(result.debug?.chosenTimepoint).toBe('t48');
        expect(result.debug?.deltaTOU).toBe(170);
        expect(result.debug?.intermediateCfuVial).toBeCloseTo(4347.83, 0);
      }
    });

    it('should handle TAC as TPC', () => {
      const sample = {
        sampleId: 'TAC-001',
        assayType: 'TAC' as const,
        tou: { t0: 100, t10: 130, t20: 160, t24: 190 },
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('numeric');
      if (result.kind === 'numeric') {
        expect(result.cfuPerG).toBeCloseTo(3071672.35, 0);
        expect(result.debug?.chosenTimepoint).toBe('t24');
      }
    });

    it('should handle LOD case (no rise)', () => {
      const sample = {
        sampleId: 'LOD-001',
        assayType: 'TPC' as const,
        tou: { t0: 125, t24: 140 }, // ΔTOU = 15 < 20
        dilutionCoefficient: 0.0001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('lod');
      if (result.kind === 'lod') {
        expect(result.lodCfuPerG).toBe(10000); // ceil(1/(0.0001*1))
        expect(result.formatted).toBe('≤ 10,000 cfu/g');
        expect(result.debug?.deltaTOU).toBe(15);
      }
    });

    it('should handle missing later timepoints', () => {
      const sample = {
        sampleId: 'MISSING-001',
        assayType: 'TPC' as const,
        tou: { t0: 100 }, // No later timepoints
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('pending');
      if (result.kind === 'pending') {
        expect(result.message).toContain('TPC requires at least one later timepoint after t0');
      }
    });

    it('should handle fallback timepoints', () => {
      const sample = {
        sampleId: 'FALLBACK-001',
        assayType: 'TPC' as const,
        tou: { t0: 100, t10: 120, t20: 150 }, // Missing t24
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('numeric');
      if (result.kind === 'numeric') {
        expect(result.debug?.chosenTimepoint).toBe('t20');
        expect(result.debug?.deltaTOU).toBe(50);
      }
    });

    it('should handle negative delta TOU (clamp to 0)', () => {
      const sample = {
        sampleId: 'NEGATIVE-001',
        assayType: 'TPC' as const,
        tou: { t0: 200, t24: 180 }, // t24 < t0
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('lod');
      if (result.kind === 'lod') {
        expect(result.debug?.deltaTOU).toBe(0);
      }
    });

    it('should use default fill weight when not specified', () => {
      const sample = {
        sampleId: 'DEFAULT-001',
        assayType: 'TPC' as const,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: 0.001
        // fillWeightG not specified
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('numeric');
      if (result.kind === 'numeric') {
        expect(result.debug?.constantsUsed.fillWeightG).toBe(1.0);
      }
    });
  });

  describe('Golden Master Tests - Excel Workbook Exact Match', () => {
    it('should match Balm-1 example from Excel', () => {
      // Balm-1: t0=151, t10=184, t20=189, t24=190
      // ΔTOU = 190 - 151 = 39
      // CFU/vial = 39 / 0.0293 = 1331.06
      // CFU/g = 1331.06 / (0.001 * 1) = 1,331,060
      const sample = {
        sampleId: 'Balm-1',
        assayType: 'TPC' as const,
        tou: { t0: 151, t10: 184, t20: 189, t24: 190 },
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('numeric');
      if (result.kind === 'numeric') {
        expect(result.debug?.deltaTOU).toBe(39);
        expect(result.debug?.intermediateCfuVial).toBeCloseTo(1331.06, 1);
        expect(result.cfuPerG).toBeCloseTo(1331058.02, 0);
        expect(result.formatted).toBe('1.33e+6 cfu/g');
      }
    });

    it('should match LOD case from Excel baseline', () => {
      // Flat curve case: t0=125, t24=140 (ΔTOU=15 < 20)
      // LOD = ceil(1/(0.0001*1)) = 10,000
      const sample = {
        sampleId: 'FLAT-001',
        assayType: 'TPC' as const,
        tou: { t0: 125, t24: 140 },
        dilutionCoefficient: 0.0001,
        fillWeightG: 1.0
      };

      const result = computeCfuPerG(sample);
      
      expect(result.kind).toBe('lod');
      if (result.kind === 'lod') {
        expect(result.lodCfuPerG).toBe(10000);
        expect(result.formatted).toBe('≤ 10,000 cfu/g');
      }
    });
  });

  describe('Property-Based Checks', () => {
    it('should produce 10x opposite change in CFU/g when dilutionCoefficient changes by 10x', () => {
      const baseSample = {
        sampleId: 'PROP-001',
        assayType: 'TPC' as const,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result1 = computeCfuPerG(baseSample);
      const result2 = computeCfuPerG({ ...baseSample, dilutionCoefficient: 0.01 });

      expect(result1.kind).toBe('numeric');
      expect(result2.kind).toBe('numeric');
      
      if (result1.kind === 'numeric' && result2.kind === 'numeric') {
        // 10x increase in dilutionCoefficient should produce 10x decrease in CFU/g
        expect(result2.cfuPerG).toBeCloseTo(result1.cfuPerG / 10, 0);
      }
    });

    it('should not decrease CFU/g when endTOU increases', () => {
      const baseSample = {
        sampleId: 'PROP-002',
        assayType: 'TPC' as const,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: 0.001,
        fillWeightG: 1.0
      };

      const result1 = computeCfuPerG(baseSample);
      const result2 = computeCfuPerG({ ...baseSample, tou: { ...baseSample.tou, t24: 200 } });

      expect(result1.kind).toBe('numeric');
      expect(result2.kind).toBe('numeric');
      
      if (result1.kind === 'numeric' && result2.kind === 'numeric') {
        expect(result2.cfuPerG).toBeGreaterThan(result1.cfuPerG);
      }
    });
  });

  describe('Input Validation', () => {
    it('should reject missing sampleId', () => {
      const sample = {
        sampleId: '',
        assayType: 'TPC' as const,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: 0.001
      };

      const result = computeCfuPerG(sample);
      expect(result.kind).toBe('pending');
      if (result.kind === 'pending') {
        expect(result.message).toContain('Sample ID is required');
      }
    });

    it('should reject invalid assayType', () => {
      const sample = {
        sampleId: 'TEST-001',
        assayType: 'INVALID' as any,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: 0.001
      };

      const result = computeCfuPerG(sample);
      expect(result.kind).toBe('pending');
      if (result.kind === 'pending') {
        expect(result.message).toContain('Assay type must be TPC, YM, or TAC');
      }
    });

    it('should reject negative t0', () => {
      const sample = {
        sampleId: 'TEST-002',
        assayType: 'TPC' as const,
        tou: { t0: -10, t24: 150 },
        dilutionCoefficient: 0.001
      };

      const result = computeCfuPerG(sample);
      expect(result.kind).toBe('pending');
      if (result.kind === 'pending') {
        expect(result.message).toContain('Baseline TOU (t0) is required, must be finite, and ≥ 0');
      }
    });

    it('should reject invalid dilutionCoefficient', () => {
      const sample = {
        sampleId: 'TEST-003',
        assayType: 'TPC' as const,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: -0.001
      };

      const result = computeCfuPerG(sample);
      expect(result.kind).toBe('pending');
      if (result.kind === 'pending') {
        expect(result.message).toContain('Dilution coefficient must be finite and > 0');
      }
    });

    it('should reject invalid fillWeightG', () => {
      const sample = {
        sampleId: 'TEST-004',
        assayType: 'TPC' as const,
        tou: { t0: 100, t24: 150 },
        dilutionCoefficient: 0.001,
        fillWeightG: -1
      };

      const result = computeCfuPerG(sample);
      expect(result.kind).toBe('pending');
      if (result.kind === 'pending') {
        expect(result.message).toContain('Fill weight must be finite and > 0');
      }
    });
  });

  describe('Helper Functions', () => {
    it('should parse dilution display strings', () => {
      expect(parseDilutionDisplay('1:1,000,000')).toBe(1e-6);
      expect(parseDilutionDisplay('1:10')).toBe(0.1);
      expect(parseDilutionDisplay('1:100')).toBe(0.01);
    });

    it('should calculate dilution coefficient from sample prep', () => {
      // 10g sample + 90mL diluent = 1:10 dilution
      const result = calculateDilutionCoefficient(10, 90, 0.001);
      expect(result).toBeCloseTo(0.0001, 4);
    });

    it('should format CFU results correctly', () => {
      const numericResult = { kind: 'numeric', cfuPerG: 1234567 } as any;
      const lodResult = { kind: 'lod', lodCfuPerG: 10000 } as any;
      
      expect(formatCfuResult(numericResult)).toBe('1.23e+6 cfu/g');
      expect(formatCfuResult(lodResult)).toBe('≤ 10,000 cfu/g');
    });
  });
});
