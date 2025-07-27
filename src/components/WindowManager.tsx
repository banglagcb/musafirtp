import { useState, useEffect } from 'react';
import { X, Minus, Square } from 'lucide-react';
import { NewBookingForm } from './travel/NewBookingForm';
import { EnhancedBookingForm } from './travel/EnhancedBookingForm';
import { BookingsList } from './travel/BookingsList';
import { ReportsSection } from './travel/ReportsSection';
import { TicketPurchaseForm } from './admin/TicketPurchaseForm';
import { PurchasedTicketsList } from './admin/PurchasedTicketsList';

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
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export const WindowManager = ({ openWindows, onCloseWindow, dashboardCards }: WindowManagerProps) => {
  const [windowStates, setWindowStates] = useState<WindowState[]>([]);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    windowId: string | null;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
  }>({
    isDragging: false,
    windowId: null,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });
  const [highestZIndex, setHighestZIndex] = useState(1000);

  const getDefaultWindowPosition = (index: number) => {
    const baseX = 100 + (index * 30);
    const baseY = 100 + (index * 30);
    return {
      x: Math.min(baseX, window.innerWidth - 800),
      y: Math.min(baseY, window.innerHeight - 600),
      width: 800,
      height: 600,
    };
  };

  const getWindowState = (windowId: string): WindowState => {
    const existing = windowStates.find(w => w.id === windowId);
    if (existing) return existing;
    
    const index = openWindows.indexOf(windowId);
    const defaultPos = getDefaultWindowPosition(index);
    const newState: WindowState = {
      id: windowId,
      minimized: false,
      maximized: false,
      x: defaultPos.x,
      y: defaultPos.y,
      width: defaultPos.width,
      height: defaultPos.height,
      zIndex: highestZIndex + index,
    };
    
    setWindowStates(prev => [...prev, newState]);
    return newState;
  };

  const updateWindowState = (windowId: string, updates: Partial<WindowState>) => {
    setWindowStates(prev => {
      const existing = prev.find(w => w.id === windowId);
      if (existing) {
        return prev.map(w => w.id === windowId ? { ...w, ...updates } : w);
      } else {
        const index = openWindows.indexOf(windowId);
        const defaultPos = getDefaultWindowPosition(index);
        const newState: WindowState = {
          id: windowId,
          minimized: false,
          maximized: false,
          x: defaultPos.x,
          y: defaultPos.y,
          width: defaultPos.width,
          height: defaultPos.height,
          zIndex: highestZIndex,
          ...updates,
        };
        return [...prev, newState];
      }
    });
  };

  const bringToFront = (windowId: string) => {
    const newZIndex = highestZIndex + 1;
    setHighestZIndex(newZIndex);
    updateWindowState(windowId, { zIndex: newZIndex });
  };

  const handleMinimize = (windowId: string) => {
    updateWindowState(windowId, { minimized: true });
  };

  const handleMaximize = (windowId: string) => {
    const windowState = getWindowState(windowId);
    if (windowState.maximized) {
      updateWindowState(windowId, { 
        maximized: false,
        x: windowState.x || 100,
        y: windowState.y || 100,
        width: 800,
        height: 600,
      });
    } else {
      updateWindowState(windowId, { 
        maximized: true,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, windowId: string) => {
    if ((e.target as HTMLElement).closest('.window-control')) return;
    
    bringToFront(windowId);
    
    const windowState = getWindowState(windowId);
    if (windowState.maximized) return;

    setDragState({
      isDragging: true,
      windowId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: windowState.x,
      initialY: windowState.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.windowId) return;

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;

    updateWindowState(dragState.windowId, {
      x: Math.max(0, Math.min(dragState.initialX + deltaX, window.innerWidth - 300)),
      y: Math.max(0, Math.min(dragState.initialY + deltaY, window.innerHeight - 100)),
    });
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      windowId: null,
      startX: 0,
      startY: 0,
      initialX: 0,
      initialY: 0,
    });
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'move';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [dragState.isDragging]);

  const getWindowContent = (windowId: string) => {
    const card = dashboardCards.find(c => c.id === windowId);
    if (!card) return null;

    switch (windowId) {
      case 'new-booking':
        return {
          title: 'নতুন বুকিং',
          content: <NewBookingForm onClose={() => onCloseWindow(windowId)} />
        };
      case 'enhanced-booking':
        return {
          title: 'উন্নত বুকিং',
          content: <EnhancedBookingForm onClose={() => onCloseWindow(windowId)} />
        };
      case 'ticket-purchase':
        return {
          title: 'টিকেট ক্রয়',
          content: <TicketPurchaseForm onClose={() => onCloseWindow(windowId)} />
        };
      case 'purchased-tickets':
        return {
          title: 'ক্রয়কৃত টিকেট',
          content: <PurchasedTicketsList />
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
      default:
        return {
          title: card.title,
          content: <div className="text-center py-8 text-muted-foreground">কন্টেন্ট লোড হচ্ছে...</div>
        };
    }
  };

  // Taskbar for minimized windows
  const minimizedWindows = windowStates.filter(w => w.minimized && openWindows.includes(w.id));

  if (openWindows.length === 0) return null;

  return (
    <>
      {/* Taskbar for minimized windows */}
      {minimizedWindows.length > 0 && (
        <div className="fixed bottom-4 left-4 z-[9999] flex gap-2">
          {minimizedWindows.map((windowState) => {
            const card = dashboardCards.find(c => c.id === windowState.id);
            if (!card) return null;
            
            return (
              <button
                key={windowState.id}
                onClick={() => updateWindowState(windowState.id, { minimized: false })}
                className="flex items-center gap-2 px-3 py-2 bg-card border rounded-lg hover:bg-muted transition-colors"
                title={card.title}
              >
                <div className={`w-5 h-5 rounded ${card.color} flex items-center justify-center text-white text-xs`}>
                  {card.icon}
                </div>
                <span className="text-sm font-medium">{card.title}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Windows */}
      {openWindows.map((windowId) => {
        const windowState = getWindowState(windowId);
        const card = dashboardCards.find(c => c.id === windowId);
        const content = getWindowContent(windowId);
        
        if (!card || windowState.minimized) return null;

        return (
          <div
            key={windowId}
            className="fixed bg-card border rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{
              left: windowState.maximized ? 0 : windowState.x,
              top: windowState.maximized ? 0 : windowState.y,
              width: windowState.maximized ? '100vw' : windowState.width,
              height: windowState.maximized ? '100vh' : windowState.height,
              zIndex: windowState.zIndex,
              borderRadius: windowState.maximized ? 0 : '0.5rem',
            }}
            onClick={() => bringToFront(windowId)}
          >
            {/* Window Header */}
            <div
              className="flex items-center justify-between p-3 bg-muted cursor-move select-none"
              onMouseDown={(e) => handleMouseDown(e, windowId)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded ${card.color} flex items-center justify-center text-white text-sm`}>
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{content?.title}</h3>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
              </div>
              
              <div className="window-controls flex gap-1">
                <button 
                  className="window-control minimize"
                  onClick={() => handleMinimize(windowId)}
                  title="Minimize"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button 
                  className="window-control maximize"
                  onClick={() => handleMaximize(windowId)}
                  title={windowState.maximized ? "Restore" : "Maximize"}
                >
                  <Square className="w-4 h-4" />
                </button>
                <button 
                  className="window-control close"
                  onClick={() => onCloseWindow(windowId)}
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-auto p-4">
              {content?.content}
            </div>
          </div>
        );
      })}
    </>
  );
};