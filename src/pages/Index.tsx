import { LoginForm } from '@/components/LoginForm';
import { Dashboard } from '@/components/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogin = (username: string, role: string) => {
    // Login is handled by AuthContext
    console.log(`User ${username} logged in as ${role}`);
  };

  const handleLogout = () => {
    logout();
  };

  if (!isLoggedIn || !user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return <Dashboard username={user.name} onLogout={handleLogout} />;
};

export default Index;
