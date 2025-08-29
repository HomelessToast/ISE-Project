import { NextRequest, NextResponse } from 'next/server';
import { computeCfuPerG, SampleInput } from '@/alg/ise/compute';

export async function POST(request: NextRequest) {
  try {
    const body: SampleInput = await request.json();
    
    // Compute the result using the ISE algorithm
    const result = computeCfuPerG(body);
    
    // Log audit information
    console.log(`[ENUMERATE] ${body.sampleId} | ${body.assayType} | ${result.debug?.chosenTimepoint} | ΔTOU: ${result.debug?.deltaTOU} | ${result.kind}`);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('[ENUMERATE] Error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
