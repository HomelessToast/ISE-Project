import * as fs from 'fs';
import * as path from 'path';
import { AVERAGE, SLOPE, INTERCEPT, RSQ, LOG, POWER, IF, ROUND, ABS } from '@/app/api/src/engine/excelFns';

export type Value = number | string | boolean | null;
export type Context = Record<string, Value>;

type CsvRow = {
  sheet: string;
  cell: string;
  mapping?: string;
  kind: 'constant' | 'formula';
  is_user_input_blue?: string;
  fill_color_token?: string;
  formula_raw?: string;
  value_literal?: string;
};

function parseCsv(content: string): CsvRow[] {
  const lines = content.split(/\r?\n/).filter(l => l.trim().length > 0);
  if (lines.length === 0) return [];
  const header = lines[0].split(',').map(h => h.trim());
  const hasSimple = header.length === 2 && header[0] === 'cell' && header[1] === 'mapping';
  const idx = (name: string) => header.indexOf(name);
  const rows: CsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/).map(c => c.replace(/^\"|\"$/g, ''));
    if (hasSimple) {
      if (cols.length < 2) continue;
      const cell = cols[0];
      const mapping = cols[1];
      // mapping looks like "K15=..." where RHS may be formula, number, or text
      const eqPos = mapping.indexOf('=');
      const rhsRaw = eqPos > -1 ? mapping.substring(eqPos + 1).trim() : mapping.trim();
      const isNumeric = rhsRaw !== '' && !isNaN(Number(rhsRaw));
      const looksLikeRef = /\$?[A-Z]{1,3}\$?\d+/.test(rhsRaw);
      const looksLikeRange = /\$?[A-Z]{1,3}\$?\d+:\$?[A-Z]{1,3}\$?\d+/.test(rhsRaw);
      const looksLikeFunc = /^[A-Z]{2,}\s*\(/.test(rhsRaw);
      const hasNumberedOperator = /\d\s*[+*/^]\s*\d/.test(rhsRaw) || /\d\s*-\s*\d/.test(rhsRaw);
      const hasLowercase = /[a-z]/.test(rhsRaw);
      const hasBrackets = /[\[\]]/.test(rhsRaw);
      const isFormula = rhsRaw.startsWith('=') || (!hasLowercase && !hasBrackets && (looksLikeRef || looksLikeRange || looksLikeFunc || hasNumberedOperator));
      if (isFormula) {
        const rhs = rhsRaw.startsWith('=') ? rhsRaw : `=${rhsRaw}`;
        rows.push({ sheet: 'Sheet1', cell, kind: 'formula', formula_raw: rhs });
      } else if (isNumeric) {
        rows.push({ sheet: 'Sheet1', cell, kind: 'constant', value_literal: rhsRaw });
      } else {
        rows.push({ sheet: 'Sheet1', cell, kind: 'constant', value_literal: rhsRaw });
      }
    } else {
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
  }
  return rows;
}

function isCellRef(token: string): boolean {
  return /^\$?[A-Z]{1,3}\$?\d+$/.test(token);
}

function colToNum(col: string): number {
  let n = 0;
  for (let i = 0; i < col.length; i++) {
    n = n * 26 + (col.charCodeAt(i) - 64);
  }
  return n;
}

function numToCol(num: number): string {
  let s = '';
  while (num > 0) {
    const m = (num - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    num = Math.floor((num - 1) / 26);
  }
  return s;
}

function expandRange(range: string): string[] {
  const [start, end] = range.split(':');
  const s = start.replace(/\$/g, '');
  const e = end.replace(/\$/g, '');
  const m1 = s.match(/^([A-Z]+)(\d+)$/);
  const m2 = e.match(/^([A-Z]+)(\d+)$/);
  if (!m1 || !m2) return [];
  const c1 = colToNum(m1[1]);
  const r1 = parseInt(m1[2], 10);
  const c2 = colToNum(m2[1]);
  const r2 = parseInt(m2[2], 10);
  const cols = [c1, c2].sort((a, b) => a - b);
  const rows = [r1, r2].sort((a, b) => a - b);
  const out: string[] = [];
  for (let c = cols[0]; c <= cols[1]; c++) {
    for (let r = rows[0]; r <= rows[1]; r++) {
      out.push(`${numToCol(c)}${r}`);
    }
  }
  return out;
}

function findDeps(formula: string): Set<string> {
  const deps = new Set<string>();
  const f = formula.startsWith('=') ? formula.substring(1) : formula;
  // ranges
  const rangeRe = /\$?[A-Z]{1,3}\$?\d+:\$?[A-Z]{1,3}\$?\d+/g;
  const refRe = /\$?[A-Z]{1,3}\$?\d+/g;
  for (const m of Array.from(f.matchAll(rangeRe))) {
    const cells = expandRange(m[0]);
    for (const c of cells) deps.add(`Sheet1!${c}`);
  }
  // single refs
  for (const m of Array.from(f.replace(rangeRe, '').matchAll(refRe))) {
    const ref = m[0].replace(/\$/g, '');
    deps.add(`Sheet1!${ref}`);
  }
  return deps;
}

function compile(formula: string): (ctx: Context) => any {
  const raw = formula.startsWith('=') ? formula.substring(1) : formula;
  // Normalize: strip any explicit sheet qualifiers like Sheet1!A1
  let expr = raw.replace(/\b[A-Za-z0-9_]+!/g, '');

  // 1) Replace ranges with placeholders to avoid double replacement
  const rangeRegex = /\$?[A-Z]{1,3}\$?\d+:\$?[A-Z]{1,3}\$?\d+/g;
  const rangeStash: string[] = [];
  expr = expr.replace(rangeRegex, (range) => {
    const cells = expandRange(range);
    const items = cells.map(c => `ctx['Sheet1!${c}']`).join(', ');
    const asArray = `[${items}]`;
    const placeholder = `__RANGE_${rangeStash.length}__`;
    rangeStash.push(asArray);
    return placeholder;
  });

  // 2) Replace single refs with ctx lookups
  expr = expr.replace(/\$?[A-Z]{1,3}\$?\d+/g, (ref) => `ctx['Sheet1!${ref.replace(/\$/g,'')}']`);

  // 3) Restore range placeholders
  expr = rangeStash.reduce((acc, val, i) => acc.replace(new RegExp(`__RANGE_${i}__`, 'g'), val), expr);
  // Map caret exponent if any (Excel uses POWER, but keep safe)
  expr = expr.replace(/\^/g, '**');
  // Build evaluator
  try {
    const fn = new Function(
      'ctx',
      'AVERAGE','SLOPE','INTERCEPT','RSQ','LOG','POWER','IF','ROUND','ABS',
      `"use strict"; return (${expr});`
    );
    return (ctx: Context) => fn(ctx, AVERAGE, SLOPE, INTERCEPT, RSQ, LOG, POWER, IF, ROUND, ABS);
  } catch (e: any) {
    throw new Error(`Compile failed for formula "${formula}" -> expr "${expr}": ${e?.message || String(e)}`);
  }
}

export class CsvEngine {
  private rows: CsvRow[] = [];
  private nodeOrder: string[] = [];
  private compilers: Record<string, (ctx: Context) => any> = {};

  constructor(csvPath?: string) {
    const p = csvPath ?? path.resolve(process.cwd(), 'assets', 'New_Formula_Mapping.csv');
    const content = fs.readFileSync(p, 'utf8');
    this.rows = parseCsv(content);
    this.prepare();
  }

  private prepare() {
    const ids = new Set<string>();
    const depsMap: Record<string, Set<string>> = {};
    for (const r of this.rows) {
      const id = `${r.sheet}!${r.cell}`;
      ids.add(id);
      if (r.kind === 'formula' && r.formula_raw) {
        depsMap[id] = findDeps(r.formula_raw);
        this.compilers[id] = compile(r.formula_raw);
      } else {
        depsMap[id] = new Set();
      }
    }
    // Kahn's algorithm
    const indeg: Record<string, number> = {};
    for (const id of Array.from(ids)) indeg[id] = 0;
    for (const [id, dset] of Object.entries(depsMap)) {
      for (const d of Array.from(dset)) if (indeg[d] !== undefined) indeg[id]++;
    }
    const q: string[] = [];
    for (const [id, deg] of Object.entries(indeg)) if (deg === 0) q.push(id);
    const order: string[] = [];
    while (q.length) {
      const v = q.shift()!;
      order.push(v);
      for (const [id, dset] of Object.entries(depsMap)) {
        if (dset.has(v)) {
          indeg[id]--;
          if (indeg[id] === 0) q.push(id);
        }
      }
    }
    this.nodeOrder = order;
  }

  compute(initial: Partial<Context>): Context {
    const ctx: Context = { ...(initial as any) };
    // Seed constants from CSV when not provided
    for (const r of this.rows) {
      const id = `${r.sheet}!${r.cell}`;
      if (ctx[id] !== undefined) continue;
      if (r.kind === 'constant') {
        if (r.value_literal === undefined || r.value_literal === '') continue;
        const n = Number(r.value_literal);
        ctx[id] = Number.isFinite(n) ? n : r.value_literal!;
      }
    }
    // Evaluate in node order
    for (const id of this.nodeOrder) {
      if (ctx[id] !== undefined) continue;
      const compileFn = this.compilers[id];
      if (compileFn) {
        try {
          ctx[id] = compileFn(ctx);
        } catch (e) {
          // Leave undefined; caller can inspect
        }
      }
    }
    return ctx;
  }
}

export function computeFromCsv(inputs: {
  dilutionDisplay?: string;
  dilutionCoeff?: number;
  requiredDilutionSpec?: string;
  fillWeight_g: number;
  tou: { h0: number; h10: number; h20: number; h24: number };
}): Context {
  const parseDisplay = (d?: string) => {
    if (!d) return undefined;
    if (d.includes(':')) {
      const denom = Number(d.split(':')[1].replace(/,/g, ''));
      return denom > 0 ? 1 / denom : undefined;
    }
    const n = Number(d);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  const parseDenominator = (d?: string) => {
    if (!d) return undefined;
    if (d.includes(':')) {
      const denom = Number(d.split(':')[1].replace(/,/g, ''));
      return Number.isFinite(denom) && denom > 0 ? denom : undefined;
    }
    const n = Number(d);
    if (Number.isFinite(n) && n > 0) {
      // If user gave coefficient numeric (e.g., 0.001), invert to denom
      return n <= 1 ? 1 / n : n;
    }
    return undefined;
  };
  const coeffTest = inputs.dilutionCoeff ?? parseDisplay(inputs.dilutionDisplay) ?? 0.001;
  const denomSpec = parseDenominator(inputs.requiredDilutionSpec ?? '1:1000') ?? 1000;

  const engine = new CsvEngine();
  const ctx = engine.compute({
    'Sheet1!B18': coeffTest,             // coefficient
    'Sheet1!C18': 1 / coeffTest,         // denominator
    'Sheet1!C35': denomSpec,             // C35 is denominator in sheet
    'Sheet1!J11': inputs.fillWeight_g,
    'Sheet1!D18': inputs.tou.h0,
    'Sheet1!D19': inputs.tou.h10,
    'Sheet1!D20': inputs.tou.h20,
    'Sheet1!D21': inputs.tou.h24,
  });
  return ctx;
}

export function diagnoseCsv(): {
  totalRows: number;
  formulaRows: number;
  compiledOk: number;
  errors: Array<{ id: string; formula: string; error: string }>;
} {
  const p = path.resolve(process.cwd(), 'assets', 'New_Formula_Mapping.csv');
  const content = fs.readFileSync(p, 'utf8');
  const rows = parseCsv(content);
  const errors: Array<{ id: string; formula: string; error: string }> = [];
  let ok = 0;
  let formulas = 0;
  for (const r of rows) {
    if (r.kind === 'formula' && r.formula_raw) {
      formulas++;
      const id = `${r.sheet}!${r.cell}`;
      try {
        compile(r.formula_raw);
        ok++;
      } catch (e: any) {
        errors.push({ id, formula: r.formula_raw, error: e?.message || String(e) });
      }
    }
  }
  return { totalRows: rows.length, formulaRows: formulas, compiledOk: ok, errors };
}

export function analyzeMissingDependencies(): {
  defined: string[];
  referenced: string[];
  missing: string[];
} {
  const p = path.resolve(process.cwd(), 'assets', 'New_Formula_Mapping.csv');
  const content = fs.readFileSync(p, 'utf8');
  const rows = parseCsv(content);
  const defined = new Set<string>();
  const referenced = new Set<string>();

  for (const r of rows) {
    const id = `${r.sheet}!${r.cell}`;
    defined.add(id);
    if (r.kind === 'formula' && r.formula_raw) {
      const deps = findDeps(r.formula_raw);
      for (const d of Array.from(deps)) referenced.add(d);
    }
  }

  // Seeded inputs at runtime (avoid flagging as missing)
  const seeded = [
    'Sheet1!B18','Sheet1!C18','Sheet1!C35','Sheet1!J11',
    'Sheet1!D18','Sheet1!D19','Sheet1!D20','Sheet1!D21',
  ];
  for (const s of seeded) defined.add(s);

  const missing = Array.from(referenced).filter(id => !defined.has(id));
  missing.sort();
  return { defined: Array.from(defined).sort(), referenced: Array.from(referenced).sort(), missing };
}


