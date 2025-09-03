import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import path from 'path';
import fs from 'fs';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetCell = searchParams.get('cell') || 'I15';
    
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
    
    // Get the target cell formula
    const targetCellData = worksheet[targetCell];
    if (!targetCellData || targetCellData.t !== 'f') {
      return NextResponse.json({ 
        error: `Cell ${targetCell} is not a formula cell`,
        cellType: targetCellData?.t,
        cellValue: targetCellData?.v
      }, { status: 400 });
    }
    
    const targetFormula = targetCellData.f;
    
    // Find F-cells that might be referenced (F18, F24, F30, etc.)
    const fCellPattern = /F\d+/g;
    const fCells = Array.from(new Set(targetFormula.match(fCellPattern) || []));
    
    // Get formulas for F-cells
    const fCellFormulas: Record<string, string> = {};
    for (const fCell of fCells) {
      const fCellData = worksheet[fCell as keyof typeof worksheet];
      if (fCellData && fCellData.t === 'f') {
        fCellFormulas[fCell] = fCellData.f;
      }
    }
    
    // Extract all cell references from the formulas
    const cellRefPattern = /[A-Z]+\d+/g;
    const allRefs = new Set<string>();
    
    // Add refs from target cell
    const targetRefs = targetFormula.match(cellRefPattern) || [];
    targetRefs.forEach(ref => allRefs.add(ref));
    
    // Add refs from F-cells
    Object.values(fCellFormulas).forEach(formula => {
      const refs = formula.match(cellRefPattern) || [];
      refs.forEach(ref => allRefs.add(ref));
    });
    
    // Remove the target cell itself from refs
    allRefs.delete(targetCell);
    
    return NextResponse.json({
      targetCell,
      targetFormula,
      fCells: fCells.map(cell => ({
        cell,
        formula: fCellFormulas[cell] || 'Not a formula'
      })),
      allCellReferences: Array.from(allRefs).sort(),
      analysis: {
        totalFCells: fCells.length,
        totalReferences: allRefs.size,
        hasFormula: !!targetFormula
      }
    });
    
  } catch (error) {
    console.error('Error in trace endpoint:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
