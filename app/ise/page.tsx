'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ComputeResult {
  raw: number | null;
  display: string;
}

interface ComputeResponse {
  ok: boolean;
  result?: ComputeResult;
  error?: string;
  details?: string | string[];
}

export default function ISEPage() {
  const [formData, setFormData] = useState({
    dilutionDisplay: '1:1000',
    dilutionCoeff: '',
    tou: {
      h0: '100',
      h10: '120',
      h20: '150',
      h24: '180'
    },
    requiredDilutionSpec: '1000',
    fillWeight_g: ''
  });

  const [result, setResult] = useState<ComputeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('tou.')) {
      const touField = field.split('.')[1];
      setFormData(prev => ({
      ...prev,
      tou: {
        ...prev.tou,
          [touField]: value
      }
    }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.tou.h0 || !formData.tou.h10 || !formData.tou.h20 || !formData.tou.h24 || 
        !formData.requiredDilutionSpec || !formData.fillWeight_g) {
      setResult({
        ok: false,
        error: 'VALIDATION_ERROR',
        details: 'Please fill in all required fields'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      // Prepare request payload
      const payload: any = {
        tou: {
          h0: Number(formData.tou.h0),
          h10: Number(formData.tou.h10),
          h20: Number(formData.tou.h20),
          h24: Number(formData.tou.h24)
        },
        requiredDilutionSpec: formData.requiredDilutionSpec,
        fillWeight_g: Number(formData.fillWeight_g)
      };

      // Add optional fields if provided
      if (formData.dilutionDisplay) {
        payload.dilutionDisplay = formData.dilutionDisplay;
      }
      if (formData.dilutionCoeff) {
        payload.dilutionCoeff = Number(formData.dilutionCoeff);
      }

      console.log('Sending payload:', payload);

             const response = await fetch('http://localhost:3000/api/ise/compute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      setResult(data);

    } catch (error) {
      console.error('Error in handleSubmit:', error);
      setResult({
        ok: false,
        error: 'NETWORK_ERROR',
        details: error instanceof Error ? error.message : 'Failed to connect to the server'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BioCount ISE Calculator</h1>
        <p className="text-gray-600">
          Convert CO₂ RMM TOU time-series into CFU/g using our ISE method
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
            <CardDescription>
              Enter your sample data to calculate CFU/g
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dilution Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dilution</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dilutionDisplay">Dilution Display</Label>
                <Input
                  id="dilutionDisplay"
                      placeholder="e.g., 1:1000"
                      value={formData.dilutionDisplay}
                  onChange={(e) => handleInputChange('dilutionDisplay', e.target.value)}
                />
                    <p className="text-sm text-gray-500 mt-1">
                      Format: 1:1000, 1:1,000, or 0.001
                </p>
              </div>
                  <div>
                    <Label htmlFor="dilutionCoeff">Dilution Coefficient (Optional)</Label>
                <Input
                      id="dilutionCoeff"
                      type="number"
                      step="0.000001"
                      placeholder="e.g., 0.001"
                      value={formData.dilutionCoeff}
                      onChange={(e) => handleInputChange('dilutionCoeff', e.target.value)}
                />
              </div>
                </div>
              </div>

              <Separator />

              {/* TOU Values Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">TOU Values</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tou0h">TOU 0h</Label>
                    <Input
                      id="tou0h"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.tou.h0}
                      onChange={(e) => handleInputChange('tou.h0', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tou10h">TOU 10h</Label>
                    <Input
                      id="tou10h"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.tou.h10}
                      onChange={(e) => handleInputChange('tou.h10', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tou20h">TOU 20h</Label>
                    <Input
                      id="tou20h"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.tou.h20}
                      onChange={(e) => handleInputChange('tou.h20', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tou24h">TOU 24h</Label>
                    <Input
                      id="tou24h"
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.tou.h24}
                      onChange={(e) => handleInputChange('tou.h24', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Other Parameters */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Other Parameters</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="requiredDilutionSpec">Required Test Dilution Specification</Label>
                    <Input
                      id="requiredDilutionSpec"
                      required
                      placeholder="e.g., 1000"
                      value={formData.requiredDilutionSpec}
                      onChange={(e) => handleInputChange('requiredDilutionSpec', e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      The dilution specification for your test (e.g., 1000, 10000)
                </p>
              </div>
                  <div>
                    <Label htmlFor="fillWeight_g">Fill Weight (g)</Label>
                <Input
                      id="fillWeight_g"
                  type="text"
                      required
                      placeholder="1.00"
                      value={formData.fillWeight_g}
                      onChange={(e) => handleInputChange('fillWeight_g', e.target.value)}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Weight of the sample in grams (must be &gt; 0)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
              <Button 
                type="submit" 
                className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Computing...' : 'Compute Result'}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                                         try {
                                               const response = await fetch('http://localhost:3000/api/ise/test-workbook');
                      const data = await response.json();
                      console.log('Workbook test result:', data);
                      alert(`Workbook test: ${data.ok ? 'SUCCESS' : 'FAILED'}\n${JSON.stringify(data, null, 2)}`);
                    } catch (error) {
                      console.error('Workbook test error:', error);
                      alert('Workbook test failed: ' + error);
                    }
                  }}
                >
                  Test Workbook
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setFormData({
                      dilutionDisplay: '1:1000',
                      dilutionCoeff: '',
                      tou: { h0: '100', h10: '120', h20: '150', h24: '180' },
                      requiredDilutionSpec: '1000',
                      fillWeight_g: ''
                    });
                    setResult(null);
                  }}
                >
                  Reset Form
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      // Read current cell values (what's actually in the workbook)
                                             const readResponse = await fetch('http://localhost:3000/api/ise/debug-cells', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'read' })
                      });
                      const readData = await readResponse.json();
                      console.log('Current cell values:', readData);
                      
                      alert(`Current cell values:\n\n${JSON.stringify(readData.cellValues, null, 2)}`);
                    } catch (error) {
                      console.error('Debug error:', error);
                      alert('Debug failed: ' + error);
                    }
                  }}
                >
                  Read Current Values
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={async () => {
                    try {
                      // Write test values to verify system is working
                                             const writeResponse = await fetch('http://localhost:3000/api/ise/debug-cells', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          action: 'write',
                          testValues: {
                            dilutionDisplay: '1:100',
                            tou: { h0: 999, h10: 888, h20: 777, h24: 666 },
                            requiredDilutionSpec: '1:100',
                            fillWeight_g: 5.0
                          }
                        })
                      });
                      const writeData = await writeResponse.json();
                      console.log('Test values written:', writeData);
                      
                      alert(`Test values written successfully!\n\nWritten values: ${JSON.stringify(writeData.writtenValues, null, 2)}`);
                    } catch (error) {
                      console.error('Debug error:', error);
                      alert('Debug failed: ' + error);
                    }
                  }}
                >
                  Write Test Values
              </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              CFU/g calculation result from Excel workbook
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Processing...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {result.ok ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Result (K15)</h4>
                      <div className="text-2xl font-bold text-green-900">
                        {result.result?.display}
                  </div>
                      {result.result?.raw !== null && (
                        <div className="text-sm text-green-700 mt-1">
                          Raw value: {result.result.raw}
                      </div>
                    )}
                  </div>
                </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Error</h4>
                    <p className="text-red-700">{result.error}</p>
                    {result.details && (
                      <div className="mt-2">
                        {Array.isArray(result.details) ? (
                          <ul className="text-sm text-red-600 list-disc list-inside">
                            {result.details.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-red-600">{result.details}</p>
                        )}
                      </div>
                    )}
                </div>
                )}
              </div>
            )}

            {!result && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                <p>Enter parameters and click Compute to see results</p>
                <p className="text-sm mt-2">Make sure all required fields are filled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
