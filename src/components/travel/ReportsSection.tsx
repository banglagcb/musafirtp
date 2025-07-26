import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Calendar, Download, DollarSign } from 'lucide-react';

interface Booking {
  id: string;
  customerName: string;
  flightDate: string;
  route: string;
  airline: string;
  purchasePrice: string;
  sellingPrice: string;
  paymentStatus: string;
  createdAt: string;
  profit: number;
}

interface ReportData {
  totalBookings: number;
  totalRevenue: number;
  totalProfit: number;
  paidBookings: number;
  pendingPayments: number;
  averageProfit: number;
}

export const ReportsSection = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState<ReportData>({
    totalBookings: 0,
    totalRevenue: 0,
    totalProfit: 0,
    paidBookings: 0,
    pendingPayments: 0,
    averageProfit: 0
  });

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    generateReport();
  }, [bookings, reportType, selectedDate, selectedMonth]);

  const loadBookings = () => {
    const savedBookings = JSON.parse(localStorage.getItem('travel_bookings') || '[]');
    setBookings(savedBookings);
  };

  const generateReport = () => {
    let filteredBookings = [...bookings];

    // Filter by date range
    if (reportType === 'daily') {
      filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt).toISOString().split('T')[0];
        return bookingDate === selectedDate;
      });
    } else if (reportType === 'monthly') {
      filteredBookings = bookings.filter(booking => {
        const bookingMonth = new Date(booking.createdAt).toISOString().slice(0, 7);
        return bookingMonth === selectedMonth;
      });
    }

    // Calculate report data
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + parseFloat(booking.sellingPrice || '0'), 0);
    const totalProfit = filteredBookings.reduce((sum, booking) => sum + booking.profit, 0);
    const paidBookings = filteredBookings.filter(booking => booking.paymentStatus === 'paid').length;
    const pendingPayments = filteredBookings.filter(booking => booking.paymentStatus === 'pending').length;
    const averageProfit = totalBookings > 0 ? totalProfit / totalBookings : 0;

    setReportData({
      totalBookings,
      totalRevenue,
      totalProfit,
      paidBookings,
      pendingPayments,
      averageProfit
    });
  };

  const exportToCSV = () => {
    let filteredBookings = [...bookings];

    if (reportType === 'daily') {
      filteredBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.createdAt).toISOString().split('T')[0];
        return bookingDate === selectedDate;
      });
    } else if (reportType === 'monthly') {
      filteredBookings = bookings.filter(booking => {
        const bookingMonth = new Date(booking.createdAt).toISOString().slice(0, 7);
        return bookingMonth === selectedMonth;
      });
    }

    // Create CSV content
    const headers = ['গ্রাহকের নাম', 'ফ্লাইট তারিখ', 'রুট', 'এয়ারলাইন', 'ক্রয়মূল্য', 'বিক্রয়মূল্য', 'মুনাফা', 'পেমেন্ট স্ট্যাটাস', 'বুকিং তারিখ'];
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => [
        booking.customerName,
        booking.flightDate,
        booking.route,
        booking.airline,
        booking.purchasePrice,
        booking.sellingPrice,
        booking.profit,
        booking.paymentStatus,
        new Date(booking.createdAt).toLocaleDateString('bn-BD')
      ].join(','))
    ].join('\n');

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `travel_report_${reportType}_${selectedDate || selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('bn-BD')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">রিপোর্ট ও বিশ্লেষণ</CardTitle>
              <CardDescription>বিক্রয় ও মুনাফার বিস্তারিত রিপোর্ট</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Report Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="রিপোর্ট টাইপ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">দৈনিক রিপোর্ট</SelectItem>
                <SelectItem value="monthly">মাসিক রিপোর্ট</SelectItem>
                <SelectItem value="all">সব সময়ের রিপোর্ট</SelectItem>
              </SelectContent>
            </Select>

            {reportType === 'daily' && (
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {reportType === 'monthly' && (
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            <Button 
              onClick={exportToCSV}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV এক্সপোর্ট
            </Button>
          </div>

          {/* Report Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">মোট বুকিং</p>
                    <p className="text-3xl font-bold text-blue-700">{reportData.totalBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">মোট বিক্রয়</p>
                    <p className="text-3xl font-bold text-green-700">{formatCurrency(reportData.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">মোট মুনাফা</p>
                    <p className="text-3xl font-bold text-yellow-700">{formatCurrency(reportData.totalProfit)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">পেইড বুকিং</p>
                    <p className="text-3xl font-bold text-purple-700">{reportData.paidBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">অপেক্ষমাণ পেমেন্ট</p>
                    <p className="text-3xl font-bold text-red-700">{reportData.pendingPayments}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">গড় মুনাফা</p>
                    <p className="text-3xl font-bold text-indigo-700">{formatCurrency(reportData.averageProfit)}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">পেমেন্ট স্ট্যাটাস বিভাজন</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">সম্পূর্ণ পেমেন্ট</span>
                    <span className="font-medium text-green-600">{reportData.paidBookings}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">অপেক্ষমাণ পেমেন্ট</span>
                    <span className="font-medium text-red-600">{reportData.pendingPayments}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">আংশিক পেমেন্ট</span>
                    <span className="font-medium text-yellow-600">
                      {reportData.totalBookings - reportData.paidBookings - reportData.pendingPayments}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">মুনাফা বিশ্লেষণ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">মোট বিক্রয়</span>
                    <span className="font-medium">{formatCurrency(reportData.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">মোট মুনাফা</span>
                    <span className="font-medium text-green-600">{formatCurrency(reportData.totalProfit)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">মুনাফার হার</span>
                    <span className="font-medium text-blue-600">
                      {reportData.totalRevenue > 0 
                        ? `${((reportData.totalProfit / reportData.totalRevenue) * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};