import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { action, testValues } = body;
    
    const templatePath = path.join(process.cwd(), 'assets', 'biocount-template.xlsx');
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({
        ok: false,
        error: 'WORKBOOK_NOT_FOUND',
        path: templatePath
      });
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);

    if (action === 'read') {
      // Read current cell values
      const cellValues = {
        B18: worksheet.getCell('B18').value,
        C18: worksheet.getCell('C18').value,
        D18: worksheet.getCell('D18').value,  // TOU 0h input
        D19: worksheet.getCell('D19').value,  // TOU 10h input
        D20: worksheet.getCell('D20').value,  // TOU 20h input
        D21: worksheet.getCell('D21').value,  // TOU 24h input
        C35: worksheet.getCell('C35').value,
        J11: worksheet.getCell('J11').value,
        K15: worksheet.getCell('K15').value
      };

      return NextResponse.json({
        ok: true,
        action: 'read',
        cellValues,
        message: 'Current cell values read successfully'
      });

    } else if (action === 'write') {
      // Write test values to cells
      if (testValues) {
        if (testValues.dilutionDisplay) {
          worksheet.getCell('C18').value = testValues.dilutionDisplay;
        }
        if (testValues.tou) {
          worksheet.getCell('D18').value = testValues.tou.h0;   // Fixed: D18 is TOU 0h input
          worksheet.getCell('D19').value = testValues.tou.h10;  // Fixed: D19 is TOU 10h input
          worksheet.getCell('D20').value = testValues.tou.h20;  // Fixed: D20 is TOU 20h input
          worksheet.getCell('D21').value = testValues.tou.h24;  // Fixed: D21 is TOU 24h input
        }
        if (testValues.requiredDilutionSpec) {
          worksheet.getCell('C35').value = testValues.requiredDilutionSpec;
        }
        if (testValues.fillWeight_g) {
          worksheet.getCell('J11').value = testValues.fillWeight_g;
        }
      }

      // Read back the values to confirm they were written
      const writtenValues = {
        B18: worksheet.getCell('B18').value,
        C18: worksheet.getCell('C18').value,
        D18: worksheet.getCell('D18').value,  // TOU 0h input
        D19: worksheet.getCell('D19').value,  // TOU 10h input
        D20: worksheet.getCell('D20').value,  // TOU 20h input
        D21: worksheet.getCell('D21').value,  // TOU 24h input
        C35: worksheet.getCell('C35').value,
        J11: worksheet.getCell('J11').value,
        K15: worksheet.getCell('K15').value
      };

      return NextResponse.json({
        ok: true,
        action: 'write',
        writtenValues,
        message: 'Test values written successfully'
      });

    } else {
      return NextResponse.json({
        ok: false,
        error: 'INVALID_ACTION',
        details: 'Action must be "read" or "write"'
      });
    }

  } catch (error: any) {
    console.error('[DEBUG-CELLS] Failed:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'DEBUG_CELLS_ERROR',
        details: error.message
      },
      { status: 500 }
    );
  }
}
