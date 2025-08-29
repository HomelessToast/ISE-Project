import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data for analysis
const mockAnalysisData = [
  {
    sampleId: 'beet-1',
    description: 'Beet Sample',
    testType: 'S2-SAL',
    result: 'ND S2-SAL',
    detectionTime: '3.8 Hrs',
    concentration: '<10 cfu/gram',
    status: 'Complete',
    endTime: '4/17/2020 11:20:36 AM',
    user: 'Validation Lab',
    threshold: 8,
    skip: 1,
    shutEye: 25,
    duration: 20,
    temperature: 35,
  },
  {
    sampleId: 'beet-5',
    description: 'Beet Sample',
    testType: 'CC-109',
    result: 'CC-109',
    detectionTime: '16 Hrs',
    concentration: '<10 cfu/gram',
    status: 'Complete',
    endTime: '4/17/2020 11:20:36 AM',
    user: 'Validation Lab',
    threshold: 8,
    skip: 1,
    shutEye: 25,
    duration: 20,
    temperature: 35,
  },
  {
    sampleId: 'EQ-CHOC-21',
    description: 'Chocolate Sample',
    testType: 'S2-STA',
    result: 'S2-STA',
    detectionTime: '12.5 Hrs',
    concentration: '<10 cfu/gram',
    status: 'Complete',
    endTime: '4/17/2020 11:20:36 AM',
    user: 'Validation Lab',
    threshold: 8,
    skip: 1,
    shutEye: 25,
    duration: 20,
    temperature: 35,
  },
];

export default function AnalysisPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analysis</h1>
        <p className="text-gray-600 mt-1">Data visualization and sample analysis</p>
      </div>

      {/* Sample Grid View */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Analysis Grid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Grid Headers */}
            <div className="font-semibold text-center">1</div>
            <div className="font-semibold text-center">2</div>
            <div className="font-semibold text-center">3</div>
            <div className="font-semibold text-center">4</div>
            
            {/* Row A */}
            <div className="bg-gray-200 p-3 rounded border-2 border-blue-500">
              <div className="text-sm font-medium">beet-1</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">S2-SAL</div>
              <div className="text-xs">DT: 3.8 Hrs</div>
              <div className="text-xs font-medium">&lt;10 cfu/gram</div>
            </div>
            <div className="bg-gray-200 p-3 rounded">
              <div className="text-sm font-medium">beet-5</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">CC-109</div>
              <div className="text-xs">DT: 16 Hrs</div>
              <div className="text-xs font-medium">&lt;10 cfu/gram</div>
            </div>
            <div className="bg-gray-200 p-3 rounded">
              <div className="text-sm font-medium">EQ-CHOC-21</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">S2-STA</div>
              <div className="text-xs">DT: 12.5 Hrs</div>
              <div className="text-xs font-medium">&lt;10 cfu/gram</div>
            </div>
            <div className="bg-gray-200 p-3 rounded">
              <div className="text-sm font-medium">Available Sample A</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">Pending</div>
              <div className="text-xs">DT: --</div>
              <div className="text-xs font-medium">--</div>
            </div>
            
            {/* Row B */}
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample B1</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 8.2 Hrs</div>
              <div className="text-xs font-medium">45 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample B2</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 6.7 Hrs</div>
              <div className="text-xs font-medium">67 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample B3</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 9.1 Hrs</div>
              <div className="text-xs font-medium">23 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample B4</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 7.4 Hrs</div>
              <div className="text-xs font-medium">89 cfu/gram</div>
            </div>
            
            {/* Row C */}
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample C1</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 5.9 Hrs</div>
              <div className="text-xs font-medium">156 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample C2</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 4.3 Hrs</div>
              <div className="text-xs font-medium">234 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample C3</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 6.8 Hrs</div>
              <div className="text-xs font-medium">78 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample C4</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 7.2 Hrs</div>
              <div className="text-xs font-medium">112 cfu/gram</div>
            </div>
            
            {/* Row D */}
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample D1</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 8.9 Hrs</div>
              <div className="text-xs font-medium">189 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample D2</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 6.1 Hrs</div>
              <div className="text-xs font-medium">267 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample D3</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 5.4 Hrs</div>
              <div className="text-xs font-medium">345 cfu/gram</div>
            </div>
            <div className="bg-red-200 p-3 rounded">
              <div className="text-sm font-medium">Sample D4</div>
              <div className="text-xs text-gray-600">Validation Lab</div>
              <div className="text-xs">NF-TVC</div>
              <div className="text-xs">DT: 7.8 Hrs</div>
              <div className="text-xs font-medium">123 cfu/gram</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sample Information */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sample ID:</Label>
              <Input value="beet-1" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Description:</Label>
              <Input value="Beet Sample" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Production Lot:</Label>
              <Input value="LOT-2020-001" readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="destructive" className="w-full">CLEAR</Button>
            <Button variant="outline" className="w-full">REFRESH</Button>
            <Button variant="outline" className="w-full">CLOSE</Button>
            <Button variant="outline" className="w-full">EXPORT CHART</Button>
          </CardContent>
        </Card>

        {/* Assay Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assay Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status:</Label>
              <Badge variant="default">Complete</Badge>
            </div>
            <div className="space-y-2">
              <Label>End Time:</Label>
              <Input value="4/17/2020 11:20:36 AM" readOnly />
            </div>
            <div className="space-y-2">
              <Label>User:</Label>
              <Input value="Validation Lab" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Test Name:</Label>
              <Input value="S2-SAL" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Test Type:</Label>
              <Input value="Yellow" readOnly />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Area */}
      <Card>
        <CardHeader>
          <CardTitle>Optical Units vs Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg border flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p>Chart visualization will be implemented here</p>
              <p className="text-sm">Y-axis: 0-1000 Optical Units</p>
              <p className="text-sm">X-axis: 0-10 Hours</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Test Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Threshold:</Label>
              <Input value="8" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Skip:</Label>
              <Input value="1" readOnly />
            </div>
            <div className="space-y-2">
              <Label>ShutEye:</Label>
              <Input value="25" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Duration:</Label>
              <Input value="20" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Temperature:</Label>
              <Input value="35" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Indicator:</Label>
              <Input value="" placeholder="Not specified" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Supplement:</Label>
              <Input value="" placeholder="Not specified" readOnly />
            </div>
            <div className="space-y-2">
              <Label>VialLot:</Label>
              <Input value="VL-001" readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
