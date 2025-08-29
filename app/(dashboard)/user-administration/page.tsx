import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Mock user data
const mockUsers = [
  {
    id: 'U001',
    username: 'admin',
    fullName: 'System Administrator',
    email: 'admin@biocount.ai',
    role: 'Administrator',
    status: 'Active',
    lastLogin: '7/23/2020 10:30:15 AM',
    permissions: ['all'],
  },
  {
    id: 'U002',
    username: 'lab_manager',
    fullName: 'Laboratory Manager',
    email: 'lab.manager@biocount.ai',
    role: 'Lab Manager',
    status: 'Active',
    lastLogin: '7/23/2020 9:15:22 AM',
    permissions: ['samples', 'reports', 'analysis'],
  },
  {
    id: 'U003',
    username: 'analyst1',
    fullName: 'Lab Analyst 1',
    email: 'analyst1@biocount.ai',
    role: 'Lab Analyst',
    status: 'Active',
    lastLogin: '7/22/2020 4:45:30 PM',
    permissions: ['samples', 'analysis'],
  },
  {
    id: 'U004',
    username: 'analyst2',
    fullName: 'Lab Analyst 2',
    email: 'analyst2@biocount.ai',
    role: 'Lab Analyst',
    status: 'Inactive',
    lastLogin: '7/15/2020 2:20:10 PM',
    permissions: ['samples'],
  },
  {
    id: 'U005',
    username: 'viewer',
    fullName: 'Read-Only User',
    email: 'viewer@biocount.ai',
    role: 'Viewer',
    status: 'Active',
    lastLogin: '7/23/2020 8:00:00 AM',
    permissions: ['reports'],
  },
];

const roles = [
  { id: 'administrator', name: 'Administrator', description: 'Full system access' },
  { id: 'lab_manager', name: 'Lab Manager', description: 'Manage samples, reports, and analysis' },
  { id: 'lab_analyst', name: 'Lab Analyst', description: 'Create samples and perform analysis' },
  { id: 'viewer', name: 'Viewer', description: 'Read-only access to reports' },
];

export default function UserAdministrationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Administration</h1>
        <p className="text-gray-600 mt-1">Manage user accounts and system permissions</p>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{mockUsers.length}</div>
            <p className="text-sm text-gray-600">Total Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {mockUsers.filter(u => u.status === 'Active').length}
            </div>
            <p className="text-sm text-gray-600">Active Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {mockUsers.filter(u => u.status === 'Inactive').length}
            </div>
            <p className="text-sm text-gray-600">Inactive Users</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(mockUsers.map(u => u.role)).size}
            </div>
            <p className="text-sm text-gray-600">User Roles</p>
          </CardContent>
        </Card>
      </div>

      {/* Create New User */}
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Username:</Label>
              <Input placeholder="Enter username" />
            </div>
            <div className="space-y-2">
              <Label>Full Name:</Label>
              <Input placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label>Email:</Label>
              <Input type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label>Role:</Label>
              <select className="w-full p-2 border rounded-md">
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Password:</Label>
              <Input type="password" placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password:</Label>
              <Input type="password" placeholder="Confirm password" />
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <Button className="bg-blue-600 hover:bg-blue-700">CREATE USER</Button>
            <Button variant="outline">IMPORT USERS</Button>
            <Button variant="outline">RESET FORM</Button>
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Username</th>
                  <th className="text-left p-2">Full Name</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Role</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Last Login</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{user.id}</td>
                    <td className="p-2">{user.username}</td>
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>
                    <td className="p-2">
                      <Badge 
                        variant={user.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-2 text-xs">{user.lastLogin}</td>
                    <td className="p-2">
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="outline">Reset Password</Button>
                        <Button 
                          size="sm" 
                          variant={user.status === 'Active' ? 'destructive' : 'default'}
                        >
                          {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Definitions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Definitions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.map(role => (
              <div key={role.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{role.name}</h3>
                  <Button size="sm" variant="outline">Edit</Button>
                </div>
                <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Permissions:</Label>
                  <div className="flex flex-wrap gap-1">
                    {role.id === 'administrator' && (
                      <>
                        <Badge variant="secondary" className="text-xs">All Access</Badge>
                      </>
                    )}
                    {role.id === 'lab_manager' && (
                      <>
                        <Badge variant="secondary" className="text-xs">Samples</Badge>
                        <Badge variant="secondary" className="text-xs">Reports</Badge>
                        <Badge variant="secondary" className="text-xs">Analysis</Badge>
                        <Badge variant="secondary" className="text-xs">Users</Badge>
                      </>
                    )}
                    {role.id === 'lab_analyst' && (
                      <>
                        <Badge variant="secondary" className="text-xs">Samples</Badge>
                        <Badge variant="secondary" className="text-xs">Analysis</Badge>
                      </>
                    )}
                    {role.id === 'viewer' && (
                      <>
                        <Badge variant="secondary" className="text-xs">Reports</Badge>
                        <Badge variant="secondary" className="text-xs">Read Only</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Permission</th>
                    <th className="text-center p-2">Admin</th>
                    <th className="text-center p-2">Lab Manager</th>
                    <th className="text-center p-2">Lab Analyst</th>
                    <th className="text-center p-2">Viewer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">User Management</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✗</td>
                    <td className="p-2 text-center">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Sample Creation</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Sample Analysis</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Report Generation</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✗</td>
                    <td className="p-2 text-center">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">System Settings</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✗</td>
                    <td className="p-2 text-center">✗</td>
                    <td className="p-2 text-center">✗</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Data Export</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✓</td>
                    <td className="p-2 text-center">✗</td>
                    <td className="p-2 text-center">✗</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Refresh</Button>
                <Button variant="outline" size="sm">Export</Button>
                <Button variant="outline" size="sm">Clear Logs</Button>
              </div>
              <div className="flex items-center space-x-2">
                <Label>Filter by User:</Label>
                <select className="p-1 border rounded text-sm">
                  <option value="">All Users</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.username}>{user.username}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">7/23/2020 10:30:15 AM</span>
                  <span className="font-medium">admin</span>
                  <span className="text-blue-600">User login successful</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7/23/2020 10:25:30 AM</span>
                  <span className="font-medium">lab_manager</span>
                  <span className="text-green-600">Sample created: Sample-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7/23/2020 10:20:15 AM</span>
                  <span className="font-medium">analyst1</span>
                  <span className="text-purple-600">Analysis completed: Sample-001</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">7/23/2020 10:15:45 AM</span>
                  <span className="font-medium">admin</span>
                  <span className="text-orange-600">User account created: analyst2</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
