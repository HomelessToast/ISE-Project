# ISE Method Domain Notes

This document summarizes the key constants, formulas, and domain knowledge extracted from the "ISE Method Submission Manuscript (1).txt" for implementation in the ISE SaaS application.

## Core ISE Method

The In-Silico Enumeration (ISE) method converts CO₂-based TOU (Transmittance of Optical Units) readings from Soleris Fusion systems into colony forming units per gram (cfu/g) using validated mathematical relationships.

### Key Benefits
- **Rapid Results**: 24 hours for bacteria, 48 hours for yeast/mold
- **Accurate**: ±0.5 log agreement with plate counts
- **Validated**: R² > 0.91 correlation with traditional methods
- **Range**: 1 cfu/g to 4.5 million cfu/g

## Time Points and Read Schedule

### Bacteria (Total Aerobic Count)
- **Read Times**: 0, 10, 20 hours + end of assay
- **Assay Duration**: 24 hours
- **Doubling Time**: 12 minutes

### Yeast/Mold
- **Read Times**: 0, 20, 40 hours + end of assay  
- **Assay Duration**: 48 hours
- **Doubling Time**: 14 minutes

## TOU/CFU Conversion Ratios

### Bacteria
- **Ratio**: 1 cfu/mL ≈ 0.0293 TOU
- **Source**: Manuscript section "Useful Variables and Equations"
- **Validation**: Third-party testing confirmed

### Yeast/Mold
- **Ratio**: 1 cfu/mL ≈ 0.0391 TOU
- **Source**: Manuscript section "Useful Variables and Equations"
- **Validation**: Third-party testing confirmed

## Dilution Coefficients

| Dilution | Coefficient | Use Case |
|----------|-------------|----------|
| 1:1 (As Is) | 1.0 | Non-diluted samples (e.g., water) |
| Non-dissolved Swab | 1.0 | Environmental swabs that don't dissolve |
| 1:10 | 0.1 | Standard 10g sample + 90mL diluent |
| 1:100 | 0.01 | 1:100 dilution series |
| 1:1,000 | 0.001 | 1:1,000 dilution series |
| 1:10,000 | 0.0001 | 1:10,000 dilution series |
| 1:100,000 | 0.00001 | 1:100,000 dilution series |

**Source**: Manuscript Table 2 "Reported Dilution Coefficient Values"

## Growth Phase Analysis

The ISE method identifies three distinct growth phases from TOU curves:

1. **Lag Phase**: Initial slow growth period
2. **Exponential Phase**: Rapid growth period with maximum slope
3. **Stationary Phase**: Plateau period with minimal growth

**Source**: Manuscript section "The TOU curve is divided into three distinct growth phases, leading, exponential, and lagging"

## Phase Detection Thresholds

### Bacteria
- **Minimum TOU Change**: 20 units
- **Minimum Slope**: 0.5 TOU/hour
- **Flatline Variance**: 10 TOU units

### Yeast/Mold  
- **Minimum TOU Change**: 20 units
- **Minimum Slope**: 0.3 TOU/hour (slower growth)
- **Flatline Variance**: 15 TOU units

## Precision and Validation

### Acceptance Criteria
- **Log Difference**: ±0.5 log between ISE and plate counts
- **Correlation**: R² > 0.91
- **Tolerance**: 90% of samples within ±0.5 log

### TOU Precision
- **Vertical Variance**: 20 TOU units required for significant change
- **Baseline Range**: 100-200 TOU (typical 130-150)
- **Growth Range**: Up to 10x baseline allowed

**Source**: Manuscript section "A vertical variance of 20 TOU is required to notice a change in sample cfu/g counts"

## Flatline Handling

### Detection
- Minimal TOU change across all time points
- No positive rate of change in growth curve
- TOU variance below detection thresholds

### Reporting
- **CFU per Vial**: Rounded up to 1 (from calculated 0.67)
- **QC Note**: "Flatline implies ≤ specification limit"
- **Interpretation**: Non-detectable growth, below assay specification

**Source**: Manuscript section "Any assays that appear to generate a quick rise in TOU during the assay's shut-eye stage and then levels off with no subsequent positive rate of change in the growth curve, should be considered as non-detectable growth and less than the assay specification"

## CO₂ Conversion Constants

### Bacteria
- 0.01mg CO₂ ≈ 100,000 cfu/mL
- 0.01mg CO₂ = 0.001 OD 600 units  
- 0.01mg CO₂ = 2930 TOU
- 1 cfu/mL ≈ 0.0293 TOU

### Yeast/Mold
- 0.01mg CO₂ ≈ 10,000 cfu/mL
- 0.01mg CO₂ = 0.001 OD 600 units
- 0.01mg CO₂ = 391 TOU
- 1 cfu/mL ≈ 0.0391 TOU

**Source**: Manuscript section "Useful Variables and Equations"

## Validation Results

### Performance Metrics
- **Total Samples**: 21 samples tested
- **Correlation**: R² = 0.9146
- **Log Difference**: All within ±0.5 log
- **Confidence**: 95% LCL/UCL for both methods

### Sample Types
- Food matrices (ground beef, chicken breast)
- Environmental samples (swabs)
- Process water
- Spice blends
- Dairy products

**Source**: Manuscript Table 3 "Plate results compared to ISE calculated results"

## Implementation Notes

### Formula
The core ISE formula is:
```
CFU = (TOU_change / TOU_CFU_ratio) * (time_span / 24)
```

### Rounding Rules
- **CFU Values**: Round to nearest whole number
- **Log Values**: Round to 3 decimal places
- **CFU per Gram**: Round to 2 decimal places

### Quality Control
- Automatic phase detection and analysis
- Flatline detection and reporting
- Validation against plate counts when available
- Comprehensive QC notes and recommendations

## Limitations and Considerations

### Method Limitations
- Requires CO₂-based detection systems
- Not suitable for enriched samples
- Cannot identify specific microorganisms
- Limited to aerobic bacteria and yeast/mold

### Sample Considerations
- Test method suitability generally not required
- Care needed for samples that may react with growth media
- Non-dissolved samples (swabs) use special coefficients
- Water samples can be tested "as is"

## Future Development

### Potential Enhancements
- Adaptation to specific bacterial genera (Enterobacter, coliforms)
- Dilution-absent enumeration techniques
- Integration with identification technology
- Expansion to other CO₂-based systems

**Source**: Manuscript section "Future work"

---

*This document serves as the authoritative reference for implementing the ISE method in software. All constants and formulas are extracted directly from the manuscript with specific section citations.*
