import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function EnumerationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enumeration</h1>
        <p className="text-gray-600 mt-1">Manage and analyze enumeration data.</p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Assays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No active assays found.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">No recent results found.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
