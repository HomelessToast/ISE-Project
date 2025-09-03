import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
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

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);
    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({
        ok: false,
        error: 'WORKSHEET_NOT_FOUND',
        details: 'Worksheet index 1 not found in workbook'
      }, { status: 500 });
    }

    // Get the constants used in the calculation
    const constants = {
      N2: {
        value: worksheet.getCell('N2').value,
        type: worksheet.getCell('N2').type,
        formula: worksheet.getCell('N2').formula
      },
      N3: {
        value: worksheet.getCell('N3').value,
        type: worksheet.getCell('N3').type,
        formula: worksheet.getCell('N3').formula
      },
      N4: {
        value: worksheet.getCell('N4').value,
        type: worksheet.getCell('N4').type,
        formula: worksheet.getCell('N4').formula
      },
      I4: {
        value: worksheet.getCell('I4').value,
        type: worksheet.getCell('I4').type,
        formula: worksheet.getCell('I4').formula
      },
      C18: {
        value: worksheet.getCell('C18').value,
        type: worksheet.getCell('C18').type,
        formula: worksheet.getCell('C18').formula
      },
      C35: {
        value: worksheet.getCell('C35').value,
        type: worksheet.getCell('C35').type,
        formula: worksheet.getCell('C35').formula
      },
      J11: {
        value: worksheet.getCell('J11').value,
        type: worksheet.getCell('J11').type,
        formula: worksheet.getCell('J11').formula
      },
      P10: {
        value: worksheet.getCell('P10').value,
        type: worksheet.getCell('P10').type,
        formula: worksheet.getCell('P10').formula
      }
    };

    return NextResponse.json({
      ok: true,
      constants,
      message: 'Constants retrieved successfully'
    });

  } catch (error: any) {
    console.error('[DEBUG-CONSTANTS] Failed:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'DEBUG_CONSTANTS_ERROR',
        details: error.message
      },
      { status: 500 }
    );
  }
}
