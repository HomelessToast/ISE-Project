# BioCount ISE Excel-as-Engine Service

BioCount converts CO₂ RMM TOU time-series into CFU/g using our ISE method. This service uses Excel as the calculation engine, writing user inputs into specific cells, recalculating, and returning the final result from cell K15.

## Architecture

**Approach**: Option B "sheet-as-a-service" with a local workbook
- **Spreadsheet access**: Local file at `./assets/biocount-template.xlsx` (committed to repo)
- **Runtime**: Node.js (not Edge)
- **Concurrency safety**: Fresh workbook instance per request (no shared mutable workbook objects)
- **Caching**: Off by default for auditability

## Excel Cell Mapping

### User-Settable Cells (written before calculation)
- **B18** → Dilution coefficient (number, e.g., 0.001)
- **C18** → Dilution display (string, e.g., "1:1000") - **Source of Truth**
- **D18** → TOU 0h
- **D19** → TOU 10h  
- **D20** → TOU 20h
- **D21** → TOU 24h
- **C35** → Required test dilution spec (string, e.g., "1:1000")
- **J11** → Fill weight (g)

### Result Cell (read-only after calculation)
- **K15** → Final result (we read this after calc)

### Named Ranges (preferred, with fallbacks)
- `DilutionCoeff` (B18)
- `DilutionDisplay` (C18)
- `TOU_0h` (D18), `TOU_10h` (D19), `TOU_20h` (D20), `TOU_24h` (D21)
- `RequiredDilutionSpec` (C35)
- `FillWeight_g` (J11)
- `K15_FinalResult` (K15, optional)

## Dilution Truth Rule

**Important**: Treat C18 (Dilution display) as the source of truth. If the workbook already derives B18 from C18, only write C18.

If we also receive/compute a numeric coefficient and it disagrees with the display by >1e-9, return error `DILUTION_MISMATCH` (don't guess).

## API Endpoints

### POST `/api/ise/compute`
Single calculation endpoint.

**Input JSON fields** (all optional unless workbook requires them):
```json
{
  "dilutionDisplay": "1:1000",        // string like "1:1000" or "1:1,000" or decimal "0.001"
  "dilutionCoeff": 0.001,             // optional number; use display as source of truth
  "tou": {                            // object with numbers ≥ 0
    "h0": 100,
    "h10": 120,
    "h20": 150,
    "h24": 180
  },
  "requiredDilutionSpec": "1:1000",   // string
  "fillWeight_g": 1.0                 // number > 0
}
```

**Response**:
```json
{
  "ok": true,
  "result": {
    "raw": 1234.56,           // numeric value or null for text results
    "display": "1,235 cfu/g"  // Excel's displayed value
  }
}
```

### POST `/api/ise/batch`
Batch processing endpoint. Accepts CSV or JSON array of the same fields.

**Input formats**:
```json
// JSON array
[
  { "dilutionDisplay": "1:1000", "tou": {...}, ... },
  { "dilutionDisplay": "1:100", "tou": {...}, ... }
]

// CSV string
{
  "csv": "case_id,dilution_display,tou_0h,tou_10h,tou_20h,tou_24h,required_dilution_spec,fill_weight_g\ncase_001,1:1000,100,120,150,180,1:1000,1.0"
}
```

**Response**:
```json
{
  "ok": true,
  "results": [
    { "caseId": 1, "raw": 1234.56, "display": "1,235 cfu/g" },
    { "caseId": 2, "error": "VALIDATION_ERROR", "details": [...] }
  ],
  "metadata": {
    "totalCases": 2,
    "successfulCases": 1,
    "failedCases": 1,
    "processingTimeMs": 150
  }
}
```

### GET `/api/ise/diagnostics`
Returns which expected Named Ranges are present/missing and fallback addresses.

**Response**:
```json
{
  "ok": true,
  "diagnostics": {
    "workbookPath": "./assets/biocount-template.xlsx",
    "workbookExists": true,
    "namedRanges": {
      "DILUTION_COEFF": {
        "present": true,
        "address": "Sheet1!$B$18",
        "fallback": "B18"
      }
    }
  }
}
```

### GET `/api/ise/health`
Simple health check.

**Response**:
```json
{
  "ok": true,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "BioCount ISE Excel Engine"
}
```

## Validation Rules

### Input Validation
- **dilutionDisplay**: Accept "1:10", "1:1,000", "1:1000", or decimal strings ("0.001"). Reject ambiguous forms.
- **tou.h0/h10/h20/h24**: Finite numbers ≥ 0
- **fillWeight_g**: Finite number > 0

### Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `DILUTION_MISMATCH`: Dilution display and coefficient don't match
- `WORKBOOK_NOT_FOUND`: Template file missing
- `COMPUTATION_ERROR`: General calculation error

## Frontend

A minimal but clear form mirroring the API fields:
- **Labels**: Dilution, TOU 0h/10h/20h/24h, Fill Weight (g), Required Spec
- **Compute button** → calls `/api/ise/compute` → shows Result (K15) with both display and raw value
- **UX note**: Keep 0/10/20/24h ordering fixed

## Testing

### Golden Cases Parity Test
Create `test/golden-cases.csv` with columns:
```
case_id,dilution_display,dilution_coeff,fill_weight_g,tou_0h,tou_10h,tou_20h,tou_24h,required_dilution_spec,expected_k15_display,notes
```

**Populate `expected_k15_display` by reading Excel's displayed K15 for each row.**

### Running Tests
```bash
# Run all tests
npm test

# Run ISE parity tests only
npm run test:ise

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### Test Requirements
- Test must load each row, call the compute path, and assert returned display equals `expected_k15_display` exactly
- Include a small second test set for invalid inputs asserting correct error codes

## Setup & Deployment

### 1. Place Excel Template
Ensure `biocount-template.xlsx` is in the `./assets/` directory.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Run Tests
```bash
npm test
```

## Performance Targets

- **Single calc p95**: ≤ 150 ms under typical inputs
- **Concurrency**: 100 concurrent requests with fresh workbook instances must complete without cross-request contamination

## Upgrades

To upgrade the Excel template:
1. Replace the file under `assets/` 
2. Restart the service to load
3. Keep versions (e.g., `biocount-template_vX.Y.xlsx`)
4. Maintain a short CHANGELOG

## Environment Variables

- `ISE_CACHE_ENABLED`: Enable exact-input memoization (disabled by default)

## Observability & Logging

- Structured logs (request accepted, validation outcome, calc success/failure, total compute time)
- **Never log raw values**
- If K15 is non-numeric text (e.g., "< 10"), treat as valid and return text as display
- Clear error messages for missing/unreadable workbook

## Troubleshooting

### Common Issues

1. **Workbook not found**: Ensure `biocount-template.xlsx` is in `./assets/` directory
2. **Dilution mismatch**: Check that dilution display and coefficient values are consistent
3. **Validation errors**: Verify all required fields are provided and numeric values are ≥ 0

### Debug Endpoints

- `/api/ise/health` - Check service status
- `/api/ise/diagnostics` - View workbook and named range status

## Contributing

1. Follow the exact cell mapping specifications
2. Maintain the dilution truth rule (C18 is source of truth)
3. Test with golden cases before submitting changes
4. Update documentation for any API changes
