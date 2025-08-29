import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    // Load the workbook
    const templatePath = path.resolve(process.cwd(), "assets", "biocount-template.xlsx");
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: 'Workbook not found' }, { status: 404 });
    }
    
    const buf = fs.readFileSync(templatePath);
    const workbook = XLSX.read(buf, { type: "buffer", cellNF: true, cellFormula: true });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    
    if (!worksheet) {
      return NextResponse.json({ error: 'No worksheet found' }, { status: 404 });
    }
    
    // Define the cells we want to inspect
    const cellsToInspect = [
      { name: 'Output_CFU_per_mL', address: 'K15' }, // The green "Ave. Assay cfu/mL" cell
      { name: 'Output_Sample_CFU_per_g', address: 'L15' }, // The green "Sample cfu/g" cell
      { name: 'K15_Current', address: 'K15' }, // Current K15 to see what it actually contains
      { name: 'L15_Current', address: 'L15' }, // Current L15 to see what it actually contains
      { name: 'J15_Current', address: 'J15' }, // J15 that feeds into K15
      { name: 'I15_Current', address: 'I15' }, // I15 that might be the actual CFU/mL
      { name: 'P10_Current', address: 'P10' }, // P10 exponent
      { name: 'J11_Current', address: 'J11' }, // Fill weight
      { name: 'B18_Current', address: 'B18' }, // Dilution coefficient
      { name: 'C18_Current', address: 'C18' }  // Dilution denominator
    ];
    
    const inspectionResults = [];
    
    for (const cellInfo of cellsToInspect) {
      const cellData = worksheet[cellInfo.address];
      if (cellData) {
        inspectionResults.push({
          name: cellInfo.name,
          address: cellInfo.address,
          type: cellData.t,
          value: cellData.v,
          formula: cellData.f || 'No formula',
          displayValue: cellData.w || cellData.v // Use formatted value if available
        });
      } else {
        inspectionResults.push({
          name: cellInfo.name,
          address: cellInfo.address,
          type: 'empty',
          value: null,
          formula: 'No formula',
          displayValue: 'Empty cell'
        });
      }
    }
    
    // Also look for any cells with "cfu" or "CFU" in their formulas or values
    const cfuRelatedCells = [];
    for (const [address, cellData] of Object.entries(worksheet)) {
      if (cellData && typeof cellData === 'object' && 'v' in cellData) {
        const cellValue = String(cellData.v || '');
        const cellFormula = String(cellData.f || '');
        
        if (cellValue.toLowerCase().includes('cfu') || 
            cellFormula.toLowerCase().includes('cfu') ||
            cellValue.toLowerCase().includes('assay') ||
            cellValue.toLowerCase().includes('sample')) {
          cfuRelatedCells.push({
            address,
            type: cellData.t,
            value: cellData.v,
            formula: cellData.f || 'No formula',
            displayValue: cellData.w || cellData.v
          });
        }
      }
    }
    
    return NextResponse.json({
      inspectionResults,
      cfuRelatedCells: cfuRelatedCells.slice(0, 20), // Limit to first 20 to avoid overwhelming
      analysis: {
        totalCellsInspected: inspectionResults.length,
        totalCfuRelatedCells: cfuRelatedCells.length,
        workbookPath: templatePath,
        sheetName: workbook.SheetNames[0]
      }
    });
    
  } catch (error) {
    console.error('Error in formulas endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
