import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, BarChart3, QrCode, History, Users, FileText, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getMenuItems = () => {
    switch (user?.role) {
      case 'student':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/student' },
          { icon: QrCode, label: 'Mark Attendance', path: '/student#scan' },
          { icon: History, label: 'Attendance History', path: '/student#history' },
        ];
      case 'teacher':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/teacher' },
          { icon: QrCode, label: 'Generate QR', path: '/teacher#generate' },
          { icon: FileText, label: 'Attendance List', path: '/teacher#list' },
        ];
      case 'admin':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/admin' },
          { icon: Users, label: 'User Management', path: '/admin#users' },
          { icon: FileText, label: 'Attendance Reports', path: '/admin#reports' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden bg-black bg-opacity-50"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 lg:mt-0">
          <div className="px-4 py-4 hidden lg:block">
            <h2 className="text-lg font-semibold text-gray-800 capitalize">
              {user?.role} Panel
            </h2>
          </div>
          
          <div className="px-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path.split('#')[0];
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg mb-1 transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}