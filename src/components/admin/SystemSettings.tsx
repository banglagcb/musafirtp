import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard,
  Shield,
  Bell,
  Palette,
  Save,
  Download,
  Upload
} from 'lucide-react';

interface CompanySettings {
  companyName: string;
  companyNameBangla: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  tradeLicense: string;
  taxNumber: string;
  defaultCurrency: string;
  currencySymbol: string;
  timezone: string;
  language: string;
  dateFormat: string;
  logo: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingAlerts: boolean;
  paymentAlerts: boolean;
  lowStockAlerts: boolean;
}

interface SecuritySettings {
  passwordExpiry: number;
  sessionTimeout: number;
  twoFactorAuth: boolean;
  loginAttempts: number;
  ipRestriction: boolean;
  allowedIPs: string[];
}

export const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('company');
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: '',
    companyNameBangla: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    tradeLicense: '',
    taxNumber: '',
    defaultCurrency: 'BDT',
    currencySymbol: '৳',
    timezone: 'Asia/Dhaka',
    language: 'bn',
    dateFormat: 'DD/MM/YYYY',
    logo: ''
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    bookingAlerts: true,
    paymentAlerts: true,
    lowStockAlerts: true
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    passwordExpiry: 90,
    sessionTimeout: 30,
    twoFactorAuth: false,
    loginAttempts: 5,
    ipRestriction: false,
    allowedIPs: []
  });

  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedCompanySettings = localStorage.getItem('companySettings');
      if (savedCompanySettings) {
        setCompanySettings(JSON.parse(savedCompanySettings));
      }

      const savedNotificationSettings = localStorage.getItem('notificationSettings');
      if (savedNotificationSettings) {
        setNotificationSettings(JSON.parse(savedNotificationSettings));
      }

      const savedSecuritySettings = localStorage.getItem('securitySettings');
      if (savedSecuritySettings) {
        setSecuritySettings(JSON.parse(savedSecuritySettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('companySettings', JSON.stringify(companySettings));
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      localStorage.setItem('securitySettings', JSON.stringify(securitySettings));

      toast({
        title: "সেটিংস সংরক্ষিত হয়েছে",
        description: "সকল পরিবর্তন সফলভাবে সংরক্ষণ করা হয়েছে।",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "সেটিংস সংরক্ষণে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    }
  };

  const exportSettings = () => {
    const allSettings = {
      company: companySettings,
      notifications: notificationSettings,
      security: securitySettings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(allSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `system-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);

    toast({
      title: "সেটিংস এক্সপোর্ট সম্পন্ন",
      description: "সেটিংস ফাইল ডাউনলোড হয়েছে।",
      variant: "default",
    });
  };

  const tabs = [
    { id: 'company', label: 'কোম্পানি তথ্য', icon: Building2 },
    { id: 'notifications', label: 'নোটিফিকেশন', icon: Bell },
    { id: 'security', label: 'নিরাপত্তা', icon: Shield },
    { id: 'appearance', label: 'চেহারা', icon: Palette }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">সিস্টেম সেটিংস</CardTitle>
            <CardDescription>সিস্টেম কনফিগারেশন ও পছন্দসমূহ</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Company Settings */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">কোম্পানির নাম (ইংরেজি)</Label>
                <Input
                  id="companyName"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="ABC Travel Agency"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyNameBangla">কোম্পানির নাম (বাংলা)</Label>
                <Input
                  id="companyNameBangla"
                  value={companySettings.companyNameBangla}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, companyNameBangla: e.target.value }))}
                  placeholder="এবিসি ট্রাভেল এজেন্সি"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  ইমেইল
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={companySettings.email}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="info@company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  ফোন
                </Label>
                <Input
                  id="phone"
                  value={companySettings.phone}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+880 1234-567890"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                ঠিকানা
              </Label>
              <Textarea
                id="address"
                value={companySettings.address}
                onChange={(e) => setCompanySettings(prev => ({ ...prev, address: e.target.value }))}
                placeholder="সম্পূর্ণ ঠিকানা লিখুন"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  ওয়েবসাইট
                </Label>
                <Input
                  id="website"
                  value={companySettings.website}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://www.company.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeLicense">ট্রেড লাইসেন্স</Label>
                <Input
                  id="tradeLicense"
                  value={companySettings.tradeLicense}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, tradeLicense: e.target.value }))}
                  placeholder="TL-123456"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taxNumber">ট্যাক্স নম্বর/টিআইএন</Label>
                <Input
                  id="taxNumber"
                  value={companySettings.taxNumber}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, taxNumber: e.target.value }))}
                  placeholder="123456789012"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  মুদ্রা
                </Label>
                <Input
                  id="currency"
                  value={`${companySettings.defaultCurrency} (${companySettings.currencySymbol})`}
                  onChange={(e) => {
                    const [currency, symbol] = e.target.value.split(' (');
                    setCompanySettings(prev => ({ 
                      ...prev, 
                      defaultCurrency: currency,
                      currencySymbol: symbol?.replace(')', '') || '৳'
                    }));
                  }}
                  placeholder="BDT (৳)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">নোটিফিকেশন সেটিংস</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">ইমেইল নোটিফিকেশন</Label>
                    <p className="text-sm text-muted-foreground">গুরুত্বপূর্ণ আপডেট ইমেইলে পান</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smsNotifications">SMS নোটিফিকেশন</Label>
                    <p className="text-sm text-muted-foreground">জরুরি বার্তা SMS এ পান</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bookingAlerts">বুকিং এলার্ট</Label>
                    <p className="text-sm text-muted-foreground">নতুন বুকিং হলে জানান</p>
                  </div>
                  <Switch
                    id="bookingAlerts"
                    checked={notificationSettings.bookingAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, bookingAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="paymentAlerts">পেমেন্ট এলার্ট</Label>
                    <p className="text-sm text-muted-foreground">পেমেন্ট সম্পন্ন হলে জানান</p>
                  </div>
                  <Switch
                    id="paymentAlerts"
                    checked={notificationSettings.paymentAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, paymentAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lowStockAlerts">কম স্টক এলার্ট</Label>
                    <p className="text-sm text-muted-foreground">টিকেট কম হলে জানান</p>
                  </div>
                  <Switch
                    id="lowStockAlerts"
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, lowStockAlerts: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">নিরাপত্তা সেটিংস</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">পাসওয়ার্ড মেয়াদ (দিন)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      passwordExpiry: parseInt(e.target.value) || 90 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">সেশন টাইমআউট (মিনিট)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ 
                      ...prev, 
                      sessionTimeout: parseInt(e.target.value) || 30 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts">সর্বোচ্চ লগইন চেষ্টা</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => setSecuritySettings(prev => ({ 
                    ...prev, 
                    loginAttempts: parseInt(e.target.value) || 5 
                  }))}
                  className="max-w-32"
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactorAuth">টু-ফ্যাক্টর অথেনটিকেশন</Label>
                  <p className="text-sm text-muted-foreground">অতিরিক্ত নিরাপত্তার জন্য 2FA চালু করুন</p>
                </div>
                <Switch
                  id="twoFactorAuth"
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, twoFactorAuth: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="ipRestriction">IP ঠিকানা সীমাবদ্ধতা</Label>
                  <p className="text-sm text-muted-foreground">নির্দিষ্ট IP থেকে লগইন সীমিত করুন</p>
                </div>
                <Switch
                  id="ipRestriction"
                  checked={securitySettings.ipRestriction}
                  onCheckedChange={(checked) => 
                    setSecuritySettings(prev => ({ ...prev, ipRestriction: checked }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Appearance Settings */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">চেহারা ও থিম</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">ভাষা</Label>
                  <select 
                    id="language"
                    value={companySettings.language}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="bn">বাংলা</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">তারিখ ফরম্যাট</Label>
                  <select 
                    id="dateFormat"
                    value={companySettings.dateFormat}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">টাইমজোন</Label>
                <select 
                  id="timezone"
                  value={companySettings.timezone}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Asia/Dhaka">Asia/Dhaka (+06:00)</option>
                  <option value="UTC">UTC (+00:00)</option>
                  <option value="Asia/Kolkata">Asia/Kolkata (+05:30)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 pt-6 border-t">
          <Button onClick={saveSettings} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            সংরক্ষণ করুন
          </Button>
          
          <Button onClick={exportSettings} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            সেটিংস এক্সপোর্ট
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            সেটিংস ইমপোর্ট
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};