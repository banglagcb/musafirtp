import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plane, 
  Users, 
  Settings, 
  BarChart3, 
  FolderOpen, 
  CreditCard,
  Home,
  LogOut,
  Plus,
  FileSpreadsheet,
  Package,
  ShoppingCart,
  UserPlus
} from 'lucide-react';
import { WindowManager } from './WindowManager';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardProps {
  username: string;
  onLogout: () => void;
}

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

export const Dashboard = ({ username, onLogout }: DashboardProps) => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const { isAdmin } = useAuth();

  const dashboardCards: DashboardCard[] = [
    {
      id: 'enhanced-booking',
      title: 'নতুন বুকিং',
      description: 'নতুন ফ্লাইট বুকিং যোগ করুন',
      icon: <Plus className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
    },
    ...(isAdmin() ? [
      {
        id: 'ticket-purchase',
        title: 'টিকেট ক্রয়',
        description: 'সরবরাহকারী থেকে টিকেট কিনুন',
        icon: <ShoppingCart className="w-8 h-8" />,
        color: 'from-indigo-500 to-purple-500',
        gradient: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'
      },
      {
        id: 'purchased-tickets',
        title: 'ক্রয়কৃত টিকেট',
        description: 'টিকেট স্টক ও লক ম্যানেজমেন্ট',
        icon: <Package className="w-8 h-8" />,
        color: 'from-purple-500 to-pink-500',
        gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
      },
      {
        id: 'user-management',
        title: 'ব্যবহারকারী ব্যবস্থাপনা',
        description: 'নতুন ব্যবহারকারী তৈরি ও পরিচালনা',
        icon: <UserPlus className="w-8 h-8" />,
        color: 'from-green-500 to-emerald-500',
        gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
      },
      {
        id: 'system-settings',
        title: 'সিস্টেম সেটিংস',
        description: 'সিস্টেম কনফিগারেশন ও পছন্দসমূহ',
        icon: <Settings className="w-8 h-8" />,
        color: 'from-slate-500 to-gray-500',
        gradient: 'bg-gradient-to-br from-slate-500/20 to-gray-500/20'
      }
    ] : []),
    {
      id: 'bookings-list',
      title: 'বুকিং তালিকা',
      description: 'সকল বুকিং দেখুন ও এডিট করুন',
      icon: <Plane className="w-8 h-8" />,
      color: 'from-teal-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20'
    },
    {
      id: 'payments',
      title: 'পেমেন্ট স্ট্যাটাস',
      description: 'পেমেন্ট ট্র্যাকিং ও হিসাব',
      icon: <CreditCard className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
    },
    {
      id: 'reports',
      title: 'রিপোর্ট',
      description: 'দৈনিক/মাসিক বিক্রয় ও মুনাফা',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-yellow-500 to-amber-500',
      gradient: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20'
    },
    ...(isAdmin() ? [
      {
        id: 'export',
        title: 'ডেটা এক্সপোর্ট',
        description: 'CSV বা Excel ফর্ম্যাটে ডাউনলোড',
        icon: <FileSpreadsheet className="w-8 h-8" />,
        color: 'from-gray-500 to-slate-500',
        gradient: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20'
      }
    ] : [])
  ];

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows(prev => [...prev, windowId]);
    }
  };

  const closeWindow = (windowId: string) => {
    setOpenWindows(prev => prev.filter(id => id !== windowId));
  };

  return (
    <div className="min-h-screen p-2 xs:p-3 sm:p-4 md:p-6 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
                ট্রাভেল এজেন্সি ড্যাশবোর্ড
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground truncate">স্বাগতম, {username}!</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="gap-1 sm:gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors text-xs sm:text-sm h-8 sm:h-9 md:h-10 px-2 sm:px-3 flex-shrink-0"
            style={{ touchAction: 'manipulation' }}
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">লগআউট</span>
          </Button>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6">
        {dashboardCards.map((card, index) => (
          <Card 
            key={card.id}
            className={`folder-card cursor-pointer group hover:scale-105 transition-all duration-300 ${card.gradient} border-border/50`}
            onClick={() => openWindow(card.id)}
            style={{
              animationDelay: `${index * 150}ms`,
              touchAction: 'manipulation'
            }}
          >
            <CardHeader className="pb-2 sm:pb-3 p-3 sm:p-4 md:p-6">
              <div className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-2 sm:mb-4 group-hover:scale-110 transition-transform text-lg xs:text-xl sm:text-2xl`}>
                {card.icon}
              </div>
              <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold leading-tight">{card.title}</CardTitle>
              <CardDescription className="text-xs sm:text-sm leading-relaxed">{card.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6 pt-0">
              <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                <span className="truncate">ক্লিক করে খুলুন</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Window Manager */}
      <WindowManager 
        openWindows={openWindows}
        onCloseWindow={closeWindow}
        dashboardCards={dashboardCards}
      />
    </div>
  );
};