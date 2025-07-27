import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Lock, Unlock, Edit, Trash2, Search, Package } from 'lucide-react';
import { TicketPurchase } from './TicketPurchaseForm';

export const PurchasedTicketsList = () => {
  const [tickets, setTickets] = useState<TicketPurchase[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketPurchase[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchTerm, statusFilter]);

  const loadTickets = () => {
    try {
      const savedTickets = localStorage.getItem('purchasedTickets');
      if (savedTickets) {
        const parsedTickets = JSON.parse(savedTickets);
        setTickets(parsedTickets);
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  };

  const toggleTicketLock = (ticketId: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newStatus: 'available' | 'sold' | 'locked' = ticket.status === 'locked' ? 'available' : 'locked';
        return { ...ticket, status: newStatus };
      }
      return ticket;
    });

    setTickets(updatedTickets);
    localStorage.setItem('purchasedTickets', JSON.stringify(updatedTickets));

    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      toast({
        title: ticket.status === 'locked' ? "টিকেট আনলক করা হয়েছে" : "টিকেট লক করা হয়েছে",
        description: `PNR: ${ticket.pnr}`,
        variant: "default",
      });
    }
  };

  const deleteTicket = (ticketId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই টিকেটটি মুছে ফেলতে চান?')) {
      const updatedTickets = tickets.filter(ticket => ticket.id !== ticketId);
      setTickets(updatedTickets);
      localStorage.setItem('purchasedTickets', JSON.stringify(updatedTickets));

      toast({
        title: "টিকেট মুছে ফেলা হয়েছে",
        variant: "default",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">উপলব্ধ</Badge>;
      case 'sold':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">বিক্রিত</Badge>;
      case 'locked':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">লক</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">ক্রয়কৃত টিকেট তালিকা</CardTitle>
            <CardDescription>সমস্ত ক্রয়কৃত টিকেটের তালিকা ও ব্যবস্থাপনা</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="PNR, এয়ারলাইন, রুট বা সরবরাহকারী খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="স্ট্যাটাস ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল টিকেট</SelectItem>
              <SelectItem value="available">উপলব্ধ</SelectItem>
              <SelectItem value="sold">বিক্রিত</SelectItem>
              <SelectItem value="locked">লক</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">মোট টিকেট</div>
            <div className="text-2xl font-bold text-primary">{tickets.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">উপলব্ধ</div>
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'available').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">বিক্রিত</div>
            <div className="text-2xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'sold').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">মোট বিনিয়োগ</div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(tickets.reduce((sum, ticket) => sum + ticket.totalCost, 0))}
            </div>
          </Card>
        </div>

        {/* Tickets Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">PNR</th>
                  <th className="text-left p-4 font-medium">এয়ারলাইন</th>
                  <th className="text-left p-4 font-medium">রুট</th>
                  <th className="text-left p-4 font-medium">ফ্লাইটের তারিখ</th>
                  <th className="text-left p-4 font-medium">যাত্রী</th>
                  <th className="text-left p-4 font-medium">ক্রয়মূল্য</th>
                  <th className="text-left p-4 font-medium">মোট খরচ</th>
                  <th className="text-left p-4 font-medium">সরবরাহকারী</th>
                  <th className="text-left p-4 font-medium">স্ট্যাটাস</th>
                  <th className="text-left p-4 font-medium">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="border-t hover:bg-muted/50">
                    <td className="p-4 font-mono text-sm">{ticket.pnr}</td>
                    <td className="p-4">{ticket.airline}</td>
                    <td className="p-4">{ticket.route}</td>
                    <td className="p-4">{formatDate(ticket.flightDate)}</td>
                    <td className="p-4">{ticket.passengers}</td>
                    <td className="p-4 font-semibold">{formatCurrency(ticket.purchasePrice)}</td>
                    <td className="p-4 font-semibold text-primary">{formatCurrency(ticket.totalCost)}</td>
                    <td className="p-4">{ticket.supplier}</td>
                    <td className="p-4">{getStatusBadge(ticket.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleTicketLock(ticket.id)}
                          className="h-8 w-8 p-0"
                          title={ticket.status === 'locked' ? 'আনলক করুন' : 'লক করুন'}
                        >
                          {ticket.status === 'locked' ? (
                            <Unlock className="h-3 w-3" />
                          ) : (
                            <Lock className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="সম্পাদনা"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteTicket(ticket.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTickets.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              কোনো টিকেট পাওয়া যায়নি
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};