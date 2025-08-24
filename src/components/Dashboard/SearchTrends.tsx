import React, { useState, useEffect } from 'react';
import { TrendingUp, Calendar, BarChart3, Activity, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AnalyticsService } from '../../services';

interface DailyUsageData {
  _id: string;
  requests: number;
  successful: number;
  cached: number;
  avgResponseTime: number;
}

interface DailyUsageResponse {
  dailyUsage: DailyUsageData[];
  period: string;
}

type ChartFilter = 'requests' | 'successful' | 'failed';

const SearchTrends: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DailyUsageData[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<ChartFilter>('requests');
  const [error, setError] = useState<string | null>(null);

  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await AnalyticsService.getDailyUsage(30);
        setData(response.dailyUsage);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch daily usage:', err);
        setError(err.message || 'Failed to load data');
        // Fallback to mock data if API fails
        setData(generateMockData());
      } finally {
        setIsLoading(false);
        // Trigger animation after data loads
        setTimeout(() => setIsLoaded(true), 100);
      }
    };

    fetchData();
  }, []);

  // Generate mock data as fallback
  const generateMockData = (): DailyUsageData[] => {
    const mockData: DailyUsageData[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const requests = Math.floor(Math.random() * 50) + 20;
      const successful = Math.floor(requests * 0.85) + Math.floor(Math.random() * 10);
      const cached = Math.floor(requests * 0.3) + Math.floor(Math.random() * 15);

      mockData.push({
        _id: date.toISOString().split('T')[0],
        requests,
        successful,
        cached,
        avgResponseTime: Math.floor(Math.random() * 500) + 200
      });
    }

    return mockData;
  };

  // Calculate metrics based on selected filter
  const getChartData = () => {
    return data.map(item => {
      switch (selectedFilter) {
        case 'requests':
          return item.requests;
        case 'successful':
          return item.successful;
        case 'failed':
          return item.requests - item.successful;
        default:
          return item.requests;
      }
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData, 1);

  // Calculate totals
  const totalRequests = data.reduce((sum, item) => sum + item.requests, 0);
  const totalSuccessful = data.reduce((sum, item) => sum + item.successful, 0);
  const totalFailed = totalRequests - totalSuccessful;
  const averageRequests = Math.round(totalRequests / data.length);
  const successRate = totalRequests > 0 ? Math.round((totalSuccessful / totalRequests) * 100) : 0;

  // Helper function to get color based on selected filter
  const getFilterColor = (filter: ChartFilter): string => {
    switch (filter) {
      case 'requests':
        return '#3b82f6'; // blue-500
      case 'successful':
        return '#10b981'; // emerald-500
      case 'failed':
        return '#ef4444'; // red-500
      default:
        return '#3b82f6';
    }
  };

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-red-400 mb-2">Failed to load data</p>
            <p className="text-slate-400 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700/50 shadow-2xl backdrop-blur-sm">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Search Analytics</h3>
            <p className="text-slate-400 text-sm">Last 30 days performance</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">Monthly View</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6 p-1 bg-slate-700/30 rounded-xl">
        <button
          onClick={() => setSelectedFilter('requests')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedFilter === 'requests'
            ? 'bg-blue-500 text-white shadow-lg'
            : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
            }`}
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Requests</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter('successful')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedFilter === 'successful'
            ? 'bg-emerald-500 text-white shadow-lg'
            : 'text-emerald-400 hover:text-white hover:bg-slate-600/50'
            }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span>Successful</span>
          </div>
        </button>

        <button
          onClick={() => setSelectedFilter('failed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedFilter === 'failed'
            ? 'bg-red-500 text-white shadow-lg'
            : 'text-red-400 hover:text-white hover:bg-slate-600/50'
            }`}
        >
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4" />
            <span>Failed</span>
          </div>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl p-4 border border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-xs font-medium">Total Requests</p>
              <p className="text-xl font-bold text-white">{totalRequests.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-6 h-6 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-2xl p-4 border border-emerald-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-xs font-medium">Success Rate</p>
              <p className="text-xl font-bold text-white">{successRate}%</p>
            </div>
            <CheckCircle className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-2xl p-4 border border-red-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-xs font-medium">Failed</p>
              <p className="text-xl font-bold text-white">{totalFailed}</p>
            </div>
            <XCircle className="w-6 h-6 text-red-400" />
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-slate-400 font-medium">
          <span>{Math.ceil(maxValue * 1.2)}</span>
          <span>{Math.ceil(maxValue * 0.9)}</span>
          <span>{Math.ceil(maxValue * 0.6)}</span>
          <span>{Math.ceil(maxValue * 0.3)}</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 h-full">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div
              key={percent}
              className="absolute w-full border-t border-slate-700/30"
              style={{ top: `${100 - percent}%` }}
            />
          ))}
        </div>

        {/* Line Chart */}
        <div className="ml-16 h-80 relative">
          {/* SVG for line chart */}
          <svg className="w-full h-full" viewBox={`0 0 ${Math.max(data.length * 20, 600)} 320`}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => (
              <line
                key={percent}
                x1="0"
                y1={320 - (percent * 3.2)}
                x2="100%"
                y2={320 - (percent * 3.2)}
                stroke="rgba(148, 163, 184, 0.2)"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            ))}

            {/* Line chart path */}
            {data.length > 0 && (
              <path
                d={data.map((item, index) => {
                  const x = index * 20;
                  const y = 320 - ((chartData[index] / maxValue) * 320);
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke={getFilterColor(selectedFilter)}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500 ease-out"
                style={{
                  strokeDasharray: isLoaded ? 'none' : '0,1000',
                  strokeDashoffset: isLoaded ? 0 : 1000,
                }}
              />
            )}

            {/* Data points */}
            {data.map((item, index) => {
              const x = index * 20;
              const y = 320 - ((chartData[index] / maxValue) * 320);
              const isHovered = hoveredIndex === index;

              return (
                <g key={index}>
                  {/* Hover area */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />

                  {/* Data point */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? "6" : "4"}
                    fill={getFilterColor(selectedFilter)}
                    className="transition-all duration-200"
                    style={{
                      filter: isHovered ? 'drop-shadow(0 0 8px currentColor)' : 'none',
                    }}
                  />

                  {/* Tooltip */}
                  {isHovered && (
                    <foreignObject
                      x={x - 60}
                      y={y - 80}
                      width="120"
                      height="60"
                      className="pointer-events-none"
                    >
                      <div className="bg-slate-900 text-white text-xs rounded-lg p-2 border border-slate-700 shadow-xl">
                        <div className="text-center">
                          <p className="font-semibold">{new Date(item._id).toLocaleDateString()}</p>
                          <p className="text-blue-400">{chartData[index]} {selectedFilter}</p>
                          <p className="text-slate-400 text-xs">Response: {item.avgResponseTime}ms</p>
                        </div>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* X-axis labels */}
        <div className="mt-4 ml-16 flex justify-between text-xs text-slate-500">
          {data.length > 0 && (
            <>
              <span>{new Date(data[0]._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(data[Math.floor(data.length * 0.25)]._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(data[Math.floor(data.length * 0.5)]._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(data[Math.floor(data.length * 0.75)]._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(data[data.length - 1]._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </>
          )}
        </div>
      </div>

      {/* Bottom info */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div className="flex items-center space-x-4">
            <span>Data updates every hour</span>
            <span>•</span>
            <span>Showing: {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}</span>
            <span>•</span>
            <span>Period: {data.length > 0 ? data.length : 30} days</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <span>Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTrends;