import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock users for demonstration
  const mockUsers = [
    { id: '1', name: 'John Student', email: 'student@college.edu', password: 'password', role: 'student' as const },
    { id: '2', name: 'Dr. Sarah Teacher', email: 'teacher@college.edu', password: 'password', role: 'teacher' as const },
    { id: '3', name: 'Admin User', email: 'admin@college.edu', password: 'password', role: 'admin' as const },
  ];

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => 
      u.email === email && u.password === password && u.role === role
    );
    
    if (foundUser) {
      const userInfo = { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role };
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}