import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Save } from 'lucide-react';

export interface TicketPurchase {
  id: string;
  pnr: string;
  airline: string;
  route: string;
  flightDate: string;
  passengers: number;
  purchasePrice: number;
  tax: number;
  totalCost: number;
  supplier: string;
  supplierContact: string;
  notes?: string;
  status: 'available' | 'sold' | 'locked';
  purchaseDate: Date;
  purchasedBy: string;
}

interface TicketPurchaseFormProps {
  onClose: () => void;
}

export const TicketPurchaseForm = ({ onClose }: TicketPurchaseFormProps) => {
  const [purchaseData, setPurchaseData] = useState({
    pnr: '',
    airline: '',
    route: '',
    flightDate: '',
    passengers: 1,
    purchasePrice: '',
    tax: '',
    supplier: '',
    supplierContact: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const airlines = [
    'বিমান বাংলাদেশ এয়ারলাইন্স',
    'নোভোএয়ার',
    'ইউএস বাংলা এয়ারলাইন্স',
    'এমিরেটস',
    'কাতার এয়ারওয়েজ',
    'সিঙ্গাপুর এয়ারলাইন্স',
    'থাই এয়ারওয়েজ',
    'মালয়েশিয়া এয়ারলাইন্স',
    'এয়ার এশিয়া',
    'অন্যান্য'
  ];

  const routes = [
    'ঢাকা - চট্টগ্রাম',
    'ঢাকা - সিলেট',
    'ঢাকা - রাজশাহী',
    'ঢাকা - যশোর',
    'ঢাকা - দুবাই',
    'ঢাকা - দোহা',
    'ঢাকা - কুয়ালালামপুর',
    'ঢাকা - সিঙ্গাপুর',
    'ঢাকা - ব্যাংকক',
    'ঢাকা - কলকাতা',
    'ঢাকা - দিল্লি',
    'ঢাকা - মুম্বাই',
    'অন্যান্য'
  ];

  const handleInputChange = (field: string, value: string | number) => {
    setPurchaseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalCost = () => {
    const price = parseFloat(purchaseData.purchasePrice) || 0;
    const tax = parseFloat(purchaseData.tax) || 0;
    return price + tax;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!purchaseData.pnr || !purchaseData.airline || !purchaseData.route || 
        !purchaseData.flightDate || !purchaseData.purchasePrice || !purchaseData.supplier) {
      toast({
        title: "ত্রুটি",
        description: "সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const totalCost = calculateTotalCost();
      
      const newTicket: TicketPurchase = {
        id: `ticket_${Date.now()}`,
        pnr: purchaseData.pnr,
        airline: purchaseData.airline,
        route: purchaseData.route,
        flightDate: purchaseData.flightDate,
        passengers: purchaseData.passengers,
        purchasePrice: parseFloat(purchaseData.purchasePrice),
        tax: parseFloat(purchaseData.tax) || 0,
        totalCost,
        supplier: purchaseData.supplier,
        supplierContact: purchaseData.supplierContact,
        notes: purchaseData.notes,
        status: 'available',
        purchaseDate: new Date(),
        purchasedBy: 'Admin' // In real app, get from auth context
      };

      // Save to localStorage (in real app, this would be API call)
      const existingTickets = JSON.parse(localStorage.getItem('purchasedTickets') || '[]');
      existingTickets.push(newTicket);
      localStorage.setItem('purchasedTickets', JSON.stringify(existingTickets));

      toast({
        title: "সফল!",
        description: `টিকেট সফলভাবে ক্রয় করা হয়েছে (PNR: ${newTicket.pnr})`,
        variant: "default",
      });

      onClose();
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "টিকেট ক্রয় করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">নতুন টিকেট ক্রয়</CardTitle>
            <CardDescription>সরবরাহকারীর কাছ থেকে টিকেট ক্রয় করুন</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pnr">PNR নম্বর *</Label>
              <Input
                id="pnr"
                placeholder="PNR নম্বর লিখুন"
                value={purchaseData.pnr}
                onChange={(e) => handleInputChange('pnr', e.target.value)}
                className="uppercase"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="airline">এয়ারলাইন *</Label>
              <Select value={purchaseData.airline} onValueChange={(value) => handleInputChange('airline', value)}>
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
              <Label htmlFor="route">রুট *</Label>
              <Select value={purchaseData.route} onValueChange={(value) => handleInputChange('route', value)}>
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
              <Label htmlFor="flightDate">ফ্লাইটের তারিখ *</Label>
              <Input
                id="flightDate"
                type="date"
                value={purchaseData.flightDate}
                onChange={(e) => handleInputChange('flightDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengers">যাত্রী সংখ্যা</Label>
              <Input
                id="passengers"
                type="number"
                min="1"
                value={purchaseData.passengers}
                onChange={(e) => handleInputChange('passengers', parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">ক্রয়মূল্য (টাকা) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                placeholder="0"
                value={purchaseData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax">ট্যাক্স/ফি (টাকা)</Label>
              <Input
                id="tax"
                type="number"
                placeholder="0"
                value={purchaseData.tax}
                onChange={(e) => handleInputChange('tax', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>মোট খরচ</Label>
              <div className="text-lg font-semibold text-primary bg-muted p-3 rounded-md">
                ৳{calculateTotalCost().toLocaleString()}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">সরবরাহকারী *</Label>
              <Input
                id="supplier"
                placeholder="সরবরাহকারীর নাম"
                value={purchaseData.supplier}
                onChange={(e) => handleInputChange('supplier', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplierContact">সরবরাহকারীর যোগাযোগ</Label>
              <Input
                id="supplierContact"
                placeholder="মোবাইল/ইমেইল"
                value={purchaseData.supplierContact}
                onChange={(e) => handleInputChange('supplierContact', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">অতিরিক্ত নোট</Label>
            <Textarea
              id="notes"
              placeholder="কোনো বিশেষ তথ্য বা নোট..."
              value={purchaseData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                  প্রক্রিয়াধীন...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  টিকেট ক্রয় করুন
                </div>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              বাতিল
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};