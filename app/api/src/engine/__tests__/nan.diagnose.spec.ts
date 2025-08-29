import { describe, it } from 'vitest';
import { compute } from '../compute';
import { NODES } from '../graph';

function isNum(x: any) { return typeof x === 'number' && !Number.isNaN(x); }

describe('NaN diagnosis', () => {
  it('prints unresolved nodes that block K15', () => {
    // Seed with the same inputs we've been testing
    const inputs = {
      // Fill weight (g) - maps to Sheet1!J11
      'Sheet1!J11': 1.0,
      
      // Dilution coefficient - maps to Sheet1!C18
      'Sheet1!C18': 0.001, // 1:1000
      
      // TOU values - maps to Sheet1!D18, D19, D20, D21
      'Sheet1!D18': 100,  // h0
      'Sheet1!D19': 120,  // h10
      'Sheet1!D20': 150,  // h20
      'Sheet1!D21': 180,  // h24
      
      // Required dilution spec - maps to Sheet1!C35
      'Sheet1!C35': 1,
      
      // Constants from Excel (these should match your workbook)
      'Sheet1!H3': 0.5,
      'Sheet1!I3': 1.0,
      'Sheet1!K4': 1.0,
      'Sheet1!L4': 1.0,
      'Sheet1!I4': 1.0,
      'Sheet1!$N$14': 100,
      'Sheet1!$O$14': 1.0,
      
      // Additional required inputs that are referenced but not calculated
      'Sheet1!B6': 0.5,   // Referenced by B9, B5, B4
      'Sheet1!D6': 0.5,   // Referenced by D9, D5, D4
      'Sheet1!B18': 0.001, // Referenced by B12, B24, B30
      'Sheet1!$B$18': 0.001, // Absolute reference
      'Sheet1!$C$18': 0.001, // Absolute reference
      'Sheet1!$D$18': 100,   // Absolute reference
      'Sheet1!$D$19': 120,   // Absolute reference
      'Sheet1!$D$20': 150,   // Absolute reference
      'Sheet1!$D$21': 180,   // Absolute reference
      'Sheet1!$C$35': 1,     // Absolute reference
      'Sheet1!$I$4': 1.0,    // Absolute reference
      'Sheet1!$L$4': 1.0,    // Absolute reference
      'Sheet1!$K$4': 1.0,    // Absolute reference
      
      // Additional cells that might be needed
      'Sheet1!J23': 1.0,     // Referenced by N22, O22, P22
      'Sheet1!J24': 1.0,     // Referenced by N23, O23, P23
      'Sheet1!J25': 1.0,     // Referenced by N24, O24, P24
      'Sheet1!J26': 1.0,     // Referenced by N25, O25, P25
      'Sheet1!O28': 1.0,     // Referenced by N28
      'Sheet1!O29': 1.0,     // Referenced by N29
      'Sheet1!O30': 1.0,     // Referenced by N30
      'Sheet1!O31': 1.0,     // Referenced by N31
      'Sheet1!O32': 1.0,     // Referenced by N32
      'Sheet1!O33': 1.0,     // Referenced by N33
      
      // Additional cells needed for statistical calculations
      'Sheet1!K23': 1.0,     // Referenced by L23 - TEMPORARILY HARDCODED
      'Sheet1!K24': 20,      // Already calculated, but ensure it's available
      'Sheet1!K25': 50,      // Already calculated, but ensure it's available
      'Sheet1!K26': 80,      // Already calculated, but ensure it's available
      
      // Values for statistical functions (B3-B9, C3-C9, D3-D9)
      'Sheet1!B3': 0.125,    // For statistical calculations
      'Sheet1!B4': 0.25,     // For statistical calculations
      'Sheet1!B5': 0.5,      // For statistical calculations
      'Sheet1!B6': 0.5,      // For statistical calculations
      'Sheet1!B7': 0.5,      // For statistical calculations
      'Sheet1!B8': 0.5,      // For statistical calculations
      'Sheet1!B9': 1.0,      // For statistical calculations
      'Sheet1!C3': 0.0625,   // For statistical calculations
      'Sheet1!C4': 0.125,    // For statistical calculations
      'Sheet1!C5': 0.25,     // For statistical calculations
      'Sheet1!C6': 0.5,      // For statistical calculations
      'Sheet1!C7': 0.5,      // For statistical calculations
      'Sheet1!C8': 0.5,      // For statistical calculations
      'Sheet1!C9': 1.0,      // For statistical calculations
      'Sheet1!D3': 0.0625,   // For statistical calculations
      'Sheet1!D4': 0.125,    // For statistical calculations
      'Sheet1!D5': 0.25,     // For statistical calculations
      'Sheet1!D6': 0.5,      // For statistical calculations
      'Sheet1!D7': 0.5,      // For statistical calculations
      'Sheet1!D8': 0.5,      // For statistical calculations
      'Sheet1!D9': 1.0,      // For statistical calculations
      'Sheet1!A3': 0.125,    // For statistical calculations
      'Sheet1!A4': 0.25,     // For statistical calculations
      'Sheet1!A5': 0.5,      // For statistical calculations
      'Sheet1!A6': 1.0,      // For statistical calculations
      'Sheet1!A7': 1.0,      // For statistical calculations
      'Sheet1!A8': 1.0,      // For statistical calculations
      'Sheet1!A9': 2.0,      // For statistical calculations
    };

    const ctx = compute(inputs);
    const nodes = NODES.map(n => n.id);      // topological order ending at Sheet1!K15
    const byId: Record<string, any> = ctx;

    const nanNodes: string[] = [];
    for (const id of nodes) {
      const v = byId[id];
      if (!isNum(v)) nanNodes.push(id);
    }

    // Print a compact report (Cursor will show this in test output)
    console.log('--- NaN Report (topological) ---');
    for (const id of nanNodes) {
      const n = NODES.find(node => node.id === id);
      const why = n
        ? `deps=${(n.deps || []).join(', ')}`
        : 'missing in graph';
      const kind =
        inputs[id] !== undefined ? 'INPUT (provided?)' :
        (n?.fn ? 'HAS_FN' : 'MISSING_FN');
      console.log(`${id} :: ${kind} :: ${why}`);
    }

    // Also show the K15 calculation chain specifically
    console.log('\n--- K15 Calculation Chain Status ---');
    const k15Chain = ['Sheet1!J15', 'Sheet1!P10', 'Sheet1!K15'];
    for (const id of k15Chain) {
      const v = byId[id];
      const status = isNum(v) ? `✅ ${v}` : `❌ ${v}`;
      console.log(`${id}: ${status}`);
    }

    // Show what's blocking K15
    if (!isNum(byId['Sheet1!K15'])) {
      console.log('\n--- What\'s Blocking K15 ---');
      const blockers = ['Sheet1!J15', 'Sheet1!P10'];
      for (const id of blockers) {
        const v = byId[id];
        if (!isNum(v)) {
          console.log(`${id} is ${v} - this blocks K15`);
        }
      }
    }
  });
});
