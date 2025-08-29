# BioCount ISE Service Changelog

All notable changes to the BioCount ISE Excel-as-engine service will be documented in this file.

## [Unreleased]

### Added
- Initial implementation of BioCount ISE service
- Excel workbook integration with named range support
- REST API endpoints for single and batch calculations
- Input validation with friendly error messages
- Golden cases parity testing framework
- Minimal but clear frontend UI
- Comprehensive documentation and setup instructions

### Technical Details
- **Approach**: Option B "sheet-as-a-service" with local workbook
- **Runtime**: Node.js (not Edge)
- **Concurrency**: Fresh workbook instance per request
- **Caching**: Off by default for auditability
- **Performance Target**: ≤150ms p95 for single calculations

## Template Versions

### biocount-template.xlsx (Current)
- **Version**: v1.0.0
- **Last Updated**: 2024-01-15
- **Cell Mapping**: 
  - B18: Dilution coefficient
  - C18: Dilution display (source of truth)
  - D18-D21: TOU values (0h, 10h, 20h, 24h)
  - C35: Required dilution spec
  - J11: Fill weight
  - K15: Final result (read-only)

### Named Ranges
- `DilutionCoeff` → B18
- `DilutionDisplay` → C18
- `TOU_0h` → D18, `TOU_10h` → D19, `TOU_20h` → D20, `TOU_24h` → D21
- `RequiredDilutionSpec` → C35
- `FillWeight_g` → J11
- `K15_FinalResult` → K15

## Upgrade Instructions

To upgrade the Excel template:

1. **Backup**: Save current template as `biocount-template_vX.Y.xlsx`
2. **Replace**: Place new template in `./assets/biocount-template.xlsx`
3. **Restart**: Restart the service to load new template
4. **Test**: Run golden cases parity tests
5. **Update**: Update this CHANGELOG with new version details

## Breaking Changes

None in current version.

## Deprecations

None in current version.

---

**Note**: This service follows the dilution truth rule where C18 (Dilution display) is the source of truth. Any changes to this cell mapping must be carefully documented and tested.
