import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  FolderOpen, 
  Bell,
  Home,
  LogOut
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
      id: 'documents',
      title: 'ডকুমেন্টস',
      description: 'আপনার সকল ফাইল এবং ডকুমেন্ট',
      icon: <FileText className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20'
    },
    {
      id: 'users',
      title: 'ব্যবহারকারী',
      description: 'ব্যবহারকারী ব্যবস্থাপনা এবং প্রোফাইল',
      icon: <Users className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-500',
      gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
    },
    {
      id: 'analytics',
      title: 'বিশ্লেষণ',
      description: 'ডেটা এবং পরিসংখ্যান দেখুন',
      icon: <BarChart3 className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'projects',
      title: 'প্রকল্প',
      description: 'আপনার সকল প্রকল্প এবং কাজ',
      icon: <FolderOpen className="w-8 h-8" />,
      color: 'from-orange-500 to-red-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
    },
    {
      id: 'notifications',
      title: 'বিজ্ঞপ্তি',
      description: 'গুরুত্বপূর্ণ বার্তা এবং আপডেট',
      icon: <Bell className="w-8 h-8" />,
      color: 'from-yellow-500 to-amber-500',
      gradient: 'bg-gradient-to-br from-yellow-500/20 to-amber-500/20'
    },
    {
      id: 'settings',
      title: 'সেটিংস',
      description: 'অ্যাপ্লিকেশন কনফিগারেশন',
      icon: <Settings className="w-8 h-8" />,
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
                ড্যাশবোর্ড
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