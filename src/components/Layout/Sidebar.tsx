import React from 'react';
import {
  Home,
  Search,
  // History, // Temporarily unused
  Key,
  // CreditCard, // Temporarily unused (plans hidden)
  Settings,
  LogOut,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home, section: t('main_menu') },
    { id: 'search', label: t('search'), icon: Search, section: t('main_menu') },
    // { id: 'history', label: t('history'), icon: History, section: t('history_section') },
    { id: 'api', label: t('api'), icon: Key, section: t('system') },
    // { id: 'plans', label: t('plans'), icon: CreditCard, section: t('system') }, // Temporarily hidden
    { id: 'activation', label: t('activation'), icon: CheckCircle, section: t('system') },
    { id: 'settings', label: t('settings'), icon: Settings, section: t('system') },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="w-64 bg-slate-900 min-h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">{t('sidebar.title')}</h1>
            <p className="text-slate-400 text-sm">{t('sidebar.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 py-6 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {section}
            </h3>
            <nav className="space-y-1 px-3">
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-6 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {t('logout')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;