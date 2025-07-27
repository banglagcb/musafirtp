import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, Save, Calculator, AlertTriangle, Ticket, Info } from 'lucide-react';
import { TicketPurchase } from '../admin/TicketPurchaseForm';

interface EnhancedBookingData {
  customerName: string;
  mobile: string;
  passport: string;
  email: string;
  selectedTicketId: string;
  sellingPrice: string;
  paymentStatus: string;
  paymentAmount: string;
  paymentMethod: string;
  notes: string;
}

interface EnhancedBookingFormProps {
  onClose: () => void;
}

export const EnhancedBookingForm = ({ onClose }: EnhancedBookingFormProps) => {
  const [availableTickets, setAvailableTickets] = useState<TicketPurchase[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketPurchase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TicketPurchase | null>(null);
  const [bookingData, setBookingData] = useState<EnhancedBookingData>({
    customerName: '',
    mobile: '',
    passport: '',
    email: '',
    selectedTicketId: '',
    sellingPrice: '',
    paymentStatus: 'pending',
    paymentAmount: '',
    paymentMethod: 'cash',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, hasPermission } = useAuth();

  useEffect(() => {
    loadAvailableTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [availableTickets, searchTerm]);

  const loadAvailableTickets = () => {
    try {
      const savedTickets = localStorage.getItem('purchasedTickets');
      if (savedTickets) {
        const tickets = JSON.parse(savedTickets);
        // Filter out locked and sold tickets, only show available
        const available = tickets.filter((ticket: TicketPurchase) => 
          ticket.status === 'available'
        );
        setAvailableTickets(available);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const filterTickets = () => {
    if (!searchTerm) {
      setFilteredTickets(availableTickets);
      return;
    }

    const filtered = availableTickets.filter(ticket =>
      ticket.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.route.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTickets(filtered);
  };

  const handleTicketSelect = (ticketId: string) => {
    const ticket = availableTickets.find(t => t.id === ticketId);
    setSelectedTicket(ticket || null);
    setBookingData(prev => ({
      ...prev,
      selectedTicketId: ticketId,
      sellingPrice: ticket ? (ticket.purchasePrice * 1.15).toString() : '' // Suggest 15% markup
    }));
  };

  const handleInputChange = (field: keyof EnhancedBookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const calculateProfit = () => {
    if (!selectedTicket || !bookingData.sellingPrice) return 0;
    return parseFloat(bookingData.sellingPrice) - selectedTicket.purchasePrice;
  };

  const calculateDueAmount = () => {
    const selling = parseFloat(bookingData.sellingPrice) || 0;
    const paid = parseFloat(bookingData.paymentAmount) || 0;
    return selling - paid;
  };

  const getPaymentStatusFromAmount = () => {
    const selling = parseFloat(bookingData.sellingPrice) || 0;
    const paid = parseFloat(bookingData.paymentAmount) || 0;
    
    if (paid === 0) return 'pending';
    if (paid >= selling) return 'paid';
    return 'partial';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.customerName || !bookingData.mobile || !bookingData.selectedTicketId || !bookingData.sellingPrice) {
      toast({
        title: "ত্রুটি",
        description: "সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTicket) {
      toast({
        title: "ত্রুটি",
        description: "কোনো টিকেট নির্বাচিত নয়",
        variant: "destructive",
      });
      return;
    }

    // Check if selling price is lower than purchase price
    const profit = calculateProfit();
    if (profit < 0) {
      const confirm = window.confirm(
        `সতর্কতা: এই বিক্রয়ে ${Math.abs(profit).toLocaleString()} টাকা ক্ষতি হবে। আপনি কি নিশ্চিত?`
      );
      if (!confirm) return;
    }

    setIsLoading(true);

    try {
      const actualPaymentStatus = getPaymentStatusFromAmount();
      
      const newBooking = {
        id: `booking_${Date.now()}`,
        ...bookingData,
        paymentStatus: actualPaymentStatus,
        ticketInfo: selectedTicket,
        profit,
        dueAmount: calculateDueAmount(),
        createdAt: new Date().toISOString(),
        createdBy: user?.username || 'unknown',
        lastUpdated: new Date().toISOString()
      };

      // Save booking
      const existingBookings = JSON.parse(localStorage.getItem('travel_bookings') || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem('travel_bookings', JSON.stringify(existingBookings));

      // Update ticket status to sold
      const savedTickets = JSON.parse(localStorage.getItem('purchasedTickets') || '[]');
      const updatedTickets = savedTickets.map((ticket: TicketPurchase) => 
        ticket.id === selectedTicket.id 
          ? { ...ticket, status: 'sold' as const, soldTo: bookingData.customerName, soldDate: new Date().toISOString() }
          : ticket
      );
      localStorage.setItem('purchasedTickets', JSON.stringify(updatedTickets));

      toast({
        title: "সফল!",
        description: `বুকিং সফলভাবে তৈরি হয়েছে (PNR: ${selectedTicket.pnr})`,
        variant: "default",
      });

      onClose();
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "বুকিং তৈরি করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">নতুন বুকিং (উন্নত)</CardTitle>
              <CardDescription>উপলব্ধ টিকেট থেকে নতুন বুকিং তৈরি করুন</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Available Tickets Selection */}
            <div className="space-y-3">
              <Label>উপলব্ধ টিকেট নির্বাচন করুন *</Label>
              
              {/* Search Filter */}
              <div className="relative">
                <Input
                  placeholder="PNR, এয়ারলাইন বা রুট দিয়ে খুঁজুন..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute left-3 top-3 text-muted-foreground">
                  🔍
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    কোনো উপলব্ধ টিকেট নেই। প্রথমে অ্যাডমিন প্যানেল থেকে টিকেট ক্রয় করুন।
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-3">
                  {filteredTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTicket?.id === ticket.id 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-muted hover:border-muted-foreground/50 hover:bg-muted/50'
                      }`}
                      onClick={() => handleTicketSelect(ticket.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-primary" />
                            <span className="font-mono text-sm font-semibold">{ticket.pnr}</span>
                            <Badge variant="outline" className="text-xs">{ticket.airline}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{ticket.route}</p>
                          <p className="text-xs text-muted-foreground">
                            তারিখ: {new Date(ticket.flightDate).toLocaleDateString('bn-BD')} | 
                            যাত্রী: {ticket.passengers}
                          </p>
                        </div>
                        <div className="text-right">
                          {hasPermission('view_purchase_price') ? (
                            <div className="text-sm">
                              <div className="text-muted-foreground">ক্রয়মূল্য:</div>
                              <div className="font-semibold">{formatCurrency(ticket.purchasePrice)}</div>
                            </div>
                          ) : (
                            <div className="text-sm">
                              <div className="text-muted-foreground">ন্যূনতম মূল্য:</div>
                              <div className="font-semibold blur-sm select-none">
                                {formatCurrency(ticket.purchasePrice)}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTicket && (
              <>
                {/* Customer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <Label className="text-base font-medium">গ্রাহকের তথ্য</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">গ্রাহকের নাম *</Label>
                      <Input
                        id="customerName"
                        placeholder="গ্রাহকের পূর্ণ নাম"
                        value={bookingData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">মোবাইল নম্বর *</Label>
                      <Input
                        id="mobile"
                        placeholder="01XXXXXXXXX"
                        value={bookingData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        required
                      />
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
                      <Input
                        id="email"
                        type="email"
                        placeholder="customer@email.com"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-primary" />
                    <Label className="text-base font-medium">মূল্য ও পেমেন্ট</Label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">বিক্রয়মূল্য (টাকা) *</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        placeholder="0"
                        value={bookingData.sellingPrice}
                        onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">প্রাপ্ত অর্থ (টাকা)</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        placeholder="0"
                        value={bookingData.paymentAmount}
                        onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">পেমেন্ট পদ্ধতি</Label>
                      <Select 
                        value={bookingData.paymentMethod}
                        onValueChange={(value) => handleInputChange('paymentMethod', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">নগদ</SelectItem>
                          <SelectItem value="bkash">বিকাশ</SelectItem>
                          <SelectItem value="nagad">নগদ</SelectItem>
                          <SelectItem value="rocket">রকেট</SelectItem>
                          <SelectItem value="bank">ব্যাংক ট্রান্সফার</SelectItem>
                          <SelectItem value="card">কার্ড</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>পেমেন্ট স্ট্যাটাস</Label>
                      <div className="p-3 bg-muted rounded-md">
                        <Badge variant={
                          getPaymentStatusFromAmount() === 'paid' ? 'default' :
                          getPaymentStatusFromAmount() === 'partial' ? 'secondary' : 'outline'
                        }>
                          {getPaymentStatusFromAmount() === 'paid' ? 'সম্পূর্ণ পেমেন্ট' :
                           getPaymentStatusFromAmount() === 'partial' ? 'আংশিক পেমেন্ট' : 'অপেক্ষমাণ'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                {bookingData.sellingPrice && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg border">
                    <h4 className="font-medium mb-3">আর্থিক সারসংক্ষেপ</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">বিক্রয়মূল্য</div>
                        <div className="font-semibold text-blue-600">
                          {formatCurrency(parseFloat(bookingData.sellingPrice) || 0)}
                        </div>
                      </div>
                      {hasPermission('view_profit') && (
                        <div>
                          <div className="text-muted-foreground">মুনাফা</div>
                          <div className={`font-semibold ${calculateProfit() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(calculateProfit())}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground">প্রাপ্ত</div>
                        <div className="font-semibold text-emerald-600">
                          {formatCurrency(parseFloat(bookingData.paymentAmount) || 0)}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">বকেয়া</div>
                        <div className="font-semibold text-orange-600">
                          {formatCurrency(calculateDueAmount())}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">অতিরিক্ত নোট</Label>
                  <Input
                    id="notes"
                    placeholder="কোনো বিশেষ তথ্য..."
                    value={bookingData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
                disabled={isLoading || !selectedTicket}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    বুকিং তৈরি হচ্ছে...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    বুকিং তৈরি করুন
                  </div>
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