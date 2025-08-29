import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SamplesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Samples</h1>
          <p className="text-gray-600 mt-1">Manage your sample collection.</p>
        </div>
        <Link href="/samples/new">
          <Button className="bg-blue-600 hover:bg-blue-700">New Sample</Button>
        </Link>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Sample List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No samples found. Create your first sample to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
