import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'csv-parse/sync';

interface GoldenCase {
  case_id: string;
  dilution_display: string;
  dilution_coeff?: string;
  fill_weight_g: string;
  tou_0h: string;
  tou_10h: string;
  tou_20h: string;
  tou_24h: string;
  required_dilution_spec: string;
  expected_k15_display: string;
  notes?: string;
}

interface TestResult {
  caseId: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

describe('ISE Golden Cases Parity Test', () => {
  let goldenCases: GoldenCase[] = [];

  beforeAll(async () => {
    try {
      // Read golden cases CSV
      const csvPath = join(process.cwd(), 'test', 'golden-cases.csv');
      const csvContent = readFileSync(csvPath, 'utf-8');
      
      goldenCases = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      console.log(`Loaded ${goldenCases.length} golden cases for testing`);
    } catch (error) {
      console.error('Failed to load golden cases:', error);
      throw error;
    }
  });

  it('should process all golden cases and match Excel results', async () => {
    const results: TestResult[] = [];
    let passedCount = 0;
    let failedCount = 0;

    for (const testCase of goldenCases) {
      try {
        // Prepare test input
        const input = {
          dilutionDisplay: testCase.dilution_display,
          dilutionCoeff: testCase.dilution_coeff ? Number(testCase.dilution_coeff) : undefined,
        tou: {
            h0: Number(testCase.tou_0h),
            h10: Number(testCase.tou_10h),
            h20: Number(testCase.tou_20h),
            h24: Number(testCase.tou_24h)
          },
          requiredDilutionSpec: testCase.required_dilution_spec,
          fillWeight_g: Number(testCase.fill_weight_g)
        };

        // Call the compute API
        const response = await fetch('http://localhost:3000/api/ise/compute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(input),
        });

        if (!response.ok) {
          const errorData = await response.json();
          results.push({
            caseId: testCase.case_id,
            expected: testCase.expected_k15_display,
            actual: 'ERROR',
            passed: false,
            error: `${response.status}: ${errorData.error || 'Unknown error'}`
          });
          failedCount++;
          continue;
        }

        const data = await response.json();
        
        if (!data.ok) {
          results.push({
            caseId: testCase.case_id,
            expected: testCase.expected_k15_display,
            actual: 'ERROR',
            passed: false,
            error: data.error || 'Unknown error'
          });
          failedCount++;
          continue;
        }

        const actual = data.result.display;
        const expected = testCase.expected_k15_display;
        const passed = actual === expected;

        results.push({
          caseId: testCase.case_id,
          expected,
          actual,
          passed
        });

        if (passed) {
          passedCount++;
        } else {
          failedCount++;
        }

      } catch (error) {
        results.push({
          caseId: testCase.case_id,
          expected: testCase.expected_k15_display,
          actual: 'EXCEPTION',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown exception'
        });
        failedCount++;
      }
    }

    // Log results summary
    console.log('\n=== ISE Golden Cases Test Results ===');
    console.log(`Total cases: ${goldenCases.length}`);
    console.log(`Passed: ${passedCount}`);
    console.log(`Failed: ${failedCount}`);
    console.log(`Success rate: ${((passedCount / goldenCases.length) * 100).toFixed(1)}%`);

    // Log failed cases
    if (failedCount > 0) {
      console.log('\n=== Failed Cases ===');
      results.filter(r => !r.passed).forEach(result => {
        console.log(`Case ${result.caseId}:`);
        console.log(`  Expected: ${result.expected}`);
        console.log(`  Actual:   ${result.actual}`);
        if (result.error) {
          console.log(`  Error:    ${result.error}`);
        }
        console.log('');
      });
    }

    // Assert all cases passed
    expect(failedCount).toBe(0);
  }, 60000); // 60 second timeout for all cases

  it('should handle invalid inputs correctly', async () => {
    const invalidInputs = [
      {
        name: 'negative TOU values',
        input: {
          tou: { h0: -1, h10: 0, h20: 0, h24: 0 },
        requiredDilutionSpec: '1:1000',
        fillWeight_g: 1.0
        },
        expectedError: 'VALIDATION_ERROR'
      },
      {
        name: 'zero fill weight',
        input: {
          tou: { h0: 0, h10: 0, h20: 0, h24: 0 },
        requiredDilutionSpec: '1:1000',
          fillWeight_g: 0
        },
        expectedError: 'VALIDATION_ERROR'
      },
      {
        name: 'missing required fields',
        input: {
          tou: { h0: 0, h10: 0, h20: 0, h24: 0 }
        },
        expectedError: 'VALIDATION_ERROR'
      }
    ];

    for (const testCase of invalidInputs) {
      try {
        const response = await fetch('http://localhost:3000/api/ise/compute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testCase.input),
        });

        const data = await response.json();
        
        expect(response.status).toBe(400);
        expect(data.ok).toBe(false);
        expect(data.error).toBe(testCase.expectedError);
        
      } catch (error) {
        throw new Error(`Test case "${testCase.name}" failed: ${error}`);
      }
    }
  });
});
