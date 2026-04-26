import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Ship } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { logAuthDebug } from '@/lib/debugAuth';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    
    try {
      const { data: { user }, error } = await login(email, password);
      if (error) throw error;
      
      logAuthDebug('Login successful, user:', user);
      
      toast({ title: "Welcome back", description: "Login successful" });
      
      // Small delay to ensure auth state propagates and toast is visible
      setTimeout(() => {
        logAuthDebug('Navigating to /admin dashboard');
        navigate('/admin', { replace: true });
      }, 500);

    } catch (error) {
      logAuthDebug('Login error:', error.message);
      toast({ 
        variant: "destructive", 
        title: "Login failed", 
        description: error.message || "Invalid credentials" 
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b1216] p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#03c4c9]">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-[#e6fcfc] p-3 rounded-full">
               <Ship className="h-8 w-8 text-[#03c4c9]" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#2d353b]">Admin Access</CardTitle>
          <CardDescription>Enter your credentials to manage Poseidon</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@poseidon.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-[#03c4c9] hover:bg-[#029a9e]" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;