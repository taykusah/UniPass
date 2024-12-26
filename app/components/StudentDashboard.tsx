'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, QrCode, BellDot, AlertCircle } from 'lucide-react';
import QRCodeModal from './QRCodeModal';
import { Student, ExeatRequest, Notification } from '@/types/interfaces';

interface StudentDashboardProps {
  user: Student;
}

const StudentDashboard = ({ user }: StudentDashboardProps) => {
   const [exeatRequests, setExeatRequests] = useState<ExeatRequest[]>([]);

   useEffect(() => {
       const fetchExeats = async () => {
           try {
               const response = await exeats.getAll();
               setExeatRequests(response.data);
           } catch (error) {
               console.error('Failed to fetch exeats:', error);
           }
       };
       fetchExeats();
   }, []);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      userId: user.id,
      type: 'exeat_request',
      message: 'Your exeat request is pending parent approval',
      read: false,
      createdAt: new Date().toISOString()
    }
  ]);

  // Form state for new exeat request
  const [newRequest, setNewRequest] = useState({
    reason: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    parentNumber: ''
  });

  const handleSubmitRequest = async (data: any) => {
   try {
       const response = await exeats.create(data);
       setExeatRequests([...exeatRequests, response.data]);
   } catch (error) {
       console.error('Failed to submit request:', error);
   }
};

  const RequestForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Exeat Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for leaving campus</Label>
            <Input 
              id="reason"
              value={newRequest.reason}
              onChange={(e) => setNewRequest({...newRequest, reason: e.target.value})}
              placeholder="Enter detailed reason"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departure</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newRequest.departureDate}
                  onChange={(e) => setNewRequest({...newRequest, departureDate: e.target.value})}
                  required
                />
                <Input
                  type="time"
                  value={newRequest.departureTime}
                  onChange={(e) => setNewRequest({...newRequest, departureTime: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Return</Label>
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newRequest.returnDate}
                  onChange={(e) => setNewRequest({...newRequest, returnDate: e.target.value})}
                  required
                />
                <Input
                  type="time"
                  value={newRequest.returnTime}
                  onChange={(e) => setNewRequest({...newRequest, returnTime: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentNumber">Parent's Phone Number</Label>
            <Input
              id="parentNumber"
              value={newRequest.parentNumber}
              onChange={(e) => setNewRequest({...newRequest, parentNumber: e.target.value})}
              placeholder="Enter parent's contact number"
              required
            />
          </div>

          <Button type="submit" className="w-full">Submit Request</Button>
        </form>
      </CardContent>
    </Card>
  );

  const RequestList = () => (
    <Card>
      <CardHeader>
        <CardTitle>My Exeat Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exeatRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{request.reason}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Departure: {request.departureDate} {request.departureTime}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Return: {request.returnDate} {request.returnTime}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'denied' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </span>
                  {request.status === 'approved' && (
                    <div className="mt-2">
                      <QRCodeModal exeat={request} />
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    request.parentApproval === 'approved' ? 'bg-green-500' :
                    request.parentApproval === 'denied' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  Parent Approval: {request.parentApproval?.charAt(0).toUpperCase() + request.parentApproval?.slice(1)}
                </div>
                {request.deanApproval && (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      request.deanApproval === 'approved' ? 'bg-green-500' :
                      request.deanApproval === 'denied' ? 'bg-red-500' :
                      'bg-yellow-500'
                    }`} />
                    Dean Approval: {request.deanApproval.charAt(0).toUpperCase() + request.deanApproval.slice(1)}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const NotificationsList = () => (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border ${
                notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-100'
              }`}
            >
              <div className="flex items-start gap-2">
                {!notification.read && (
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests">Exeat Requests</TabsTrigger>
          <TabsTrigger value="notifications">
            <div className="flex items-center gap-2">
              Notifications
              {notifications.some(n => !n.read) && (
                <div className="w-2 h-2 rounded-full bg-red-500" />
              )}
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-6">
          <RequestForm />
          <RequestList />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;