import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Lock, User, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormProps {
  onLogin: (username: string, role: string) => void;
}

export const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "ত্রুটি",
        description: "সব ক্ষেত্র পূরণ করুন",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "সফল!",
          description: "সফলভাবে লগইন হয়েছে",
          variant: "default",
        });
        
        // Determine role based on username (in real app, this comes from backend)
        const role = username === 'admin' ? 'admin' : 'manager';
        onLogin(username, role);
      } else {
        toast({
          title: "ত্রুটি",
          description: "ভুল ব্যবহারকারীর নাম বা পাসওয়ার্ড",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "ত্রুটি",
        description: "লগইন করতে সমস্যা হয়েছে",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 animate-pulse-glow"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-float opacity-60 hidden sm:block"></div>
      <div className="absolute top-40 right-32 w-6 h-6 bg-accent rounded-full animate-float opacity-40 hidden sm:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-32 left-1/4 w-5 h-5 bg-primary-glow rounded-full animate-float opacity-50 hidden sm:block" style={{ animationDelay: '2s' }}></div>
      
      <Card className="w-full max-w-md relative z-10 folder-card animate-folder-open">
        <CardHeader className="text-center space-y-1 sm:space-y-2 p-4 sm:p-6">
          <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-2 sm:mb-4 animate-pulse-glow">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
            ট্রাভেল এজেন্সি
          </CardTitle>
          <CardDescription className="text-muted-foreground text-xs sm:text-sm">
            ইন্টারনাল ম্যানেজমেন্ট সিস্টেম
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="username" className="text-xs sm:text-sm font-medium">ব্যবহারকারীর নাম</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="আপনার নাম লিখুন"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8 sm:pl-10 bg-muted/50 border-muted transition-all focus:bg-background focus:ring-2 focus:ring-primary/50 h-10 sm:h-11 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-xs sm:text-sm font-medium">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-8 sm:pl-10 pr-10 sm:pr-12 bg-muted/50 border-muted transition-all focus:bg-background focus:ring-2 focus:ring-primary/50 h-10 sm:h-11 text-sm sm:text-base"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-2 sm:px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ touchAction: 'manipulation' }}
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:scale-105 transition-transform font-medium h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
              style={{ touchAction: 'manipulation' }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin"></div>
                  লগইন হচ্ছে...
                </div>
              ) : (
                'লগইন করুন'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};