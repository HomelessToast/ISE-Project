import { NextResponse } from 'next/server';
import { workbookService } from '@/lib/workbook-service';

export async function GET() {
  try {
    // Test basic workbook operations
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

    // Try to read the workbook
    const workbook = new (await import('exceljs')).Workbook();
    await workbook.xlsx.readFile(diagnostics.workbookPath);
    
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json(
        { 
          ok: false, 
          error: 'NO_WORKSHEET',
          details: 'No worksheet found in workbook'
        },
        { status: 500 }
      );
    }

    // Test writing to a cell
    const testCell = worksheet.getCell('A1');
    testCell.value = 'Test Value';
    
    // Test reading from a cell
    const readValue = testCell.value;

    return NextResponse.json({
      ok: true,
      message: 'Workbook test successful',
      diagnostics: {
        workbookPath: diagnostics.workbookPath,
        workbookExists: diagnostics.workbookExists,
        worksheetCount: workbook.worksheets.length,
        firstWorksheetName: worksheet.name,
        testCellValue: readValue,
        namedRanges: (() => {
          const names: string[] = [];
          try {
            if (workbook.definedNames && typeof workbook.definedNames.forEach === 'function') {
              workbook.definedNames.forEach((dn: any) => {
                names.push(dn.name);
              });
            }
          } catch (e) {
            console.log('Warning: Could not access defined names');
          }
          return names;
        })()
      }
    });

  } catch (error: any) {
    console.error('[TEST-WORKBOOK] Failed to test workbook:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'WORKBOOK_TEST_ERROR',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
