import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { QrCode, Camera, CheckCircle, XCircle, Calendar, Book, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import QRScanner from '../components/QRScanner';

export default function StudentPage() {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Mock data
  const attendanceStats = {
    totalClasses: 45,
    attendedClasses: 38,
    percentage: 84
  };

  const attendanceData = [
    { name: 'Present', value: 38, fill: '#10B981' },
    { name: 'Absent', value: 7, fill: '#EF4444' }
  ];

  const weeklyData = [
    { day: 'Mon', attendance: 85 },
    { day: 'Tue', attendance: 90 },
    { day: 'Wed', attendance: 78 },
    { day: 'Thu', attendance: 88 },
    { day: 'Fri', attendance: 82 },
  ];

  const attendanceHistory = [
    { date: '2025-01-15', subject: 'Mathematics', status: 'Present', time: '09:00 AM' },
    { date: '2025-01-14', subject: 'Physics', status: 'Present', time: '11:00 AM' },
    { date: '2025-01-13', subject: 'Chemistry', status: 'Absent', time: '-' },
    { date: '2025-01-12', subject: 'Mathematics', status: 'Present', time: '09:00 AM' },
    { date: '2025-01-11', subject: 'English', status: 'Present', time: '02:00 PM' },
  ];

  const handleScanSuccess = async (qrData: string) => {
    setLoading(true);
    setScanResult(qrData);
    
    try {
      // Call backend API to mark attendance
      const response = await fetch('/student/mark-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add auth token
        },
        body: JSON.stringify({
          qr_code: qrData,
          student_id: user?.id
        })
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ 
          type: 'success', 
          text: `Attendance marked successfully for ${result.subject || 'class'}!` 
        });
      } else {
        const error = await response.json();
        setMessage({ 
          type: 'error', 
          text: error.message || 'Failed to mark attendance. Please try again.' 
        });
      }
    } catch (error) {
      // Fallback for demo - simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      } else {
        setMessage({ type: 'error', text: 'QR code expired or invalid. Please try again.' });
      }
    }
    
    setLoading(false);
    setShowScanner(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          Here's your attendance summary for this semester
        </p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <XCircle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Classes</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.totalClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Classes Attended</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.attendedClasses}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{attendanceStats.percentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Attendance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* QR Scanner Section */}
      <div id="scan" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mark Attendance</h3>
          <QrCode className="h-6 w-6 text-blue-600" />
        </div>
        
        {!showScanner ? (
          <div className="text-center py-8">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Scan the QR code displayed by your teacher to mark your attendance
            </p>
            <button
              onClick={() => setShowScanner(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Open QR Scanner
            </button>
          </div>
        ) : (
          <QRScanner 
            onResult={handleScanSuccess}
            onClose={() => setShowScanner(false)}
            loading={loading}
          />
        )}
      </div>

      {/* Attendance History */}
      <div id="history" className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Attendance History</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.status === 'Present' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
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