import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mock data for devices and samples
const mockDevices = [
  {
    id: 'Validation1',
    type: 'Soleris Next Gen',
    status: 'Connected',
    detections: 12,
    calibratedTemp: 34.9,
    wells: Array(32).fill('available'), // 32 wells, all available
  },
  {
    id: 'Validation2',
    type: 'Soleris Next Gen',
    status: 'Connected',
    detections: 8,
    calibratedTemp: 35.0,
    wells: Array(32).fill('available'),
  },
  {
    id: 'Validation3',
    type: 'Soleris Next Gen',
    status: 'Connected',
    detections: 15,
    calibratedTemp: 28.0,
    wells: Array(32).fill('available'),
  },
  {
    id: 'Validation4',
    type: 'Soleris Next Gen',
    status: 'Disconnected',
    detections: 0,
    calibratedTemp: 35.2,
    wells: Array(32).fill('disabled'),
  },
  {
    id: 'Validation5',
    type: 'Soleris Next Gen',
    status: 'Connected',
    detections: 6,
    calibratedTemp: 34.8,
    wells: Array(32).fill('available'),
  },
  {
    id: 'Validation6',
    type: 'Soleris Next Gen',
    status: 'Connected',
    detections: 22,
    calibratedTemp: 35.1,
    wells: Array(32).fill('available'),
  },
];

const systemStatus = {
  pending: 37,
  active: 0,
  available: 187,
};

export default function GridViewPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grid View</h1>
        <p className="text-gray-600 mt-1">Device management and sample status overview</p>
      </div>

      {/* Top Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Connected Devices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Connected Devices</CardTitle>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Button>
              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold">{mockDevices.filter(d => d.status === 'Connected').length}</div>
              <p className="text-xs text-muted-foreground">Active devices</p>
              
              {/* Status Legend */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">Sample Status Legend:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Detection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <span>Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Temperature Mismatch</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Disabled</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Button size="sm" variant="outline">ARRANGE INSTRUMENTS</Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {/* Simple Pie Chart */}
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2"
                    strokeDasharray={`${(systemStatus.pending / (systemStatus.pending + systemStatus.available)) * 100}, 100`}
                  />
                </svg>
              </div>
              
              {/* Status Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-sm">{systemStatus.pending} (Pending)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-black rounded-full"></div>
                  <span className="text-sm">{systemStatus.active} (Active)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-white border border-gray-300 rounded-full"></div>
                  <span className="text-sm">{systemStatus.available} (Available)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DeviceCard({ device }: { device: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Connected':
        return 'bg-green-100 text-green-800';
      case 'Disconnected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getWellColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-white border border-gray-300';
      case 'pending':
        return 'bg-yellow-400';
      case 'detection':
        return 'bg-red-500';
      case 'active':
        return 'bg-black';
      case 'disabled':
        return 'bg-gray-400';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${device.status === 'Disconnected' ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{device.id}</h3>
          <p className="text-sm text-gray-600">{device.type}</p>
        </div>
        <Badge className={getStatusColor(device.status)}>{device.status}</Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>Detections:</span>
          <span className="font-medium">{device.detections}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Calibrated Temp:</span>
          <span className="font-medium">{device.calibratedTemp}°</span>
        </div>
      </div>
      
      {/* Well Grid */}
      <div className="grid grid-cols-4 gap-1">
        {device.wells.map((well: string, index: number) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-sm ${getWellColor(well)}`}
            title={`Well ${index + 1}: ${well}`}
          />
        ))}
      </div>
    </div>
  );
}
