import { NextRequest, NextResponse } from 'next/server';
import { validateISEInput, ISEComputeInput } from '@/lib/validation';
import { computeFromCsv } from '@/lib/csv-engine';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate input
    const validation = validateISEInput(body);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'VALIDATION_ERROR',
          details: validation.errors 
        },
        { status: 400 }
      );
    }

    // Compute result using CSV-derived engine
    const ctx = computeFromCsv({
      dilutionDisplay: body.dilutionDisplay,
      dilutionCoeff: body.dilutionCoeff,
      tou: { h0: body.tou.h0, h10: body.tou.h10, h20: body.tou.h20, h24: body.tou.h24 },
      requiredDilutionSpec: body.requiredDilutionSpec,
      fillWeight_g: body.fillWeight_g,
    });
    
    const computeTime = Date.now() - startTime;
    console.log(`[COMPUTE] Calculation completed in ${computeTime}ms`);

    // Return success response with CSV engine calculations
    return NextResponse.json({
      ok: true,
      result: {
        raw: typeof ctx['Sheet1!K15'] === 'number' ? (ctx['Sheet1!K15'] as number) : 0,
        display: typeof ctx['Sheet1!K15'] === 'number' ? (ctx['Sheet1!K15'] as number).toFixed(2) : '0.00',
        cfuPerG: typeof ctx['Sheet1!K15'] === 'number' ? (ctx['Sheet1!K15'] as number) : 0,
        cfuPerMl: typeof ctx['Sheet1!J15'] === 'number' ? (ctx['Sheet1!J15'] as number) : 0,
        calcVersion: '@biocount/csv-engine@0.1.0',
      }
    });

  } catch (error: any) {
    const computeTime = Date.now() - startTime;
    console.error(`[COMPUTE] Calculation failed after ${computeTime}ms:`, error.message);

    // Handle specific error types
    if (error.message.includes('Implement node')) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'ENGINE_ERROR',
          details: `Missing implementation: ${error.message}` 
        },
        { status: 500 }
      );
    }

    // Generic error
    return NextResponse.json(
      { 
        ok: false, 
        error: 'COMPUTATION_ERROR',
        details: 'An error occurred during calculation' 
      },
      { status: 500 }
    );
  }
}
