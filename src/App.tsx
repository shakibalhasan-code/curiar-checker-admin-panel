import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import SearchNow from './pages/SearchNow';
import History from './pages/History';
import API from './pages/API';
import Plans from './pages/Plans';
import Activation from './pages/Activation';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'search':
        return <SearchNow />;
      case 'history':
        return <History />;
      case 'api':
        return <API />;
      case 'plans':
        return <Plans />;
      case 'activation':
        return <Activation />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden lg:block">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Mobile Header - Visible only on mobile */}
        <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Courier Order</h1>
                <p className="text-slate-400 text-sm">Rate Checker</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto pb-20 lg:pb-0 relative">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <div className="lg:hidden">
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;