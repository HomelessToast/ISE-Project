import { NextResponse } from 'next/server';
import { CALIBRATION_VERSION, ENUMERATION_MODEL } from '@/alg/ise/compute';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    calibration: {
      version: CALIBRATION_VERSION,
      enumerationModel: ENUMERATION_MODEL,
      source: 'Matthew\'s copy.xlsx Excel workbook'
    },
    system: {
      node: process.version,
      platform: process.platform,
      uptime: process.uptime()
    }
  });
}
