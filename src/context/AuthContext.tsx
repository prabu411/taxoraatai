import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import clientPromise from '@/lib/mongodb';

export type UserRole = 'user' | 'admin' | null;

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface MarketRates {
  goldRate: number;
  silverRate: number;
  marketIndex: number;
  lastUpdated: string;
}

export interface AdminRequest {
  _id: string;
  userId: string;
  userName: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  marketRates: MarketRates;
  updateMarketRates: (rates: Partial<MarketRates>) => void;
  adminRequests: AdminRequest[];
  addAdminRequest: (message: string) => void;
  resolveRequest: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [marketRates, setMarketRates] = useState<MarketRates>({
    goldRate: 0,
    silverRate: 0,
    marketIndex: 0,
    lastUpdated: new Date().toISOString(),
  });
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const client = await clientPromise;
      const db = client.db();
      const rates = await db.collection('marketRates').findOne({});
      if (rates) {
        setMarketRates(rates as any);
      }
      const requests = await db.collection('adminRequests').find({}).toArray();
      setAdminRequests(requests as any);
    };
    fetchData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const client = await clientPromise;
    const db = client.db();
    const userRecord = await db.collection('users').findOne({ email });
    if (userRecord && userRecord.password === password) {
      setUser({ email, name: userRecord.name as string, role: userRecord.role as UserRole });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateMarketRates = async (rates: Partial<MarketRates>) => {
    const newRates = {
      ...marketRates,
      ...rates,
      lastUpdated: new Date().toISOString(),
    };
    setMarketRates(newRates);
    const client = await clientPromise;
    const db = client.db();
    await db.collection('marketRates').updateOne({}, { $set: newRates }, { upsert: true });
  };

  const addAdminRequest = async (message: string) => {
    if (!user) return;
    const newRequest = {
      userId: user.email,
      userName: user.name,
      message,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('adminRequests').insertOne(newRequest);
    setAdminRequests(prev => [...prev, { ...newRequest, _id: result.insertedId.toString() }]);
  };

  const resolveRequest = async (id: string) => {
    setAdminRequests(prev =>
      prev.map(req => (req._id === id ? { ...req, status: 'resolved' } : req))
    );
    const client = await clientPromise;
    const db = client.db();
    const { ObjectId } = await import('mongodb');
    await db.collection('adminRequests').updateOne({ _id: new ObjectId(id) }, { $set: { status: 'resolved' } });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        marketRates,
        updateMarketRates,
        adminRequests,
        addAdminRequest,
        resolveRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
