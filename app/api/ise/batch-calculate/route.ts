import { NextRequest, NextResponse } from 'next/server';
import { computeFromCsv } from '@/lib/csv-engine';

export const runtime = 'nodejs';

interface BatchCalculationInput {
  samples: Array<{
    sampleName: string;
    dilutionDisplay: string;
    dilutionCoeff?: number;
    tou: {
      h0: number;
      h10: number;
      h20: number;
      h24: number;
    };
    requiredDilutionSpec: string;
    fillWeight_g: number;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchCalculationInput = await request.json();
    const { samples } = body;

    if (!samples || !Array.isArray(samples) || samples.length === 0) {
      return NextResponse.json(
        { error: 'Invalid input: samples array is required and must not be empty' },
        { status: 400 }
      );
    }

    const results: { [sampleName: string]: any } = {};

    // Process each sample individually through the CSV engine (source of truth)
    for (const sample of samples) {
      try {
        console.log(`Processing sample ${sample.sampleName} with CSV engine...`);

        const ctx = computeFromCsv({
          dilutionDisplay: sample.dilutionDisplay,
          dilutionCoeff: sample.dilutionCoeff,
          tou: { h0: sample.tou.h0, h10: sample.tou.h10, h20: sample.tou.h20, h24: sample.tou.h24 },
          requiredDilutionSpec: sample.requiredDilutionSpec,
          fillWeight_g: sample.fillWeight_g,
        });
        
        // Transform engine result to dashboard format
        const result = {
          kind: 'numeric',
          cfuPerG: typeof ctx['Sheet1!K15'] === 'number' ? (ctx['Sheet1!K15'] as number) : 0,
          cfuPerMl: typeof ctx['Sheet1!J15'] === 'number' ? (ctx['Sheet1!J15'] as number) : 0,
          formatted: typeof ctx['Sheet1!K15'] === 'number' ? (ctx['Sheet1!K15'] as number).toFixed(2) : '0.00',
          debug: {
            deltaTOU: sample.tou.h24 - sample.tou.h0,
            chosenTimepoint: 't24',
            intermediateCfuVial: (typeof ctx['Sheet1!K15'] === 'number' ? (ctx['Sheet1!K15'] as number) : 0) * sample.fillWeight_g,
            constantsUsed: {
              touPerCfu: 1, // Placeholder - Engine handles this internally
              minRiseTOU: 20,
              fillWeightG: sample.fillWeight_g,
            },
            calibrationVersion: '@biocount/ise-engine@0.1.0',
            enumerationModel: 'ISE Method - CSV Engine',
          }
        };
        
        results[sample.sampleName] = result;
        
      } catch (error) {
        console.error(`Error calculating ${sample.sampleName} with CSV engine:`, error);
        
        // Create error result
        const errorResult = {
          kind: 'pending',
          message: `Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          debug: {
            deltaTOU: sample.tou.h24 - sample.tou.h0,
            chosenTimepoint: 't24',
            constantsUsed: {
              touPerCfu: 1,
              minRiseTOU: 20,
              fillWeightG: sample.fillWeight_g,
            },
            calibrationVersion: '@biocount/ise-engine@0.1.0',
            enumerationModel: 'ISE Method - CSV Engine',
          }
        };
        
        results[sample.sampleName] = errorResult;
      }
    }

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Error in batch calculation API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Batch calculation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
