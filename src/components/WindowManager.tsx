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
        <div className="fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-50 flex flex-wrap gap-1 sm:gap-2 max-w-[calc(100vw-1rem)]">
          {minimizedWindows.map((windowId) => {
            const card = dashboardCards.find(c => c.id === windowId);
            if (!card) return null;
            return (
              <button
                key={windowId}
                onClick={() => handleRestore(windowId)}
                className="flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-card/80 backdrop-blur-sm border rounded-lg hover:bg-card/90 transition-all duration-200 animate-slide-up min-h-[44px]"
                style={{ touchAction: 'manipulation' }}
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xs flex-shrink-0`}>
                  {card.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium truncate max-w-[60px] sm:max-w-[100px] hidden xs:block">{card.title}</span>
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
              ? 'window-maximized' 
              : 'window-normal'
          }`}
          style={{
            width: windowState.maximized ? '95vw' : 'min(90vw, 900px)',
            height: windowState.maximized ? '90vh' : 'min(80vh, 700px)',
            maxWidth: windowState.maximized ? '95vw' : '900px',
            maxHeight: windowState.maximized ? '90vh' : '700px'
          }}
        >
          {/* Window Header */}
          <div className="window-header flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-xs sm:text-sm flex-shrink-0`}>
                {card.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-sm sm:text-base md:text-lg truncate">{content?.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground truncate hidden sm:block">{card.description}</p>
              </div>
            </div>
            
            <div className="window-controls flex-shrink-0">
              <button 
                className="window-control minimize"
                onClick={() => handleMinimize(windowId)}
                title="Minimize"
                style={{ touchAction: 'manipulation' }}
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button 
                className="window-control maximize"
                onClick={() => updateWindowState(windowId, { maximized: !windowState.maximized })}
                title={windowState.maximized ? "Restore" : "Maximize"}
                style={{ touchAction: 'manipulation' }}
              >
                <Square className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button 
                className="window-control close"
                onClick={() => onCloseWindow(windowId)}
                title="Close"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div className="window-content p-2 xs:p-3 sm:p-4 md:p-6 overflow-auto flex-1">
            {content?.content}
          </div>
            </div>
          </div>
        );
      })}
    </>
  );
};