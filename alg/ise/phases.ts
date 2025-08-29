import { 
  TestType, 
  PHASE_DETECTION_THRESHOLDS, 
  GROWTH_CURVE_ANALYSIS,
  TIME_INTERVALS 
} from './constants';

export interface TOUReading {
  hour: number;
  tou: number;
}

export interface GrowthPhase {
  type: 'lag' | 'exponential' | 'stationary';
  startHour: number;
  endHour: number;
  startTOU: number;
  endTOU: number;
  touChange: number;
  duration: number;
}

export interface GrowthAnalysis {
  phases: GrowthPhase[];
  hasGrowth: boolean;
  isFlatline: boolean;
  isQuickRise: boolean;
  totalTOUChange: number;
  baselineTOU: number;
}

/**
 * Analyze TOU readings to identify growth phases and characteristics
 * Based on ISE method: "The TOU curve is divided into three distinct growth phases, leading, exponential, and lagging"
 */
export function analyzeGrowthCurve(
  readings: TOUReading[],
  testType: TestType
): GrowthAnalysis {
  if (readings.length < 2) {
    throw new Error('At least 2 TOU readings are required for analysis');
  }

  // Sort readings by hour
  const sortedReadings = [...readings].sort((a, b) => a.hour - b.hour);
  const thresholds = PHASE_DETECTION_THRESHOLDS[testType];
  
  // Get baseline TOU (0 hour reading)
  const baselineReading = sortedReadings.find(r => r.hour === TIME_INTERVALS.BASELINE);
  const baselineTOU = baselineReading?.tou || sortedReadings[0].tou;
  
  // Calculate total TOU change
  const totalTOUChange = sortedReadings[sortedReadings.length - 1].tou - baselineTOU;
  
  // Detect flatline (no significant growth)
  const isFlatline = detectFlatline(sortedReadings, thresholds);
  
  // Detect quick rise then level off (non-detectable growth)
  const isQuickRise = detectQuickRise(sortedReadings, thresholds);
  
  // Identify growth phases if there is growth
  const phases = isFlatline ? [] : identifyGrowthPhases(sortedReadings, thresholds);
  
  const hasGrowth = phases.length > 0 && !isFlatline && !isQuickRise;
  
  return {
    phases,
    hasGrowth,
    isFlatline,
    isQuickRise,
    totalTOUChange,
    baselineTOU,
  };
}

/**
 * Detect flatline - no significant growth
 * Source: "Any assays that appear to generate a quick rise in TOU during the assay's shut-eye stage and then levels off with no subsequent positive rate of change in the growth curve, should be considered as non-detectable growth"
 */
function detectFlatline(
  sortedReadings: TOUReading[],
  thresholds: typeof PHASE_DETECTION_THRESHOLDS[TestType]
): boolean {
  if (sortedReadings.length < 3) return true;
  
  // Check if TOU changes are below threshold
  for (let i = 1; i < sortedReadings.length; i++) {
    const touChange = Math.abs(sortedReadings[i].tou - sortedReadings[i-1].tou);
    if (touChange > thresholds.MIN_TOU_CHANGE) {
      return false;
    }
  }
  
  return true;
}

/**
 * Detect quick rise then level off (non-detectable growth)
 * Source: "Any assays that appear to generate a quick rise in TOU during the assay's shut-eye stage and then levels off with no subsequent positive rate of change in the growth curve, should be considered as non-detectable growth"
 */
function detectQuickRise(
  sortedReadings: TOUReading[],
  thresholds: typeof PHASE_DETECTION_THRESHOLDS[TestType]
): boolean {
  if (sortedReadings.length < 3) return false;
  
  // Check for quick rise in early stages
  const earlyReadings = sortedReadings.filter(r => r.hour <= GROWTH_CURVE_ANALYSIS.MIN_GROWTH_TIME);
  if (earlyReadings.length < 2) return false;
  
  const earlyTOUChange = earlyReadings[earlyReadings.length - 1].tou - earlyReadings[0].tou;
  
  // Check if there's a quick rise followed by leveling off
  if (earlyTOUChange > GROWTH_CURVE_ANALYSIS.QUICK_RISE_THRESHOLD) {
    // Check if subsequent readings show no significant change
    const laterReadings = sortedReadings.filter(r => r.hour > GROWTH_CURVE_ANALYSIS.MIN_GROWTH_TIME);
    if (laterReadings.length >= 2) {
      const laterTOUChange = laterReadings[laterReadings.length - 1].tou - laterReadings[0].tou;
      return Math.abs(laterTOUChange) < thresholds.MIN_TOU_CHANGE;
    }
  }
  
  return false;
}

/**
 * Identify the three distinct growth phases: leading, exponential, and lagging
 * Source: "The TOU curve is divided into three distinct growth phases, leading, exponential, and lagging"
 */
function identifyGrowthPhases(
  sortedReadings: TOUReading[],
  thresholds: typeof PHASE_DETECTION_THRESHOLDS[TestType]
): GrowthPhase[] {
  const phases: GrowthPhase[] = [];
  
  // Identify lag phase (initial slow growth)
  const lagPhase = identifyLagPhase(sortedReadings, thresholds);
  if (lagPhase) phases.push(lagPhase);
  
  // Identify exponential phase (rapid growth)
  const exponentialPhase = identifyExponentialPhase(sortedReadings, thresholds);
  if (exponentialPhase) phases.push(exponentialPhase);
  
  // Identify stationary phase (growth levels off)
  const stationaryPhase = identifyStationaryPhase(sortedReadings, thresholds);
  if (stationaryPhase) phases.push(stationaryPhase);
  
  return phases;
}

/**
 * Identify lag phase - initial slow growth period
 */
function identifyLagPhase(
  sortedReadings: TOUReading[],
  thresholds: typeof PHASE_DETECTION_THRESHOLDS[TestType]
): GrowthPhase | null {
  // Look for initial period with low TOU change
  let startIndex = 0;
  let endIndex = 0;
  
  for (let i = 1; i < sortedReadings.length; i++) {
    const touChange = sortedReadings[i].tou - sortedReadings[i-1].tou;
    if (touChange > thresholds.LAG_PHASE_THRESHOLD) {
      endIndex = i - 1;
      break;
    }
    endIndex = i;
  }
  
  if (endIndex - startIndex < 1) return null;
  
  const startReading = sortedReadings[startIndex];
  const endReading = sortedReadings[endIndex];
  
  return {
    type: 'lag',
    startHour: startReading.hour,
    endHour: endReading.hour,
    startTOU: startReading.tou,
    endTOU: endReading.tou,
    touChange: endReading.tou - startReading.tou,
    duration: endReading.hour - startReading.hour,
  };
}

/**
 * Identify exponential phase - rapid growth period
 */
function identifyExponentialPhase(
  sortedReadings: TOUReading[],
  thresholds: typeof PHASE_DETECTION_THRESHOLDS[TestType]
): GrowthPhase | null {
  // Look for period with high TOU change
  let maxChange = 0;
  let startIndex = 0;
  let endIndex = 0;
  
  for (let i = 1; i < sortedReadings.length; i++) {
    const touChange = sortedReadings[i].tou - sortedReadings[i-1].tou;
    if (touChange > thresholds.EXPONENTIAL_PHASE_THRESHOLD) {
      if (maxChange === 0) startIndex = i - 1;
      maxChange = Math.max(maxChange, touChange);
      endIndex = i;
    } else if (maxChange > 0) {
      break;
    }
  }
  
  if (endIndex - startIndex < 1) return null;
  
  const startReading = sortedReadings[startIndex];
  const endReading = sortedReadings[endIndex];
  
  return {
    type: 'exponential',
    startHour: startReading.hour,
    endHour: endReading.hour,
    startTOU: startReading.tou,
    endTOU: endReading.tou,
    touChange: endReading.tou - startReading.tou,
    duration: endReading.hour - startReading.hour,
  };
}

/**
 * Identify stationary phase - growth levels off
 */
function identifyStationaryPhase(
  sortedReadings: TOUReading[],
  thresholds: typeof PHASE_DETECTION_THRESHOLDS[TestType]
): GrowthPhase | null {
  // Look for final period with low TOU change
  let startIndex = sortedReadings.length - 1;
  let endIndex = sortedReadings.length - 1;
  
  for (let i = sortedReadings.length - 2; i >= 0; i--) {
    const touChange = Math.abs(sortedReadings[i+1].tou - sortedReadings[i].tou);
    if (touChange > thresholds.STATIONARY_PHASE_THRESHOLD) {
      startIndex = i + 1;
      break;
    }
    startIndex = i;
  }
  
  if (endIndex - startIndex < 1) return null;
  
  const startReading = sortedReadings[startIndex];
  const endReading = sortedReadings[endIndex];
  
  return {
    type: 'stationary',
    startHour: startReading.hour,
    endHour: endReading.hour,
    startTOU: startReading.tou,
    endTOU: endReading.tou,
    touChange: endReading.tou - startReading.tou,
    duration: endReading.hour - startReading.hour,
  };
}

/**
 * Get TOU readings for a specific time range
 */
export function getTOUReadingsInRange(
  readings: TOUReading[],
  startHour: number,
  endHour: number
): TOUReading[] {
  return readings.filter(r => r.hour >= startHour && r.hour <= endHour);
}

/**
 * Calculate TOU change over a specific time period
 */
export function calculateTOUChange(
  readings: TOUReading[],
  startHour: number,
  endHour: number
): number {
  const startReading = readings.find(r => r.hour === startHour);
  const endReading = readings.find(r => r.hour === endHour);
  
  if (!startReading || !endReading) {
    throw new Error(`Missing TOU readings for hours ${startHour} or ${endHour}`);
  }
  
  return endReading.tou - startReading.tou;
}
