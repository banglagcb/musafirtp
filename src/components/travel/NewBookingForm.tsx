import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Plane, User, Phone, Mail, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingData {
  customerName: string;
  mobile: string;
  passport: string;
  email: string;
  flightDate: string;
  route: string;
  airline: string;
  purchasePrice: string;
  sellingPrice: string;
  paymentStatus: string;
}

interface NewBookingFormProps {
  onClose: () => void;
}

export const NewBookingForm = ({ onClose }: NewBookingFormProps) => {
  const [bookingData, setBookingData] = useState<BookingData>({
    customerName: '',
    mobile: '',
    passport: '',
    email: '',
    flightDate: '',
    route: '',
    airline: '',
    purchasePrice: '',
    sellingPrice: '',
    paymentStatus: 'pending'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const airlines = [
    'বিমান বাংলাদেশ',
    'US-Bangla Airlines',
    'Novoair',
    'Emirates',
    'Qatar Airways',
    'Singapore Airlines',
    'Thai Airways',
    'Malaysia Airlines'
  ];

  const routes = [
    'ঢাকা - দুবাই',
    'ঢাকা - দোহা',
    'ঢাকা - সিঙ্গাপুর',
    'ঢাকা - কুয়ালালামপুর',
    'ঢাকা - ব্যাংকক',
    'ঢাকা - মুম্বাই',
    'ঢাকা - দিল্লি',
    'ঢাকা - কলকাতা'
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!bookingData.customerName || !bookingData.mobile || !bookingData.flightDate) {
      toast({
        title: "ত্রুটি",
        description: "প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      const existingBookings = JSON.parse(localStorage.getItem('travel_bookings') || '[]');
      const newBooking = {
        ...bookingData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        profit: (parseFloat(bookingData.sellingPrice) - parseFloat(bookingData.purchasePrice)) || 0
      };
      
      existingBookings.push(newBooking);
      localStorage.setItem('travel_bookings', JSON.stringify(existingBookings));
      
      setIsLoading(false);
      toast({
        title: "সফল!",
        description: "নতুন বুকিং যোগ করা হয়েছে",
        variant: "default",
      });
      
      onClose();
    }, 1500);
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">নতুন বুকিং</CardTitle>
              <CardDescription>নতুন ফ্লাইট বুকিং যোগ করুন</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">গ্রাহকের নাম *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customerName"
                    placeholder="গ্রাহকের পূর্ণ নাম"
                    value={bookingData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">মোবাইল নম্বর *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mobile"
                    placeholder="01XXXXXXXXX"
                    value={bookingData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passport">পাসপোর্ট নম্বর</Label>
                <Input
                  id="passport"
                  placeholder="A12345678"
                  value={bookingData.passport}
                  onChange={(e) => handleInputChange('passport', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">ইমেইল</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="customer@email.com"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Flight Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flightDate">ফ্লাইট তারিখ *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="flightDate"
                    type="date"
                    value={bookingData.flightDate}
                    onChange={(e) => handleInputChange('flightDate', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route">রুট</Label>
                <Select onValueChange={(value) => handleInputChange('route', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="রুট নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route) => (
                      <SelectItem key={route} value={route}>
                        {route}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="airline">এয়ারলাইন</Label>
                <Select onValueChange={(value) => handleInputChange('airline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="এয়ারলাইন নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {airlines.map((airline) => (
                      <SelectItem key={airline} value={airline}>
                        {airline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentStatus">পেমেন্ট স্ট্যাটাস</Label>
                <Select 
                  value={bookingData.paymentStatus}
                  onValueChange={(value) => handleInputChange('paymentStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
                    <SelectItem value="partial">আংশিক পেমেন্ট</SelectItem>
                    <SelectItem value="paid">সম্পূর্ণ পেমেন্ট</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchasePrice">ক্রয়মূল্য (টাকা)</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="0"
                    value={bookingData.purchasePrice}
                    onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sellingPrice">বিক্রয়মূল্য (টাকা)</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="sellingPrice"
                    type="number"
                    placeholder="0"
                    value={bookingData.sellingPrice}
                    onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Profit Display */}
            {bookingData.purchasePrice && bookingData.sellingPrice && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">মুনাফা:</span>
                  <span className={`font-bold ${
                    (parseFloat(bookingData.sellingPrice) - parseFloat(bookingData.purchasePrice)) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    ৳{(parseFloat(bookingData.sellingPrice) - parseFloat(bookingData.purchasePrice)) || 0}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    সেভ করা হচ্ছে...
                  </div>
                ) : (
                  'বুকিং সেভ করুন'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isLoading}
              >
                বাতিল
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};