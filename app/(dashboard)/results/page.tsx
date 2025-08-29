import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        <p className="text-gray-600 mt-1">View and analyze your assay results.</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Result History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No results found. Complete an assay to see results here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
