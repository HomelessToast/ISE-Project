'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TestType, TIME_INTERVALS, DILUTION_COEFFICIENTS } from '@/alg/ise/constants';
import { getDilutionDescription } from '@/lib/dilution';

interface SampleData {
  code: string;
  matrix: string;
  testType: TestType;
  notes?: string;
}

interface AssayData {
  dilution: keyof typeof DILUTION_COEFFICIENTS;
  endAtHours: number;
  touReadings: Record<string, number>;
  plateCount?: number;
}

export default function NewSamplePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [sampleData, setSampleData] = useState<SampleData>({
    code: '',
    matrix: '',
    testType: TestType.TPC,
    notes: '',
  });
  const [assayData, setAssayData] = useState<AssayData>({
    dilution: '1',
    endAtHours: 24,
    touReadings: {},
    plateCount: undefined,
  });

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleAssaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handleCalculate = async () => {
    // TODO: Implement API call to compute ISE results
    console.log('Calculating ISE results...', { sampleData, assayData });
    
    // For now, just simulate success and redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  };

  const getReadTimes = () => {
    const times = TIME_INTERVALS.STANDARD;
    return times.filter((time: number) => time !== 48).map(String);
  };

  const updateTouReading = (time: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAssayData(prev => ({
      ...prev,
      touReadings: {
        ...prev.touReadings,
        [time]: numValue,
      },
    }));
  };

  const updateEndTime = () => {
    const newEndTime = sampleData.testType === TestType.TPC ? 24 : 48;
    setAssayData(prev => ({ ...prev, endAtHours: newEndTime }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Sample</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Set up a new sample and assay for ISE analysis
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-16 h-0.5 mx-2 ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Sample Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Sample Information</CardTitle>
            <CardDescription>
              Enter basic information about your sample
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSampleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Sample Code *</Label>
                  <Input
                    id="code"
                    value={sampleData.code}
                    onChange={(e) => setSampleData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., SAMPLE-001"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matrix">Sample Matrix *</Label>
                  <Input
                    id="matrix"
                    value={sampleData.matrix}
                    onChange={(e) => setSampleData(prev => ({ ...prev, matrix: e.target.value }))}
                    placeholder="e.g., Ground Beef, Chicken Breast"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="testType">Test Type *</Label>
                <Select
                  value={sampleData.testType}
                  onValueChange={(value: TestType) => {
                    setSampleData(prev => ({ ...prev, testType: value }));
                    updateEndTime();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BACTERIA">Total Aerobic Count (Bacteria)</SelectItem>
                    <SelectItem value="YEAST_MOLD">Total Yeast/Mold</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  {sampleData.testType === TestType.TPC 
                    ? 'Read times: 0, 10, 20 hours + end of assay'
                    : 'Read times: 0, 20, 40 hours + end of assay'
                  }
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={sampleData.notes}
                  onChange={(e) => setSampleData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional information about the sample..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Continue to Assay Setup
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Assay Setup */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Assay Setup</CardTitle>
            <CardDescription>
              Configure the assay parameters and enter TOU readings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssaySubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="dilution">Dilution *</Label>
                  <Select
                    value={assayData.dilution}
                    onValueChange={(value: keyof typeof DILUTION_COEFFICIENTS) => 
                      setAssayData(prev => ({ ...prev, dilution: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DILUTION_COEFFICIENTS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {key === '1' ? 'As Is (No Dilution)' : 
                           key === '1:10' ? '1:10 Dilution' :
                           `Dilution ${key}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    {getDilutionDescription(assayData.dilution)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End of Assay (hours)</Label>
                  <Input
                    id="endTime"
                    type="number"
                    value={assayData.endAtHours}
                    onChange={(e) => setAssayData(prev => ({ 
                      ...prev, 
                      endAtHours: parseInt(e.target.value) || 24 
                    }))}
                    min={1}
                    max={72}
                  />
                  <p className="text-sm text-gray-500">
                    Assay duration in hours
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>TOU Readings *</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {getReadTimes().map((time) => (
                    <div key={time} className="space-y-2">
                      <Label htmlFor={`tou-${time}`}>{time} hours</Label>
                      <Input
                        id={`tou-${time}`}
                        type="number"
                        value={assayData.touReadings[time] || ''}
                        onChange={(e) => updateTouReading(time, e.target.value)}
                        placeholder="Enter TOU value"
                        min={100}
                        max={2000}
                        required
                      />
                    </div>
                  ))}
                  <div className="space-y-2">
                    <Label htmlFor="tou-end">End of Assay</Label>
                    <Input
                      id="tou-end"
                      type="number"
                      value={assayData.touReadings['end'] || ''}
                      onChange={(e) => updateTouReading('end', e.target.value)}
                      placeholder="Enter TOU value"
                      min={100}
                      max={2000}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plateCount">Reference Plate Count (Optional)</Label>
                <Input
                  id="plateCount"
                  type="number"
                  value={assayData.plateCount || ''}
                  onChange={(e) => setAssayData(prev => ({ 
                    ...prev, 
                    plateCount: e.target.value ? parseInt(e.target.value) : undefined 
                  }))}
                  placeholder="For validation purposes"
                  min={1}
                />
                <p className="text-sm text-gray-500">
                  If available, used to validate ISE method accuracy
                </p>
              </div>

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Continue to Calculation
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Calculation */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Calculate ISE Results</CardTitle>
            <CardDescription>
              Review your data and calculate the ISE results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sample Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Code:</span>
                      <span className="font-medium">{sampleData.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Matrix:</span>
                      <span className="font-medium">{sampleData.matrix}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Test Type:</span>
                      <Badge variant="outline">
                        {sampleData.testType === TestType.TPC ? '🦠 Bacteria' : '🍄 Yeast/Mold'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Assay Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dilution:</span>
                      <span className="font-medium">
                        {assayData.dilution === '1' ? 'As Is' : 
                         assayData.dilution === '1:10' ? '1:10 Dilution' :
                         `Dilution ${assayData.dilution}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{assayData.endAtHours} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TOU Readings:</span>
                      <span className="font-medium">
                        {Object.keys(assayData.touReadings).length} points
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* TOU Data Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">TOU Data Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(assayData.touReadings).map(([time, value]) => (
                      <div key={time} className="text-center p-3 border rounded-lg">
                        <div className="text-sm text-gray-600">{time === 'end' ? 'End' : `${time}h`}</div>
                        <div className="text-lg font-semibold">{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </Button>
                <Button
                  onClick={handleCalculate}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Calculate ISE Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
