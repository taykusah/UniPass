'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  QrCode,
  Search,
  LogIn,
  LogOut,
  AlertCircle,
  Clock,
  User,
  CheckCircle,
  XCircle,
  History
} from 'lucide-react';
import { SecurityPersonnel, GateActivity, ExeatRequest } from '@/types/interfaces';

interface SecurityDashboardProps {
  user: SecurityPersonnel;
}

const SecurityDashboard = ({ user }: SecurityDashboardProps) => {
  const [activeTab, setActiveTab] = useState('scan');
  const [scanMode, setScanMode] = useState<'entry' | 'exit'>('exit');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<ExeatRequest | null>(null);

  // Mock data for recent gate activities
  const [gateActivities, setGateActivities] = useState<GateActivity[]>([
    {
      id: '1',
      exeatId: 'EX123',
      studentId: 'STU123',
      type: 'exit',
      timestamp: new Date().toISOString(),
      securityId: user.id,
      status: 'valid',
      notes: 'Regular exit'
    }
  ]);

  // Mock function to handle QR code scan result
  const handleScan = async (result: string) => {
    try {
      // In real app, this would verify the QR with backend
      const scannedData = JSON.parse(result);
      
      // Add to gate activities
      const newActivity: GateActivity = {
        id: Date.now().toString(),
        exeatId: scannedData.exeatId,
        studentId: scannedData.studentId,
        type: scanMode,
        timestamp: new Date().toISOString(),
        securityId: user.id,
        status: 'valid'
      };
      
      setGateActivities([newActivity, ...gateActivities]);
      alert('Scan successful! Student verified.');
    } catch (error) {
      alert('Invalid QR Code');
    }
  };

  // Mock function to handle manual student search
  const handleManualSearch = async () => {
    // In real app, this would search the backend
    const mockStudent: ExeatRequest = {
      id: 'EX124',
      studentId: 'STU124',
      studentName: 'Jane Smith',
      matricNumber: searchTerm,
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
    };
    
    setSearchResult(mockStudent);
  };

  const QRScannerView = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scan QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-center gap-4 mb-4">
              <Button
                variant={scanMode === 'exit' ? 'default' : 'outline'}
                onClick={() => setScanMode('exit')}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Exit Mode
              </Button>
              <Button
                variant={scanMode === 'entry' ? 'default' : 'outline'}
                onClick={() => setScanMode('entry')}
                className="flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Entry Mode
              </Button>
            </div>

            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Point camera at student's QR code</p>
              <p className="text-sm mt-2 font-semibold text-blue-600">
                Currently in {scanMode.toUpperCase()} mode
              </p>
            </div>

            {/* Simulated scan button (for demo) */}
            <Button 
              className="w-full"
              onClick={() => handleScan(JSON.stringify({
                exeatId: 'EX123',
                studentId: 'STU123',
                studentName: 'John Doe',
                validUntil: '2024-12-26T18:00:00'
              }))}
            >
              Simulate Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gateActivities.slice(0, 5).map((activity) => (
              <div 
                key={activity.id} 
                className={`p-3 rounded-lg border ${
                  activity.status === 'valid' ? 'bg-green-50 border-green-100' :
                  activity.status === 'invalid' ? 'bg-red-50 border-red-100' :
                  'bg-yellow-50 border-yellow-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">ID: {activity.studentId}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    activity.type === 'entry' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {activity.type.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ManualSearchView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Manual Student Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter student ID or Matric Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleManualSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>

          {searchResult && (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{searchResult.studentName}</h3>
                    <p className="text-sm text-gray-500">ID: {searchResult.matricNumber}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Departure</p>
                      <p>{searchResult.departureDate}</p>
                      <p>{searchResult.departureTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Return</p>
                      <p>{searchResult.returnDate}</p>
                      <p>{searchResult.returnTime}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      searchResult.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {searchResult.status.toUpperCase()}
                    </span>
                    {searchResult.status === 'approved' && (
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                          const activity: GateActivity = {
                            id: Date.now().toString(),
                            exeatId: searchResult.id,
                            studentId: searchResult.studentId,
                            type: scanMode,
                            timestamp: new Date().toISOString(),
                            securityId: user.id,
                            status: 'valid'
                          };
                          setGateActivities([activity, ...gateActivities]);
                        }}>
                          Record {scanMode.toUpperCase()}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ActivityLogView = () => (
    <Card>
      <CardHeader>
        <CardTitle>Gate Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search activities..."
              className="flex-1"
            />
            <select className="p-2 border rounded">
              <option value="all">All Activities</option>
              <option value="entry">Entries Only</option>
              <option value="exit">Exits Only</option>
            </select>
          </div>

          <div className="space-y-2">
            {gateActivities.map((activity) => (
              <div 
                key={activity.id}
                className="p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">Student ID: {activity.studentId}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                    {activity.notes && (
                      <p className="text-sm text-gray-600 mt-1">{activity.notes}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      activity.type === 'entry' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {activity.type.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      activity.status === 'valid' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {activity.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="scan">
            <QrCode className="w-4 h-4 mr-2" />
            QR Scanner
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Search className="w-4 h-4 mr-2" />
            Manual Search
          </TabsTrigger>
          <TabsTrigger value="log">
            <History className="w-4 h-4 mr-2" />
            Activity Log
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scan">
          <QRScannerView />
        </TabsContent>
        
        <TabsContent value="manual">
          <ManualSearchView />
        </TabsContent>

        <TabsContent value="log">
          <ActivityLogView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityDashboard;