import React from 'react';
import { BarChart3, Clock, CheckCircle, Calendar } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import SearchTrends from '../components/Dashboard/SearchTrends';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title={t('dashboard.lifetime_search')}
          value="৭৮৫৯"
          icon={BarChart3}
          color="blue"
        />
        <StatsCard
          title={t('dashboard.free_limit')}
          value="৬১/৫০০০০"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title={t('dashboard.paid_limit')}
          value="০/০"
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title={t('dashboard.today_search')}
          value="৬১"
          icon={Calendar}
          color="yellow"
        />
      </div>

      {/* Expiry Date Card */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 text-red-400 rounded-lg">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-sm">{t('dashboard.expiry_date')}</p>
            <p className="text-xl lg:text-2xl font-bold text-white">২০২৫-১২-১১</p>
          </div>
        </div>
      </div>

      {/* Search Trends Chart */}
      <SearchTrends />
    </div>
  );
};

export default Dashboard;