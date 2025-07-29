import React from 'react';
import {
    Home,
    Search,
    History,
    Key,
    CreditCard,
    Settings,
    CheckCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const { t } = useLanguage();

    const navItems = [
        { id: 'dashboard', icon: Home, label: t('dashboard') },
        { id: 'search', icon: Search, label: t('search') },
        { id: 'api', icon: Key, label: t('api') },
        { id: 'plans', icon: CreditCard, label: t('plans') },
        { id: 'settings', icon: Settings, label: t('settings') },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50">
            <div className="flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors min-w-0 flex-1 ${activeTab === item.id
                                    ? 'text-blue-400 bg-blue-500/10'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`}
                        >
                            <Icon className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium truncate">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav; 