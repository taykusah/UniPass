'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  BarChart,
  Search,
  Filter
} from 'lucide-react';
import { Admin, ExeatRequest, ExeatReport } from '@/types/interfaces';

interface DeanDashboardProps {
  user: Admin;
}

const DeanDashboard = ({ user }: DeanDashboardProps) => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for requests pending dean approval
  const [pendingRequests, setPendingRequests] = useState<ExeatRequest[]>([
    {
      id: '1',
      studentId: 'STU123',
      studentName: 'John Doe',
      matricNumber: 'MAT123',
      reason: 'Medical appointment',
      departureDate: '2024-12-26',
      departureTime: '10:00',
      returnDate: '2024-12-26',
      returnTime: '16:00',
      parentNumber: '+1234567890',
      status: 'pending_dean_approval',
      parentApproval: 'approved', // Only shows up in dean's dashboard after parent approval
      deanApproval: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Mock analytics data
  const [analytics, setAnalytics] = useState<ExeatReport>({
    totalRequests: 150,
    approved: 120,
    denied: 20,
    pending: 10,
    overdue: 5,
    complianceRate: 95,
    peakPeriods: [
      { period: 'Dec 2024', count: 45 },
      { period: 'Nov 2024', count: 38 }
    ],
    departmentStats: [
      { department: 'Computer Science', count: 35 },
      { department: 'Engineering', count: 42 }
    ]
  });

  const handleApproval = async (requestId: string, approved: boolean) => {
    setPendingRequests(requests => 
      requests.map(req => 
        req.id === requestId 
          ? { ...req, 
              status: approved ? 'approved' : 'denied',
              deanApproval: approved ? 'approved' : 'denied'
            }
          : req
      )
    );
  };

  const PendingRequestsView = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          className="p-2 border rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending_dean">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      {pendingRequests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{request.studentName}</h3>
              <p className="text-sm text-gray-500">ID: {request.matricNumber}</p>
              <p className="text-sm">{request.reason}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p>Departure: {request.departureDate} {request.departureTime}</p>
                <p>Return: {request.returnDate} {request.returnTime}</p>
                <p className="mt-1 text-green-600">✓ Parent Approval Received</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {request.status === 'pending_dean_approval' && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleApproval(request.id, true)}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => handleApproval(request.id, false)}
                  >
                    <XCircle className="w-4 h-4" />
                    Deny
                  </Button>
                </div>
              )}
              <span className={`px-2 py-1 rounded-full text-sm ${
                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                request.status === 'denied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {request.status.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const AnalyticsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Approval Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{analytics.approved}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Denied</p>
                <p className="text-2xl font-bold">{analytics.denied}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{analytics.pending}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold">{analytics.complianceRate}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.departmentStats.map((stat) => (
              <div key={stat.department} className="flex justify-between items-center">
                <span>{stat.department}</span>
                <span className="font-bold">{stat.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Peak Periods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.peakPeriods.map((period) => (
              <div key={period.period} className="flex justify-between items-center">
                <span>{period.period}</span>
                <span className="font-bold">{period.count} requests</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="w-4 h-4 mr-2" />
            Pending Approvals
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <PendingRequestsView />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeanDashboard;