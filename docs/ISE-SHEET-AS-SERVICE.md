# BioCount ISE Sheet-as-Service

## Overview

This document describes the implementation of BioCount's ISE (In-Silico Enumeration) calculation service that uses Excel workbooks as the calculation engine. The service provides a REST API wrapper around Excel formulas while maintaining Excel as the single source of truth for all calculations.

## Architecture

### Core Components

1. **Workbook Service** (`lib/workbook-service.ts`)
   - Loads Excel template from `./assets/biocount-template.xlsx`
   - Manages named ranges and fallback addresses
   - Creates fresh workbook instances per request
   - Handles Excel formula evaluation

2. **API Endpoints** (`app/api/ise/`)
   - `POST /api/ise/compute` - Single sample calculation
   - `POST /api/ise/batch` - Batch sample processing
   - `GET /api/ise/health` - Service health check
   - `GET /api/ise/diagnostics` - Named range diagnostics

3. **Validation Layer** (`lib/validation.ts`)
   - Input validation with helpful error messages
   - Dilution format validation
   - Type safety enforcement

4. **Test Harness** (`test/ise-parity.test.ts`)
   - Golden test cases from CSV
   - Parity verification with Excel
   - Concurrency safety testing

## Deployment

### Prerequisites

- Node.js 18+ (required for Excel processing)
- Excel template file at `./assets/biocount-template.xlsx`

### Installation

```bash
npm install
npm run build
npm start
```

### Environment Variables

No external API keys or services required. All calculations are performed locally using the Excel template.

## Excel Template Management

### Template Updates

1. **Version Control**: Create new versioned files (e.g., `biocount-template_v1.1.xlsx`)
2. **Symlink Update**: Update symlink or copy new version to `biocount-template.xlsx`
3. **Server Restart**: Restart the service to reload the template
4. **Test Verification**: Run parity tests to ensure calculations match

### Named Ranges

The service expects these named ranges in the Excel template:

| Name | Fallback Address | Description | Required |
|------|------------------|-------------|----------|
| `DilutionDisplay` | `B2` | Dilution string (e.g., "1:10") | Yes |
| `MatrixType` | `B3` | Matrix type: bacteria/yeast_mold | Yes |
| `IsDissolvedSample` | `B4` | Boolean flag | Yes |
| `TOU_0h` | `B5` | TOU at 0 hours | Yes |
| `TOU_10h` | `B6` | TOU at 10 hours | No |
| `TOU_20h` | `B7` | TOU at 20 hours | No |
| `TOU_End` | `B8` | TOU at end time | Yes |

### Result Cell

The final ISE result is read from cell `K15`. If a named range `K15_FinalResult` exists, it will be used instead.

## API Usage

### Single Sample Calculation

```bash
POST /api/ise/compute
Content-Type: application/json

{
  "DilutionDisplay": "1:10",
  "MatrixType": "bacteria",
  "IsDissolvedSample": true,
  "TOU_0h": 100,
  "TOU_10h": 120,
  "TOU_20h": 150,
  "TOU_End": 180
}
```

**Response:**
```json
{
  "ok": true,
  "result": {
    "raw": 1234.56,
    "display": "1,235 cfu/g",
    "cellAddress": "K15"
  },
  "metadata": {
    "computeTimeMs": 45,
    "templateVersion": "v1.0.0-2024-01-15"
  }
}
```

### Batch Processing

```bash
POST /api/ise/batch
Content-Type: application/json

{
  "samples": [
    {
      "DilutionDisplay": "1:10",
      "MatrixType": "bacteria",
      "IsDissolvedSample": true,
      "TOU_0h": 100,
      "TOU_End": 180
    }
  ]
}
```

### Health Check

```bash
GET /api/ise/health
```

### Diagnostics

```bash
GET /api/ise/diagnostics
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run only ISE parity tests
npm run test:ise

# Run with UI
npm run test:ui
```

### Golden Test Cases

1. **Setup**: Populate `test/golden-cases.csv` with known inputs and expected outputs
2. **Execution**: Run `npm run test:ise` to verify parity
3. **Verification**: All tests must pass before deploying template updates

### Test CSV Format

```csv
DilutionDisplay,MatrixType,IsDissolvedSample,TOU_0h,TOU_10h,TOU_20h,TOU_End,ExpectedDisplay
1:10,bacteria,true,100,120,150,180,Expected Result 1
1:100,bacteria,false,80,100,120,140,Expected Result 2
```

## Performance

### Targets

- **Latency**: ≤150ms p95 per single calculation
- **Throughput**: 100 RPS burst on single container
- **Memory**: Template buffer cached, fresh workbook per request

### Optimization

- No caching by default (compliance clarity)
- Optional memoization behind `ISE_CACHE_ENABLED` flag
- Fresh workbook instances prevent cross-request contamination

## Error Handling

### Common Errors

| Error Code | Description | Resolution |
|------------|-------------|------------|
| `VALIDATION_FAILED` | Input validation error | Check input format and required fields |
| `MISSING_NAMED_RANGE` | Named range not found | Add named range or update fallback config |
| `WORKBOOK_ERROR` | Excel processing failed | Verify template file integrity |
| `INTERNAL_ERROR` | Unexpected system error | Check server logs |

### Error Response Format

```json
{
  "ok": false,
  "error": "ERROR_CODE",
  "message": "Human readable description",
  "details": [] // Validation errors if applicable
}
```

## Monitoring & Observability

### Logging

- **Request Level**: Schema validity, high-level events
- **Calculation Level**: Compute time, success/failure
- **No Sensitive Data**: Input values are not logged

### Metrics

- Request count and success rate
- Compute time percentiles
- Template version tracking
- Named range resolution status

## Security

### Data Privacy

- **Local Processing**: All calculations performed locally
- **No External Calls**: No Google APIs or external services
- **Input Validation**: Strict validation prevents injection attacks

### Access Control

- API endpoints are public (no authentication required)
- Consider adding rate limiting for production use

## Troubleshooting

### Common Issues

1. **Template Not Found**
   - Verify `./assets/biocount-template.xlsx` exists
   - Check file permissions

2. **Named Range Errors**
   - Run diagnostics endpoint to see missing ranges
   - Update fallback configuration if needed

3. **Calculation Failures**
   - Check Excel template for formula errors
   - Verify input data types match expectations

4. **Performance Issues**
   - Monitor compute times in logs
   - Check for memory leaks in workbook instances

### Debug Mode

Enable detailed logging by setting environment variable:
```bash
DEBUG=workbook-service npm start
```

## Maintenance

### Regular Tasks

1. **Template Updates**: Monthly review of calculation accuracy
2. **Performance Monitoring**: Track compute times and success rates
3. **Test Updates**: Refresh golden test cases with new scenarios
4. **Log Rotation**: Manage application logs

### Update Process

1. Create new versioned template file
2. Update symlink/copy to current template
3. Restart service
4. Run parity tests
5. Monitor for errors
6. Update CHANGELOG

## Support

For technical support or questions about the ISE service:

1. Check this documentation
2. Review server logs for error details
3. Run diagnostics endpoint for system status
4. Verify template file integrity
5. Test with known good inputs

## CHANGELOG

### v1.0.0 - Initial Release
- Excel workbook integration
- REST API endpoints
- Input validation
- Test harness
- Minimal UI interface
