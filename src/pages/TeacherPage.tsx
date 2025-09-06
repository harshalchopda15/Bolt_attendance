import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Users, BookOpen, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function TeacherPage() {
  const { user } = useAuth();
  const [qrData, setQrData] = useState<string>('');
  const [qrExpiry, setQrExpiry] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data
  const teacherStats = {
    totalStudents: 42,
    totalClasses: 15,
    attendanceToday: 38
  };

  const attendanceList = [
    { id: 1, studentName: 'John Smith', subject: 'Mathematics', timestamp: '2025-01-15 09:05:23', status: 'Present' },
    { id: 2, studentName: 'Sarah Johnson', subject: 'Mathematics', timestamp: '2025-01-15 09:03:15', status: 'Present' },
    { id: 3, studentName: 'Mike Wilson', subject: 'Mathematics', timestamp: '2025-01-15 09:07:42', status: 'Present' },
    { id: 4, studentName: 'Emily Davis', subject: 'Mathematics', timestamp: '2025-01-15 09:02:18', status: 'Present' },
    { id: 5, studentName: 'Alex Brown', subject: 'Mathematics', timestamp: '2025-01-15 09:08:55', status: 'Present' },
  ];

  const generateQR = async () => {
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newQrData = `ATTENDANCE_${Date.now()}_TEACHER_${user?.id}_CLASS_MATH101`;
    const expiry = new Date(Date.now() + 30000); // 30 seconds from now
    
    setQrData(newQrData);
    setQrExpiry(expiry);
    setIsGenerating(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (qrExpiry) {
      interval = setInterval(() => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((qrExpiry.getTime() - now.getTime()) / 1000));
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          setQrData('');
          setQrExpiry(null);
        }
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [qrExpiry]);

  useEffect(() => {
    // Scroll to section based on hash
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-green-100">
          Manage attendance for your classes and track student participation
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Today</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.totalClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Today</p>
              <p className="text-2xl font-bold text-gray-900">{teacherStats.attendanceToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Generator Section */}
      <div id="generate" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Generate QR Code</h3>
          <QrCode className="h-6 w-6 text-green-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <button
              onClick={generateQR}
              disabled={isGenerating || (qrData && timeRemaining > 0)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : qrData ? 'QR Code Active' : 'Generate New QR Code'}
            </button>
            
            {qrData && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <span className="text-green-700 font-medium">QR Code Active</span>
                  <div className="flex items-center text-green-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="font-mono">{timeRemaining}s</span>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">QR Code Data:</p>
                  <p className="text-sm text-gray-800 font-mono break-all">{qrData}</p>
                </div>
              </div>
            )}
            
            {!qrData && !isGenerating && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                  <p className="text-blue-800 text-sm">
                    Click "Generate New QR Code" to create a QR code for students to scan. 
                    The QR code will be valid for 30 seconds.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center">
            {qrData ? (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCode value={qrData} size={200} />
              </div>
            ) : (
              <div className="w-52 h-52 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <QrCode className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">QR Code will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div id="list" className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Attendance</h3>
            <Users className="h-6 w-6 text-green-600" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceList.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}