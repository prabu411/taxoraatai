import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Users,
  Truck,
  Calculator,
} from 'lucide-react';

interface GSTForm {
  id: string;
  name: string;
  description: string;
  category: 'regular' | 'composition' | 'special';
  frequency: string;
  deadline?: string;
  filePath?: string;
}

const gstForms: GSTForm[] = [
  // Regular Taxpayers
  { id: 'gstr1', name: 'GSTR-1', description: 'Details of outward supplies (sales)', category: 'regular', frequency: 'Monthly/Quarterly', filePath: '/GST forms/GSTR1_Excel_Workbook_Template_V2.2.xlsx' },
  { id: 'gstr3b', name: 'GSTR-3B', description: 'Monthly summary return for sales, purchases, and tax payment', category: 'regular', frequency: 'Monthly' },
  { id: 'gstr9', name: 'GSTR-9', description: 'Annual return consolidating all monthly/quarterly filings', category: 'regular', frequency: 'Annual' },
  { id: 'gstr9c', name: 'GSTR-9C', description: 'Reconciliation statement for large taxpayers', category: 'regular', frequency: 'Annual' },
  
  // Composition Scheme
  { id: 'cmp08', name: 'CMP-08', description: 'Quarterly payment and return for composition dealers', category: 'composition', frequency: 'Quarterly' },
  { id: 'gstr4', name: 'GSTR-4', description: 'Annual return for composition scheme taxpayers', category: 'composition', frequency: 'Annual' },
  
  // Special Categories
  { id: 'gstr5', name: 'GSTR-5', description: 'For Non-Resident Taxable Persons', category: 'special', frequency: 'Monthly' },
  { id: 'gstr5a', name: 'GSTR-5A', description: 'For OIDAR Service Providers (Online Info & Database Access)', category: 'special', frequency: 'Monthly' },
  { id: 'gstr6', name: 'GSTR-6', description: 'For Input Service Distributors (ISD)', category: 'special', frequency: 'Monthly' },
  { id: 'gstr7', name: 'GSTR-7', description: 'For Tax Deducted at Source (TDS)', category: 'special', frequency: 'Monthly' },
  { id: 'gstr8', name: 'GSTR-8', description: 'For E-commerce Operators (TCS)', category: 'special', frequency: 'Monthly', filePath: '/GST forms/GSTR-8.xlsx' },
  { id: 'gstr10', name: 'GSTR-10', description: 'Final Return (upon registration cancellation)', category: 'special', frequency: 'Once' },
  { id: 'gstr11', name: 'GSTR-11', description: 'For UIN Holders (Unique Identification Number)', category: 'special', frequency: 'Quarterly' },
  { id: 'itc04', name: 'ITC-04', description: 'For movements of goods for job work', category: 'special', frequency: 'Half-yearly' },
];

const GSTCompliance = () => {
  const [taxCalc, setTaxCalc] = useState({
    amount: '',
    sgstRate: '9',
    cgstRate: '9',
    igstRate: '18',
    cessRate: '0',
  });

  const calculateTax = () => {
    const amount = parseFloat(taxCalc.amount) || 0;
    const sgst = (amount * parseFloat(taxCalc.sgstRate)) / 100;
    const cgst = (amount * parseFloat(taxCalc.cgstRate)) / 100;
    const igst = (amount * parseFloat(taxCalc.igstRate)) / 100;
    const cess = (amount * parseFloat(taxCalc.cessRate)) / 100;
    
    return { sgst, cgst, igst, cess, total: amount + sgst + cgst };
  };

  const taxes = calculateTax();

  const upcomingDeadlines = [
    { form: 'GSTR-3B', date: 'Feb 20, 2025', status: 'upcoming' },
    { form: 'GSTR-1', date: 'Feb 11, 2025', status: 'urgent' },
    { form: 'GSTR-9', date: 'Dec 31, 2025', status: 'later' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'regular': return Building2;
      case 'composition': return Users;
      case 'special': return Truck;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">GST & Tax Compliance</h2>
          <p className="text-muted-foreground">Manage your GST filings and calculate taxes</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <Clock className="w-8 h-8 text-warning mb-3" />
            <p className="text-sm text-muted-foreground">Next Filing</p>
            <p className="text-xl font-bold">GSTR-1</p>
            <p className="text-sm text-warning">Due: Feb 11, 2025</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <CheckCircle className="w-8 h-8 text-success mb-3" />
            <p className="text-sm text-muted-foreground">Filed This Year</p>
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Out of 12 required</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <Calculator className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Tax Paid YTD</p>
            <p className="text-2xl font-bold">₹1,24,500</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tax Calculator */}
        <Card className="glass-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Tax Calculator
            </CardTitle>
            <CardDescription>Calculate SGST, CGST & IGST</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Taxable Amount (₹)</Label>
              <Input
                type="number"
                placeholder="10000"
                className="input-premium"
                value={taxCalc.amount}
                onChange={(e) => setTaxCalc({...taxCalc, amount: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">SGST Rate (%)</Label>
                <Input
                  type="number"
                  className="input-premium"
                  value={taxCalc.sgstRate}
                  onChange={(e) => setTaxCalc({...taxCalc, sgstRate: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">CGST Rate (%)</Label>
                <Input
                  type="number"
                  className="input-premium"
                  value={taxCalc.cgstRate}
                  onChange={(e) => setTaxCalc({...taxCalc, cgstRate: e.target.value})}
                />
              </div>
            </div>

            <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SGST ({taxCalc.sgstRate}%)</span>
                <span className="font-medium">₹{taxes.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CGST ({taxCalc.cgstRate}%)</span>
                <span className="font-medium">₹{taxes.cgst.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 mt-2 flex justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="text-lg font-bold text-primary">₹{taxes.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-info/10 border border-info/20">
              <p className="text-xs text-info">
                IGST ({taxCalc.igstRate}%) applies for interstate: ₹{taxes.igst.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* GST Forms Library */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              GST Forms Library
            </CardTitle>
            <CardDescription>Download and view all GST forms</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="regular">
              <TabsList className="w-full">
                <TabsTrigger value="regular" className="flex-1">
                  <Building2 className="w-4 h-4 mr-2" />
                  Regular
                </TabsTrigger>
                <TabsTrigger value="composition" className="flex-1">
                  <Users className="w-4 h-4 mr-2" />
                  Composition
                </TabsTrigger>
                <TabsTrigger value="special" className="flex-1">
                  <Truck className="w-4 h-4 mr-2" />
                  Special
                </TabsTrigger>
              </TabsList>

              {['regular', 'composition', 'special'].map((category) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <div className="space-y-2">
                    {gstForms
                      .filter((form) => form.category === category)
                      .map((form) => {
                        const Icon = getCategoryIcon(form.category);
                        return (
                          <div
                            key={form.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{form.name}</p>
                                  <Badge variant="outline" className="text-xs">
                                    {form.frequency}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">{form.description}</p>
                              </div>
                            </div>
                            <Button size="sm" variant="outline" asChild>
                              <a href={form.filePath} download>
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </a>
                            </Button>
                          </div>
                        );
                      })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Filing Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingDeadlines.map((deadline, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  deadline.status === 'urgent'
                    ? 'border-destructive/50 bg-destructive/5'
                    : deadline.status === 'upcoming'
                    ? 'border-warning/50 bg-warning/5'
                    : 'border-border/50 bg-secondary/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={deadline.status === 'urgent' ? 'destructive' : 'outline'}
                    className={deadline.status === 'urgent' ? '' : 'text-muted-foreground'}
                  >
                    {deadline.status === 'urgent' ? (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Urgent
                      </>
                    ) : (
                      deadline.status.charAt(0).toUpperCase() + deadline.status.slice(1)
                    )}
                  </Badge>
                </div>
                <p className="font-semibold text-lg">{deadline.form}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {deadline.date}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GSTCompliance;
