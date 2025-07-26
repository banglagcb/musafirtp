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
      {openWindows.map((windowId) => {
        const windowState = getWindowState(windowId);
        const card = dashboardCards.find(c => c.id === windowId);
        const content = getWindowContent(windowId, windowState.currentPage);
        
        if (!card || windowState.minimized) return null;

        return (
          <div key={windowId} className="window-container animate-window-appear">
            <div 
              className={`window ${windowState.maximized ? 'w-full h-full' : 'w-[800px] h-[600px] max-w-[90vw] max-h-[85vh]'}`}
            >
              {/* Window Header */}
              <div className="window-header">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white text-sm`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{content?.title}</h3>
                    <p className="text-xs text-muted-foreground">{card.description}</p>
                  </div>
                </div>
                
                <div className="window-controls">
                  <button 
                    className="window-control minimize"
                    onClick={() => updateWindowState(windowId, { minimized: true })}
                  />
                  <button 
                    className="window-control maximize"
                    onClick={() => updateWindowState(windowId, { maximized: !windowState.maximized })}
                  />
                  <button 
                    className="window-control close"
                    onClick={() => onCloseWindow(windowId)}
                  />
                </div>
              </div>

              {/* Window Content */}
              <div className="p-6 overflow-auto flex-1">
                {content?.content}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};