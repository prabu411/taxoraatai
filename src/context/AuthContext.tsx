import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// All database logic has been moved to /api routes. This file now only makes fetch calls.

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
  updateMarketRates: (rates: Partial<Omit<MarketRates, 'lastUpdated'>>) => Promise<void>;
  adminRequests: AdminRequest[];
  addAdminRequest: (message: string) => Promise<void>;
  resolveRequest: (id: string) => Promise<void>;
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
    const fetchAppData = async () => {
      try {
        const response = await fetch('/api/app-data');
        const data = await response.json();
        if (response.ok && data.success) {
          if (data.marketRates) setMarketRates(data.marketRates);
          if (data.adminRequests) setAdminRequests(data.adminRequests);
        }
      } catch (error) {
        console.error("Failed to fetch app data:", error);
      }
    };
    fetchAppData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const addAdminRequest = async (message: string) => {
    if (!user) return;
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.email, userName: user.name, message }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminRequests(prev => [data.request, ...prev]);
      }
    } catch (error) {
      console.error("Failed to add admin request:", error);
    }
  };

  const resolveRequest = async (id: string) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        setAdminRequests(prev =>
          prev.map(req => (req._id === id ? { ...req, status: 'resolved' } : req))
        );
      }
    } catch (error) {
      console.error("Failed to resolve request:", error);
    }
  };

  const updateMarketRates = async (rates: Partial<Omit<MarketRates, 'lastUpdated'>>) => {
    try {
      const response = await fetch('/api/market-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rates),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMarketRates(data.updatedRates);
      }
    } catch (error) {
      console.error("Failed to update market rates:", error);
    }
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
