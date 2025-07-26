import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plane, Search, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
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
  createdAt: string;
  profit: number;
}

export const BookingsList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const loadBookings = () => {
    const savedBookings = JSON.parse(localStorage.getItem('travel_bookings') || '[]');
    setBookings(savedBookings);
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.mobile.includes(searchTerm) ||
        booking.passport.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.paymentStatus === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(booking => booking.flightDate === dateFilter);
    }

    setFilteredBookings(filtered);
  };

  const deleteBooking = (id: string) => {
    const updatedBookings = bookings.filter(booking => booking.id !== id);
    setBookings(updatedBookings);
    localStorage.setItem('travel_bookings', JSON.stringify(updatedBookings));
    toast({
      title: "সফল!",
      description: "বুকিং ডিলিট করা হয়েছে",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">সম্পূর্ণ পেমেন্ট</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500 text-white">আংশিক পেমেন্ট</Badge>;
      case 'pending':
        return <Badge className="bg-red-500 text-white">অপেক্ষমাণ</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  const formatCurrency = (amount: string | number) => {
    return `৳${Number(amount).toLocaleString('bn-BD')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">বুকিং তালিকা</CardTitle>
              <CardDescription>সকল ফ্লাইট বুকিং দেখুন ও পরিচালনা করুন</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="গ্রাহক খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="পেমেন্ট স্ট্যাটাস" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব স্ট্যাটাস</SelectItem>
                <SelectItem value="pending">অপেক্ষমাণ</SelectItem>
                <SelectItem value="partial">আংশিক পেমেন্ট</SelectItem>
                <SelectItem value="paid">সম্পূর্ণ পেমেন্ট</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="তারিখ ফিল্টার"
            />

            <div className="text-sm text-muted-foreground flex items-center">
              মোট বুকিং: <span className="ml-1 font-semibold">{filteredBookings.length}</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredBookings.length}
                  </div>
                  <div className="text-sm text-blue-600">মোট বুকিং</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-green-50/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredBookings.filter(b => b.paymentStatus === 'paid').length}
                  </div>
                  <div className="text-sm text-green-600">পেইড বুকিং</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-yellow-200 bg-yellow-50/50">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {formatCurrency(filteredBookings.reduce((sum, booking) => sum + booking.profit, 0))}
                  </div>
                  <div className="text-sm text-yellow-600">মোট মুনাফা</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>গ্রাহক</TableHead>
                  <TableHead>যোগাযোগ</TableHead>
                  <TableHead>ফ্লাইট তথ্য</TableHead>
                  <TableHead>মূল্য</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                  <TableHead>মুনাফা</TableHead>
                  <TableHead>অ্যাকশন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      কোনো বুকিং পাওয়া যায়নি
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customerName}</div>
                          {booking.passport && (
                            <div className="text-sm text-muted-foreground">
                              পাসপোর্ট: {booking.passport}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="w-3 h-3" />
                            {booking.mobile}
                          </div>
                          {booking.email && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {booking.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.route}</div>
                          <div className="text-sm text-muted-foreground">{booking.airline}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(booking.flightDate)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            ক্রয়: {formatCurrency(booking.purchasePrice)}
                          </div>
                          <div className="text-sm">
                            বিক্রয়: {formatCurrency(booking.sellingPrice)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(booking.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <span className={`font-medium ${
                          booking.profit >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatCurrency(booking.profit)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => deleteBooking(booking.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};