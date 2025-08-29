'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, BarChart3 } from 'lucide-react';

// Mock data - will be replaced with API calls
const mockSample = {
  id: '1',
  code: 'SAMPLE-001',
  matrix: 'Ground Beef',
  testType: 'BACTERIA' as const,
  createdAt: '2024-01-15T10:00:00Z',
  notes: 'Sample from production line A',
};

const mockAssay = {
  id: '1',
  dilution: 'ONE_TO_TEN' as const,
  dilutionCoeff: 0.1,
  endAtHours: 24,
  touReadings: {
    '0': 150,
    '10': 180,
    '20': 230,
    'end': 260,
  },
  notes: 'Standard 1:10 dilution assay',
};

const mockResult = {
  id: '1',
  cfuVial: 15,
  cfuPerG: 1500,
  logReported: 3.18,
  logIse: 3.18,
  logDiff: 0.0,
  qcNote: 'Within ±0.5 log of plate reference',
  phases: [
    {
      type: 'lag' as const,
      startHour: 0,
      endHour: 10,
      startTou: 150,
      endTou: 180,
      slope: 3.0,
    },
    {
      type: 'exponential' as const,
      startHour: 10,
      endHour: 20,
      startTou: 180,
      endTou: 230,
      slope: 5.0,
    },
    {
      type: 'stationary' as const,
      startHour: 20,
      endHour: 24,
      startTou: 230,
      endTou: 260,
      slope: 7.5,
    },
  ],
  isFlatline: false,
};

export default function SampleDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('results');

  const getDilutionLabel = (dilution: string) => {
    switch (dilution) {
      case 'AS_IS': return 'As Is (No Dilution)';
      case 'NON_DISSOLVED_SWAB': return 'Non-dissolved Swab';
      case 'ONE_TO_TEN': return '1:10';
      case 'ONE_TO_HUNDRED': return '1:100';
      case 'ONE_TO_THOUSAND': return '1:1,000';
      case 'ONE_TO_TEN_THOUSAND': return '1:10,000';
      case 'ONE_TO_HUNDRED_THOUSAND': return '1:100,000';
      default: return dilution;
    }
  };

  const getQcNoteClass = (note: string) => {
    if (note.includes('Within ±0.5 log')) return 'success';
    if (note.includes('Flatline')) return 'info';
    if (note.includes('exceeds')) return 'error';
    return 'warning';
  };

  const exportCSV = () => {
    const csvContent = `Sample Code,Matrix,Test Type,Dilution,CFU/vial,CFU/g,Log ISE,QC Note
${mockSample.code},${mockSample.matrix},${mockSample.testType},${getDilutionLabel(mockAssay.dilution)},${mockResult.cfuVial},${mockResult.cfuPerG},${mockResult.logIse},${mockResult.qcNote}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mockSample.code}-results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    // TODO: Implement PDF export
    alert('PDF export coming soon!');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mockSample.code}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {mockSample.matrix} • {mockSample.testType === 'BACTERIA' ? '🦠 Bacteria' : '🍄 Yeast/Mold'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Created {new Date(mockSample.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF}>
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Sample Info */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sample Code:</span>
                <span className="font-medium">{mockSample.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Matrix:</span>
                <span className="font-medium">{mockSample.matrix}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Test Type:</span>
                <Badge variant="outline">
                  {mockSample.testType === 'BACTERIA' ? '🦠 Total Aerobic Count' : '🍄 Total Yeast/Mold'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="font-medium">
                  {new Date(mockSample.createdAt).toLocaleString()}
                </span>
              </div>
              {mockSample.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Notes:</span>
                  <span className="font-medium text-right max-w-xs">{mockSample.notes}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assay Details */}
      <Card>
        <CardHeader>
          <CardTitle>Assay Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Dilution:</span>
                <span className="font-medium">{getDilutionLabel(mockAssay.dilution)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dilution Coefficient:</span>
                <span className="font-medium">{mockAssay.dilutionCoeff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Assay Duration:</span>
                <span className="font-medium">{mockAssay.endAtHours} hours</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">TOU Readings:</span>
                <span className="font-medium">{Object.keys(mockAssay.touReadings).length} time points</span>
              </div>
              {mockAssay.notes && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Notes:</span>
                  <span className="font-medium text-right max-w-xs">{mockAssay.notes}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TOU Data */}
      <Card>
        <CardHeader>
          <CardTitle>TOU Readings</CardTitle>
          <CardDescription>
            Transmittance of Optical Units at specified time points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(mockAssay.touReadings).map(([time, value]) => (
              <div key={time} className="text-center p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="text-sm text-gray-600 font-medium">
                  {time === 'end' ? 'End of Assay' : `${time} hours`}
                </div>
                <div className="text-2xl font-bold text-blue-600">{value}</div>
                <div className="text-xs text-gray-500">TOU units</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>ISE Results</CardTitle>
          <CardDescription>
            Calculated colony forming units and quality control information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Results */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-gray-600">CFU per Vial</div>
                <div className="text-3xl font-bold text-blue-600">{mockResult.cfuVial}</div>
                <div className="text-xs text-gray-500">Colony forming units</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-gray-600">CFU per Gram</div>
                <div className="text-3xl font-bold text-green-600">{mockResult.cfuPerG}</div>
                <div className="text-xs text-gray-500">Original sample</div>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <div className="text-sm text-gray-600">Log CFU/g</div>
                <div className="text-3xl font-bold text-purple-600">{mockResult.logIse}</div>
                <div className="text-xs text-gray-500">Logarithmic value</div>
              </div>
            </div>

            {/* Quality Control */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Quality Control Note</span>
                <Badge variant="outline" className={getQcNoteClass(mockResult.qcNote)}>
                  {mockResult.qcNote.includes('Within ±0.5 log') ? 'Pass' : 
                   mockResult.qcNote.includes('Flatline') ? 'Info' : 'Review'}
                </Badge>
              </div>
              <p className={`qc-note ${getQcNoteClass(mockResult.qcNote)}`}>
                {mockResult.qcNote}
              </p>
            </div>

            {/* Validation (if plate count available) */}
            {mockResult.logReported !== null && (
              <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <h4 className="font-medium mb-2">Method Validation</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Plate Count Log:</span>
                    <span className="ml-2 font-medium">{mockResult.logReported}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">ISE Log:</span>
                    <span className="ml-2 font-medium">{mockResult.logIse}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Log Difference:</span>
                    <span className="ml-2 font-medium">{mockResult.logDiff}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <Badge 
                      variant={mockResult.logDiff! <= 0.5 ? 'default' : 'destructive'}
                      className="ml-2"
                    >
                      {mockResult.logDiff! <= 0.5 ? 'Valid' : 'Exceeds Tolerance'}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Growth Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Phase Analysis</CardTitle>
          <CardDescription>
            Identified growth phases from TOU curve analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockResult.phases.map((phase, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={`phase-${phase.type} border-current`}
                    >
                      {phase.type.charAt(0).toUpperCase() + phase.type.slice(1)} Phase
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {phase.startHour}-{phase.endHour} hours
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    Slope: {phase.slope.toFixed(1)} TOU/hour
                  </span>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start TOU:</span>
                    <span className="ml-2 font-medium">{phase.startTou}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">End TOU:</span>
                    <span className="ml-2 font-medium">{phase.endTou}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">TOU Change:</span>
                    <span className="ml-2 font-medium">
                      {Math.abs(phase.endTou - phase.startTou)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>TOU vs Time Chart</CardTitle>
          <CardDescription>
            Visual representation of growth curve with phase identification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-2" />
              <p>Chart visualization coming soon</p>
              <p className="text-sm">Will show TOU curve with phase overlays</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
