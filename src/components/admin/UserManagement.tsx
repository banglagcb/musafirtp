import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Key, 
  Shield, 
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock
} from 'lucide-react';
import { User, UserRole } from '@/contexts/AuthContext';

interface NewUser {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    password: '',
    role: 'manager',
    name: '',
    email: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const savedUsers = localStorage.getItem('systemUsers');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        // Load default users
        const defaultUsers: User[] = [
          {
            id: '1',
            username: 'admin',
            role: 'admin',
            name: 'সিস্টেম অ্যাডমিন',
            email: 'admin@travelagency.com',
            createdAt: new Date(),
            lastLogin: new Date(),
            isActive: true
          },
          {
            id: '2',
            username: 'manager1',
            role: 'manager',
            name: 'ম্যানেজার ওয়ান',
            email: 'manager1@travelagency.com',
            createdAt: new Date(),
            lastLogin: new Date(),
            isActive: true
          }
        ];
        setUsers(defaultUsers);
        localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const createUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name) {
      toast({
        title: "ত্রুটি",
        description: "সকল প্রয়োজনীয় ফিল্ড পূরণ করুন।",
        variant: "destructive",
      });
      return;
    }

    // Check if username already exists
    if (users.some(user => user.username === newUser.username)) {
      toast({
        title: "ত্রুটি",
        description: "এই ইউজারনেম ইতিমধ্যে ব্যবহৃত হয়েছে।",
        variant: "destructive",
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username,
      role: newUser.role,
      name: newUser.name,
      email: newUser.email,
      createdAt: new Date(),
      isActive: true
    };

    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));

    // Store password separately (in real app, this would be hashed)
    const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
    passwords[newUser.username] = newUser.password;
    localStorage.setItem('userPasswords', JSON.stringify(passwords));

    setNewUser({
      username: '',
      password: '',
      role: 'manager',
      name: '',
      email: ''
    });
    setIsCreateDialogOpen(false);

    toast({
      title: "সফল",
      description: "নতুন ব্যবহারকারী তৈরি হয়েছে।",
      variant: "default",
    });
  };

  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));

    const user = users.find(u => u.id === userId);
    toast({
      title: user?.isActive ? "ব্যবহারকারী নিষ্ক্রিয় করা হয়েছে" : "ব্যবহারকারী সক্রিয় করা হয়েছে",
      description: `${user?.name}`,
      variant: "default",
    });
  };

  const deleteUser = (userId: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে মুছে ফেলতে চান?')) {
      const userToDelete = users.find(u => u.id === userId);
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('systemUsers', JSON.stringify(updatedUsers));

      // Remove password
      if (userToDelete) {
        const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
        delete passwords[userToDelete.username];
        localStorage.setItem('userPasswords', JSON.stringify(passwords));
      }

      toast({
        title: "ব্যবহারকারী মুছে ফেলা হয়েছে",
        variant: "default",
      });
    }
  };

  const resetPassword = (username: string) => {
    const newPassword = prompt('নতুন পাসওয়ার্ড দিন:');
    if (newPassword) {
      const passwords = JSON.parse(localStorage.getItem('userPasswords') || '{}');
      passwords[username] = newPassword;
      localStorage.setItem('userPasswords', JSON.stringify(passwords));

      toast({
        title: "পাসওয়ার্ড রিসেট সফল",
        description: `${username} এর জন্য নতুন পাসওয়ার্ড সেট করা হয়েছে।`,
        variant: "default",
      });
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">অ্যাডমিন</Badge>;
      case 'manager':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">ম্যানেজার</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">সক্রিয়</Badge>
      : <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">নিষ্ক্রিয়</Badge>;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('bn-BD');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">ব্যবহারকারী ব্যবস্থাপনা</CardTitle>
              <CardDescription>সিস্টেম ব্যবহারকারী তৈরি ও পরিচালনা</CardDescription>
            </div>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                নতুন ব্যবহারকারী
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>নতুন ব্যবহারকারী যোগ করুন</DialogTitle>
                <DialogDescription>
                  সিস্টেমে নতুন ব্যবহারকারী তৈরি করুন
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">ইউজারনেম</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="ইউজারনেম লিখুন"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">পূর্ণ নাম</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="পূর্ণ নাম লিখুন"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ইমেইল</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="ইমেইল ঠিকানা লিখুন"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">ভূমিকা</Label>
                  <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">অ্যাডমিন</SelectItem>
                      <SelectItem value="manager">ম্যানেজার</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="পাসওয়ার্ড লিখুন"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={createUser} className="flex-1">
                    তৈরি করুন
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    বাতিল
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম, ইউজারনেম বা ইমেইল খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="ভূমিকা ফিল্টার" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল ভূমিকা</SelectItem>
              <SelectItem value="admin">অ্যাডমিন</SelectItem>
              <SelectItem value="manager">ম্যানেজার</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">মোট ব্যবহারকারী</div>
            <div className="text-2xl font-bold text-primary">{users.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">সক্রিয়</div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.isActive).length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">অ্যাডমিন</div>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">নাম</th>
                  <th className="text-left p-4 font-medium">ইউজারনেম</th>
                  <th className="text-left p-4 font-medium">ইমেইল</th>
                  <th className="text-left p-4 font-medium">ভূমিকা</th>
                  <th className="text-left p-4 font-medium">অবস্থা</th>
                  <th className="text-left p-4 font-medium">তৈরির তারিখ</th>
                  <th className="text-left p-4 font-medium">শেষ লগইন</th>
                  <th className="text-left p-4 font-medium">কার্যক্রম</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t hover:bg-muted/50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 font-mono text-sm">{user.username}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">{getRoleBadge(user.role)}</td>
                    <td className="p-4">{getStatusBadge(user.isActive)}</td>
                    <td className="p-4">{formatDate(user.createdAt)}</td>
                    <td className="p-4">{user.lastLogin ? formatDate(user.lastLogin) : 'কখনো না'}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleUserStatus(user.id)}
                          className="h-8 w-8 p-0"
                          title={user.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                        >
                          {user.isActive ? (
                            <Lock className="h-3 w-3" />
                          ) : (
                            <Unlock className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resetPassword(user.username)}
                          className="h-8 w-8 p-0"
                          title="পাসওয়ার্ড রিসেট"
                        >
                          <Key className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="সম্পাদনা"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {user.username !== 'admin' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteUser(user.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              কোনো ব্যবহারকারী পাওয়া যায়নি
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};