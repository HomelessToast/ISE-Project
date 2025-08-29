import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const templatePath = path.join(process.cwd(), 'assets', 'biocount-template.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({
        ok: false,
        error: 'WORKBOOK_NOT_FOUND',
        path: templatePath
      });
    }

    // Test basic SheetJS functionality
    const workbook = XLSX.readFile(templatePath);
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];

    // Read some basic cell values
    const testCells = {
      B18: worksheet['B18'],
      C18: worksheet['C18'],
      D18: worksheet['D18'],
      D19: worksheet['D19'],
      D20: worksheet['D20'],
      D21: worksheet['D21'],
      K15: worksheet['K15']
    };

    // Test writing a value
    worksheet['D18'] = { v: 999, t: 'n' };
    const writtenValue = worksheet['D18'];

    return NextResponse.json({
      ok: true,
      message: 'SheetJS test successful',
      testCells,
      writtenValue,
      worksheetNames: workbook.SheetNames
    });

  } catch (error: any) {
    console.error('[TEST-SHEETJS] Failed:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'TEST_SHEETJS_ERROR',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
