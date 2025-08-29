import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock data for reports
const mockReportTypes = [
  'Sample History Report',
  'Condensed History Report', 
  'Detailed History Report',
  'Curve Report',
  'Temperature Report',
  'Certificate of Analysis',
  'Custom Certificate of Analysis',
];

const mockSampleData = [
  {
    date: '4/22/2020',
    product: 'Total Viable Count',
    test: 'NF-TVC',
    sample: 'Balm-1',
    tou: '7.9',
    predictedCfu: '<10 cfu/gram',
    specification: '<10 cfu/gram',
    serialNumber: 'SN001',
    location: 'Validation4 1A1',
    user: 'Validation Lab',
    productionLot: 'LOT-2020-001',
    vialLot: 'VL-001',
    supplement: 'None',
    description: 'Lip Balm Sample',
    reported: '4/22/2020',
    val: 'Pass',
  },
  {
    date: '4/22/2020',
    product: 'Total Viable Count',
    test: 'NF-TVC',
    sample: 'Balm-2',
    tou: '7.6',
    predictedCfu: '<10 cfu/gram',
    specification: '<10 cfu/gram',
    serialNumber: 'SN002',
    location: 'Validation4 1A2',
    user: 'Validation Lab',
    productionLot: 'LOT-2020-001',
    vialLot: 'VL-001',
    supplement: 'None',
    description: 'Lip Balm Sample',
    reported: '4/22/2020',
    val: 'Pass',
  },
  {
    date: '4/22/2020',
    product: 'Total Viable Count',
    test: 'NF-TVC',
    sample: 'Balm-3',
    tou: '8.0',
    predictedCfu: '<10 cfu/gram',
    specification: '<10 cfu/gram',
    serialNumber: 'SN003',
    location: 'Validation4 1A3',
    user: 'Validation Lab',
    productionLot: 'LOT-2020-001',
    vialLot: 'VL-001',
    supplement: 'None',
    description: 'Lip Balm Sample',
    reported: '4/22/2020',
    val: 'Pass',
  },
  {
    date: '4/22/2020',
    product: 'Total Viable Count',
    test: 'NF-TVC',
    sample: 'Bronz-1',
    tou: 'ND',
    predictedCfu: '<10 cfu/gram',
    specification: '<10 cfu/gram',
    serialNumber: 'SN004',
    location: 'Validation4 1A4',
    user: 'Validation Lab',
    productionLot: 'LOT-2020-002',
    vialLot: 'VL-002',
    supplement: 'None',
    description: 'Bronzer Sample',
    reported: '4/22/2020',
    val: 'Pass',
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-1">Sample history and data export</p>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <Card>
          <CardHeader>
            <CardTitle>Report Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockReportTypes.map((reportType, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="reportType"
                  id={`report-${index}`}
                  defaultChecked={index === 0}
                  className="text-blue-600"
                />
                <label htmlFor={`report-${index}`} className="text-sm cursor-pointer">
                  {reportType}
                </label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Date Range */}
        <Card>
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Starting Date:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="startDate"
                  type="date"
                  defaultValue="2020-04-22"
                  className="flex-1"
                />
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Ending Date:</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="endDate"
                  type="date"
                  defaultValue="2020-07-22"
                  className="flex-1"
                />
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Export To:</Label>
              <div className="flex items-center space-x-2">
                <svg className="h-8 w-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                  <path d="M14 2v6h6"/>
                  <path d="M16 13H8"/>
                  <path d="M16 17H8"/>
                  <path d="M10 9H8"/>
                </svg>
                <span className="text-sm text-gray-600">CSV Format</span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">UNSELECT RECORDS</Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">CUSTOMIZE C OF A REPORTS</Button>
        <Button variant="outline">C OF A APPROVAL</Button>
        <Button variant="outline">ANALYZE SAMPLE DATA</Button>
      </div>

      {/* Sample Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Data Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Product</th>
                  <th className="text-left p-2">Test</th>
                  <th className="text-left p-2">Sample</th>
                  <th className="text-left p-2">TOU</th>
                  <th className="text-left p-2">Predicted CFU</th>
                  <th className="text-left p-2">Specification</th>
                  <th className="text-left p-2">Location</th>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSampleData.map((sample, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-2">{sample.date}</td>
                    <td className="p-2">{sample.product}</td>
                    <td className="p-2">{sample.test}</td>
                    <td className="p-2">{sample.sample}</td>
                    <td className="p-2">
                      {sample.tou === 'ND' ? (
                        <span className="text-gray-500">ND</span>
                      ) : (
                        sample.tou
                      )}
                    </td>
                    <td className="p-2">{sample.predictedCfu}</td>
                    <td className="p-2">{sample.specification}</td>
                    <td className="p-2">{sample.location}</td>
                    <td className="p-2">{sample.user}</td>
                    <td className="p-2">
                      <Badge variant={sample.val === 'Pass' ? 'default' : 'destructive'}>
                        {sample.val}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Overlay */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white border rounded-lg shadow-lg p-4 max-w-md">
          <div className="text-center text-sm text-gray-600 mb-2">
            Pull up for precise seeking
          </div>
          <div className="bg-gray-100 rounded p-2 text-xs">
            <div className="text-center font-medium">Reports</div>
            <div className="text-center text-gray-500">6:08</div>
          </div>
        </div>
      </div>
    </div>
  );
}
