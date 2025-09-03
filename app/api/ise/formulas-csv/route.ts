import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { diagnoseCsv } from '@/lib/csv-engine';

// xlsx-calc exports a function directly
const XLSX_CALC = require('xlsx-calc');

export const runtime = 'nodejs';

type CsvRow = {
  sheet: string;
  cell: string;
  mapping: string;
  kind: 'constant' | 'formula';
  is_user_input_blue: string;
  fill_color_token: string;
  formula_raw: string | undefined;
  value_literal: string | undefined;
};

function parseCsv(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  const header = lines[0].split(',');
  const idx = (name: string) => header.indexOf(name);
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.replace(/^\"|\"$/g, ''));
    if (cols.length < header.length) continue;
    rows.push({
      sheet: cols[idx('sheet')],
      cell: cols[idx('cell')],
      mapping: cols[idx('mapping')],
      kind: (cols[idx('kind')] as any) || 'constant',
      is_user_input_blue: cols[idx('is_user_input_blue')],
      fill_color_token: cols[idx('fill_color_token')],
      formula_raw: cols[idx('formula_raw')] || undefined,
      value_literal: cols[idx('value_literal')] || undefined,
    });
  }
  return rows;
}

function isNumericLike(s: string | undefined): boolean {
  if (s == null || s === '') return false;
  const n = Number(s);
  return Number.isFinite(n);
}

function buildWorkbookFromCsv(rows: CsvRow[]) {
  const sheetName = 'Sheet1';
  const sheet: Record<string, any> = {};
  for (const r of rows) {
    if (r.sheet !== sheetName) continue; // single-sheet for now
    if (r.kind === 'formula' && r.formula_raw) {
      const f = r.formula_raw.startsWith('=') ? r.formula_raw.substring(1) : r.formula_raw;
      sheet[r.cell] = { f, t: 'n' };
    } else {
      // constant cell
      if (isNumericLike(r.value_literal)) {
        sheet[r.cell] = { v: Number(r.value_literal), t: 'n' };
      } else if (r.value_literal != null) {
        sheet[r.cell] = { v: r.value_literal, t: 's' };
      }
    }
  }
  return { SheetNames: [sheetName], Sheets: { [sheetName]: sheet } };
}

export async function GET() {
  const csvPath = path.resolve(process.cwd(), 'assets', 'biocount_template_cell_formulas.csv');
  if (!fs.existsSync(csvPath)) {
    return NextResponse.json({ error: 'CSV not found', path: csvPath }, { status: 404 });
  }
  const csv = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(csv);
  const diag = diagnoseCsv();
  return NextResponse.json({ count: rows.length, rows, diagnosis: diag });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      dilutionDisplay,
      dilutionCoeff,
      requiredDilutionSpec,
      fillWeight_g,
      tou,
    }: {
      dilutionDisplay?: string;
      dilutionCoeff?: number;
      requiredDilutionSpec?: string;
      fillWeight_g: number;
      tou: { h0: number; h10: number; h20: number; h24: number };
    } = body;

    const parseDisplay = (d?: string) => {
      if (!d) return undefined;
      if (d.includes(':')) {
        const denom = Number(d.split(':')[1].replace(/,/g, ''));
        return denom > 0 ? 1 / denom : undefined;
      }
      const n = Number(d);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    };

    const coeffTest = dilutionCoeff ?? parseDisplay(dilutionDisplay) ?? 0.001;
    const coeffSpec = parseDisplay(requiredDilutionSpec ?? '1:1000') ?? 0.001;

    const csvPath = path.resolve(process.cwd(), 'assets', 'biocount_template_cell_formulas.csv');
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: 'CSV not found', path: csvPath }, { status: 404 });
    }
    const csv = fs.readFileSync(csvPath, 'utf8');
    const rows = parseCsv(csv);
    const wb = buildWorkbookFromCsv(rows);
    const ws = wb.Sheets['Sheet1'];

    // Seed required inputs according to Name Manager mapping
    ws['B18'] = { v: coeffTest, t: 'n' };      // coefficient
    ws['C18'] = { v: 1 / coeffTest, t: 'n' };  // denominator
    ws['C35'] = { v: 1 / coeffSpec, t: 'n' };  // Required spec denominator as in sheet (1000)
    ws['J11'] = { v: fillWeight_g, t: 'n' };
    ws['D18'] = { v: tou.h0, t: 'n' };
    ws['D19'] = { v: tou.h10, t: 'n' };
    ws['D20'] = { v: tou.h20, t: 'n' };
    ws['D21'] = { v: tou.h24, t: 'n' };
    // Offset_P10 at S11
    if (!ws['S11']) ws['S11'] = { v: 2, t: 'n' };

    // Recalculate
    if (XLSX_CALC && typeof XLSX_CALC === 'function') {
      XLSX_CALC(wb);
    }

    const j15 = ws['J15'];
    const k15 = ws['K15'];
    const p10 = ws['P10'];
    const i15 = ws['I15'];

    return NextResponse.json({
      ok: true,
      inputs: { coeffTest, coeffSpec, fillWeight_g, tou },
      outputs: {
        J15: { value: j15?.v ?? null, formula: j15?.f ?? null },
        K15: { value: k15?.v ?? null, formula: k15?.f ?? null },
        I15: { value: i15?.v ?? null, formula: i15?.f ?? null },
        P10: { value: p10?.v ?? null, formula: p10?.f ?? null },
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}


