import { NextRequest, NextResponse } from 'next/server';
import { workbookService } from '@/lib/workbook-service';
import { validateISEInput, ISEComputeInput } from '@/lib/validation';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse request body
    const body = await request.json();
    
    // Handle both CSV and JSON array formats
    let inputs: ISEComputeInput[];
    
    if (Array.isArray(body)) {
      // JSON array format
      inputs = body;
    } else if (body.csv) {
      // CSV format - parse CSV string
      inputs = parseCSVInput(body.csv);
    } else {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'INVALID_FORMAT',
          details: 'Request must be either a JSON array or contain a CSV field'
        },
        { status: 400 }
      );
    }

    // Validate batch size
    if (inputs.length === 0) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'EMPTY_BATCH',
          details: 'Batch cannot be empty'
        },
        { status: 400 }
      );
    }

    if (inputs.length > 100) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'BATCH_TOO_LARGE',
          details: 'Batch cannot exceed 100 samples'
        },
        { status: 400 }
      );
    }

    // Log batch request
    console.log(`[BATCH] Processing batch of ${inputs.length} samples`);

    // Process each input sequentially
    const results = [];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      
      try {
        // Validate individual input
        const validation = validateISEInput(input);
        if (!validation.valid) {
          results.push({
            caseId: i + 1,
            error: 'VALIDATION_ERROR',
            details: validation.errors
          });
          continue;
        }

        // Compute result
        const result = await workbookService.computeResult(input);
        results.push({
          caseId: i + 1,
          raw: result.raw,
          display: result.display
        });

      } catch (error: any) {
        // Handle specific errors for this case
        if (error.message.includes('DILUTION_MISMATCH')) {
          results.push({
            caseId: i + 1,
            error: 'DILUTION_MISMATCH',
            details: error.message
          });
        } else {
          results.push({
            caseId: i + 1,
            error: 'COMPUTATION_ERROR',
            details: 'An error occurred during calculation'
          });
        }
      }
    }

    const batchTime = Date.now() - startTime;
    console.log(`[BATCH] Batch processing completed in ${batchTime}ms`);

    // Return batch results
    return NextResponse.json({
      ok: true,
      results,
      metadata: {
        totalCases: inputs.length,
        successfulCases: results.filter(r => !r.error).length,
        failedCases: results.filter(r => r.error).length,
        processingTimeMs: batchTime
      }
    });

  } catch (error: any) {
    const batchTime = Date.now() - startTime;
    console.error(`[BATCH] Batch processing failed after ${batchTime}ms:`, error.message);

    return NextResponse.json(
      { 
        ok: false, 
        error: 'BATCH_ERROR',
        details: 'An error occurred during batch processing'
      },
      { status: 500 }
    );
  }
}

/**
 * Parse CSV input string to array of objects
 */
function parseCSVInput(csvString: string): ISEComputeInput[] {
  const lines = csvString.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const inputs: ISEComputeInput[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    const values = line.split(',').map(v => v.trim());
    const input: any = {};
    
    // Map CSV columns to input fields
    headers.forEach((header, index) => {
      const value = values[index];
      
      switch (header.toLowerCase()) {
        case 'dilution_display':
        case 'dilutiondisplay':
          input.dilutionDisplay = value;
          break;
        case 'dilution_coeff':
        case 'dilutioncoeff':
          input.dilutionCoeff = value ? Number(value) : undefined;
          break;
        case 'tou_0h':
        case 'tou0h':
          if (!input.tou) input.tou = {};
          input.tou.h0 = Number(value);
          break;
        case 'tou_10h':
        case 'tou10h':
          if (!input.tou) input.tou = {};
          input.tou.h10 = Number(value);
          break;
        case 'tou_20h':
        case 'tou20h':
          if (!input.tou) input.tou = {};
          input.tou.h20 = Number(value);
          break;
        case 'tou_24h':
        case 'tou24h':
          if (!input.tou) input.tou = {};
          input.tou.h24 = Number(value);
          break;
        case 'required_dilution_spec':
        case 'requireddilutionspec':
          input.requiredDilutionSpec = value;
          break;
        case 'fill_weight_g':
        case 'fillweightg':
          input.fillWeight_g = Number(value);
          break;
      }
    });
    
    // Ensure all required fields are present
    if (input.tou && input.requiredDilutionSpec && input.fillWeight_g !== undefined) {
      inputs.push(input as ISEComputeInput);
    }
  }
  
  return inputs;
}
