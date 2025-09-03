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

    // Get detailed information about key cells
    const cellInfo = {
      B18: {
        value: worksheet.getCell('B18').value,
        formula: worksheet.getCell('B18').formula,
        type: worksheet.getCell('B18').type
      },
      C18: {
        value: worksheet.getCell('C18').value,
        formula: worksheet.getCell('C18').formula,
        type: worksheet.getCell('C18').type
      },
      D18: {
        value: worksheet.getCell('D18').value,
        formula: worksheet.getCell('D18').formula,
        type: worksheet.getCell('D18').type
      },
      D19: {
        value: worksheet.getCell('D19').value,
        formula: worksheet.getCell('D19').formula,
        type: worksheet.getCell('D19').type
      },
      D20: {
        value: worksheet.getCell('D20').value,
        formula: worksheet.getCell('D20').formula,
        type: worksheet.getCell('D20').type
      },
      D21: {
        value: worksheet.getCell('D21').value,
        formula: worksheet.getCell('D21').formula,
        type: worksheet.getCell('D21').type
      },
      C35: {
        value: worksheet.getCell('C35').value,
        formula: worksheet.getCell('C35').formula,
        type: worksheet.getCell('C35').type
      },
      J11: {
        value: worksheet.getCell('J11').value,
        formula: worksheet.getCell('J11').formula,
        type: worksheet.getCell('J11').type
      },
      K15: {
        value: worksheet.getCell('K15').value,
        formula: worksheet.getCell('K15').formula,
        type: worksheet.getCell('K15').type,
        result: worksheet.getCell('K15').result
      },
      // Check some intermediate cells that might be part of the calculation
      J15: {
        value: worksheet.getCell('J15').value,
        formula: worksheet.getCell('J15').formula,
        type: worksheet.getCell('J15').type
      },
      P10: {
        value: worksheet.getCell('P10').value,
        formula: worksheet.getCell('P10').formula,
        type: worksheet.getCell('P10').type
      },
      // Add more cells to trace the calculation
      I15: {
        value: worksheet.getCell('I15').value,
        formula: worksheet.getCell('I15').formula,
        type: worksheet.getCell('I15').type
      },
      M10: {
        value: worksheet.getCell('M10').value,
        formula: worksheet.getCell('M10').formula,
        type: worksheet.getCell('M10').type
      },
      O10: {
        value: worksheet.getCell('O10').value,
        formula: worksheet.getCell('O10').formula,
        type: worksheet.getCell('O10').type
      },
      // Add the actual TOU input cells
      F18: {
        value: worksheet.getCell('F18').value,
        formula: worksheet.getCell('F18').formula,
        type: worksheet.getCell('F18').type
      },
      F24: {
        value: worksheet.getCell('F24').value,
        formula: worksheet.getCell('F24').formula,
        type: worksheet.getCell('F24').type
      },
      F30: {
        value: worksheet.getCell('F30').value,
        formula: worksheet.getCell('F30').formula,
        type: worksheet.getCell('F30').type
      }
    };

    // Check if any cells have formulas
    const cellsWithFormulas = Object.entries(cellInfo)
      .filter(([_, info]) => info.formula)
      .map(([cell, info]) => ({ cell, formula: info.formula }));

    return NextResponse.json({
      ok: true,
      cellInfo,
      cellsWithFormulas,
      message: 'Formula analysis completed'
    });

  } catch (error: any) {
    console.error('[DEBUG-FORMULA] Failed:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'DEBUG_FORMULA_ERROR',
        details: error.message
      },
      { status: 500 }
    );
  }
}
