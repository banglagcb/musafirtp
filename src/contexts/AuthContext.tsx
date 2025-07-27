import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'manager';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default users for demo
const defaultUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    name: 'সিস্টেম অ্যাডমিন',
    email: 'admin@travelagency.com',
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  },
  {
    id: '2',
    username: 'manager1',
    role: 'manager',
    name: 'ম্যানেজার ওয়ান',
    email: 'manager1@travelagency.com',
    createdAt: new Date(),
    lastLogin: new Date(),
    isActive: true
  }
];

// Admin permissions
const adminPermissions = [
  'view_all_bookings',
  'create_booking',
  'edit_booking',
  'delete_booking',
  'purchase_tickets',
  'view_purchase_price',
  'lock_tickets',
  'view_reports',
  'view_profit',
  'manage_users',
  'export_data',
  'system_settings'
];

// Manager permissions
const managerPermissions = [
  'view_own_bookings',
  'create_booking',
  'edit_own_booking',
  'view_available_tickets',
  'update_payment_status'
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication - in real app, this would be API call
    const foundUser = defaultUsers.find(u => u.username === username && u.isActive);
    
    if (foundUser && (password === 'admin123' || password === 'manager123')) {
      const updatedUser = { ...foundUser, lastLogin: new Date() };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') {
      return adminPermissions.includes(permission);
    } else if (user.role === 'manager') {
      return managerPermissions.includes(permission);
    }
    
    return false;
  };

  const isAdmin = (): boolean => user?.role === 'admin';
  const isManager = (): boolean => user?.role === 'manager';

  // Load user from localStorage on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const value = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    hasPermission,
    isAdmin,
    isManager
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};