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
  FileSpreadsheet
} from 'lucide-react';
import { WindowManager } from './WindowManager';

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

  const dashboardCards: DashboardCard[] = [
    {
      id: 'new-booking',
      title: 'নতুন বুকিং',
      description: 'নতুন ফ্লাইট বুকিং যোগ করুন',
      icon: <Plus className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'bookings-list',
      title: 'বুকিং তালিকা',
      description: 'সকল বুকিং দেখুন ও এডিট করুন',
      icon: <Plane className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'customers',
      title: 'গ্রাহক তালিকা',
      description: 'গ্রাহকদের তথ্য ও ইতিহাস',
      icon: <Users className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
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
    {
      id: 'export',
      title: 'ডেটা এক্সপোর্ট',
      description: 'CSV বা Excel ফর্ম্যাটে ডাউনলোড',
      icon: <FileSpreadsheet className="w-8 h-8" />,
      color: 'from-gray-500 to-slate-500',
      gradient: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20'
    }
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
    <div className="min-h-screen p-6 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ট্রাভেল এজেন্সি ড্যাশবোর্ড
              </h1>
              <p className="text-muted-foreground">স্বাগতম, {username}!</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onLogout}
            className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            লগআউট
          </Button>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Card 
            key={card.id}
            className={`folder-card cursor-pointer group hover:scale-105 transition-all duration-300 ${card.gradient} border-border/50`}
            onClick={() => openWindow(card.id)}
            style={{
              animationDelay: `${index * 150}ms`
            }}
          >
            <CardHeader className="pb-3">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <CardTitle className="text-xl font-semibold">{card.title}</CardTitle>
              <CardDescription className="text-sm">{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-muted-foreground">
                <FolderOpen className="w-4 h-4 mr-2" />
                ক্লিক করে খুলুন
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