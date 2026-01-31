import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Plus,
  Trash2,
  Building2,
  Phone,
  CreditCard,
  FileText,
  Edit2,
  Save,
  QrCode,
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  gstNumber: string;
  mobile: string;
  email: string;
  address: string;
  upiId: string;
  posNumber: string;
}

const BusinessTools = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'ABC Trading Co.',
      gstNumber: '33AABCU9603R1ZM',
      mobile: '9876543210',
      email: 'abc@trading.com',
      address: '123 Industrial Area, Chennai',
      upiId: 'abctrading@ybl',
      posNumber: 'POS001234',
    },
    {
      id: '2',
      name: 'XYZ Suppliers Pvt Ltd',
      gstNumber: '27AADCX0987P1ZQ',
      mobile: '8765432109',
      email: 'contact@xyz.com',
      address: '456 Market Street, Mumbai',
      upiId: 'xyzsuppliers@paytm',
      posNumber: 'POS005678',
    },
  ]);

  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addSupplier = () => {
    if (!newSupplier.name || !newSupplier.gstNumber) {
      toast({
        title: 'Error',
        description: 'Name and GST Number are required',
        variant: 'destructive',
      });
      return;
    }

    const supplier: Supplier = {
      id: Date.now().toString(),
      name: newSupplier.name || '',
      gstNumber: newSupplier.gstNumber || '',
      mobile: newSupplier.mobile || '',
      email: newSupplier.email || '',
      address: newSupplier.address || '',
      upiId: newSupplier.upiId || '',
      posNumber: newSupplier.posNumber || '',
    };

    setSuppliers([...suppliers, supplier]);
    setNewSupplier({});
    setShowAddForm(false);
    toast({
      title: 'Supplier Added',
      description: `${supplier.name} has been added to your directory.`,
    });
  };

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter((s) => s.id !== id));
    toast({
      title: 'Deleted',
      description: 'Supplier removed from directory.',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold">Business Tools</h2>
          <p className="text-muted-foreground">Manage your supplier directory and business contacts</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="btn-premium">
          <Plus className="w-4 h-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <Users className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">Total Suppliers</p>
            <p className="text-2xl font-bold">{suppliers.length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <Building2 className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">GST Registered</p>
            <p className="text-2xl font-bold">{suppliers.filter((s) => s.gstNumber).length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <CreditCard className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">UPI Enabled</p>
            <p className="text-2xl font-bold">{suppliers.filter((s) => s.upiId).length}</p>
          </CardContent>
        </Card>

        <Card className="glass-card stat-card">
          <CardContent className="p-6">
            <QrCode className="w-8 h-8 text-primary mb-3" />
            <p className="text-sm text-muted-foreground">POS Linked</p>
            <p className="text-2xl font-bold">{suppliers.filter((s) => s.posNumber).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Add Supplier Form */}
      {showAddForm && (
        <Card className="glass-card border-primary/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Add New Supplier
            </CardTitle>
            <CardDescription>Enter supplier details for your business directory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Supplier Name *</Label>
                <Input
                  placeholder="Company Name"
                  className="input-premium"
                  value={newSupplier.name || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GST Number *</Label>
                <Input
                  placeholder="33AABCU9603R1ZM"
                  className="input-premium"
                  value={newSupplier.gstNumber || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, gstNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input
                  placeholder="9876543210"
                  className="input-premium"
                  value={newSupplier.mobile || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, mobile: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="contact@company.com"
                  className="input-premium"
                  value={newSupplier.email || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>UPI ID</Label>
                <Input
                  placeholder="business@upi"
                  className="input-premium"
                  value={newSupplier.upiId || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, upiId: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>POS Number</Label>
                <Input
                  placeholder="POS001234"
                  className="input-premium"
                  value={newSupplier.posNumber || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, posNumber: e.target.value })}
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label>Address</Label>
                <Input
                  placeholder="Full business address"
                  className="input-premium"
                  value={newSupplier.address || ''}
                  onChange={(e) => setNewSupplier({ ...newSupplier, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={addSupplier} className="btn-premium">
                <Save className="w-4 h-4 mr-2" />
                Save Supplier
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suppliers List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Supplier Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suppliers.map((supplier) => (
              <div
                key={supplier.id}
                className="p-4 rounded-lg bg-secondary/20 border border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{supplier.name}</p>
                        <Badge variant="outline" className="text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          {supplier.gstNumber}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{supplier.mobile || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-muted-foreground" />
                        <span>{supplier.upiId || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-muted-foreground" />
                        <span>{supplier.posNumber || 'N/A'}</span>
                      </div>
                      <div className="text-muted-foreground truncate">
                        {supplier.address || 'No address'}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="ghost">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSupplier(supplier.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {suppliers.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No suppliers added yet.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setShowAddForm(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Supplier
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessTools;
