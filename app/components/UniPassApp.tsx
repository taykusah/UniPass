'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserCircle, LogOut } from 'lucide-react';
import { BaseUser, UserRole, Student, Admin, SecurityPersonnel } from '@/types/interfaces';
import LoginForm from './LoginForm';
// Import all dashboards
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import DeanDashboard from './DeanDashboard';
import SecurityDashboard from './SecurityDashboard';

const UniPassApp = () => {
  const [currentUser, setCurrentUser] = useState<BaseUser | null>(null);

  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ 
      username: '', 
      password: '',
      role: 'student' as UserRole 
    });
    
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate login with mock users
      const mockUsers = {
        student: {
          id: 'STU123',
          name: 'John Student',
          email: 'john@student.edu',
          role: 'student' as const,
          matricNumber: 'MAT123',
          department: 'Computer Science',
          level: '300'
        },
        admin: {
          id: 'ADM123',
          name: 'Jane Admin',
          email: 'jane@admin.edu',
          role: 'admin' as const,
          department: 'Student Affairs',
          position: 'Student Affairs Officer'
        },
        dean: {
          id: 'DEAN123',
          name: 'Dr. Dean',
          email: 'dean@admin.edu',
          role: 'dean' as const,
          department: 'Student Affairs',
          position: 'Dean of Students'
        },
        security: {
          id: 'SEC123',
          name: 'Bob Security',
          email: 'bob@security.edu',
          role: 'security' as const,
          shift: 'morning' as const,
          post: 'Main Gate'
        }
      };
      
      setCurrentUser(mockUsers[credentials.role as keyof typeof mockUsers]);
    };

    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">UniPass Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username/ID</Label>
              <Input 
                id="username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                placeholder="Enter your ID"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                placeholder="Enter your password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select 
                id="role"
                className="w-full p-2 border rounded"
                value={credentials.role}
                onChange={(e) => setCredentials({...credentials, role: e.target.value as UserRole})}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="dean">Dean</option>
                <option value="security">Security</option>
              </select>
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    );
  };

  const Header = ({ user }: { user: BaseUser }) => (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="flex items-center gap-2">
        <UserCircle className="w-8 h-8" />
        <div>
          <h2 className="font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} - ID: {user.id}
          </p>
        </div>
      </div>
      <Button variant="outline" onClick={() => setCurrentUser(null)}>
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'student':
        return <StudentDashboard user={currentUser as Student} />;
      case 'admin':
        return <AdminDashboard user={currentUser as Admin} />;
      case 'dean':
        return <DeanDashboard user={currentUser as Admin} />;
      case 'security':
        return <SecurityDashboard user={currentUser as SecurityPersonnel} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
   <div className="min-h-screen bg-gray-50">
     {!currentUser ? (
       <div className="p-4">
         <LoginForm onLogin={setCurrentUser} />
       </div>
     ) : (
       <div>
         <Header user={currentUser} />
         <main className="p-4">
           {renderDashboard()}
         </main>
       </div>
     )}
   </div>
 );
};

export default UniPassApp;