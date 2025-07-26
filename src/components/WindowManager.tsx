import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Minus, Square, ArrowLeft, FileText, Users, BarChart3, FolderOpen, Bell, Settings } from 'lucide-react';

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

    const baseContent = {
      documents: {
        main: {
          title: 'ডকুমেন্ট ম্যানেজার',
          content: (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-blue-500" />
                    <div>
                      <h4 className="font-medium">প্রতিবেদন ২০২৪</h4>
                      <p className="text-sm text-muted-foreground">PDF • 2.3 MB</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-500" />
                    <div>
                      <h4 className="font-medium">বাজেট পরিকল্পনা</h4>
                      <p className="text-sm text-muted-foreground">Excel • 1.1 MB</p>
                    </div>
                  </div>
                </Card>
              </div>
              <Separator />
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>আরও ডকুমেন্ট লোড করতে ক্লিক করুন</p>
              </div>
            </div>
          )
        }
      },
      users: {
        main: {
          title: 'ব্যবহারকারী তালিকা',
          content: (
            <div className="space-y-4">
              {['আহমেদ আলী', 'ফাতেমা খান', 'মোহাম্মদ হাসান'].map((name, index) => (
                <Card key={index} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center text-white font-medium">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{name}</h4>
                        <p className="text-sm text-muted-foreground">সক্রিয় ব্যবহারকারী</p>
                      </div>
                    </div>
                    <Badge variant="secondary">অনলাইন</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )
        }
      },
      analytics: {
        main: {
          title: 'বিশ্লেষণ ড্যাশবোর্ড',
          content: (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-primary">১,২৩৪</h3>
                  <p className="text-sm text-muted-foreground">মোট ব্যবহারকারী</p>
                </Card>
                <Card className="p-4 text-center">
                  <h3 className="text-2xl font-bold text-accent">৫৬৭</h3>
                  <p className="text-sm text-muted-foreground">সক্রিয় সেশন</p>
                </Card>
              </div>
              <Card className="p-6">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground" />
                </div>
                <p className="text-center mt-4 text-muted-foreground">চার্ট ডেটা লোড হচ্ছে...</p>
              </Card>
            </div>
          )
        }
      },
      projects: {
        main: {
          title: 'প্রকল্প তালিকা',
          content: (
            <div className="space-y-4">
              {['ওয়েবসাইট ডিজাইন', 'মোবাইল অ্যাপ', 'ডেটাবেস আপগ্রেড'].map((project, index) => (
                <Card key={index} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-6 h-6 text-orange-500" />
                      <div>
                        <h4 className="font-medium">{project}</h4>
                        <p className="text-sm text-muted-foreground">চলমান প্রকল্প</p>
                      </div>
                    </div>
                    <Badge variant="outline">৭৫%</Badge>
                  </div>
                </Card>
              ))}
            </div>
          )
        }
      },
      notifications: {
        main: {
          title: 'বিজ্ঞপ্তি কেন্দ্র',
          content: (
            <div className="space-y-4">
              {[
                { title: 'নতুন বার্তা', time: '৫ মিনিট আগে', type: 'info' },
                { title: 'সিস্টেম আপডেট', time: '১ ঘন্টা আগে', type: 'warning' },
                { title: 'ব্যাকআপ সম্পন্ন', time: '২ ঘন্টা আগে', type: 'success' }
              ].map((notification, index) => (
                <Card key={index} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-start gap-3">
                    <Bell className="w-5 h-5 mt-1 text-primary" />
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        }
      },
      settings: {
        main: {
          title: 'সেটিংস',
          content: (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">সাধারণ</h3>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">থিম সেটিংস</h4>
                      <p className="text-sm text-muted-foreground">অ্যাপিয়ারেন্স কাস্টমাইজ করুন</p>
                    </div>
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">ভাষা সেটিংস</h4>
                      <p className="text-sm text-muted-foreground">বাংলা (ডিফল্ট)</p>
                    </div>
                    <Settings className="w-5 h-5 text-muted-foreground" />
                  </div>
                </Card>
              </div>
            </div>
          )
        }
      }
    };

    return baseContent[windowId as keyof typeof baseContent]?.[currentPage as 'main'] || {
      title: card.title,
      content: <div className="text-center py-8 text-muted-foreground">কন্টেন্ট লোড হচ্ছে...</div>
    };
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