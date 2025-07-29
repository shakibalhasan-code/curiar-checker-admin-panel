import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Pages
import Dashboard from './pages/Dashboard';
import SearchNow from './pages/SearchNow';
import History from './pages/History';
import API from './pages/API';
import Plans from './pages/Plans';
import Activation from './pages/Activation';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Auth pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import EmailVerify from './pages/auth/EmailVerify';

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'search': return <SearchNow />;
      case 'history': return <History />;
      case 'api': return <API />;
      case 'plans': return <Plans />;
      case 'activation': return <Activation />;
      case 'settings': return <Settings />;
      case 'profile': return <Profile />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col ml-64">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const AuthFlow: React.FC = () => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'verify'>('login');

  switch (authMode) {
    case 'signup':
      return (
        <Signup
          onSwitchToLogin={() => setAuthMode('login')}
          onSwitchToVerify={() => setAuthMode('verify')}
        />
      );
    case 'verify':
      return (
        <EmailVerify
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    default:
      return (
        <Login
          onSwitchToSignup={() => setAuthMode('signup')}
          onSwitchToVerify={() => setAuthMode('verify')}
        />
      );
  }
};

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <AuthFlow />;
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