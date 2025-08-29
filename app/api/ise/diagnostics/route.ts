import { NextResponse } from 'next/server';
import { workbookService } from '@/lib/workbook-service';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Get workbook diagnostics
    const diagnostics = await workbookService.getDiagnostics();
    
    if (!diagnostics.workbookExists) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'WORKBOOK_NOT_FOUND',
          details: 'Workbook template not found',
          path: diagnostics.workbookPath
        },
        { status: 404 }
      );
    }

    // Return diagnostics information
    return NextResponse.json({
      ok: true,
      diagnostics: {
        workbookPath: diagnostics.workbookPath,
        workbookExists: diagnostics.workbookExists,
        namedRanges: diagnostics.namedRanges
      }
    });

  } catch (error: any) {
    console.error('[DIAGNOSTICS] Failed to get diagnostics:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'DIAGNOSTICS_ERROR',
        details: 'Failed to retrieve workbook diagnostics'
      },
      { status: 500 }
    );
  }
}
