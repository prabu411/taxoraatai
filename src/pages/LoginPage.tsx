import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, TrendingUp, BarChart, Bot } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-gradient-gold">Login to TaxoraAI</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your financial dashboard.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ganesh@taxora.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-premium"
              />
            </div>
            <Button type="submit" className="w-full btn-premium mt-2">
              Login
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline text-primary">
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero z-10"></div>
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-12 text-white">
            <div className="mb-8">
                <h2 className="text-4xl font-bold font-display text-gradient-gold">
                    Your AI-Powered Financial Co-Pilot
                </h2>
                <p className="text-lg mt-4 text-muted-foreground">
                    TaxoraAI combines all your financial data into one intelligent, secure, and easy-to-use platform.
                </p>
            </div>
            <div className="space-y-6 max-w-md">
                <div className="flex items-start gap-4 text-left">
                    <div className="p-3 bg-primary/20 rounded-full">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Unified Portfolio Tracking</h3>
                        <p className="text-sm text-muted-foreground">Monitor stocks, mutual funds, FDs, and more from a single dashboard.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 text-left">
                    <div className="p-3 bg-primary/20 rounded-full">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">Simplified Tax Compliance</h3>
                        <p className="text-sm text-muted-foreground">Never miss a deadline with automated reminders and easy access to GST forms.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 text-left">
                    <div className="p-3 bg-primary/20 rounded-full">
                        <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">AI-Driven Insights</h3>
                        <p className="text-sm text-muted-foreground">Get personalized advice and answers to your financial questions in real-time.</p>
                    </div>
                </div>
            </div>
            <p className="absolute bottom-10 text-xs text-muted-foreground">
                © 2024 TaxoraAI. All Rights Reserved.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
