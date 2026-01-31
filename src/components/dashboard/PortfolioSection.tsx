import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  TrendingUp, 
  Landmark, 
  PiggyBank,
  Plus,
  Trash2,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

// All database logic has been moved to /api routes. This file now only makes fetch calls.

interface FDRDEntry {
  _id?: string;
  userId: string;
  type: 'FD' | 'RD';
  bankName: string;
  principal: number;
  interestRate: number;
  investmentDate: string;
  maturityDate: string;
}

interface StockHolding {
  _id?: string;
  userId: string;
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

interface HUFPF {
  _id?: string;
  userId: string;
  hufPan?: string;
  hufAssets?: number;
  epfBalance?: number;
  npsBalance?: number;
}

const PortfolioSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [fdrdEntries, setFdrdEntries] = useState<FDRDEntry[]>([]);
  const [stocks, setStocks] = useState<StockHolding[]>([]);
  const [hufPf, setHufPf] = useState<HUFPF | null>(null);

  const [newFDRD, setNewFDRD] = useState({
    type: 'FD' as 'FD' | 'RD',
    bankName: '',
    principal: '',
    interestRate: '',
    investmentDate: '',
    maturityDate: '',
  });

  const [hufPfForm, setHufPfForm] = useState({ hufPan: '', hufAssets: '', epfBalance: '', npsBalance: '' });

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/portfolio?userId=${user.email}`);
        const data = await response.json();
        if (data.success) {
          setFdrdEntries(data.fdrd || []);
          setStocks(data.stocks || []);
          if (data.hufPf) {
            setHufPf(data.hufPf);
            setHufPfForm({
              hufPan: data.hufPf.hufPan || '',
              hufAssets: data.hufPf.hufAssets?.toString() || '',
              epfBalance: data.hufPf.epfBalance?.toString() || '',
              npsBalance: data.hufPf.npsBalance?.toString() || '',
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
        toast({ title: 'Error', description: 'Could not load portfolio data.', variant: 'destructive' });
      }
    };
    fetchData();
  }, [user, toast]);

  const addFDRD = async () => {
    if (!newFDRD.bankName || !newFDRD.principal || !user) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          type: 'fdrd',
          data: { ...newFDRD, principal: parseFloat(newFDRD.principal), interestRate: parseFloat(newFDRD.interestRate) }
        }),
      });
      const result = await response.json();
      if (result.success) {
        setFdrdEntries(prev => [...prev, { ...newFDRD, _id: result.insertedId, userId: user.email, principal: parseFloat(newFDRD.principal), interestRate: parseFloat(newFDRD.interestRate) }]);
        setNewFDRD({ type: 'FD', bankName: '', principal: '', interestRate: '', investmentDate: '', maturityDate: '' });
        toast({ title: 'Added Successfully' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not add entry.', variant: 'destructive' });
    }
  };

  const deleteFDRD = async (id: string) => {
    if (!user) return;
    try {
      await fetch('/api/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.email, type: 'fdrd', id }),
      });
      setFdrdEntries(fdrdEntries.filter(e => e._id !== id));
      toast({ title: 'Deleted' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not delete entry.', variant: 'destructive' });
    }
  };

  const updateHufPf = async (data: Partial<HUFPF>) => {
    if (!user) return;
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.email, type: 'hufPf', data }),
      });
      setHufPf(prev => ({ ...(prev || { userId: user.email }), ...data }));
      toast({ title: 'Updated', description: 'HUF/PF details have been saved.' });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not save details.', variant: 'destructive' });
    }
  };

  const handleHufSubmit = () => {
    const dataToSave = {
      hufPan: hufPfForm.hufPan,
      hufAssets: parseFloat(hufPfForm.hufAssets) || undefined,
    };
    updateHufPf(dataToSave);
  };

  const handlePensionSubmit = () => {
    const dataToSave = {
      epfBalance: parseFloat(hufPfForm.epfBalance) || undefined,
      npsBalance: parseFloat(hufPfForm.npsBalance) || undefined,
    };
    updateHufPf(dataToSave);
  };

  const totalFDRD = fdrdEntries.reduce((sum, e) => sum + e.principal, 0);
  const totalStocksValue = stocks.reduce((sum, s) => sum + (s.quantity * s.currentPrice), 0);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Portfolio Overview</h2>
          <p className="text-muted-foreground">Track your investments across all asset classes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <Landmark className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">FD/RD Total</p>
            <p className="text-2xl font-bold">₹{totalFDRD.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">{fdrdEntries.length} accounts</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <TrendingUp className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Stocks Value</p>
            <p className="text-2xl font-bold">₹{totalStocksValue.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fdrd" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fdrd">FD & RD</TabsTrigger>
          <TabsTrigger value="stocks">Stocks & Demat</TabsTrigger>
          <TabsTrigger value="others">HUF & Pension</TabsTrigger>
        </TabsList>

        <TabsContent value="fdrd" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Fixed & Recurring Deposits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 p-4 rounded-lg bg-secondary/20 mb-4">
                 <div>
                  <Label className="text-xs">Type</Label>
                  <select 
                    className="w-full h-10 rounded-md bg-secondary border-border text-sm px-2"
                    value={newFDRD.type}
                    onChange={(e) => setNewFDRD({...newFDRD, type: e.target.value as 'FD' | 'RD'})}
                  >
                    <option value="FD">FD</option>
                    <option value="RD">RD</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Bank Name</Label>
                  <Input 
                    placeholder="SBI, HDFC..." 
                    className="input-premium"
                    value={newFDRD.bankName}
                    onChange={(e) => setNewFDRD({...newFDRD, bankName: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-xs">Amount (₹)</Label>
                  <Input 
                    type="number" 
                    placeholder="100000" 
                    className="input-premium"
                    value={newFDRD.principal}
                    onChange={(e) => setNewFDRD({...newFDRD, principal: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-xs">Interest %</Label>
                  <Input 
                    type="number" 
                    step="0.1"
                    placeholder="7.1" 
                    className="input-premium"
                    value={newFDRD.interestRate}
                    onChange={(e) => setNewFDRD({...newFDRD, interestRate: e.target.value})}
                  />
                </div>
                <div>
                  <Label className="text-xs">Maturity Date</Label>
                  <Input 
                    type="date" 
                    className="input-premium"
                    value={newFDRD.maturityDate}
                    onChange={(e) => setNewFDRD({...newFDRD, maturityDate: e.target.value})}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addFDRD} className="w-full btn-premium">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Bank</th>
                      <th>Principal</th>
                      <th>Interest</th>
                      <th>Maturity</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fdrdEntries.map((entry) => (
                      <tr key={entry._id}>
                        <td>
                          <Badge variant={entry.type === 'FD' ? 'default' : 'secondary'}>
                            {entry.type}
                          </Badge>
                        </td>
                        <td className="font-medium">{entry.bankName}</td>
                        <td>₹{entry.principal.toLocaleString()}</td>
                        <td>{entry.interestRate}%</td>
                        <td className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(entry.maturityDate).toLocaleDateString()}
                        </td>
                        <td>
                          <Button size="sm" variant="ghost" onClick={() => deleteFDRD(entry._id!)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="others" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>HUF (Hindu Undivided Family)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>HUF PAN</Label>
                  <Input
                    className="input-premium mt-1"
                    placeholder="AABCH1234F"
                    value={hufPfForm.hufPan}
                    onChange={(e) => setHufPfForm({ ...hufPfForm, hufPan: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Total Assets (₹)</Label>
                  <Input
                    type="number"
                    className="input-premium mt-1"
                    placeholder="1500000"
                    value={hufPfForm.hufAssets}
                    onChange={(e) => setHufPfForm({ ...hufPfForm, hufAssets: e.target.value })}
                  />
                </div>
                <Button variant="outline" className="w-full" onClick={handleHufSubmit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Save HUF Details
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Pension & PF</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>EPF Balance (₹)</Label>
                  <Input
                    type="number"
                    className="input-premium mt-1"
                    placeholder="450000"
                    value={hufPfForm.epfBalance}
                    onChange={(e) => setHufPfForm({ ...hufPfForm, epfBalance: e.target.value })}
                  />
                </div>
                <div>
                  <Label>NPS Balance (₹)</Label>
                  <Input
                    type="number"
                    className="input-premium mt-1"
                    placeholder="230000"
                    value={hufPfForm.npsBalance}
                    onChange={(e) => setHufPfForm({ ...hufPfForm, npsBalance: e.target.value })}
                  />
                </div>
                <Button variant="outline" className="w-full" onClick={handlePensionSubmit}>
                  <Plus className="w-4 h-4 mr-2" />
                  Save Pension Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioSection;
