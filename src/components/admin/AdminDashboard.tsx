import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Settings,
  Save,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
} from 'lucide-react';

const AdminDashboard = () => {
  const { marketRates, updateMarketRates, adminRequests, resolveRequest } = useAuth();
  const { toast } = useToast();
  
  const [goldRate, setGoldRate] = useState(marketRates.goldRate.toString());
  const [silverRate, setSilverRate] = useState(marketRates.silverRate.toString());
  const [marketIndex, setMarketIndex] = useState(marketRates.marketIndex.toString());

  const handleUpdateRates = () => {
    updateMarketRates({
      goldRate: parseFloat(goldRate),
      silverRate: parseFloat(silverRate),
      marketIndex: parseFloat(marketIndex),
    });
    toast({
      title: 'Market Rates Updated',
      description: 'All users will now see the updated rates.',
    });
  };

  const pendingRequests = adminRequests.filter(r => r.status === 'pending');
  const resolvedRequests = adminRequests.filter(r => r.status === 'resolved');

  const stats = [
    { 
      title: 'Total Users', 
      value: '1,247', 
      change: '+12%', 
      trend: 'up',
      icon: Users 
    },
    { 
      title: 'Pending Requests', 
      value: pendingRequests.length.toString(), 
      change: pendingRequests.length > 0 ? 'Needs attention' : 'All clear', 
      trend: pendingRequests.length > 0 ? 'down' : 'up',
      icon: MessageSquare 
    },
    { 
      title: 'Gold Rate (₹/g)', 
      value: `₹${marketRates.goldRate.toLocaleString()}`, 
      change: '+2.5%', 
      trend: 'up',
      icon: DollarSign 
    },
    { 
      title: 'Market Index', 
      value: marketRates.marketIndex.toLocaleString(), 
      change: '-0.8%', 
      trend: 'down',
      icon: BarChart3 
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage market rates and user requests</p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Settings className="w-3 h-3 mr-1" />
          Control Center
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="glass-card stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="w-8 h-8 text-primary" />
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-success" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Market Rate Controls */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Market Rate Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gold">Gold Rate (₹ per gram)</Label>
              <Input
                id="gold"
                type="number"
                value={goldRate}
                onChange={(e) => setGoldRate(e.target.value)}
                className="input-premium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="silver">Silver Rate (₹ per gram)</Label>
              <Input
                id="silver"
                type="number"
                value={silverRate}
                onChange={(e) => setSilverRate(e.target.value)}
                className="input-premium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="market">Market Index (Nifty 50)</Label>
              <Input
                id="market"
                type="number"
                value={marketIndex}
                onChange={(e) => setMarketIndex(e.target.value)}
                className="input-premium"
              />
            </div>
            <div className="pt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(marketRates.lastUpdated).toLocaleString()}
              </p>
              <Button onClick={handleUpdateRates} className="btn-premium">
                <Save className="w-4 h-4 mr-2" />
                Update Rates
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Requests */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              User Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="w-full">
                <TabsTrigger value="pending" className="flex-1">
                  Pending ({pendingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="resolved" className="flex-1">
                  Resolved ({resolvedRequests.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4 space-y-3">
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success" />
                    <p>All requests have been resolved!</p>
                  </div>
                ) : (
                  pendingRequests.map((request) => (
                    <div key={request._id} className="p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{request.userName}</p>
                          <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => {
                            resolveRequest(request._id);
                            toast({
                              title: 'Request Resolved',
                              description: `Marked ${request.userName}'s request as resolved.`,
                            });
                          }}
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="resolved" className="mt-4 space-y-3">
                {resolvedRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No resolved requests yet.</p>
                  </div>
                ) : (
                  resolvedRequests.map((request) => (
                    <div key={request._id} className="p-4 rounded-lg bg-secondary/20 border border-border/30 opacity-70">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{request.userName}</p>
                          <p className="text-sm text-muted-foreground mt-1">{request.message}</p>
                        </div>
                        <Badge variant="outline" className="text-success border-success">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
