import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  FileWarning, 
  Upload, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Building2,
  Home,
  Factory,
  Calendar,
  IndianRupee,
  Trash2,
  Eye
} from 'lucide-react';

interface Bill {
  id: string;
  sector: 'residential' | 'commercial' | 'industrial';
  billType: 'electricity' | 'water' | 'property';
  amount: number;
  unitsConsumed: number;
  wattsSanctioned: number;
  billDate: string;
  dueDate: string;
  status: 'normal' | 'warning' | 'fraud';
  fraudReason?: string;
}

const BillTracker = () => {
  const { toast } = useToast();
  const [bills, setBills] = useState<Bill[]>([
    {
      id: '1',
      sector: 'residential',
      billType: 'electricity',
      amount: 2450,
      unitsConsumed: 320,
      wattsSanctioned: 5000,
      billDate: '2025-01-01',
      dueDate: '2025-01-20',
      status: 'normal',
    },
    {
      id: '2',
      sector: 'commercial',
      billType: 'electricity',
      amount: 8500,
      unitsConsumed: 1200,
      wattsSanctioned: 3000,
      billDate: '2025-01-05',
      dueDate: '2025-01-25',
      status: 'fraud',
      fraudReason: 'Units consumed (1200) far exceed expected for 3kW sanctioned load. Possible meter tampering.',
    },
  ]);

  const [newBill, setNewBill] = useState({
    sector: '' as 'residential' | 'commercial' | 'industrial' | '',
    billType: 'electricity' as 'electricity' | 'water' | 'property',
    amount: '',
    unitsConsumed: '',
    wattsSanctioned: '',
    billDate: '',
    dueDate: '',
  });

  // Fraud detection logic
  const detectFraud = (bill: Omit<Bill, 'id' | 'status' | 'fraudReason'>): { status: Bill['status']; reason?: string } => {
    const { sector, unitsConsumed, wattsSanctioned } = bill;
    
    // Expected units per kW per month based on sector
    const expectedUnitsPerKW: Record<string, number> = {
      residential: 50, // ~50 units per kW for homes
      commercial: 150, // Higher for shops
      industrial: 300, // Highest for factories
    };

    const maxExpectedUnits = (wattsSanctioned / 1000) * expectedUnitsPerKW[sector];
    
    // If units consumed are 2x more than expected, flag as potential fraud
    if (unitsConsumed > maxExpectedUnits * 2) {
      return {
        status: 'fraud',
        reason: `Units consumed (${unitsConsumed}) significantly exceed expected (~${Math.round(maxExpectedUnits)}) for ${wattsSanctioned}W sanctioned load in ${sector} sector. Possible meter tampering or unauthorized load.`,
      };
    }
    
    // Warning if 1.5x expected
    if (unitsConsumed > maxExpectedUnits * 1.5) {
      return {
        status: 'warning',
        reason: `High consumption detected. Units (${unitsConsumed}) above normal range for your sector.`,
      };
    }

    return { status: 'normal' };
  };

  const addBill = () => {
    if (!newBill.sector || !newBill.amount) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }

    const billData = {
      sector: newBill.sector as 'residential' | 'commercial' | 'industrial',
      billType: newBill.billType,
      amount: parseFloat(newBill.amount),
      unitsConsumed: parseFloat(newBill.unitsConsumed) || 0,
      wattsSanctioned: parseFloat(newBill.wattsSanctioned) || 0,
      billDate: newBill.billDate,
      dueDate: newBill.dueDate,
    };

    const fraudCheck = detectFraud(billData);

    const bill: Bill = {
      id: Date.now().toString(),
      ...billData,
      ...fraudCheck,
    };

    setBills([...bills, bill]);
    setNewBill({ sector: '', billType: 'electricity', amount: '', unitsConsumed: '', wattsSanctioned: '', billDate: '', dueDate: '' });

    if (fraudCheck.status === 'fraud') {
      toast({
        title: '⚠️ Potential Fraud Detected!',
        description: fraudCheck.reason,
        variant: 'destructive',
      });
    } else if (fraudCheck.status === 'warning') {
      toast({
        title: 'Warning',
        description: fraudCheck.reason,
      });
    } else {
      toast({ title: 'Bill Added', description: 'Your bill has been recorded successfully' });
    }
  };

  const deleteBill = (id: string) => {
    setBills(bills.filter(b => b.id !== id));
    toast({ title: 'Deleted', description: 'Bill removed from tracker' });
  };

  const getSectorIcon = (sector: string) => {
    switch (sector) {
      case 'residential': return Home;
      case 'commercial': return Building2;
      case 'industrial': return Factory;
      default: return Home;
    }
  };

  const upcomingDues = bills.filter(b => {
    const due = new Date(b.dueDate);
    const today = new Date();
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff <= 7 && diff >= 0;
  });

  const fraudAlerts = bills.filter(b => b.status === 'fraud');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Bill Tracker & Fraud Detection</h2>
          <p className="text-muted-foreground">Monitor your utility bills and detect anomalies</p>
        </div>
      </div>

      {/* Alerts Section */}
      {fraudAlerts.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
              <div>
                <p className="font-semibold text-destructive">Fraud Alert!</p>
                <p className="text-sm text-muted-foreground">
                  {fraudAlerts.length} bill(s) flagged for suspicious activity. Review immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <FileWarning className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Total Bills</p>
            <p className="text-2xl font-bold">{bills.length}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <Calendar className="w-8 h-8 text-warning mb-3" />
            <p className="text-sm text-muted-foreground">Due Soon</p>
            <p className="text-2xl font-bold">{upcomingDues.length}</p>
            <p className="text-xs text-warning mt-1">Within 7 days</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <AlertTriangle className="w-8 h-8 text-destructive mb-3" />
            <p className="text-sm text-muted-foreground">Fraud Alerts</p>
            <p className="text-2xl font-bold">{fraudAlerts.length}</p>
            <p className="text-xs text-destructive mt-1">Needs review</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Bill Form */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Add New Bill
          </CardTitle>
          <CardDescription>
            Our AI will analyze your bill for potential fraud based on sector and consumption patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Sector Type *</Label>
              <Select 
                value={newBill.sector} 
                onValueChange={(v) => setNewBill({...newBill, sector: v as any})}
              >
                <SelectTrigger className="input-premium">
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">
                    <div className="flex items-center gap-2">
                      <Home className="w-4 h-4" />
                      Residential
                    </div>
                  </SelectItem>
                  <SelectItem value="commercial">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Commercial (Shop)
                    </div>
                  </SelectItem>
                  <SelectItem value="industrial">
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4" />
                      Industrial
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bill Amount (₹) *</Label>
              <Input
                type="number"
                placeholder="2450"
                className="input-premium"
                value={newBill.amount}
                onChange={(e) => setNewBill({...newBill, amount: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Units Consumed</Label>
              <Input
                type="number"
                placeholder="320"
                className="input-premium"
                value={newBill.unitsConsumed}
                onChange={(e) => setNewBill({...newBill, unitsConsumed: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Watts Sanctioned</Label>
              <Input
                type="number"
                placeholder="5000"
                className="input-premium"
                value={newBill.wattsSanctioned}
                onChange={(e) => setNewBill({...newBill, wattsSanctioned: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Bill Date</Label>
              <Input
                type="date"
                className="input-premium"
                value={newBill.billDate}
                onChange={(e) => setNewBill({...newBill, billDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                className="input-premium"
                value={newBill.dueDate}
                onChange={(e) => setNewBill({...newBill, dueDate: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 flex items-end">
              <Button onClick={addBill} className="w-full btn-premium">
                <Zap className="w-4 h-4 mr-2" />
                Analyze & Add Bill
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Bills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bills.map((bill) => {
              const Icon = getSectorIcon(bill.sector);
              return (
                <div 
                  key={bill.id} 
                  className={`p-4 rounded-lg border ${
                    bill.status === 'fraud' 
                      ? 'border-destructive/50 bg-destructive/5' 
                      : bill.status === 'warning'
                      ? 'border-warning/50 bg-warning/5'
                      : 'border-border/50 bg-secondary/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        bill.status === 'fraud' ? 'bg-destructive/20' : 'bg-primary/20'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          bill.status === 'fraud' ? 'text-destructive' : 'text-primary'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium capitalize">{bill.sector} - {bill.billType}</p>
                          {bill.status === 'fraud' && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Fraud Alert
                            </Badge>
                          )}
                          {bill.status === 'warning' && (
                            <Badge variant="outline" className="text-xs border-warning text-warning">
                              Warning
                            </Badge>
                          )}
                          {bill.status === 'normal' && (
                            <Badge variant="outline" className="text-xs border-success text-success">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Normal
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bill.unitsConsumed} units | {bill.wattsSanctioned}W sanctioned
                        </p>
                        {bill.fraudReason && (
                          <p className="text-xs text-destructive mt-1">{bill.fraudReason}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold">₹{bill.amount.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => deleteBill(bill.id)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillTracker;
