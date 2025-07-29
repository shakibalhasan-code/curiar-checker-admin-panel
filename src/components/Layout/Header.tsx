import React from 'react';
import { Bell, Moon, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return t('dashboard');
      case 'search': return t('header.search_title');
      case 'history': return t('history');
      case 'api': return t('header.api_title');
      case 'plans': return t('header.plans_title');
      case 'activation': return t('header.activation_title');
      case 'settings': return t('settings');
      case 'profile': return t('profile');
      default: return t('dashboard');
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return today.toLocaleDateString('bn-BD', options);
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 sticky top-0 z-40 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
          {activeTab === 'dashboard' && (
            <p className="text-slate-400 text-sm mt-1">{getCurrentDate()}</p>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
            <Moon className="w-5 h-5" />
          </button>

          <div className="relative">
            <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700">
              <Bell className="w-5 h-5" />
            </button>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center space-x-2 p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700"
          >
            <User className="w-5 h-5" />
            <span className="text-sm hidden sm:block">{user?.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;