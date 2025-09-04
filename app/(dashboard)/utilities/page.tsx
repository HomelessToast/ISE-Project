import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UtilitiesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Utilities</h1>
        <p className="text-gray-600 mt-1">System configuration and management tools</p>
      </div>

      {/* Utility Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Manage Fusion Database */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
              <span>Manage Fusion Database</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <svg className="w-12 h-12 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <p className="text-sm text-gray-600">Import</p>
              </div>
              <div className="text-center">
                <svg className="w-12 h-12 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-600">Export</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">BACKUP</Button>
              <Button variant="outline" className="flex-1">RESTORE</Button>
            </div>
          </CardContent>
        </Card>

        {/* Import Products and Tests */}
        <Card className="border-2 border-red-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              <span>Import Products and Tests</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <p className="text-sm text-gray-600">Soleris</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <p className="text-sm text-gray-600">BioLumix</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <p className="text-sm text-gray-600">Fusion</p>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700">IMPORT</Button>
          </CardContent>
        </Card>

        {/* Database Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Fusion Database Automatic Backup Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Number of days between backups:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="7">7</option>
                <option value="14">14</option>
                <option value="30" selected>30</option>
                <option value="60">60</option>
                <option value="90">90</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Time of day to perform backup:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="02:00:00">02:00:00</option>
                <option value="04:00:00">04:00:00</option>
                <option value="06:00:00">06:00:00</option>
                <option value="08:00:00" selected>08:00:00</option>
                <option value="10:00:00">10:00:00</option>
              </select>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Most recent backup:</p>
              <p className="text-sm font-medium">7/23/2020 9:01:25 AM</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">BACKUP NOW</Button>
              <Button variant="outline" className="flex-1">RESTORE</Button>
            </div>
          </CardContent>
        </Card>

        {/* Find Unregistered Instruments */}
        <Card>
          <CardHeader>
            <CardTitle>Find Unregistered Instruments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Network Range:</Label>
              <div className="flex items-center space-x-2">
                <Input value="192.168.40." className="flex-1" />
                <Input placeholder="0-255" className="w-20" />
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1">FIND SPECIFIC INSTRUMENT</Button>
              <Button variant="outline" className="flex-1">SCAN FOR INSTRUMENTS</Button>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">Last scan results:</p>
              <p className="text-sm font-medium">3 instruments found</p>
            </div>
          </CardContent>
        </Card>

        {/* Configure Data Collector Options */}
        <Card>
          <CardHeader>
            <CardTitle>Configure Data Collector Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="space-y-2">
              <Label>Data Collection Interval:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="1">1 minute</option>
                <option value="5" selected>5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Data Retention Period:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="30">30 days</option>
                <option value="60" selected>60 days</option>
                <option value="90">90 days</option>
                <option value="180">180 days</option>
              </select>
            </div>
            <Button className="w-full">SAVE SETTINGS</Button>
          </CardContent>
        </Card>

        {/* Get Instrument Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Get Instrument Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="space-y-2">
              <Label>Instrument:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select Instrument</option>
                <option value="Validation1">Validation1</option>
                <option value="Validation2">Validation2</option>
                <option value="Validation3">Validation3</option>
                <option value="Validation4">Validation4</option>
                <option value="Validation5">Validation5</option>
                <option value="Validation6">Validation6</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Log Type:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="system">System Logs</option>
                <option value="error">Error Logs</option>
                <option value="access">Access Logs</option>
                <option value="all" selected>All Logs</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Date Range:</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" defaultValue="2020-07-01" />
                <Input type="date" defaultValue="2020-07-23" />
              </div>
            </div>
            <Button className="w-full">DOWNLOAD LOGS</Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Utilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Version:</span>
              <span className="text-sm font-medium">BioCount.io v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database:</span>
              <span className="text-sm font-medium">SQLite v3.35.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Last Updated:</span>
              <span className="text-sm font-medium">7/23/2020</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status:</span>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full">CLEAR CACHE</Button>
            <Button variant="outline" className="w-full">REBUILD INDEXES</Button>
            <Button variant="outline" className="w-full">CHECK SYSTEM HEALTH</Button>
            <Button variant="outline" className="w-full">EXPORT CONFIGURATION</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
