import { NextRequest, NextResponse } from 'next/server';
import { computeCfuPerG, SampleInput } from '@/alg/ise/compute';

export async function POST(request: NextRequest) {
  try {
    const body: { samples: SampleInput[] } = await request.json();
    
    if (!Array.isArray(body.samples)) {
      return NextResponse.json(
        { error: 'Request body must contain a samples array' },
        { status: 400 }
      );
    }
    
    const results = body.samples.map(sample => {
      const result = computeCfuPerG(sample);
      
      // Log audit information for each sample
      console.log(`[BATCH] ${sample.sampleId} | ${sample.assayType} | ${result.debug?.chosenTimepoint} | ΔTOU: ${result.debug?.deltaTOU} | ${result.kind}`);
      
      return {
        sampleId: sample.sampleId,
        result
      };
    });
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('[BATCH] Error:', error);
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    );
  }
}
