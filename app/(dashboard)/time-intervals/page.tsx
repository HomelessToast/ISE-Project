import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TimeIntervalsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Time Intervals</h1>
        <p className="text-gray-600 mt-1">Configure and manage time interval settings.</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Interval Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Time interval settings will be configured here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
