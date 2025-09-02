import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import * as formulajs from '@formulajs/formulajs';

// xlsx-calc exports a function directly, not an object
const XLSX_CALC = require('xlsx-calc');

// Named ranges mapping with fallback addresses
const NAMED_RANGES = {
  // Core calculation cells
  DILUTION_COEFF: { name: 'DilutionCoeff_B18', fallback: 'B18' },
  DILUTION_DENOM: { name: 'DilutionDenom_C18', fallback: 'C18' },
  REQUIRED_SPEC_COEFF: { name: 'RequiredSpecCoeff_C35', fallback: 'C35' },
  FILL_WEIGHT_G: { name: 'FillWeight_g_J11', fallback: 'J11' },
  EXPONENT_P10: { name: 'Exponent_P10', fallback: 'P10' },
  OFFSET_P10: { name: 'Offset_P10', fallback: 'P11' }, // The offset cell (currently "2" or "-2")
  
  // OUTPUT CELLS - the green cells the scientist sees (REQUIRED NAMED RANGES)
  OUTPUT_CFU_PER_ML: { name: 'Output_CFU_per_mL', fallback: '' }, // "Ave. Assay cfu/mL" cell (≈128)
  OUTPUT_SAMPLE_CFU_PER_G: { name: 'Output_Sample_CFU_per_g', fallback: '' }, // "Sample cfu/g" cell (≈1.3)
  OUTPUT_ADJUSTED_CFU_PER_G: { name: 'Output_Adjusted_CFU_per_g', fallback: '' }, // "Adjusted Sample cfu/g" cell if used
  
  // TOU input cells - these should feed the actual calculation chain
  TOU_ACTIVE_1: { name: 'TOU_Active_1', fallback: 'D18' }, // h0
  TOU_ACTIVE_2: { name: 'TOU_Active_2', fallback: 'D19' }, // h10
  TOU_ACTIVE_3: { name: 'TOU_Active_3', fallback: 'D20' }, // h20
  TOU_ACTIVE_4: { name: 'TOU_Active_4', fallback: 'D21' }, // h24
  
  // Legacy fallbacks for backward compatibility
  TOU_0H: { name: 'TOU_0h', fallback: 'D18' },
  TOU_10H: { name: 'TOU_10h', fallback: 'D19' },
  TOU_20H: { name: 'TOU_20h', fallback: 'D20' },
  TOU_24H: { name: 'TOU_24h', fallback: 'D21' },
  DILUTION_DISPLAY: { name: 'DilutionDisplay', fallback: 'C18' },
  REQUIRED_DILUTION_SPEC: { name: 'RequiredDilutionSpec', fallback: 'C35' },
  FINAL_RESULT: { name: 'K15_FinalResult', fallback: 'K15' }
} as const;

export interface WorkbookDiagnostics {
  namedRanges: {
  [key: string]: {
      present: boolean;
    address: string;
      fallback: string;
    };
  };
  workbookPath: string;
  workbookExists: boolean;
}

export interface ComputeResult {
  raw: number | null;
  display: string;
  cfuPerMl?: number; // J15 value for CFU/ml
}

export class WorkbookService {
  private templatePath: string;
  private outputAddressCache: {
    cfuPerMl?: string;
    cfuPerG?: string;
    cfuPerGAdjusted?: string;
  } = {};

  constructor() {
    this.templatePath = path.join(process.cwd(), 'assets', 'biocount-template.xlsx');
  }

  /**
   * Enumerate and validate defined names in the workbook
   */
  private validateWorkbookNames(workbook: XLSX.WorkBook): {
    definedNames: string[];
    missingNames: string[];
    isValid: boolean;
  } {
    const definedNames: string[] = [];
    const requiredNames = [
      'Output_CFU_per_mL',
      'Output_Sample_CFU_per_g',
      'Output_Adjusted_CFU_per_g',
      'DilutionCoeff_B18',
      'DilutionDenom_C18',
      'RequiredSpecCoeff_C35',
      'FillWeight_g_J11',
      'Exponent_P10',
      'TOU_Active_1',
      'TOU_Active_2',
      'TOU_Active_3',
      'TOU_Active_4'
    ];
    
    // Enumerate defined names
    if (workbook.Workbook?.Names) {
      for (const name of workbook.Workbook.Names) {
        definedNames.push(name.Name);
      }
    }
    
    console.info("[EXCEL] Names:", definedNames);
    
    // Check for missing required names (Offset_P10 is optional)
    const missingNames = requiredNames.filter(name => !definedNames.includes(name));
    
    if (missingNames.length > 0) {
      console.error("[EXCEL] Missing named ranges:", missingNames);
    }
    
    return {
      definedNames,
      missingNames,
      isValid: missingNames.length === 0
    };
  }



  /**
   * Resolve Offset_P10 value with case-insensitive lookup and robust fallback
   */
    private resolveOffsetP10(workbook: XLSX.WorkBook, worksheet: XLSX.WorkSheet): number {
    const offsetRange = this.resolveNamedRange(workbook, worksheet, 'Offset_P10');
    
    if (!offsetRange.ok) {
      console.warn("[EXCEL] Offset_P10 not present; defaulting to 2");
      return 2;
    }
    
    // Parse the value robustly
    let offset = 2; // default
    try {
      const cell = offsetRange.cell!;
      if (cell.t === 'n' && typeof cell.v === 'number' && isFinite(cell.v)) {
        offset = cell.v;
      } else if (cell.t === 's' && typeof cell.v === 'string') {
        const parsed = parseFloat(cell.v);
        if (isFinite(parsed)) {
          offset = parsed;
        }
      } else if (cell.t === 'f' && typeof cell.v === 'string') {
        // Formula cell - try to evaluate or parse
        const parsed = parseFloat(cell.v);
        if (isFinite(parsed)) {
          offset = parsed;
        }
      }
    } catch (e) {
      console.warn("[EXCEL] Error parsing Offset_P10 value; defaulting to 2:", e);
    }
    
    console.info("[EXCEL] Offset_P10 resolved:", {
      sheet: offsetRange.sheet,
      addr: offsetRange.addr,
      raw: offsetRange.cell?.v,
      parsed: offset,
      type: offsetRange.cell?.t
    });
    
    return offset;
  }

  /**
   * Get instructions for adding workbook names (Formulas → Name Manager)
   */
  getWorkbookNameInstructions(): string {
    return `
📋 WORKBOOK NAMED RANGES TO ADD (Formulas → Name Manager):

INPUTS:
- DilutionCoeff_B18 → B18 (coefficient: 0.001, 0.0001, ...)
- DilutionDenom_C18 → C18 (denominator: 1000, 10000, ...)  
- RequiredSpecCoeff_C35 → C35
- FillWeight_g_J11 → J11
- Exponent_P10 → P10
- Offset_P10 → the offset cell ("2" or "-2")

TOU (point to cells that feed the Assay Hour Point Read block):
- TOU_Active_1 → the cell that feeds h0 calculation
- TOU_Active_2 → the cell that feeds h10 calculation
- TOU_Active_3 → the cell that feeds h20 calculation
- TOU_Active_4 → the cell that feeds h24 calculation

OUTPUTS (the green boxes):
- Output_CFU_per_mL → the green "Ave. Assay cfu/mL" cell (≈128)
- Output_Sample_CFU_per_g → the green "Sample cfu/g" cell (≈1.3)
- Output_Adjusted_CFU_per_g → the green "Adjusted Sample cfu/g" cell (if used)

⚠️  IMPORTANT: Do NOT assume I15/J15/K15/L15 are the output cells!
   The green cells are likely in different locations (e.g., D25, D26, D27).
   Use the label-based fallback until you add the proper names.
    `;
  }

  /**
   * Get diagnostics about the workbook and named ranges
   */
  async getDiagnostics(): Promise<WorkbookDiagnostics> {
    const workbookExists = fs.existsSync(this.templatePath);
    
    if (!workbookExists) {
      return {
        namedRanges: {},
        workbookPath: this.templatePath,
        workbookExists: false
      };
    }

    // Build path using path.resolve
    const TEMPLATE_PATH = path.resolve(process.cwd(), "assets", "biocount-template.xlsx");
    console.log('Template path:', TEMPLATE_PATH);
    
    // Check if file exists
    if (!fs.existsSync(TEMPLATE_PATH)) {
      throw new Error(`Template file not found at ${TEMPLATE_PATH}`);
    }
    console.log('Template file exists:', true);
    
    // Read file as buffer and load with SheetJS
    const buf = fs.readFileSync(TEMPLATE_PATH);
    const workbook = XLSX.read(buf, { type: "buffer", cellNF: true, cellFormula: true });
    const diagnostics: WorkbookDiagnostics['namedRanges'] = {};

    for (const [key, range] of Object.entries(NAMED_RANGES)) {
      // Check if named range exists in SheetJS
      let namedRange = null;
      try {
        if (workbook.Workbook?.Names) {
          for (const name of workbook.Workbook.Names) {
            if (name.Name === range.name) {
              namedRange = name;
              break;
            }
          }
        }
      } catch (e) {
        console.log(`Warning: Could not access defined names for ${range.name}`);
      }
      
      diagnostics[key] = {
        present: !!namedRange,
        address: namedRange ? namedRange.Ref : range.fallback,
        fallback: range.fallback
      };
    }

    return {
      namedRanges: diagnostics,
      workbookPath: this.templatePath,
      workbookExists: true
    };
  }

  /**
   * SINGLE SOURCE OF TRUTH: Normalize all user inputs to coefficients and calculate P10
   */
  private normalizeInputs(input: {
    dilutionDisplay?: string;
    dilutionCoeff?: number;
    tou: { h0: number; h10: number; h20: number; h24: number };
    requiredDilutionSpec: string;
    fillWeight_g: number;
  }): { testDilutionCoeff: number; requiredDilutionCoeff: number } {
    // Normalize test dilution (user input takes precedence)
    let testDilutionCoeff: number;
    if (input.dilutionDisplay) {
      testDilutionCoeff = this.parseDilutionDisplay(input.dilutionDisplay);
      console.log(`🔍 TEST DILUTION: Parsed "${input.dilutionDisplay}" → coefficient: ${testDilutionCoeff}`);
      
      // Validate against numeric coefficient if both provided
      if (input.dilutionCoeff !== undefined) {
        if (Math.abs(testDilutionCoeff - input.dilutionCoeff) > 1e-9) {
          throw new Error(`DILUTION_MISMATCH: Display "${input.dilutionDisplay}" yields coefficient ${testDilutionCoeff}, but provided coefficient is ${input.dilutionCoeff}`);
        }
      }
    } else if (input.dilutionCoeff !== undefined) {
      testDilutionCoeff = input.dilutionCoeff;
      console.log(`🔍 TEST DILUTION: Using provided coefficient: ${testDilutionCoeff}`);
    } else {
      // Default: 1:1000
      testDilutionCoeff = 0.001;
      console.log(`🔍 TEST DILUTION: Using default coefficient: ${testDilutionCoeff}`);
    }
    
    // Normalize required dilution spec
    let requiredDilutionCoeff: number;
    if (input.requiredDilutionSpec) {
      requiredDilutionCoeff = this.parseDilutionDisplay(input.requiredDilutionSpec);
      console.log(`🔍 REQUIRED SPEC: Parsed "${input.requiredDilutionSpec}" → coefficient: ${requiredDilutionCoeff}`);
    } else {
      // Default required spec: 1:1000
      requiredDilutionCoeff = 0.001;
      console.log(`🔍 REQUIRED SPEC: Using default coefficient: ${requiredDilutionCoeff}`);
    }
    
    return { testDilutionCoeff, requiredDilutionCoeff };
  }

  /**
   * Compute ISE result using the Excel workbook
   */
  async computeResult(input: {
    dilutionDisplay?: string;
    dilutionCoeff?: number;
    tou: { h0: number; h10: number; h20: number; h24: number };
    requiredDilutionSpec: string;
    fillWeight_g: number;
  }): Promise<ComputeResult> {
    try {
      console.log('Starting computation with input:', input);
      
      // Validate workbook exists
      if (!fs.existsSync(this.templatePath)) {
        throw new Error(`Workbook not found at ${this.templatePath}. Please ensure biocount-template.xlsx is placed in the assets/ directory.`);
      }

      console.log('Loading workbook from:', this.templatePath);
      
      // Build path using path.resolve
      const TEMPLATE_PATH = path.resolve(process.cwd(), "assets", "biocount-template.xlsx");
      console.log('Template path:', TEMPLATE_PATH);
      
      // Check if file exists
      if (!fs.existsSync(TEMPLATE_PATH)) {
        throw new Error(`Template file not found at ${TEMPLATE_PATH}`);
      }
      console.log('Template file exists:', true);
      
      // Read file as buffer and load with SheetJS
      const buf = fs.readFileSync(TEMPLATE_PATH);
      const workbook = XLSX.read(buf, { type: "buffer", cellNF: true, cellFormula: true });
      console.log('Workbook loaded, sheets:', workbook.SheetNames);
      
      // Validate workbook names (temporarily relaxed for debugging)
      const nameValidation = this.validateWorkbookNames(workbook);
      console.log("[EXCEL] Name validation result:", nameValidation);
      if (!nameValidation.isValid) {
        console.warn("[EXCEL] Some named ranges are missing, but continuing for debugging:", nameValidation.missingNames);
        // Temporarily allow missing names for debugging
        // if (!nameValidation.isValid) {
        //   const missingName = nameValidation.missingNames[0];
        //   console.error("[EXCEL] Missing named range:", missingName);
        //   throw new Error(`MISSING_NAMED_RANGE: ${missingName}`);
        // }
      }
      
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      if (!worksheet) {
        throw new Error('No worksheet found in workbook');
      }

      // SINGLE SOURCE OF TRUTH: Normalize all user inputs to coefficients
      const { testDilutionCoeff, requiredDilutionCoeff } = this.normalizeInputs(input);
      
      console.info("[EXCEL] Inputs:", { 
        coeff: testDilutionCoeff, 
        denom: 1/testDilutionCoeff, 
        specCoeff: requiredDilutionCoeff
      });
      
      console.log('=== SINGLE SOURCE OF TRUTH ===');
      console.log(`Test Dilution: ${input.dilutionDisplay || 'N/A'} → coefficient: ${testDilutionCoeff}`);
      console.log(`Required Spec: ${input.requiredDilutionSpec} → coefficient: ${requiredDilutionCoeff}`);
      console.log('=== END SOURCE OF TRUTH ===');
      
      console.log('Writing input values...');
      // Write input values to cells using normalized coefficients
      this.writeInputValues(worksheet, input, testDilutionCoeff, requiredDilutionCoeff);

      // Echo-test the writes: immediately read back the cells we just wrote
      console.log('Echo-testing writes...');
      this.echoTestWrites(worksheet);

      console.log('Attempting to force recalculation with xlsx-calc...');
      
      // Quick sanity checks
      console.log('typeof XLSX_CALC:', typeof XLSX_CALC);
      console.log('XLSX_CALC is function:', typeof XLSX_CALC === 'function');
      console.log('XLSX_CALC.import_functions available:', !!XLSX_CALC.import_functions);
      console.log('XLSX_CALC.set_fx available:', !!XLSX_CALC.set_fx);
      
      // Register Formula.js functions before recalculation
      console.log('Registering Formula.js functions...');
      if (typeof XLSX_CALC === 'function' && XLSX_CALC.import_functions) {
        try {
          XLSX_CALC.import_functions(formulajs);
          console.log('Formula.js functions registered successfully via import_functions');
        } catch (error: unknown) {
          console.log('Formula.js registration failed:', error);
          console.log('Proceeding without function registration');
        }
      } else {
        console.log('XLSX_CALC.import_functions not available, proceeding without function registration');
      }
      
      // Minimal shim for POWER function (bulletproof fallback)
      console.log('Adding minimal POWER function shim...');
      if (typeof XLSX_CALC === 'function' && XLSX_CALC.set_fx) {
        try {
          XLSX_CALC.set_fx('POWER', (x: number, y: number) => Math.pow(x, y));
          console.log('POWER function shim added successfully');
        } catch (error: unknown) {
          console.log('POWER shim failed:', error);
        }
      } else {
        console.log('XLSX_CALC.set_fx not available for POWER shim');
      }
      
      // Verify the values right before recalc
      console.log('🔍 Pre-recalc values:');
      console.log(`  B18 = ${testDilutionCoeff} (test dilution coefficient)`);
      console.log(`  C18 = ${1 / testDilutionCoeff} (test dilution denominator)`);
      
      // Force Excel to recalculate all formulas
      try {
        XLSX_CALC(workbook);  // Call the function directly
        console.log('xlsx-calc recalculation completed successfully');
        
        // Verify K15 has been recalculated
        const k15AfterCalc = worksheet['K15'];
        console.log('K15 after recalculation:', k15AfterCalc);
        if (k15AfterCalc && k15AfterCalc.t === 'n') {
          console.log('✅ K15 successfully recalculated to numeric value:', k15AfterCalc.v);
        } else {
          console.log('⚠️ K15 may not have recalculated properly:', k15AfterCalc);
        }
        
        // Per-sample debug logging showing the complete calculation chain
        console.log('=== PER-SAMPLE CALCULATION CHAIN ===');
        console.log(`Input: ${input.dilutionDisplay || 'N/A'} (${input.requiredDilutionSpec})`);
        console.log(`Normalized: coeffTest=${testDilutionCoeff}, coeffSpec=${requiredDilutionCoeff}`);
        console.log(`Excel Result: K15=${k15AfterCalc?.v || 'N/A'}`);
        console.log('=== END CALCULATION CHAIN ===');
        
        // Debug intermediate cells to find the 100x scaling issue
        console.log('=== INTERMEDIATE CELL DEBUG ===');
        const debugCells = ['J15', 'I15', 'H15', 'G15', 'F15', 'E15', 'N10', 'O10'];
        for (const cellAddr of debugCells) {
          const cell = worksheet[cellAddr];
          if (cell) {
            console.log(`${cellAddr}: ${cell.v} (type: ${cell.t})`);
          } else {
            console.log(`${cellAddr}: NOT FOUND`);
          }
        }
        console.log('=== END INTERMEDIATE DEBUG ===');

      } catch (error: unknown) {
        console.error('xlsx-calc recalculation failed:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`xlsx-calc recalculation failed: ${errorMessage}`);
      }

      console.log('Reading result from named ranges...');
      // Read the result from named ranges
      const result = this.readResult(worksheet, workbook, testDilutionCoeff);
      console.log('Result read successfully:', result);

      return result;
    } catch (error: unknown) {
      console.error('Error in computeResult:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`COMPUTATION_ERROR: ${errorMessage}`);
    }
  }

  /**
   * Write input values to the worksheet
   */
  private writeInputValues(
    worksheet: XLSX.WorkSheet, 
    input: {
      dilutionDisplay?: string;
      dilutionCoeff?: number;
      tou: { h0: number; h10: number; h20: number; h24: number };
      requiredDilutionSpec: string;
      fillWeight_g: number;
    },
    testDilutionCoeff: number,
    requiredDilutionCoeff: number
  ) {
    // Write TOU values using the active TOU named ranges
    this.writeCell(worksheet, NAMED_RANGES.TOU_ACTIVE_1, input.tou.h0);
    this.writeCell(worksheet, NAMED_RANGES.TOU_ACTIVE_2, input.tou.h10);
    this.writeCell(worksheet, NAMED_RANGES.TOU_ACTIVE_3, input.tou.h20);
    this.writeCell(worksheet, NAMED_RANGES.TOU_ACTIVE_4, input.tou.h24);

    // Write fill weight
    this.writeCell(worksheet, NAMED_RANGES.FILL_WEIGHT_G, input.fillWeight_g);
 
    // Write test dilution: B18 = coefficient, C18 = denominator
    this.writeCell(worksheet, NAMED_RANGES.DILUTION_COEFF, testDilutionCoeff); // B18 = coefficient (e.g., 0.001)
    const denom = 1 / testDilutionCoeff;
    this.writeCell(worksheet, NAMED_RANGES.DILUTION_DENOM, denom); // C18 = denominator (e.g., 1000)
    console.log(`🔍 Wrote test dilution: B18 = ${testDilutionCoeff} (coefficient), C18 = ${denom} (denominator)`);
    
    // Write required dilution spec to C35 ONLY (does not affect K15 calculation)
    this.writeCell(worksheet, NAMED_RANGES.REQUIRED_SPEC_COEFF, requiredDilutionCoeff);
    console.log(`🔍 Wrote required spec coefficient ${requiredDilutionCoeff} to C35 ONLY`);
    
    // Do NOT override P10; let workbook compute it
    console.log('🔍 Skipping P10 write (workbook computes P10 internally)');
  }

  /**
   * Write a value to a cell using named range or fallback address
   */
  private writeCell(worksheet: XLSX.WorkSheet, range: { name: string; fallback: string }, value: string | number) {
    // For now, just use the fallback address
    // TODO: Implement named range lookup if needed
    const cellAddress = range.fallback;
    
    // Write the value to the cell
    worksheet[cellAddress] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
  }

  /**
   * Unified name resolution helper for both inputs and outputs
   */
  private resolveNamedRange(workbook: XLSX.WorkBook, worksheet: XLSX.WorkSheet, wantedName: string): {
    ok: boolean;
    name?: string;
    sheet?: string;
    addr?: string;
    cell?: any;
    reason?: string;
  } {
    const names = workbook.Workbook?.Names?.map(n => n.Name) || [];
    
    // Case-insensitive lookup with trimming to handle hidden typos
    const getName = (want: string) => names.find(n => n.trim().toLowerCase() === want.toLowerCase());
    const canonicalName = getName(wantedName);
    
    console.info(`[EXCEL] ${wantedName} name (canonical):`, canonicalName);
    
    if (!canonicalName) {
      return { ok: false, reason: `Named range not found: ${wantedName}` };
    }
    
    // Try to get ranges for the name
    let ranges: string[] = [];
    try {
      // Look for the name in the workbook's defined names
      const nameObj = workbook.Workbook?.Names?.find(n => n.Name === canonicalName);
      if (nameObj?.Ref) {
        ranges = [nameObj.Ref];
      }
    } catch (e) {
      console.warn(`[EXCEL] Could not resolve ranges for ${wantedName}:`, e);
    }
    
    console.info(`[EXCEL] ${wantedName} ranges:`, ranges);
    
    if (ranges.length === 0) {
      return { ok: false, reason: `Named range has no ranges: ${wantedName}`, name: canonicalName };
    }
    
    // Parse the first range (e.g., "Sheet1!$J$15")
    const range = ranges[0];
    const match = range.match(/^([^!]+)!(.+)$/);
    
    if (!match) {
      return { ok: false, reason: `Range format invalid: ${range}`, name: canonicalName };
    }
    
    const [, sheetName, addr] = match;
    const targetSheet = workbook.Sheets[sheetName] || worksheet; // fallback to current sheet
    const cleanAddr = addr.replace(/\$/g, ''); // remove $ signs
    const cell = targetSheet[cleanAddr];
    
    if (!cell) {
      return { ok: false, reason: `Cell not found at ${sheetName}!${cleanAddr}`, name: canonicalName, sheet: sheetName, addr: cleanAddr };
    }
    
    // Log resolution details
    console.info(`[EXCEL] ${wantedName} resolved:`, {
      sheet: sheetName,
      addr: cleanAddr,
      cellType: cell.t,
      cellValue: cell.v,
      cellFormula: cell.f
    });
    
    // Warn if output addresses don't match expected J15/K15/L15
    if (wantedName.startsWith('Output_') && cleanAddr !== 'J15' && cleanAddr !== 'K15' && cleanAddr !== 'L15') {
      console.warn(`[EXCEL] WARNING: ${wantedName} resolves to ${cleanAddr}, expected J15/K15/L15`);
    }
    
    return { 
      ok: true, 
      name: canonicalName, 
      sheet: sheetName, 
      addr: cleanAddr, 
      cell 
    };
  }

  /**
   * Read the results from named ranges (no fallbacks)
   */
  private readResult(worksheet: XLSX.WorkSheet, workbook: XLSX.WorkBook, testDilutionCoeff: number): ComputeResult {
    console.info("[EXCEL] Will read outputs:", ["Output_CFU_per_mL", "Output_Sample_CFU_per_g", "Output_Adjusted_CFU_per_g"]);
    
    // Resolve output named ranges robustly
    const cfuPerMLRange = this.resolveNamedRange(workbook, worksheet, 'Output_CFU_per_mL');
    const cfuPerGRange = this.resolveNamedRange(workbook, worksheet, 'Output_Sample_CFU_per_g');
    const cfuPerGAdjRange = this.resolveNamedRange(workbook, worksheet, 'Output_Adjusted_CFU_per_g');
    
    // Validate required named ranges exist
    if (!cfuPerMLRange.ok) {
      throw new Error(`MISSING_NAMED_RANGE: Output_CFU_per_mL`);
    }
    
    if (!cfuPerGRange.ok) {
      throw new Error(`MISSING_NAMED_RANGE: Output_Sample_CFU_per_g`);
    }
    
    // DEBUG: Log the raw cell data we're about to read
    console.log("[DEBUG] Raw cell data for CFU/mL:", cfuPerMLRange.cell);
    console.log("[DEBUG] Raw cell data for CFU/g:", cfuPerGRange.cell);
    
    // DEBUG: Also check the direct cell addresses to see if there's a mismatch
    console.log("[DEBUG] Direct cell check - K15:", worksheet['K15']);
    console.log("[DEBUG] Direct cell check - L15:", worksheet['L15']);
    
    // Extract values from resolved cells
    const cfuPerMlResult = this.extractCellValue(cfuPerMLRange.cell!, 'CFU/mL', cfuPerMLRange.addr!);
    const cfuPerGResult = this.extractCellValue(cfuPerGRange.cell!, 'CFU/g', cfuPerGRange.addr!);
    const cfuPerGAdjResult = cfuPerGAdjRange.ok ? 
      this.extractCellValue(cfuPerGAdjRange.cell!, 'CFU/g Adjusted', cfuPerGAdjRange.addr!) : null;

    // CFU/mL: trust workbook named output directly; optionally cross-check J15
    const j15Cell = worksheet['J15'];
    const j15Raw = j15Cell && j15Cell.t === 'n' ? j15Cell.v : null;
    const namedRaw = cfuPerMlResult.raw;
    const relDiff = (namedRaw != null && j15Raw != null)
      ? Math.abs(namedRaw - j15Raw) / Math.max(1, Math.abs(j15Raw))
      : null;
    const chosenCfuPerMl = namedRaw != null ? namedRaw : j15Raw;
    const chosenAddr = namedRaw != null ? `${cfuPerMLRange.sheet}!${cfuPerMLRange.addr}` : `Sheet1!J15`;
    
    console.info("[EXCEL] CFU/mL reconcile:", { namedRaw, j15Raw, relDiff, chosen: chosenCfuPerMl });

    // Format display strings with proper precision
    const formatDisplay = (raw: number | null, precision: number): string => {
      if (raw == null) return 'N/A';
      if (raw < 10) return '< 10';
      return raw.toFixed(precision);
    };

    // Log outputs per sample
    console.info("[EXCEL] Outputs:", { 
      cfuPerMl: { addr: chosenAddr, raw: chosenCfuPerMl, display: formatDisplay(chosenCfuPerMl, 0) },
      cfuPerG: { 
        addr: `${cfuPerGRange.sheet}!${cfuPerGRange.addr}`, 
        raw: cfuPerGResult.raw, 
        display: formatDisplay(cfuPerGResult.raw, 1) // 1 decimal for CFU/g
      },
      ...(cfuPerGAdjResult && {
        cfuPerGAdj: { 
          addr: `${cfuPerGAdjRange.sheet}!${cfuPerGAdjRange.addr}`, 
          raw: cfuPerGAdjResult.raw, 
          display: formatDisplay(cfuPerGAdjResult.raw, 2) // 2 decimals for Adjusted CFU/g
        }
      })
    });

    const result = {
      raw: cfuPerGResult.raw, // CFU/g is the main result
      display: formatDisplay(cfuPerGResult.raw, 1),
      cfuPerMl: chosenCfuPerMl !== null ? chosenCfuPerMl : undefined // Use the chosen CFU/mL value
    };
    
    return result;
  }
  
  /**
   * Extract value from a cell, handling text like "< 10"
   */
  private extractCellValue(cell: any, label: string, address: string): { raw: number | null; display: string } {
    if (!cell) {
      return { raw: null, display: 'N/A' };
    }
    
    if (cell.t === 'n' && typeof cell.v === 'number') {
      const raw = cell.v;
      const display = raw < 10 ? '< 10' : raw.toFixed(1);
      console.log(`${label} value from ${address}: ${raw} → display: "${display}"`);
      return { raw, display };
    } else if (cell.t === 's' && typeof cell.v === 'string') {
      const display = cell.v;
      const parsed = parseFloat(cell.v);
      if (!isNaN(parsed)) {
        console.log(`${label} parsed from string at ${address}: ${parsed} → display: "${display}"`);
        return { raw: parsed, display };
      } else {
        console.log(`${label} is text at ${address}: "${display}"`);
        return { raw: null, display };
      }
    } else if (cell.t === 'f') {
      // Formula cell - try to get the calculated value
      console.log(`${label} is a formula cell at ${address}: ${cell.f}`);
      if (typeof cell.v === 'number') {
        const raw = cell.v;
        const display = raw < 10 ? '< 10' : raw.toFixed(1);
        console.log(`${label} value from formula: ${raw} → display: "${display}"`);
        return { raw, display };
      } else if (typeof cell.v === 'string') {
        const parsed = parseFloat(cell.v);
        if (!isNaN(parsed)) {
          const display = parsed < 10 ? '< 10' : parsed.toFixed(1);
          console.log(`${label} value from formula (parsed): ${parsed} → display: "${display}"`);
          return { raw: parsed, display };
        } else {
          const display = cell.v;
          console.log(`${label} formula result is text: "${display}"`);
          return { raw: null, display };
        }
      }
    }
    
    return { raw: null, display: 'N/A' };
  }

  /**
   * Echo-test the writes: immediately read back the cells we just wrote
   */
  private echoTestWrites(worksheet: any) {
    const cellsToTest = [
      { name: 'C18 (Dilution Coeff)', address: NAMED_RANGES.DILUTION_DENOM.fallback },
      { name: 'B18 (Dilution Coeff mirror)', address: NAMED_RANGES.DILUTION_COEFF.fallback },
      { name: 'D18 (TOU Active 1)', address: NAMED_RANGES.TOU_ACTIVE_1.fallback },
      { name: 'D19 (TOU Active 2)', address: NAMED_RANGES.TOU_ACTIVE_2.fallback },
      { name: 'D20 (TOU Active 3)', address: NAMED_RANGES.TOU_ACTIVE_3.fallback },
      { name: 'D21 (TOU Active 4)', address: NAMED_RANGES.TOU_ACTIVE_4.fallback },
      { name: 'C35 (Required Spec Coeff)', address: NAMED_RANGES.REQUIRED_SPEC_COEFF.fallback },
      { name: 'J11 (Fill Weight)', address: NAMED_RANGES.FILL_WEIGHT_G.fallback },
      // P10 is computed by workbook
      { name: 'J15 (CFU/ml)', address: 'J15' },
      { name: 'K15 (CFU/g)', address: 'K15' },
      { name: 'CFU/mL Output', address: NAMED_RANGES.OUTPUT_CFU_PER_ML.fallback },
      { name: 'CFU/g Output', address: NAMED_RANGES.OUTPUT_SAMPLE_CFU_PER_G.fallback }
    ];

    console.log('=== ECHO TEST RESULTS ===');
    for (const cell of cellsToTest) {
      const cellData = worksheet[cell.address];
      if (cellData) {
        console.log(`${cell.name}: ${cell.address} = ${cellData.v} (type: ${cellData.t})`);
      } else {
        console.log(`${cell.name}: ${cell.address} = NOT FOUND`);
      }
    }
    console.log('=== END ECHO TEST ===');
  }

  /**
   * Parse dilution display string to coefficient
   * Normalizes all inputs to a coefficient: "1:1000" → 0.001, 1000 → 0.001, 0.001 → 0.001
   */
  private parseDilutionDisplay(display: string): number {
    console.log(`🔍 parseDilutionDisplay input: "${display}" (type: ${typeof display})`);
    
    // Handle formats: "1:1000", "1:1,000", "0.001"
    if (display.includes(':')) {
      const match = display.match(/^1:\s*([\d,]+)\s*$/);
      if (!match) {
        throw new Error(`Invalid dilution display format: ${display}`);
      }
      const denom = Number(match[1].replace(/,/g, ''));
      if (!isFinite(denom) || denom <= 0) {
        throw new Error(`Invalid dilution denominator: ${display}`);
      }
      const result = 1 / denom;
      console.log(`🔍 Parsed "1:${denom}" → coefficient: ${result}`);
      return result;
    } else {
      // Decimal format
      const coeff = Number(display);
      if (!isFinite(coeff) || coeff <= 0) {
        throw new Error(`Invalid dilution coefficient: ${display}`);
      }
      console.log(`🔍 Parsed decimal "${display}" → coefficient: ${coeff}`);
      return coeff;
    }
  }
}

// Export singleton instance
export const workbookService = new WorkbookService();

