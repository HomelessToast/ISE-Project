import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const templatePath = path.join(process.cwd(), 'assets', 'biocount-template.xlsx');
    
    // Check if file exists
    const fileExists = fs.existsSync(templatePath);
    if (!fileExists) {
      return NextResponse.json({
        ok: false,
        error: 'FILE_NOT_FOUND',
        path: templatePath,
        cwd: process.cwd()
      });
    }

    // Check file stats
    const stats = fs.statSync(templatePath);
    
    // Try to read file as buffer
    const buffer = fs.readFileSync(templatePath);
    
    return NextResponse.json({
      ok: true,
      message: 'File test successful',
      fileInfo: {
        path: templatePath,
        exists: fileExists,
        size: stats.size,
        sizeInKB: (stats.size / 1024).toFixed(2),
        lastModified: stats.mtime,
        bufferSize: buffer.length,
        isBuffer: Buffer.isBuffer(buffer)
      }
    });

  } catch (error: any) {
    console.error('[SIMPLE-TEST] Failed:', error.message);
    
    return NextResponse.json(
      { 
        ok: false, 
        error: 'SIMPLE_TEST_ERROR',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}
