import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle, Calendar } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import SearchTrends from '../components/Dashboard/SearchTrends';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { AnalyticsService, NotificationService } from '../services';
import { DashboardComprehensiveResponse } from '../types/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState<DashboardComprehensiveResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await AnalyticsService.getDashboardComprehensive();
      setDashboardData(data);
      NotificationService.analyticsLoaded();
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      NotificationService.analyticsFailed(error.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  // Get real user data or fallback to stored user
  const dailyUsed = user?.quota?.daily?.used || dashboardData?.dashboard?.freeLimit?.used || 0;
  const dailyLimit = user?.quota?.daily?.limit || dashboardData?.dashboard?.freeLimit?.limit || 0;
  const dailyRemaining = user?.quota?.daily?.remaining || dashboardData?.dashboard?.freeLimit?.remaining || 0;
  const monthlyLimit = user?.quota?.monthly?.limit || dashboardData?.dashboard?.paidLimit?.limit || 0;
  const tier = user?.tier || dashboardData?.user?.tier || 'free';
  const lifetimeSearch = user?.quota?.lifetimeUsed || dashboardData?.dashboard?.lifetimeSearchCount || 0;

  if (isLoading) {
    return (
      <div className="p-4 lg:p-6">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatsCard
          title={t('dashboard.lifetime_search')}
          value={lifetimeSearch.toString()}
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
          value={`${dashboardData?.dashboard?.paidLimit?.used || 0}/${monthlyLimit}`}
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



      {/* Subscription Status */}
      {dashboardData?.dashboard?.subscription && (
        <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-4">Subscription Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Status</h4>
              <p className={`text-white font-bold text-lg capitalize ${dashboardData.dashboard.subscription.status === 'active' ? 'text-green-400' : 'text-red-400'
                }`}>
                {dashboardData.dashboard.subscription.status}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Plan</h4>
              <p className="text-white font-bold text-lg capitalize">
                {dashboardData.dashboard.subscription.plan}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Days Until Expiry</h4>
              <p className={`text-white font-bold text-lg ${dashboardData.dashboard.subscription.daysUntilExpiry <= 7 ? 'text-red-400' : 'text-green-400'
                }`}>
                {dashboardData.dashboard.subscription.daysUntilExpiry}
              </p>
            </div>
            <div className="bg-slate-700 rounded-lg p-4">
              <h4 className="text-slate-400 text-sm">Auto Renew</h4>
              <p className={`text-white font-bold text-lg ${dashboardData.dashboard.subscription.autoRenew ? 'text-green-400' : 'text-yellow-400'
                }`}>
                {dashboardData.dashboard.subscription.autoRenew ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Trends Chart */}
      <SearchTrends />
    </div>
  );
};

export default Dashboard;