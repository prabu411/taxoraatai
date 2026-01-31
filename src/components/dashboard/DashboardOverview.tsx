import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  PiggyBank,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';

const DashboardOverview = () => {
  const { user, marketRates } = useAuth();

  const portfolioStats = [
    { 
      title: 'Total Portfolio', 
      value: '₹24,56,000', 
      change: '+12.5%',
      trend: 'up',
      icon: Wallet,
    },
    { 
      title: 'Monthly Savings', 
      value: '₹45,000', 
      change: '+8.2%',
      trend: 'up',
      icon: PiggyBank,
    },
    { 
      title: 'Investments', 
      value: '₹18,30,000', 
      change: '+15.3%',
      trend: 'up',
      icon: TrendingUp,
    },
    { 
      title: 'Tax Saved', 
      value: '₹1,50,000', 
      change: 'Section 80C',
      trend: 'neutral',
      icon: Target,
    },
  ];

  const recentActivity = [
    { type: 'investment', title: 'SIP - Axis Bluechip', amount: '+₹5,000', date: 'Jan 28, 2025' },
    { type: 'expense', title: 'Electricity Bill', amount: '-₹2,450', date: 'Jan 25, 2025' },
    { type: 'income', title: 'Salary Credit', amount: '+₹85,000', date: 'Jan 20, 2025' },
    { type: 'investment', title: 'FD Maturity - SBI', amount: '+₹1,07,100', date: 'Jan 15, 2025' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's your financial overview for today
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <BarChart3 className="w-3 h-3 mr-1" />
          Financial Health: Excellent
        </Badge>
      </div>

      {/* Market Rates Bar */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Live Market Rates</span>
              <Badge variant="secondary" className="text-xs">Updated by Admin</Badge>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-sm">Gold: ₹{marketRates.goldRate.toLocaleString()}/g</span>
                <TrendingUp className="w-3 h-3 text-success" />
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Silver: ₹{marketRates.silverRate.toLocaleString()}/g</span>
                <TrendingUp className="w-3 h-3 text-success" />
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-info" />
                <span className="text-sm">Nifty 50: {marketRates.marketIndex.toLocaleString()}</span>
                <TrendingDown className="w-3 h-3 text-destructive" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioStats.map((stat, idx) => (
          <Card key={idx} className="glass-card stat-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <stat.icon className="w-8 h-8 text-primary" />
                {stat.trend === 'up' ? (
                  <div className="flex items-center text-success text-sm">
                    <ArrowUpRight className="w-4 h-4" />
                    {stat.change}
                  </div>
                ) : stat.trend === 'down' ? (
                  <div className="flex items-center text-destructive text-sm">
                    <ArrowDownRight className="w-4 h-4" />
                    {stat.change}
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs">{stat.change}</Badge>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'income' ? 'bg-success' :
                      activity.type === 'expense' ? 'bg-destructive' :
                      'bg-primary'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    activity.amount.startsWith('+') ? 'text-success' : 'text-destructive'
                  }`}>
                    {activity.amount}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Investment Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Investment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Mutual Funds', value: 45, amount: '₹8,23,500' },
                { name: 'Stocks', value: 25, amount: '₹4,57,500' },
                { name: 'Fixed Deposits', value: 20, amount: '₹3,66,000' },
                { name: 'Gold', value: 10, amount: '₹1,83,000' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.name}</span>
                    <span className="text-muted-foreground">{item.amount}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
