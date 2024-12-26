'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Phone, 
  Clock, 
  AlertCircle,
  Search,
  DollarSign,
  UserCheck,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';
import { Admin, ExeatRequest, Penalty, GateActivity } from '@/types/interfaces';

interface AdminDashboardProps {
  user: Admin;
}

const AdminDashboard = ({ user }: AdminDashboardProps) => {
  // State management for different views
  const [activeTab, setActiveTab] = useState('parent-approvals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for parent approval requests
  const [parentApprovalRequests, setParentApprovalRequests] = useState<ExeatRequest[]>([
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
      status: 'pending_parent_approval',
      parentApproval: 'pending',
      deanApproval: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Mock data for active exeats
  const [activeExeats, setActiveExeats] = useState<ExeatRequest[]>([
    {
      id: '2',
      studentId: 'STU124',
      studentName: 'Jane Smith',
      matricNumber: 'MAT124',
      reason: 'Family event',
      departureDate: '2024-12-26',
      departureTime: '09:00',
      returnDate: '2024-12-26',
      returnTime: '18:00',
      parentNumber: '+1234567891',
      status: 'approved',
      parentApproval: 'approved',
      deanApproval: 'approved',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Mock data for penalties
  const [penalties, setPenalties] = useState<Penalty[]>([
    {
      id: '1',
      studentId: 'STU125',
      exeatId: 'EX123',
      type: 'overdue',
      amount: 1000,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  ]);

  // Mock data for gate activities
  const [gateActivities, setGateActivities] = useState<GateActivity[]>([
    {
      id: '1',
      exeatId: 'EX123',
      studentId: 'STU123',
      type: 'exit',
      timestamp: new Date().toISOString(),
      securityId: 'SEC001',
      status: 'valid'
    }
  ]);

  // Handler functions
  const handleParentCall = async (request: ExeatRequest) => {
    // In real app, this would integrate with a calling system
    alert(`Initiating call to parent at ${request.parentNumber}`);
  };

  const handleParentApproval = async (requestId: string, approved: boolean) => {
    setParentApprovalRequests(requests => 
      requests.map(req => 
        req.id === requestId 
          ? { 
              ...req, 
              status: approved ? 'pending_dean_approval' : 'denied',
              parentApproval: approved ? 'approved' : 'denied',
              updatedAt: new Date().toISOString()
            }
          : req
      )
    );
  };

  const handlePenaltyUpdate = async (penaltyId: string, paid: boolean) => {
    setPenalties(currentPenalties => 
      currentPenalties.map(penalty => 
        penalty.id === penaltyId 
          ? { ...penalty, status: paid ? 'paid' : 'pending', paidAt: paid ? new Date().toISOString() : undefined }
          : penalty
      )
    );
  };

  // Component Views
  const ParentApprovalsView = () => (
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Requests</option>
          <option value="pending">Pending Parent Approval</option>
          <option value="approved">Parent Approved</option>
          <option value="denied">Parent Denied</option>
        </select>
      </div>

      {parentApprovalRequests.map((request) => (
        <Card key={request.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{request.studentName}</h3>
              <p className="text-sm text-gray-500">ID: {request.matricNumber}</p>
              <p className="text-sm">{request.reason}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p>Departure: {request.departureDate} {request.departureTime}</p>
                <p>Return: {request.returnDate} {request.returnTime}</p>
                <p className="mt-1 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {request.parentNumber}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {request.parentApproval === 'pending' && (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => handleParentCall(request)}
                    className="flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Call Parent
                  </Button>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100"
                      onClick={() => handleParentApproval(request.id, true)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approved by Parent
                    </Button>
                    <Button 
                      variant="outline"
                      className="bg-red-50 hover:bg-red-100"
                      onClick={() => handleParentApproval(request.id, false)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Denied by Parent
                    </Button>
                  </div>
                </>
              )}
              <span className={`px-2 py-1 rounded-full text-sm ${
                request.parentApproval === 'approved' ? 'bg-green-100 text-green-800' :
                request.parentApproval === 'denied' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {request.parentApproval.charAt(0).toUpperCase() + request.parentApproval.slice(1)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const ActiveExeatsView = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search active exeats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {activeExeats.map((exeat) => (
        <Card key={exeat.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{exeat.studentName}</h3>
              <p className="text-sm text-gray-500">ID: {exeat.matricNumber}</p>
              <div className="text-sm mt-2">
                <p className="font-medium">Current Status: Active</p>
                <p className="text-gray-500">Must return by: {exeat.returnDate} {exeat.returnTime}</p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>Parent Contact: {exeat.parentNumber}</p>
              </div>
            </div>
            <div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Currently Out
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  const PenaltiesView = () => (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Search penalties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          className="p-2 border rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Penalties</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {penalties.map((penalty) => (
        <Card key={penalty.id} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">Penalty #{penalty.id}</h3>
              <p className="text-sm text-gray-500">Student ID: {penalty.studentId}</p>
              <p className="text-sm text-gray-500">Type: {penalty.type}</p>
              <p className="mt-2 font-medium">Amount: ₦{penalty.amount}</p>
              <p className="text-sm text-gray-500">
                Issued: {new Date(penalty.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2 py-1 rounded-full text-sm ${
                penalty.status === 'paid' ? 'bg-green-100 text-green-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {penalty.status.charAt(0).toUpperCase() + penalty.status.slice(1)}
              </span>
              {penalty.status === 'pending' && (
                <Button 
                  variant="outline"
                  onClick={() => handlePenaltyUpdate(penalty.id, true)}
                  className="flex items-center gap-2"
                >
                  <DollarSign className="w-4 h-4" />
                  Mark as Paid
                </Button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="parent-approvals">
            <Phone className="w-4 h-4 mr-2" />
            Parent Approvals
          </TabsTrigger>
          <TabsTrigger value="active-exeats">
            <UserCheck className="w-4 h-4 mr-2" />
            Active Exeats
          </TabsTrigger>
          <TabsTrigger value="penalties">
            <DollarSign className="w-4 h-4 mr-2" />
            Penalties
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="parent-approvals">
          <ParentApprovalsView />
        </TabsContent>
        
        <TabsContent value="active-exeats">
          <ActiveExeatsView />
        </TabsContent>

        <TabsContent value="penalties">
          <PenaltiesView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;