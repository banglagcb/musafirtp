import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays, TrendingUp, Users, DollarSign, Plane, Target, Download, BarChart3, Calendar } from 'lucide-react';

// Define interfaces for our data structures
interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  passportNumber: string;
  airline: string;
  flightNumber: string;
  route: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  ticketType: string;
  sellingPrice: string;
  paymentStatus: 'Paid' | 'Unpaid' | 'Partial';
  profit: string;
  manager: string;
  pnr: string;
  createdAt: string;
}

interface PurchasedTicket {
  id: string;
  pnr: string;
  airline: string;
  route: string;
  departureDate: string;
  departureTime: string;
  purchasePrice: string;
  tax: string;
  supplier: string;
  status: 'Available' | 'Sold' | 'Locked';
  createdAt: string;
}

interface ReportData {
  totalBookings: number;
  totalRevenue: number;
  totalProfit: number;
  paidBookings: number;
  unpaidBookings: number;
  partialBookings: number;
  averageProfit: number;
  totalPurchaseCost: number;
  profitMargin: number;
}

interface ManagerPerformance {
  manager: string;
  bookings: number;
  revenue: number;
  profit: number;
  averageTicketValue: number;
}

interface AirlineReport {
  airline: string;
  bookings: number;
  revenue: number;
  profit: number;
  profitMargin: number;
}

const chartConfig = {
  revenue: {
    label: "বিক্রয়",
    color: "hsl(var(--chart-1))",
  },
  profit: {
    label: "মুনাফা",
    color: "hsl(var(--chart-2))",
  },
  bookings: {
    label: "বুকিং",
    color: "hsl(var(--chart-3))",
  },
};

export const ReportsSection = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<PurchasedTicket[]>([]);
  const [reportType, setReportType] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [reportData, setReportData] = useState<ReportData>({
    totalBookings: 0,
    totalRevenue: 0,
    totalProfit: 0,
    paidBookings: 0,
    unpaidBookings: 0,
    partialBookings: 0,
    averageProfit: 0,
    totalPurchaseCost: 0,
    profitMargin: 0
  });
  const [managerPerformance, setManagerPerformance] = useState<ManagerPerformance[]>([]);
  const [airlineReports, setAirlineReports] = useState<AirlineReport[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    generateReport();
  }, [bookings, purchasedTickets, reportType, selectedDate, selectedMonth, user]);

  const loadData = () => {
    const savedBookings = JSON.parse(localStorage.getItem('travel_bookings') || '[]');
    const savedTickets = JSON.parse(localStorage.getItem('purchased_tickets') || '[]');
    
    // Filter bookings based on user role
    if (user?.role === 'manager') {
      const userBookings = savedBookings.filter((booking: Booking) => booking.manager === user.username);
      setBookings(userBookings);
    } else {
      setBookings(savedBookings);
    }
    
    setPurchasedTickets(savedTickets);
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

    // Calculate basic report data
    const totalBookings = filteredBookings.length;
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + parseFloat(booking.sellingPrice || '0'), 0);
    const totalProfit = user?.role === 'admin' 
      ? filteredBookings.reduce((sum, booking) => sum + parseFloat(booking.profit || '0'), 0)
      : 0;
    const paidBookings = filteredBookings.filter(booking => booking.paymentStatus === 'Paid').length;
    const unpaidBookings = filteredBookings.filter(booking => booking.paymentStatus === 'Unpaid').length;
    const partialBookings = filteredBookings.filter(booking => booking.paymentStatus === 'Partial').length;
    const averageProfit = totalBookings > 0 ? totalProfit / totalBookings : 0;
    
    // Calculate purchase cost only for admin
    const totalPurchaseCost = user?.role === 'admin' 
      ? purchasedTickets.reduce((sum, ticket) => sum + parseFloat(ticket.purchasePrice || '0'), 0)
      : 0;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    setReportData({
      totalBookings,
      totalRevenue,
      totalProfit,
      paidBookings,
      unpaidBookings,
      partialBookings,
      averageProfit,
      totalPurchaseCost,
      profitMargin
    });

    // Generate manager performance report (admin only)
    if (user?.role === 'admin') {
      generateManagerPerformance(filteredBookings);
      generateAirlineReports(filteredBookings);
    }
  };

  const generateManagerPerformance = (filteredBookings: Booking[]) => {
    const managerStats = filteredBookings.reduce((acc, booking) => {
      const manager = booking.manager || 'Unknown';
      if (!acc[manager]) {
        acc[manager] = {
          manager,
          bookings: 0,
          revenue: 0,
          profit: 0,
          averageTicketValue: 0
        };
      }
      acc[manager].bookings += 1;
      acc[manager].revenue += parseFloat(booking.sellingPrice || '0');
      acc[manager].profit += parseFloat(booking.profit || '0');
      return acc;
    }, {} as Record<string, ManagerPerformance>);

    const performanceArray = Object.values(managerStats).map(manager => ({
      ...manager,
      averageTicketValue: manager.bookings > 0 ? manager.revenue / manager.bookings : 0
    }));

    setManagerPerformance(performanceArray.sort((a, b) => b.revenue - a.revenue));
  };

  const generateAirlineReports = (filteredBookings: Booking[]) => {
    const airlineStats = filteredBookings.reduce((acc, booking) => {
      const airline = booking.airline || 'Unknown';
      if (!acc[airline]) {
        acc[airline] = {
          airline,
          bookings: 0,
          revenue: 0,
          profit: 0,
          profitMargin: 0
        };
      }
      acc[airline].bookings += 1;
      acc[airline].revenue += parseFloat(booking.sellingPrice || '0');
      acc[airline].profit += parseFloat(booking.profit || '0');
      return acc;
    }, {} as Record<string, AirlineReport>);

    const airlineArray = Object.values(airlineStats).map(airline => ({
      ...airline,
      profitMargin: airline.revenue > 0 ? (airline.profit / airline.revenue) * 100 : 0
    }));

    setAirlineReports(airlineArray.sort((a, b) => b.revenue - a.revenue));
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

    // Create CSV content based on user role
    const headers = user?.role === 'admin' 
      ? ['গ্রাহকের নাম', 'ফোন', 'এয়ারলাইন', 'রুট', 'ফ্লাইট তারিখ', 'বিক্রয়মূল্য', 'মুনাফা', 'পেমেন্ট স্ট্যাটাস', 'ম্যানেজার', 'বুকিং তারিখ']
      : ['গ্রাহকের নাম', 'ফোন', 'এয়ারলাইন', 'রুট', 'ফ্লাইট তারিখ', 'বিক্রয়মূল্য', 'পেমেন্ট স্ট্যাটাস', 'বুকিং তারিখ'];
    
    const csvContent = [
      headers.join(','),
      ...filteredBookings.map(booking => {
        const baseData = [
          booking.customerName,
          booking.phone,
          booking.airline,
          booking.route,
          booking.departureDate,
          booking.sellingPrice,
        ];
        
        if (user?.role === 'admin') {
          baseData.push(booking.profit, booking.paymentStatus, booking.manager);
        } else {
          baseData.push(booking.paymentStatus);
        }
        
        baseData.push(new Date(booking.createdAt).toLocaleDateString('bn-BD'));
        return baseData.join(',');
      })
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
              <CardDescription>
                {user?.role === 'admin' ? 'সম্পূর্ণ ব্যবসার বিস্তারিত রিপোর্ট ও লাভ-ক্ষতি বিশ্লেষণ' : 'আপনার বিক্রয়ের সারসংক্ষেপ'}
              </CardDescription>
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

            {user?.role === 'admin' && (
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
            )}

            <Card className="border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">পেইড বুকিং</p>
                    <p className="text-3xl font-bold text-purple-700">{reportData.paidBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">অপেক্ষমাণ পেমেন্ট</p>
                    <p className="text-3xl font-bold text-red-700">{reportData.unpaidBookings}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <CalendarDays className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {user?.role === 'admin' && (
              <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50 to-indigo-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">মুনাফার হার</p>
                      <p className="text-3xl font-bold text-indigo-700">{reportData.profitMargin.toFixed(1)}%</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Manager Performance Report (Admin Only) */}
          {user?.role === 'admin' && managerPerformance.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  ম্যানেজার পারফরম্যান্স রিপোর্ট
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ম্যানেজার</TableHead>
                      <TableHead>বুকিং সংখ্যা</TableHead>
                      <TableHead>মোট বিক্রয়</TableHead>
                      <TableHead>মোট মুনাফা</TableHead>
                      <TableHead>গড় টিকেট মূল্য</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {managerPerformance.map((manager, index) => (
                      <TableRow key={manager.manager}>
                        <TableCell className="font-medium">{manager.manager}</TableCell>
                        <TableCell>{manager.bookings}</TableCell>
                        <TableCell>{formatCurrency(manager.revenue)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(manager.profit)}</TableCell>
                        <TableCell>{formatCurrency(manager.averageTicketValue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Airline Reports (Admin Only) */}
          {user?.role === 'admin' && airlineReports.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plane className="w-5 h-5" />
                  এয়ারলাইন ভিত্তিক রিপোর্ট
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>এয়ারলাইন</TableHead>
                      <TableHead>বুকিং সংখ্যা</TableHead>
                      <TableHead>মোট বিক্রয়</TableHead>
                      <TableHead>মোট মুনাফা</TableHead>
                      <TableHead>মুনাফার হার</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {airlineReports.map((airline, index) => (
                      <TableRow key={airline.airline}>
                        <TableCell className="font-medium">{airline.airline}</TableCell>
                        <TableCell>{airline.bookings}</TableCell>
                        <TableCell>{formatCurrency(airline.revenue)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(airline.profit)}</TableCell>
                        <TableCell>
                          <Badge variant={airline.profitMargin > 15 ? "default" : airline.profitMargin > 10 ? "secondary" : "destructive"}>
                            {airline.profitMargin.toFixed(1)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Chart Visualization (Admin Only) */}
          {user?.role === 'admin' && managerPerformance.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">ম্যানেজার পারফরম্যান্স চার্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={managerPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="manager" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" name="বিক্রয়" />
                      <Bar dataKey="profit" fill="var(--color-profit)" name="মুনাফা" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          )}

          {/* Payment Status Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">পেমেন্ট স্ট্যাটাস বিভাজন</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">সম্পূর্ণ পেমেন্ট</span>
                    <Badge variant="default">{reportData.paidBookings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">অপেক্ষমাণ পেমেন্ট</span>
                    <Badge variant="destructive">{reportData.unpaidBookings}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">আংশিক পেমেন্ট</span>
                    <Badge variant="secondary">{reportData.partialBookings}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user?.role === 'admin' && (
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
                      <span className="text-sm">মোট ক্রয়মূল্য</span>
                      <span className="font-medium text-red-600">{formatCurrency(reportData.totalPurchaseCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">নেট মুনাফা</span>
                      <span className="font-medium text-green-600">{formatCurrency(reportData.totalProfit)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">মুনাফার হার</span>
                      <Badge variant={reportData.profitMargin > 15 ? "default" : reportData.profitMargin > 10 ? "secondary" : "destructive"}>
                        {reportData.profitMargin.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};