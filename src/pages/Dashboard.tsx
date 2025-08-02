import React from 'react';
import { BarChart3, Clock, CheckCircle, Calendar } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import SearchTrends from '../components/Dashboard/SearchTrends';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Get real user data
  const dailyUsed = user?.quota?.daily?.used || 0;
  const dailyLimit = user?.quota?.daily?.limit || 0;
  const dailyRemaining = user?.quota?.daily?.remaining || 0;
  const monthlyLimit = user?.quota?.monthly?.limit || 0;
  const tier = user?.tier || 'free';

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title={t('dashboard.lifetime_search')}
          value={user?.quota?.daily?.used?.toString() || "0"}
          icon={BarChart3}
          color="blue"
        />
        <StatsCard
          title={t('dashboard.free_limit')}
          value={`${dailyUsed}/${dailyLimit}`}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title={t('dashboard.paid_limit')}
          value={`0/${monthlyLimit}`}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title={t('dashboard.today_search')}
          value={dailyUsed.toString()}
          icon={Calendar}
          color="yellow"
        />
      </div>

      {/* User Info Card */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Current Plan</p>
              <p className="text-xl lg:text-2xl font-bold text-white capitalize">{tier} Plan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Daily Usage</p>
            <p className="text-lg font-semibold text-white">{dailyRemaining} remaining</p>
          </div>
        </div>
      </div>

      {/* Search Trends Chart */}
      <SearchTrends />
    </div>
  );
};

export default Dashboard;