import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Mock calibration data
const mockCalibrationData = [
  {
    id: 'CC-001',
    testType: 'Total Viable Count',
    method: 'NF-TVC',
    date: '7/15/2020',
    status: 'Active',
    rSquared: 0.9876,
    slope: 0.0293,
    intercept: 0.0012,
    samples: 15,
    range: '10-1000 cfu/g',
  },
  {
    id: 'CC-002',
    testType: 'Yeast and Mold',
    method: 'NF-YM',
    date: '7/10/2020',
    status: 'Active',
    rSquared: 0.9845,
    slope: 0.0391,
    intercept: 0.0021,
    samples: 12,
    range: '10-500 cfu/g',
  },
  {
    id: 'CC-003',
    testType: 'Coliform',
    method: 'CC-109',
    date: '7/05/2020',
    status: 'Expired',
    rSquared: 0.9768,
    slope: 0.0312,
    intercept: 0.0018,
    samples: 18,
    range: '10-800 cfu/g',
  },
  {
    id: 'CC-004',
    testType: 'Salmonella',
    method: 'S2-SAL',
    date: '7/20/2020',
    status: 'Active',
    rSquared: 0.9923,
    slope: 0.0289,
    intercept: 0.0009,
    samples: 20,
    range: '1-100 cfu/g',
  },
];

export default function CalibrationCurvesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calibration Curves</h1>
        <p className="text-gray-600 mt-1">Method validation and calibration data management</p>
      </div>

      {/* Calibration Curve Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">4</div>
            <p className="text-sm text-gray-600">Total Curves</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">3</div>
            <p className="text-sm text-gray-600">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <p className="text-sm text-gray-600">Expired</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">0.987</div>
            <p className="text-sm text-gray-600">Avg R²</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New Calibration Curve */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Calibration Curve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Test Type:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select Test Type</option>
                <option value="NF-TVC">Total Viable Count (NF-TVC)</option>
                <option value="NF-YM">Yeast and Mold (NF-YM)</option>
                <option value="CC-109">Coliform (CC-109)</option>
                <option value="S2-SAL">Salmonella (S2-SAL)</option>
                <option value="S2-STA">Staphylococcus (S2-STA)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Method:</Label>
              <Input placeholder="Method identifier" />
            </div>
            <div className="space-y-2">
              <Label>Date:</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Number of Samples:</Label>
              <Input type="number" placeholder="10-50" min="10" max="50" />
            </div>
            <div className="space-y-2">
              <Label>Concentration Range:</Label>
              <div className="flex space-x-2">
                <Input placeholder="Min cfu/g" />
                <Input placeholder="Max cfu/g" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Validation Period (days):</Label>
              <Input type="number" placeholder="30" defaultValue="30" />
            </div>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">CREATE CURVE</Button>
            <Button variant="outline">UPLOAD DATA</Button>
            <Button variant="outline">IMPORT FROM EXCEL</Button>
          </div>
        </CardContent>
      </Card>

      {/* Calibration Curves List */}
      <Card>
        <CardHeader>
          <CardTitle>Calibration Curves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Test Type</th>
                  <th className="text-left p-2">Method</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">R²</th>
                  <th className="text-left p-2">Slope</th>
                  <th className="text-left p-2">Samples</th>
                  <th className="text-left p-2">Range</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockCalibrationData.map((curve) => (
                  <tr key={curve.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{curve.id}</td>
                    <td className="p-2">{curve.testType}</td>
                    <td className="p-2">{curve.method}</td>
                    <td className="p-2">{curve.date}</td>
                    <td className="p-2">
                      <Badge 
                        variant={curve.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {curve.status}
                      </Badge>
                    </td>
                    <td className="p-2 font-mono">{curve.rSquared.toFixed(4)}</td>
                    <td className="p-2 font-mono">{curve.slope.toFixed(4)}</td>
                    <td className="p-2">{curve.samples}</td>
                    <td className="p-2">{curve.range}</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Export</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Calibration Curve Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Curve Plot */}
        <Card>
          <CardHeader>
            <CardTitle>Calibration Curve Plot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg border flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p>Calibration curve plot will be displayed here</p>
                <p className="text-sm">X-axis: TOU Values</p>
                <p className="text-sm">Y-axis: CFU/g (log scale)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistical Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>Statistical Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>R² Value:</Label>
                <Input value="0.9876" readOnly className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Slope:</Label>
                <Input value="0.0293" readOnly className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Intercept:</Label>
                <Input value="0.0012" readOnly className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>Standard Error:</Label>
                <Input value="0.0023" readOnly className="font-mono" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Confidence Interval (95%):</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input value="0.0247" readOnly className="font-mono" placeholder="Lower" />
                <Input value="0.0339" readOnly className="font-mono" placeholder="Upper" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Validation Criteria:</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">R² ≥ 0.90 ✓</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Slope within ±10% ✓</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Intercept ≤ 0.01 ✓</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quality Control */}
      <Card>
        <CardHeader>
          <CardTitle>Quality Control</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Control Sample 1 (Low):</Label>
              <div className="flex space-x-2">
                <Input placeholder="Expected cfu/g" />
                <Input placeholder="Measured cfu/g" />
                <Input placeholder="Recovery %" readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Control Sample 2 (Medium):</Label>
              <div className="flex space-x-2">
                <Input placeholder="Expected cfu/g" />
                <Input placeholder="Measured cfu/g" />
                <Input placeholder="Recovery %" readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Control Sample 3 (High):</Label>
              <div className="flex space-x-2">
                <Input placeholder="Expected cfu/g" />
                <Input placeholder="Measured cfu/g" />
                <Input placeholder="Recovery %" readOnly />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button variant="outline">CALCULATE RECOVERY</Button>
            <Button variant="outline">VALIDATE CURVE</Button>
            <Button variant="outline">GENERATE REPORT</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
