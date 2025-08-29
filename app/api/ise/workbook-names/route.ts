import { NextRequest, NextResponse } from 'next/server';
import { workbookService } from '@/lib/workbook-service';

export async function GET(request: NextRequest) {
  try {
    const instructions = workbookService.getWorkbookNameInstructions();
    
    return NextResponse.json({
      instructions,
      summary: 'Instructions for adding workbook-scope named ranges',
      note: 'Add these names in Excel via Formulas → Name Manager to enable named range reading'
    });
    
  } catch (error) {
    console.error('Error in workbook-names endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
