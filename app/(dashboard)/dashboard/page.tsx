'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
// Local implementations to avoid import issues
const formatCfuResult = (result: any): string => {
  if (!result || typeof result === 'string') return result || 'N/A';
  if (result.cfuPerG) return result.cfuPerG.toFixed(2);
  if (result.value) return result.value.toFixed(2);
  return 'N/A';
};

const parseDilutionDisplay = (display: string): number => {
  if (!display) return 1;
  if (display.includes(':')) {
    const parts = display.split(':');
    if (parts.length === 2) {
      const denominator = parseFloat(parts[1].replace(/,/g, ''));
      return denominator > 0 ? 1 / denominator : 1;
    }
  }
  return parseFloat(display) || 1;
};

// Test Types - Updated to match the proprietary ISE algorithm
enum TestType {
  TAC_TPC = 'TAC/TPC',  // Total Aerobic Count / Total Plate Count (treated as TPC)
  YMC = 'YMC'            // Yeast Mold Count (treated as YM)
}

// Dilution Options
const DILUTION_OPTIONS = [
  { value: '1', label: '1 (Undiluted)', coefficient: 1.0 },
  { value: '1:10', label: '1:10', coefficient: 0.1 },
  { value: '1:100', label: '1:100', coefficient: 0.01 },
  { value: '1:1000', label: '1:1,000', coefficient: 0.001 },
  { value: '1:10000', label: '1:10,000', coefficient: 0.0001 },
  { value: '1:100000', label: '1:100,000', coefficient: 0.00001 },
  { value: '1:1000000', label: '1:1,000,000', coefficient: 0.000001 },
];

interface SampleData {
  id: string;
  name: string;
  testType: TestType;
  dilution: string;
  dilutionCoefficient: number;
  fillWeight: string;
  requiredDilutionSpec: string;
  status: 'pending' | 'running' | 'complete' | 'error';
}

interface TOUData {
  hour0: number;
  hour10: number;
  hour20: number;
  hourN: number;
}

// New interfaces for CSV handling
interface CSVRow {
  Date: string;
  Product: string;
  Test: string;
  Sample: string;
  DT: string;
  'Predicted CFU': string;
  Specification: string;
  Location?: string;
  User?: string;
  'Production Lot'?: string;
  VialLot?: string;
  Supplement?: string;
  Description?: string;
  Reported?: string;
  Validation?: string;
}

interface SampleTOUData {
  [sampleName: string]: {
    hour0: number;
    hour10: number;
    hour20: number;
    hour24: number;
  };
}

type HourKey = 'hour0' | 'hour10' | 'hour20' | 'hour24';

interface Results {
  cfuPerG: number;
  cfuPerVial: number;
  logValue: number;
  status: 'pending' | 'calculated' | 'error';
}

const MAX_SAMPLES = 32;

export default function DashboardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [sampleCount, setSampleCount] = useState(1);
  const [templateSampleName, setTemplateSampleName] = useState('');
  const [templateTestType, setTemplateTestType] = useState<TestType>(TestType.TAC_TPC);
  const [templateDilution, setTemplateDilution] = useState('1');
  const [templateDilutionCoefficient, setTemplateDilutionCoefficient] = useState(1.0);
  const [templateFillWeight, setTemplateFillWeight] = useState('');
  const [templateRequiredDilutionSpec, setTemplateRequiredDilutionSpec] = useState('1000');
  const [touData, setTouData] = useState<TOUData>({
    hour0: 0,
    hour10: 0,
    hour20: 0,
    hourN: 0,
  });
  const [results, setResults] = useState<Results>({
    cfuPerG: 0,
    cfuPerVial: 0,
    logValue: 0,
    status: 'pending',
  });
  const [isRunning, setIsRunning] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // New state for CSV handling
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [touDataBySample, setTouDataBySample] = useState<SampleTOUData>({});
  const [csvPreviewExpanded, setCsvPreviewExpanded] = useState(false);

  // State for storing calculated ISE results
  const [calculatedResults, setCalculatedResults] = useState<{ [sampleName: string]: any }>({});

  // Track the highest step reached
  const [highestStepReached, setHighestStepReached] = useState(1);

  const handleSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted!'); // Debug log
    
    // Generate the specified number of samples
    const newSamples: SampleData[] = [];
    for (let i = 0; i < sampleCount; i++) {
      newSamples.push({
        id: `sample-${Date.now()}-${i}`,
        name: templateSampleName ? `${templateSampleName} ${i + 1}` : `Sample ${i + 1}`,
        testType: templateTestType,
        dilution: templateDilution,
        dilutionCoefficient: templateDilutionCoefficient,
        fillWeight: templateFillWeight || '1.0',
        requiredDilutionSpec: templateRequiredDilutionSpec,
        status: 'pending',
      });
    }
    
    console.log('Samples created:', newSamples); // Debug log
    
    setSamples(newSamples);
    setCurrentSampleIndex(0);
    navigateToStep(2);
    setHighestStepReached(Math.max(highestStepReached, 2));
  };

  const addAnotherSample = () => {
    if (samples.length >= MAX_SAMPLES) {
      alert(`Maximum of ${MAX_SAMPLES} samples allowed per run`);
      return;
    }

    const newSample: SampleData = {
      id: `sample-${Date.now()}`,
      name: '',
      testType: TestType.TAC_TPC,
      dilution: '1',
      dilutionCoefficient: 1.0,
      fillWeight: '1.0',
      requiredDilutionSpec: '1000',
      status: 'pending',
    };

    setSamples(prev => [...prev, newSample]);
    setCurrentSampleIndex(samples.length);
  };

  const handleRunSample = () => {
    if (samples.length === 0) {
      alert('Please add at least one sample before running');
      return;
    }

    setIsRunning(true);
    // Simulate running the sample
    setTimeout(() => {
      setIsRunning(false);
      // Mark current sample as complete
      setSamples(prev => prev.map((sample, index) => 
        index === currentSampleIndex ? { ...sample, status: 'complete' } : sample
      ));
      
      // If all samples are complete, move to next step
      const updatedSamples = samples.map((sample, index) => 
        index === currentSampleIndex ? { ...sample, status: 'complete' } : sample
      );
      
      if (updatedSamples.every(sample => sample.status === 'complete')) {
        setCurrentStep(3);
      }
    }, 3000);
  };

  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    // Simulate importing data
    setTimeout(() => {
      setIsImporting(false);
      setCurrentStep(4);
    }, 1500);
  };

    const handleCalculate = async () => {
    setIsCalculating(true);
    
    try {
      // Prepare batch calculation data for the API
      const batchData = csvData.map(row => {
      const sampleTOU = touDataBySample[row.Sample];
      const matchedSample = findMatchingSample(row.Sample);
      
        if (!sampleTOU || !matchedSample) {
          return null;
        }
        
        return {
          sampleName: row.Sample,
          dilutionDisplay: matchedSample.dilution,
          dilutionCoeff: matchedSample.dilutionCoefficient,
          tou: {
            h0: sampleTOU.hour0,
            h10: sampleTOU.hour10,
            h20: sampleTOU.hour20,
            h24: sampleTOU.hour24,
          },
          requiredDilutionSpec: matchedSample.requiredDilutionSpec,
          fillWeight_g: parseFloat(matchedSample.fillWeight) || 1.0,
        };
      }).filter(Boolean); // Remove null entries
      
      if (batchData.length === 0) {
        throw new Error('No valid samples found for calculation');
      }
      
      console.log('Sending batch calculation request:', batchData);
      
      // Call the batch calculation API endpoint
      const response = await fetch('/api/ise/batch-calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ samples: batchData }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const { results } = await response.json();
      console.log('Received batch calculation results:', results);
      
      // Transform results to include additional dashboard data
      const dashboardResults: { [sampleName: string]: any } = {};
      
      csvData.forEach(row => {
        const sampleTOU = touDataBySample[row.Sample];
        const matchedSample = findMatchingSample(row.Sample);
        
        if (sampleTOU && matchedSample && results[row.Sample]) {
          dashboardResults[row.Sample] = {
            result: results[row.Sample],
          matchedSample,
          csvRow: row,
          sampleTOU
        };
      }
    });
    
    // Store results and move to next step
      setCalculatedResults(dashboardResults);
    navigateToStep(5);
    setHighestStepReached(Math.max(highestStepReached, 5));
      
    } catch (error) {
      console.error('Error during calculation:', error);
      alert(`Calculation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    if (Object.keys(calculatedResults).length === 0) {
      alert('No results to export. Please calculate results first.');
      return;
    }

    if (format === 'pdf') {
      exportToPDF();
    } else if (format === 'csv') {
      exportToCSV();
    }
  };

  const exportToPDF = () => {
    // Import jspdf dynamically to avoid SSR issues
    import('jspdf').then(({ default: jsPDF }) => {
      import('jspdf-autotable').then(({ default: autoTable }) => {
        const doc = new jsPDF();
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(59, 130, 246); // Blue-600
        doc.text('BioCount.io ISE Results Report', 105, 20, { align: 'center' });
        

        
        // Date and time
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99); // Gray-600
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        const timeStr = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        doc.text(`Generated on ${dateStr} at ${timeStr}`, 105, 40, { align: 'center' });
        
        // Summary stats
        doc.setFontSize(14);
        doc.setTextColor(17, 24, 39); // Gray-900
        doc.text('Analysis Summary', 20, 55);
        
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81); // Gray-700
        doc.text(`Total Samples: ${Object.keys(calculatedResults).length}`, 20, 65);
        doc.text(`Analysis Date: ${dateStr}`, 20, 72);
        
        // Results table
        const tableData = Object.entries(calculatedResults).map(([sampleName, data]) => [
          sampleName,
          data.matchedSample.testType,
          data.matchedSample.dilution,
          `${data.matchedSample.fillWeight} g`,
          data.matchedSample.requiredDilutionSpec,
          data.sampleTOU.hour0,
          data.sampleTOU.hour10,
          data.sampleTOU.hour20,
          data.sampleTOU.hour24,
          (data.result?.cfuPerMl || 0).toFixed(2),
          data.result?.formatted || data.result?.cfuPerG || 'N/A'
        ]);
        
        autoTable(doc, {
          head: [['Sample', 'Test Type', 'Dilution', 'Fill Weight', 'Required Spec', 'TOU 0h', 'TOU 10h', 'TOU 20h', 'TOU 24h', 'Avg Assay CFU/ml', 'CFU/g Result']],
          body: tableData,
          startY: 85,
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [59, 130, 246], // Blue-600
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [249, 250, 251] // Gray-50
          },
          columnStyles: {
            0: { cellWidth: 22 }, // Sample name
            1: { cellWidth: 18 }, // Test type
            2: { cellWidth: 16 }, // Dilution
            3: { cellWidth: 16 }, // Fill weight
            4: { cellWidth: 20 }, // Required spec
            5: { cellWidth: 14 }, // TOU 0h
            6: { cellWidth: 14 }, // TOU 10h
            7: { cellWidth: 14 }, // TOU 20h
            8: { cellWidth: 14 }, // TOU 24h
            9: { cellWidth: 20 }, // Avg Assay CFU/ml
            10: { cellWidth: 18 }  // CFU/g result
          }
        });
        
        // Footer
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(8);
        doc.setTextColor(156, 163, 175); // Gray-400
        doc.text('BioCount.io - Advanced Microbiological Enumeration', 105, finalY, { align: 'center' });
        
        // Save the PDF
        doc.save(`biocount-ise-results-${now.toISOString().split('T')[0]}.pdf`);
      });
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Sample Name',
      'Test Type', 
      'Dilution',
      'Fill Weight (g)',
      'Required Dilution Spec',
      'TOU 0h',
      'TOU 10h', 
      'TOU 20h',
      'TOU 24h',
      'Avg Assay CFU/ml',
      'CFU/g Result',
      'Analysis Date'
    ];
    
    const csvData = Object.entries(calculatedResults).map(([sampleName, data]) => [
      sampleName,
      data.matchedSample.testType,
      data.matchedSample.dilution,
      data.matchedSample.fillWeight,
      data.matchedSample.requiredDilutionSpec,
      data.sampleTOU.hour0,
      data.sampleTOU.hour10,
      data.sampleTOU.hour20,
      data.sampleTOU.hour24,
      (data.result?.cfuPerMl || 0).toFixed(2),
      data.result?.formatted || data.result?.cfuPerG || 'N/A',
      new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      })
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `biocount-ise-results-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV handling functions
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      const csv: CSVRow[] = [];
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          csv.push(row as CSVRow);
        }
      }
      
      setCsvData(csv);
      
      // Initialize TOU data for each sample
      const initialTOUData: SampleTOUData = {};
      csv.forEach(row => {
        initialTOUData[row.Sample] = {
          hour0: 0,
          hour10: 0,
          hour20: 0,
          hour24: 0,
        };
      });
      setTouDataBySample(initialTOUData);
    };
    reader.readAsText(file);
  };

  const handleTOUInputChange = (sampleName: string, hour: HourKey, value: string) => {
    setTouDataBySample(prev => ({
      ...prev,
      [sampleName]: {
        ...prev[sampleName],
        [hour]: parseFloat(value) || 0,
      },
    }));
  };

  const isTOUDataComplete = (): boolean => {
    if (csvData.length === 0) return false;
    
    return csvData.every(row => {
      const sampleTOU = touDataBySample[row.Sample];
      if (!sampleTOU) return false;
      
      return sampleTOU.hour0 > 0 && 
             sampleTOU.hour10 > 0 && 
             sampleTOU.hour20 > 0 && 
             sampleTOU.hour24 > 0;
    });
  };

  const handleProcessTOUData = () => {
    if (!isTOUDataComplete()) return;
    
    // Process the TOU data and move to next step
    // For now, just move to step 4
    navigateToStep(4);
    setHighestStepReached(Math.max(highestStepReached, 4));
  };

  const clearCSVData = () => {
    setCsvData([]);
    setTouDataBySample({});
  };

  // Sample name normalization function
  const normalizeSampleName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[-_]/g, ' ')  // Replace hyphens and underscores with spaces
      .replace(/\s+/g, ' ')   // Replace multiple spaces with single space
      .trim();                // Remove leading/trailing spaces
  };

  // Enhanced sample matching function
  const findMatchingSample = (csvSampleName: string) => {
    const normalizedCsvName = normalizeSampleName(csvSampleName);
    
    return samples.find(sample => {
      const normalizedSampleName = normalizeSampleName(sample.name);
      return normalizedSampleName === normalizedCsvName;
    });
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSamples([]);
    setCurrentSampleIndex(0);
    setSampleCount(1);
    setTemplateSampleName('');
    setTemplateTestType(TestType.TAC_TPC);
    setTemplateDilution('1');
    setTemplateDilutionCoefficient(1.0);
    setTemplateFillWeight('');
    setTemplateRequiredDilutionSpec('1000');
    setTouData({
      hour0: 0,
      hour10: 0,
      hour20: 0,
      hourN: 0,
    });
    setResults({
      cfuPerG: 0,
      cfuPerVial: 0,
      logValue: 0,
      status: 'pending',
    });
  };

  const updateDilution = (value: string) => {
    const selectedDilution = DILUTION_OPTIONS.find(d => d.value === value);
    if (selectedDilution) {
      setSamples(prev => prev.map((sample, index) => 
        index === currentSampleIndex 
          ? { ...sample, dilution: value, dilutionCoefficient: selectedDilution.coefficient }
          : sample
      ));
    }
  };

  const updateSampleField = (field: keyof SampleData, value: any, sampleIndex?: number) => {
    const targetIndex = sampleIndex !== undefined ? sampleIndex : currentSampleIndex;
    setSamples(prev => prev.map((sample, index) => 
      index === targetIndex ? { ...sample, [field]: value } : sample
    ));
  };

  const selectSample = (index: number) => {
    setCurrentSampleIndex(index);
  };

  const removeSample = (index: number) => {
    if (samples.length <= 1) {
      alert('At least one sample is required');
      return;
    }
    
    setSamples(prev => prev.filter((_, i) => i !== index));
    
    // Adjust current sample index if necessary
    if (currentSampleIndex >= samples.length - 1) {
      setCurrentSampleIndex(Math.max(0, samples.length - 2));
    }
  };

  const getCurrentSample = () => samples[currentSampleIndex] || {
    name: '',
    testType: TestType.TAC_TPC,
    dilution: '1',
    dilutionCoefficient: 1.0,
    fillWeight: '1.0',
    requiredDilutionSpec: '1000',
    status: 'pending',
  };

  // Enhanced step navigation function
  const navigateToStep = (step: number) => {
    console.log('Navigating to step:', step); // Debug log
    setCurrentStep(step);
    // Always allow access to any step - no restrictions
  };

  const handleDeleteSample = (sampleName: string) => {
    setCsvData(prev => prev.filter(row => row.Sample !== sampleName));
    setTouDataBySample(prev => {
      const newState = { ...prev };
      delete newState[sampleName];
      return newState;
    });
    // If the deleted sample was the current one, reset to the first sample
    if (findMatchingSample(sampleName) === getCurrentSample()) {
      selectSample(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">BioCount.io Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Rapid Microbiological Enumeration using the ISE Method
        </p>
        <div className="mt-4">
          <Badge variant="outline" className="text-sm">
            Capacity: {samples.length}/{MAX_SAMPLES} samples per run
          </Badge>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[
          { step: 1, title: 'Set Parameters', description: 'Begin New Analysis' },
          { step: 2, title: 'Sample Setup', description: 'Count, Name & Type' },
          { step: 3, title: 'Import Data', description: 'TOU Readings' },
          { step: 4, title: 'Calculate', description: 'ISE Results' },
          { step: 5, title: 'Export', description: 'Results & Reports' },
        ].map(({ step, title, description }) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => {
                console.log('Step button clicked:', step); // Debug log
                navigateToStep(step);
              }}
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-semibold transition-all ${
                currentStep === step
                    ? 'bg-blue-600 text-white border-blue-600 cursor-pointer hover:bg-blue-700 hover:scale-105'
                    : 'bg-blue-600 text-white border-blue-600 cursor-pointer hover:bg-blue-700 hover:scale-105'
              }`}
            >
              {step}
            </button>
            <div className="ml-3">
              <div className={`text-sm font-medium ${
                currentStep === step ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {title}
              </div>
              <div className="text-xs text-gray-400">{description}</div>
            </div>
            {step < 5 && (
              <div className={`ml-4 w-16 h-0.5 ${
                currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Set Parameters */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 1: Set Parameters</CardTitle>
                      <CardDescription>
              Begin your analysis by configuring sample parameters and specifying how many samples to process
          </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSampleSubmit}>
              {/* Sample Count */}
              <div className="space-y-2">
                <Label htmlFor="sampleCount">Number of Samples</Label>
                <Input
                  id="sampleCount"
                  type="number"
                  min="1"
                  max="32"
                  placeholder="1-32"
                  value={sampleCount}
                  onChange={(e) => setSampleCount(Math.min(32, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-32"
                  required
                />
                <div className="text-xs text-gray-500">
                  Enter the number of samples you want to process (1-32)
                </div>
              </div>

              {/* Sample Name */}
              <div className="space-y-2">
                <Label htmlFor="sampleName">Sample Name</Label>
                <Input
                  id="sampleName"
                  placeholder="Enter sample name (e.g., Product A, Batch 123)"
                  value={templateSampleName}
                  onChange={(e) => setTemplateSampleName(e.target.value)}
                  required
                />
              </div>

              {/* Test Type Selection */}
              <div className="space-y-2">
                <Label>Test Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.values(TestType).map((type) => (
                    <div
                      key={type}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        templateTestType === type
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setTemplateTestType(type)}
                    >
                      <div className="text-center">
                        <div className="font-semibold text-gray-900">{type}</div>
                        <div className="text-sm text-gray-600">
                          {type === TestType.TAC_TPC && 'Total Aerobic/Plate Count'}
                          {type === TestType.YMC && 'Yeast Mold Count'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dilution Selection */}
              <div className="space-y-2">
                <Label>Dilution Factor</Label>
                <div className="grid grid-cols-4 gap-3">
                  {DILUTION_OPTIONS.map((dilution) => (
                    <div
                      key={dilution.value}
                      className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                        templateDilution === dilution.value
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        setTemplateDilution(dilution.value);
                        setTemplateDilutionCoefficient(dilution.coefficient);
                      }}
                    >
                      <div className="font-semibold text-gray-900">{dilution.label}</div>
                      <div className="text-sm text-gray-600">Coeff: {dilution.coefficient}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fill Weight and Required Test Dilution Spec */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fillWeight">Fill Weight (g)</Label>
                  <Input
                    id="fillWeight"
                    type="text"
                    placeholder="1.00"
                    value={templateFillWeight}
                    onChange={(e) => setTemplateFillWeight(e.target.value)}
                  />
                  <div className="text-xs text-gray-500">
                    Weight of the sample in grams (must be &gt; 0)
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="requiredDilutionSpec">Required Test Dilution Specification</Label>
                  <Input
                    id="requiredDilutionSpec"
                    placeholder="e.g., 1000"
                    value={templateRequiredDilutionSpec}
                    onChange={(e) => setTemplateRequiredDilutionSpec(e.target.value)}
                    required
                  />
                  <div className="text-xs text-gray-500">
                    The dilution specification for your test (e.g., 1000, 10000)
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue to Sample Run
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Sample Setup */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 2: Sample Setup</CardTitle>
            <CardDescription>
              Manage your samples, configure test types and dilutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sample Management */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Sample Management</h3>
                <Button 
                  onClick={addAnotherSample} 
                  variant="outline" 
                  disabled={samples.length >= MAX_SAMPLES}
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  + Add Another Sample
                </Button>
              </div>
              
              {/* Sample List */}
              {samples.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {samples.map((sample, index) => (
                    <div
                      key={sample.id}
                      className={`p-3 border-2 rounded-lg transition-all cursor-pointer ${
                        index === currentSampleIndex
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => selectSample(index)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSample(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                      
                      {/* Editable Sample Fields */}
                      <div className="space-y-2">
                        {/* Sample Name Input */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600 font-medium">Sample Name</Label>
                          <Input
                            value={sample.name}
                            onChange={(e) => updateSampleField('name', e.target.value, index)}
                            placeholder="Enter sample name..."
                            className="text-sm h-8 font-bold text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectSample(index);
                            }}
                            onFocus={(e) => {
                              e.stopPropagation();
                              selectSample(index);
                            }}
                          />
                        </div>
                        
                        {/* Test Type Dropdown */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Type</Label>
                          <Select
                            value={sample.testType}
                            onValueChange={(value) => updateSampleField('testType', value, index)}
                          >
                            <SelectTrigger className="text-xs h-7">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(TestType).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type === TestType.TAC_TPC && 'TAC/TPC'}
                                  {type === TestType.YMC && 'YMC'}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Dilution Dropdown */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Dilution</Label>
                          <Select
                            value={sample.dilution}
                            onValueChange={(value) => {
                              const selectedDilution = DILUTION_OPTIONS.find(d => d.value === value);
                              if (selectedDilution) {
                                setSamples(prev => prev.map((s, i) => 
                                  i === index 
                                    ? { ...s, dilution: value, dilutionCoefficient: selectedDilution.coefficient }
                                    : s
                                ));
                              }
                            }}
                          >
                            <SelectTrigger className="text-xs h-7">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {DILUTION_OPTIONS.map((dilution) => (
                                <SelectItem key={dilution.value} value={dilution.value}>
                                  {dilution.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Fill Weight Input */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Fill Weight (g)</Label>
                          <Input
                            type="text"
                            value={sample.fillWeight}
                            onChange={(e) => updateSampleField('fillWeight', e.target.value, index)}
                            placeholder="1.00"
                            className="text-xs h-7 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectSample(index);
                            }}
                            onFocus={(e) => {
                              e.stopPropagation();
                              selectSample(index);
                            }}
                          />
                        </div>
                        
                        {/* Required Test Dilution Specification Input */}
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Required Dilution Specification</Label>
                          <Input
                            value={sample.requiredDilutionSpec}
                            onChange={(e) => updateSampleField('requiredDilutionSpec', e.target.value, index)}
                            placeholder="e.g., 1000"
                            className="text-xs h-7 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectSample(index);
                            }}
                            onFocus={(e) => {
                              e.stopPropagation();
                              selectSample(index);
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Status Display */}
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">Status:</span>
                          <Badge 
                            variant={sample.status === 'complete' ? 'default' : 'secondary'}
                            className={`text-xs px-2 py-1 ${
                              sample.status === 'complete' ? 'bg-green-100 text-green-800' : ''
                            }`}
                          >
                            {sample.status === 'pending' && 'Pending'}
                            {sample.status === 'running' && 'Running'}
                            {sample.status === 'complete' && 'Complete'}
                            {sample.status === 'error' && 'Error'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {samples.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No samples added yet. Please add your first sample.
                </div>
              )}
            </div>

            {/* Current Sample Details */}
            {samples.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Selected Sample: {getCurrentSample().name || `Sample ${currentSampleIndex + 1}`}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Test Type:</span>
                    <div className="font-medium text-blue-900">{getCurrentSample().testType}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Dilution:</span>
                    <div className="font-medium text-blue-900">{getCurrentSample().dilution} (Coeff: {getCurrentSample().dilutionCoefficient})</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Fill Weight:</span>
                    <div className="font-medium text-blue-900">{getCurrentSample().fillWeight} g</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Required Dilution Specification:</span>
                    <div className="font-medium text-blue-900">{getCurrentSample().requiredDilutionSpec}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Status:</span>
                    <div className="font-medium text-blue-900">{getCurrentSample().status}</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-blue-600">
                  Click on any sample card above to select it, or use the "Add Another Sample" button to create new samples.
                </div>
              </div>
            )}

            {/* Assay Progress */}
            {samples.length > 0 && (
              <div className="text-center space-y-4">
                {/* Removed Run Current Sample button - not needed for workflow */}
                    </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 space-y-3">
              {samples.length > 0 && (
                <Button onClick={() => navigateToStep(3)} className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue to Data Import
                  </Button>
              )}
              
              <div className="flex justify-between">
                <Button 
                  onClick={() => navigateToStep(1)} 
                  variant="outline"
                >
                  ← Back to Sample Setup
                </Button>
                
                <Button 
                  onClick={() => navigateToStep(3)} 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Skip to Data Import →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Import Data */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 3: Import Soleris Data & Enter TOU Values</CardTitle>
            <CardDescription>
              Upload CSV from Soleris Software and enter TOU readings for each sample
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* CSV Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">1. Upload Soleris CSV Export</h3>
              
              {/* Drag & Drop Zone */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <div className="space-y-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-gray-600">
                    <p className="text-lg font-medium">Drag and drop your Soleris CSV file here</p>
                    <p className="text-sm">or click to browse</p>
                    </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleCSVUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button 
                    onClick={() => document.getElementById('csv-upload')?.click()}
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Browse Files
                  </Button>
                  </div>
              </div>

              {/* Manual Add Samples Button */}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <div className="space-y-4">
                  <svg className="mx-auto h-12 w-12 text-green-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M12 6v6m0 0v6m0-6h6m-6 0H6m12 0h6m-6 0v6m0-6V6m0 6h6m-6 0H6m12 0h6m-6 0v6m0-6V6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="text-gray-600">
                    <p className="text-lg font-medium">Or use samples from steps 1 & 2</p>
                    <p className="text-sm">Add your created samples to enter TOU values</p>
                  </div>
                  <Button 
                    onClick={() => {
                      // Convert samples from steps 1 & 2 to CSV format
                      const sampleRows: CSVRow[] = samples.map((sample, index) => ({
                        Date: new Date().toLocaleDateString(),
                        Product: 'Manual Entry',
                        Test: sample.testType,
                        Sample: sample.name,
                        DT: 'Manual',
                        'Predicted CFU': 'TBD',
                        Specification: sample.requiredDilutionSpec,
                        Location: 'Manual',
                        User: 'User',
                        'Production Lot': `Lot ${index + 1}`,
                        VialLot: 'Manual',
                        Supplement: 'Manual',
                        Description: `Sample ${index + 1}`,
                        Reported: 'Manual',
                        Validation: 'Manual'
                      }));
                      
                      setCsvData(sampleRows);
                      
                      // Initialize TOU data for each sample
                      const initialTOUData: SampleTOUData = {};
                      sampleRows.forEach(row => {
                        initialTOUData[row.Sample] = {
                          hour0: 0,
                          hour10: 0,
                          hour20: 0,
                          hour24: 0,
                        };
                      });
                      setTouDataBySample(initialTOUData);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Manually Add Samples
                  </Button>
                  </div>
              </div>

              {/* CSV Preview */}
              {csvData.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">
                      CSV Preview ({csvData.length} rows)
                    </h4>
                    <div className="flex space-x-2">
                      {!csvPreviewExpanded ? (
                        <Button
                          onClick={() => setCsvPreviewExpanded(true)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          Show All Rows
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setCsvPreviewExpanded(false)}
                          variant="outline"
                          size="sm"
                          className="text-gray-600 border-gray-300 hover:bg-gray-50"
                        >
                          Collapse Preview
                        </Button>
                      )}
                      {/* Clear All Button */}
                      <Button
                        onClick={() => {
                          if (confirm(`Are you sure you want to clear all ${csvData.length} samples? This will remove all CSV data and TOU values.`)) {
                            clearCSVData();
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-2">Date</th>
                          <th className="text-left py-2 px-2">Product</th>
                          <th className="text-left py-2 px-2">Test</th>
                          <th className="text-left py-2 px-2">Sample</th>
                          <th className="text-left py-2 px-2">DT (TOU)</th>
                          <th className="text-left py-2 px-2">Predicted CFU</th>
                          <th className="text-left py-2 px-2">Specification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvData.slice(0, csvPreviewExpanded ? csvData.length : 5).map((row, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-2 px-2">{row.Date}</td>
                            <td className="py-2 px-2">{row.Product}</td>
                            <td className="py-2 px-2">{row.Test}</td>
                            <td className="py-2 px-2">{row.Sample}</td>
                            <td className="py-2 px-2">{row.DT}</td>
                            <td className="py-2 px-2">{row['Predicted CFU']}</td>
                            <td className="py-2 px-2">{row.Specification}</td>
                          </tr>
                        ))}
                        {!csvPreviewExpanded && csvData.length > 5 && (
                          <tr>
                            <td colSpan={7} className="py-2 px-2 text-center text-gray-500">
                              ... and {csvData.length - 5} more rows
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              </div>

            {/* Sample TOU Input Grid - Similar to Step 2 layout */}
            {csvData.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">2. Enter TOU Values for Each Sample</h3>
                
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                      <div className="font-medium">TOU Input Instructions:</div>
                    <ul className="mt-1 space-y-1">
                        <li>• Enter TOU values from your Soleris growth curves for each sample</li>
                        <li>• Required time points: 0, 10, 20, and 24 hours</li>
                        <li>• Samples with matching names will show ✓ Matched status</li>
                        <li>• Unmatched samples can still be processed</li>
                        <li>• Manual samples from steps 1 & 2 will be automatically matched</li>
                    </ul>
                  </div>
                </div>
              </div>

                {/* Sample Grid - Similar to Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                  {csvData.map((row, index) => {
                    const matchedSample = findMatchingSample(row.Sample);
                    const isMatched = !!matchedSample;
                    const sampleTOU = touDataBySample[row.Sample];
                    
                    return (
                      <div
                        key={index}
                        className={`p-3 border-2 rounded-lg transition-all ${
                          isMatched 
                            ? 'border-green-300 bg-green-50 hover:border-green-400' 
                            : 'border-orange-300 bg-orange-50 hover:border-orange-400'
                        }`}
                      >
                        {/* Sample Header */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-sm mb-1">{row.Sample}</div>
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>{row.Product}</div>
                              <div>{row.Test}</div>
                              <div>DT: {row.DT}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {isMatched ? (
                              <Badge className="bg-green-100 text-green-800 text-xs">✓ Matched</Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 text-xs">⚠ Unmatched</Badge>
                            )}
                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteSample(row.Sample)}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                              title="Delete sample"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* TOU Input Circles */}
                        <div className="space-y-3">
                          <div className="text-center text-xs font-medium text-gray-700 mb-3">TOU Values</div>
                          
                          {/* 4 TOU Input Circles */}
                          <div className="grid grid-cols-2 gap-3 justify-items-center">
                            {[
                              { key: 'hour0', label: '0h' },
                              { key: 'hour10', label: '10h' },
                              { key: 'hour20', label: '20h' },
                              { key: 'hour24', label: '24h' },
                            ].map(({ key, label }) => (
                              <div key={key} className="text-center flex flex-col items-center">
                                {/* Input Field */}
                                <Input
                                  type="number"
                                  step="0.001"
                                  placeholder="0"
                                  value={sampleTOU?.[key as HourKey] || ''}
                                  onChange={(e) => handleTOUInputChange(row.Sample, key as HourKey, e.target.value)}
                                  className="w-16 h-16 text-center text-lg font-bold border-2 rounded-full p-0 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  required
                                />
                                {/* Hour Label */}
                                <div className="text-xs font-medium text-gray-600 mt-2">
                                  {label}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sample Details */}
                        {matchedSample && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>Type: {matchedSample.testType}</div>
                              <div>Dilution: {matchedSample.dilution}</div>
                              <div>Coeff: {matchedSample.dilutionCoefficient}</div>
                              <div>Fill Weight: {matchedSample.fillWeight} g</div>
                              <div>Required Dilution Specification: {matchedSample.requiredDilutionSpec}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 space-y-3">
              {csvData.length > 0 && (
                <Button 
                  onClick={handleProcessTOUData}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!isTOUDataComplete()}
                >
                  Process TOU Data & Continue
                </Button>
              )}
              
              <div className="flex justify-between">
                <Button 
                  onClick={() => navigateToStep(2)} 
                  variant="outline"
                >
                  ← Back to Samples
                </Button>
                
                <Button 
                  onClick={() => navigateToStep(4)} 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Skip to Results →
                </Button>
                
                {csvData.length > 0 && (
                  <Button 
                    onClick={clearCSVData}
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Clear CSV Data
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Calculate Results */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 4: Calculate ISE Results</CardTitle>
            <CardDescription>
              Process TOU data using the ISE method to generate cfu/g results for all samples
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Summary for All Samples */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Imported TOU Data Summary</h3>
              
              {csvData.map((row, index) => {
                const sampleTOU = touDataBySample[row.Sample];
                const matchedSample = findMatchingSample(row.Sample);
                
                return (
                  <div key={index} className={`bg-gray-50 p-4 rounded-lg border ${matchedSample ? 'border-green-200' : 'border-orange-200'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{row.Sample}</h4>
                      {matchedSample ? (
                        <Badge className="bg-green-100 text-green-800">✓ Matched</Badge>
                      ) : (
                        <Badge className="bg-orange-100 text-orange-800">⚠ Unmatched</Badge>
                      )}
                    </div>
                    
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">0 Hour</div>
                        <div className="font-medium text-lg">{sampleTOU?.hour0 || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">10 Hour</div>
                        <div className="font-medium text-lg">{sampleTOU?.hour10 || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">20 Hour</div>
                        <div className="font-medium text-lg">{sampleTOU?.hour20 || 0}</div>
                </div>
                <div className="text-center">
                        <div className="text-gray-600">24 Hour</div>
                        <div className="font-medium text-lg">{sampleTOU?.hour24 || 0}</div>
                </div>
              </div>
                    
                    {matchedSample && (
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                        <div>Test Type: {matchedSample.testType} | Dilution: {matchedSample.dilution}</div>
                        <div>Fill Weight: {matchedSample.fillWeight} g | Required Specification: {matchedSample.requiredDilutionSpec}</div>
                        <div>Product: {row.Product} | Test: {row.Test}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Calculation Button */}
            <div className="text-center">
              <Button 
                onClick={handleCalculate} 
                disabled={isCalculating}
                className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  'Calculate CFU/G Results for All Samples'
                )}
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex justify-between">
                <Button 
                  onClick={() => navigateToStep(3)} 
                  variant="outline"
                >
                  ← Back to Data Import
                </Button>
                
                <Button 
                  onClick={() => navigateToStep(5)} 
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  Skip to Export →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Results & Export */}
      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Step 5: Results & Export</CardTitle>
            <CardDescription>
              Review your ISE calculation results for each sample and export as needed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Individual Sample Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Sample Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {csvData.map((row, index) => {
                  const sampleTOU = touDataBySample[row.Sample];
                  const matchedSample = findMatchingSample(row.Sample);
                  const isMatched = !!matchedSample;
                  const calculatedResult = calculatedResults[row.Sample];
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg ${
                        isMatched 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-orange-300 bg-orange-50'
                      }`}
                    >
                      {/* Sample Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">{row.Sample}</h4>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>{row.Product} | {row.Test}</div>
                            <div>DT from CSV: {row.DT}</div>
                            {matchedSample && (
                              <>
                              <div>Type: {matchedSample.testType} | Dilution: {matchedSample.dilution}</div>
                                <div>Fill Weight: {matchedSample.fillWeight} g | Required Specification: {matchedSample.requiredDilutionSpec}</div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="ml-2">
                          {isMatched ? (
                            <Badge className="bg-green-100 text-green-800">✓ Matched</Badge>
                          ) : (
                            <Badge className="bg-orange-100 text-orange-800">⚠ Unmatched</Badge>
                          )}
              </div>
            </div>

                      {/* TOU Values Summary */}
                      <div className="bg-white p-3 rounded border mb-3">
                        <div className="text-xs font-medium text-gray-700 mb-2">TOU Values</div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                            <div className="text-xs text-gray-500">0h</div>
                            <div className="font-medium">{sampleTOU?.hour0 || 0}</div>
                </div>
                <div>
                            <div className="text-xs text-gray-500">10h</div>
                            <div className="font-medium">{sampleTOU?.hour10 || 0}</div>
                </div>
                <div>
                            <div className="text-xs text-gray-500">20h</div>
                            <div className="font-medium">{sampleTOU?.hour20 || 0}</div>
                </div>
                <div>
                            <div className="text-xs text-gray-500">24h</div>
                            <div className="font-medium">{sampleTOU?.hour24 || 0}</div>
                </div>
                        </div>
                      </div>

                      {/* Results Display */}
                      {isMatched && calculatedResult ? (
                        <div className="space-y-3">
                          <div className="text-center text-sm font-medium text-gray-700">ISE Results</div>
                          
                          {calculatedResult.result.kind === 'numeric' ? (
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-blue-50 p-3 rounded-lg text-center">
                                <div className="text-lg font-bold text-blue-600 mb-1">
                                  {Math.round(calculatedResult.result?.cfuPerMl || 0).toLocaleString()}
                                </div>
                                <div className="text-xs font-medium text-blue-800">Avg Assay cfu/mL</div>
                              </div>
                              
                              <div className="bg-green-50 p-3 rounded-lg text-center">
                                <div className="text-lg font-bold text-green-600 mb-1">
                                  {Math.round(calculatedResult.result?.cfuPerG || 0).toLocaleString()}
                                </div>
                                <div className="text-xs font-medium text-blue-800">cfu/g</div>
                              </div>
                              
                              <div className="bg-purple-50 p-3 rounded-lg text-center">
                                <div className="text-lg font-bold text-purple-600 mb-1">
                                  {calculatedResult.result?.cfuPerG > 0 ? Math.log10(calculatedResult.result.cfuPerG).toFixed(2) : '0.00'}
                                </div>
                                <div className="text-xs font-medium text-purple-800">Log₁₀</div>
                              </div>
                            </div>
                          ) : calculatedResult.result.kind === 'lod' ? (
                            <div className="text-center py-3">
                              <div className="text-lg font-bold text-orange-600 mb-1">
                                {calculatedResult.result?.formatted || calculatedResult.result?.cfuPerG || 'N/A'}
                              </div>
                              <div className="text-xs text-orange-600">Limit of Detection</div>
                              <div className="text-xs text-gray-500 mt-1">
                                ΔTOU: {calculatedResult.result.debug?.deltaTOU} &lt; 20
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-3">
                              <div className="text-sm text-gray-500">
                                {calculatedResult.result?.message || 'No message available'}
                              </div>
                            </div>
                          )}
                          
                          {/* Debug Information */}
                          {calculatedResult.result?.debug && (
                            <div className="bg-gray-50 p-2 rounded text-xs text-gray-600">
                              <div>Timepoint: {calculatedResult.result.debug?.chosenTimepoint || 'N/A'}</div>
                              <div>ΔTOU: {calculatedResult.result.debug?.deltaTOU || 'N/A'}</div>
                              <div>Constants: {calculatedResult.result.debug?.constantsUsed?.touPerCfu || 'N/A'}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          {!isMatched ? (
                            <div className="text-orange-600 text-sm">
                              ⚠️ Sample not matched - cannot calculate results
                            </div>
                          ) : !calculatedResult ? (
                            <div className="text-gray-500 text-sm">
                              Results not yet calculated
                            </div>
                          ) : (
                            <div className="text-gray-500 text-sm">
                              No significant TOU change detected
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Export Results</h3>
              
              {/* Export Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-800">Export Summary</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-600 font-medium">Samples:</span>
                    <span className="text-blue-800 ml-1">{Object.keys(calculatedResults).length}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Date:</span>
                    <span className="text-blue-800 ml-1">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Time:</span>
                    <span className="text-blue-800 ml-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div>
                    <span className="text-blue-600 font-medium">Format:</span>
                    <span className="text-blue-800 ml-1">PDF/CSV</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => handleExport('pdf')} 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  📄 Export All to PDF
                </Button>
                <Button 
                  onClick={() => handleExport('csv')} 
                  variant="outline" 
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  📊 Export All to CSV
                </Button>
                <Button 
                  onClick={() => alert('Database export functionality coming soon!')} 
                  variant="outline" 
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  💾 Save to Database
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
              <Button onClick={resetForm} variant="outline">
                Start New Sample
              </Button>
              <Button onClick={() => navigateToStep(1)} className="bg-blue-600 hover:bg-blue-700">
                Modify Sample
              </Button>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex justify-between">
                <Button 
                  onClick={() => navigateToStep(4)} 
                  variant="outline"
                >
                  ← Back to Results
                </Button>
                
                <Button 
                  onClick={() => navigateToStep(3)} 
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Back to Data Import
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
