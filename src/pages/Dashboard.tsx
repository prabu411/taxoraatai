import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import PortfolioSection from '@/components/dashboard/PortfolioSection';
import BillTracker from '@/components/dashboard/BillTracker';
import GSTCompliance from '@/components/dashboard/GSTCompliance';
import BusinessTools from '@/components/dashboard/BusinessTools';
import AIAssistant from '@/components/dashboard/AIAssistant';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    // Set default section based on user role
    if (user?.role === 'admin') {
      setActiveSection('admin');
    } else {
      setActiveSection('overview');
    }
  }, [isAuthenticated, navigate, user]);

  const renderSection = () => {
    // Admin users can only access admin panel
    if (user?.role === 'admin') {
      return <AdminDashboard />;
    }

    // Regular users access their dashboard sections
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'portfolio':
        return <PortfolioSection />;
      case 'bills':
        return <BillTracker />;
      case 'gst':
        return <GSTCompliance />;
      case 'business':
        return <BusinessTools />;
      case 'ai':
        return <AIAssistant />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
