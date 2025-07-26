import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Minus, Square, ArrowLeft, FileText, Users, BarChart3, FolderOpen, Bell, Settings } from 'lucide-react';
import { NewBookingForm } from './travel/NewBookingForm';
import { BookingsList } from './travel/BookingsList';
import { ReportsSection } from './travel/ReportsSection';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

interface WindowManagerProps {
  openWindows: string[];
  onCloseWindow: (windowId: string) => void;
  dashboardCards: DashboardCard[];
}

interface WindowState {
  id: string;
  minimized: boolean;
  maximized: boolean;
  currentPage: string;
}

export const WindowManager = ({ openWindows, onCloseWindow, dashboardCards }: WindowManagerProps) => {
  const [windowStates, setWindowStates] = useState<WindowState[]>([]);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);

  const updateWindowState = (windowId: string, updates: Partial<WindowState>) => {
    setWindowStates(prev => {
      const existing = prev.find(w => w.id === windowId);
      if (existing) {
        return prev.map(w => w.id === windowId ? { ...w, ...updates } : w);
      } else {
        return [...prev, { id: windowId, minimized: false, maximized: false, currentPage: 'main', ...updates }];
      }
    });
  };

  const handleMinimize = (windowId: string) => {
    setMinimizedWindows(prev => [...prev, windowId]);
    updateWindowState(windowId, { minimized: true });
  };

  const handleRestore = (windowId: string) => {
    setMinimizedWindows(prev => prev.filter(id => id !== windowId));
    updateWindowState(windowId, { minimized: false });
  };

  const getWindowState = (windowId: string): WindowState => {
    return windowStates.find(w => w.id === windowId) || { 
      id: windowId, 
      minimized: false, 
      maximized: false, 
      currentPage: 'main' 
    };
  };

  const getWindowContent = (windowId: string, currentPage: string) => {
    const card = dashboardCards.find(c => c.id === windowId);
    if (!card) return null;

    switch (windowId) {
      case 'new-booking':
        return {
          title: 'নতুন বুকিং',
          content: <NewBookingForm onClose={() => onCloseWindow(windowId)} />
        };
      case 'bookings-list':
        return {
          title: 'বুকিং তালিকা', 
          content: <BookingsList />
        };
      case 'reports':
        return {
          title: 'রিপোর্ট ও বিশ্লেষণ',
          content: <ReportsSection />
        };
      case 'customers':
        return {
          title: 'গ্রাহক তালিকা',
          content: (
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>গ্রাহক ম্যানেজমেন্ট মডিউল শীঘ্রই আসছে</p>
              </div>
            </div>
          )
        };
      case 'payments':
        return {
          title: 'পেমেন্ট স্ট্যাটাস',
          content: (
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>পেমেন্ট ট্র্যাকিং মডিউল শীঘ্রই আসছে</p>
              </div>
            </div>
          )
        };
      case 'export':
        return {
          title: 'ডেটা এক্সপোর্ট',
          content: (
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>ডেটা এক্সপোর্ট মডিউল শীঘ্রই আসছে</p>
              </div>
            </div>
          )
        };
      default:
        return {
          title: card.title,
          content: <div className="text-center py-8 text-muted-foreground">কন্টেন্ট লোড হচ্ছে...</div>
        };
    }
  };

  if (openWindows.length === 0) return null;

  return (
    <>
      {/* Minimized Windows Taskbar */}
      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-4 left-4 z-50 flex gap-2">
          {minimizedWindows.map((windowId) => {
            const card = dashboardCards.find(c => c.id === windowId);
            if (!card) return null;
            return (
              <button
                key={windowId}
                onClick={() => handleRestore(windowId)}
                className="flex items-center gap-2 px-3 py-2 bg-card/80 backdrop-blur-sm border rounded-lg hover:bg-card/90 transition-all duration-200 animate-slide-up"
              >
                <div className={`w-5 h-5 rounded bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xs`}>
                  {card.icon}
                </div>
                <span className="text-sm font-medium truncate max-w-[100px]">{card.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Windows */}
      {openWindows.map((windowId) => {
        const windowState = getWindowState(windowId);
        const card = dashboardCards.find(c => c.id === windowId);
        const content = getWindowContent(windowId, windowState.currentPage);
        
        if (!card || windowState.minimized) return null;

        return (
          <div key={windowId} className="window-container animate-float-up">
            <div 
              className={`window transform-gpu ${
                windowState.maximized 
                  ? 'window-maximized w-[95vw] h-[95vh] sm:w-[98vw] sm:h-[98vh]' 
                  : 'window-normal w-[95vw] h-[90vh] sm:w-[85vw] sm:h-[85vh] md:w-[800px] md:h-[600px] lg:w-[900px] lg:h-[700px]'
              }`}
            >
              {/* Window Header */}
              <div className="window-header flex-shrink-0">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xs md:text-sm flex-shrink-0`}>
                    {card.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm md:text-base truncate">{content?.title}</h3>
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">{card.description}</p>
                  </div>
                </div>
                
                <div className="window-controls flex-shrink-0">
                  <button 
                    className="window-control minimize"
                    onClick={() => handleMinimize(windowId)}
                    title="Minimize"
                  >
                    <Minus className="w-2 h-2" />
                  </button>
                  <button 
                    className="window-control maximize"
                    onClick={() => updateWindowState(windowId, { maximized: !windowState.maximized })}
                    title={windowState.maximized ? "Restore" : "Maximize"}
                  >
                    <Square className="w-2 h-2" />
                  </button>
                  <button 
                    className="window-control close"
                    onClick={() => onCloseWindow(windowId)}
                    title="Close"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
              </div>

              {/* Window Content */}
              <div className="window-content p-3 md:p-6 overflow-auto flex-1">
                {content?.content}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};