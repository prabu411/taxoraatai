import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  CreditCard,
  Plus,
  Trash2,
  Calendar,
  Percent,
  IndianRupee,
  Copy,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import clientPromise from '@/lib/mongodb';

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

  const [pastedPortfolio, setPastedPortfolio] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const client = await clientPromise;
      const db = client.db();
      const fdrd = await db.collection('fdrd').find({ userId: user.email }).toArray();
      setFdrdEntries(fdrd as any);
      const stocks = await db.collection('stocks').find({ userId: user.email }).toArray();
      setStocks(stocks as any);
      const hufPfData = await db.collection('hufPf').findOne({ userId: user.email });
      setHufPf(hufPfData as any);
    };
    fetchData();
  }, [user]);

  const addFDRD = async () => {
    if (!newFDRD.bankName || !newFDRD.principal || !user) {
      toast({ title: 'Error', description: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    const entry: FDRDEntry = {
      userId: user.email,
      ...newFDRD,
      principal: parseFloat(newFDRD.principal),
      interestRate: parseFloat(newFDRD.interestRate),
    };
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('fdrd').insertOne(entry);
    setFdrdEntries([...fdrdEntries, { ...entry, _id: result.insertedId.toString() }]);
    setNewFDRD({ type: 'FD', bankName: '', principal: '', interestRate: '', investmentDate: '', maturityDate: '' });
    toast({ title: 'Added Successfully', description: `${entry.type} entry added to your portfolio` });
  };

  const deleteFDRD = async (id: string) => {
    if(!user) return;
    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = await import('mongodb');
    await db.collection('fdrd').deleteOne({ _id: new ObjectId(id), userId: user.email });
    setFdrdEntries(fdrdEntries.filter(e => e._id !== id));
    toast({ title: 'Deleted', description: 'Entry removed from portfolio' });
  };

  const parsePortfolio = async () => {
    if(!user) return;
    const lines = pastedPortfolio.trim().split('\n');
    const parsed: StockHolding[] = [];
    
    lines.forEach((line) => {
      const parts = line.split(/[\t,]+/).map(p => p.trim());
      if (parts.length >= 3) {
        parsed.push({
          userId: user.email,
          symbol: parts[0].toUpperCase(),
          quantity: parseInt(parts[1]) || 0,
          avgPrice: parseFloat(parts[2]) || 0,
          currentPrice: parseFloat(parts[3]) || parseFloat(parts[2]) || 0,
        });
      }
    });

    if (parsed.length > 0) {
      const client = await clientPromise;
      const db = client.db();
      const result = await db.collection('stocks').insertMany(parsed);
      const newStocks = parsed.map((stock, i) => ({ ...stock, _id: result.insertedIds[i].toString() }));
      setStocks([...stocks, ...newStocks]);
      setPastedPortfolio('');
      toast({ title: 'Portfolio Imported', description: `${parsed.length} stocks added to your portfolio` });
    } else {
      toast({ title: 'Parse Error', description: 'Could not parse portfolio data. Use format: SYMBOL, QTY, AVG_PRICE', variant: 'destructive' });
    }
  };

  const updateHufPf = async (data: Partial<HUFPF>) => {
    if (!user) return;
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('hufPf').updateOne(
      { userId: user.email },
      { $set: { ...data, userId: user.email } },
      { upsert: true }
    );
    const updatedHufPf = await db.collection('hufPf').findOne({ userId: user.email });
    setHufPf(updatedHufPf as any);
    toast({ title: 'Updated', description: 'HUF/PF details have been updated.' });
  };

  const totalFDRD = fdrdEntries.reduce((sum, e) => sum + e.principal, 0);
  const totalStocksValue = stocks.reduce((sum, s) => sum + (s.quantity * s.currentPrice), 0);
  const totalStocksCost = stocks.reduce((sum, s) => sum + (s.quantity * s.avgPrice), 0);
  const stocksPnL = totalStocksValue - totalStocksCost;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Portfolio Overview</h2>
          <p className="text-muted-foreground">Track your investments across all asset classes</p>
        </div>
      </div>

      {/* Summary Cards */}
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
            <p className={`text-xs mt-1 ${stocksPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
              {stocksPnL >= 0 ? '+' : ''}₹{stocksPnL.toLocaleString()} P&L
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <PiggyBank className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Total Invested</p>
            <p className="text-2xl font-bold">₹{(totalFDRD + totalStocksCost).toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <CreditCard className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-2xl font-bold">₹{(totalFDRD + totalStocksValue).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="fdrd" className="space-y-4">
        <TabsList>
          <TabsTrigger value="fdrd">FD & RD</TabsTrigger>
          <TabsTrigger value="stocks">Stocks & Demat</TabsTrigger>
          <TabsTrigger value="others">HUF & Pension</TabsTrigger>
        </TabsList>

        {/* FD/RD Tab */}
        <TabsContent value="fdrd" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-primary" />
                Fixed & Recurring Deposits
              </CardTitle>
              <CardDescription>Manage your bank deposits</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add New Form */}
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

              {/* Entries Table */}
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

        {/* Stocks Tab */}
        <TabsContent value="stocks" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Stock Holdings
              </CardTitle>
              <CardDescription>Import from Zerodha, Groww, or other brokers</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Copy Portfolio Feature */}
              <div className="p-4 rounded-lg bg-secondary/20 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Copy className="w-4 h-4 text-primary" />
                  <Label className="font-medium">Paste Portfolio Data</Label>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Copy from your broker (format: SYMBOL, QTY, AVG_PRICE per line)
                </p>
                <textarea
                  className="w-full h-24 p-3 rounded-md bg-secondary border-border text-sm resize-none"
                  placeholder="RELIANCE, 10, 2450&#10;TCS, 5, 3800&#10;INFY, 15, 1650"
                  value={pastedPortfolio}
                  onChange={(e) => setPastedPortfolio(e.target.value)}
                />
                <Button onClick={parsePortfolio} className="mt-2" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Import Portfolio
                </Button>
              </div>

              {/* Stocks Table */}
              <div className="overflow-x-auto">
                <table className="table-premium">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Qty</th>
                      <th>Avg Price</th>
                      <th>Current</th>
                      <th>Value</th>
                      <th>P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((stock) => {
                      const value = stock.quantity * stock.currentPrice;
                      const cost = stock.quantity * stock.avgPrice;
                      const pnl = value - cost;
                      const pnlPercent = ((pnl / cost) * 100).toFixed(2);
                      return (
                        <tr key={stock._id}>
                          <td className="font-medium text-primary">{stock.symbol}</td>
                          <td>{stock.quantity}</td>
                          <td>₹{stock.avgPrice.toLocaleString()}</td>
                          <td>₹{stock.currentPrice.toLocaleString()}</td>
                          <td>₹{value.toLocaleString()}</td>
                          <td className={pnl >= 0 ? 'text-success' : 'text-destructive'}>
                            {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString()} ({pnlPercent}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HUF & Pension Tab */}
        <TabsContent value="others" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  HUF (Hindu Undivided Family)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-secondary/20">
                    <Label className="text-sm text-muted-foreground">HUF PAN</Label>
                    <Input
                      className="input-premium mt-1"
                      placeholder="AABCH1234F"
                      value={hufPf?.hufPan || ''}
                      onChange={(e) => setHufPf({ ...hufPf, userId: user!.email, hufPan: e.target.value })}
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/20">
                    <Label className="text-sm text-muted-foreground">Total Assets</Label>
                    <Input
                      type="number"
                      className="input-premium mt-1"
                      placeholder="1500000"
                      value={hufPf?.hufAssets || ''}
                      onChange={(e) => setHufPf({ ...hufPf, userId: user!.email, hufAssets: parseFloat(e.target.value) })}
                    />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => updateHufPf({ hufPan: hufPf?.hufPan, hufAssets: hufPf?.hufAssets })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Save HUF Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-primary" />
                  Pension & PF
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-secondary/20">
                    <Label className="text-sm text-muted-foreground">EPF Balance</Label>
                    <Input
                      type="number"
                      className="input-premium mt-1"
                      placeholder="450000"
                      value={hufPf?.epfBalance || ''}
                      onChange={(e) => setHufPf({ ...hufPf, userId: user!.email, epfBalance: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/20">
                    <Label className="text-sm text-muted-foreground">NPS</Label>
                    <Input
                      type="number"
                      className="input-premium mt-1"
                      placeholder="230000"
                      value={hufPf?.npsBalance || ''}
                      onChange={(e) => setHufPf({ ...hufPf, userId: user!.email, npsBalance: parseFloat(e.target.value) })}
                    />
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => updateHufPf({ epfBalance: hufPf?.epfBalance, npsBalance: hufPf?.npsBalance })}>
                    <Plus className="w-4 h-4 mr-2" />
                    Save Pension Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioSection;
