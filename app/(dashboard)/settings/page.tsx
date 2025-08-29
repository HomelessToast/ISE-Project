import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">System configuration and preferences</p>
      </div>

      {/* Settings Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button className="border-b-2 border-blue-500 py-2 px-1 text-sm font-medium text-blue-600">
            Report Settings
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Email Settings
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Security Settings
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Other Settings
          </button>
          <button className="border-b-2 border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Network Settings
          </button>
        </nav>
      </div>

      {/* Report Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Report Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Report Header Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Report Header Address One:</Label>
                <Input value="620 LesherP" />
              </div>
              <div className="space-y-2">
                <Label>Report Header Address Two:</Label>
                <Input value="Address 2" />
              </div>
              <div className="space-y-2">
                <Label>Report Header Company:</Label>
                <Input value="Company" />
              </div>
              <div className="space-y-2">
                <Label>Report Header Department:</Label>
                <Input value="Department" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Report Header Description:</Label>
                <Input value="General description here" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Report Logo Location:</Label>
                <div className="flex space-x-2">
                  <Input value="C:\Working Logo.PNG" />
                  <Button variant="outline" size="sm">Browse</Button>
                </div>
              </div>
            </div>

            {/* Report Titles */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Report Titles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Calibration Curve Report Title:</Label>
                  <Input value="Calibration Curve Report" />
                </div>
                <div className="space-y-2">
                  <Label>Calibration Report Title:</Label>
                  <Input value="Calibration Report" />
                </div>
                <div className="space-y-2">
                  <Label>Certificate Of Analysis Title:</Label>
                  <Input value="Certificate of Analysis" />
                </div>
                <div className="space-y-2">
                  <Label>Condensed Report Title:</Label>
                  <Input value="Condensed Report" />
                </div>
                <div className="space-y-2">
                  <Label>Condensed Report Subtitle:</Label>
                  <Input placeholder="Enter subtitle" />
                </div>
                <div className="space-y-2">
                  <Label>Curve Report Title:</Label>
                  <Input value="Curve Report" />
                </div>
                <div className="space-y-2">
                  <Label>Detail Report Title:</Label>
                  <Input value="Detail Report" />
                </div>
                <div className="space-y-2">
                  <Label>Login Audit Report Title:</Label>
                  <Input value="Login Audit Report" />
                </div>
                <div className="space-y-2">
                  <Label>Login Audit Report Subtitle:</Label>
                  <Input value="User Login History" />
                </div>
                <div className="space-y-2">
                  <Label>Sample Audit Report Title:</Label>
                  <Input value="Sample Data Report" />
                </div>
                <div className="space-y-2">
                  <Label>Sample Audit Report Subtitle:</Label>
                  <Input value="Audit Report" />
                </div>
                <div className="space-y-2">
                  <Label>Temperature Report Title:</Label>
                  <Input value="Temperature Report" />
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">System Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Time Between Temperature Readings:</Label>
                  <Input value="2" type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Manufacturing Report Enabled:</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="manufacturing" className="rounded" />
                    <label htmlFor="manufacturing" className="text-sm text-gray-600">
                      Enable manufacturing report generation
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Electronic Signature Enabled:</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="signature" className="rounded" checked readOnly />
                    <label htmlFor="signature" className="text-sm text-gray-600">
                      Enable electronic signatures on reports
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Validation Report Enabled:</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="validation" className="rounded" />
                    <label htmlFor="validation" className="text-sm text-gray-600">
                      Enable validation report generation
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Modification History */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Modification History</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Report Header Company</span>
                    <span className="text-gray-600">Fusion User</span>
                    <span className="text-gray-600">7/23/2020 2:15:30 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Report Logo Location</span>
                    <span className="text-gray-600">System</span>
                    <span className="text-gray-600">7/22/2020 10:45:15 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Electronic Signature Enabled</span>
                    <span className="text-gray-600">Default</span>
                    <span className="text-gray-600">7/20/2020 9:30:00 AM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time Between Temperature Readings</span>
                    <span className="text-gray-600">Default</span>
                    <span className="text-gray-600">7/19/2020 3:20:45 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex justify-end space-x-4">
              <Button variant="outline">CANCEL</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">SAVE</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Settings Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>SMTP Server:</Label>
                <Input placeholder="smtp.company.com" />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port:</Label>
                <Input placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label>Email From:</Label>
                <Input placeholder="noreply@biocount.ai" />
              </div>
              <div className="space-y-2">
                <Label>Authentication Required:</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="auth" className="rounded" />
                  <label htmlFor="auth" className="text-sm text-gray-600">
                    Require authentication for email sending
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Session Timeout (minutes):</Label>
                <Input placeholder="30" />
              </div>
              <div className="space-y-2">
                <Label>Password Policy:</Label>
                <select className="w-full p-2 border rounded-md">
                  <option value="standard">Standard (8+ characters)</option>
                  <option value="enhanced">Enhanced (12+ characters, special chars)</option>
                  <option value="strict">Strict (16+ characters, complexity required)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Two-Factor Authentication:</Label>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="2fa" className="rounded" />
                  <label htmlFor="2fa" className="text-sm text-gray-600">
                    Require 2FA for all users
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Failed Login Attempts:</Label>
                <Input placeholder="5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
