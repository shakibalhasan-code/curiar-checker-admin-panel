import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
    AnalyticsSummary,
    DailyUsage,
    ServiceStats,
    PhoneHistoryResponse,
    RequestLogsResponse,
    StatsResponse,
    DailyUsageResponse,
    ServiceStatsResponse,
    DashboardResponse,
    DashboardComprehensiveResponse
} from '../types/api';

export class AnalyticsService {
    // Get usage statistics
    static async getStats(days: number = 30): Promise<StatsResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.STATS(days);
            const response = await apiClient.get<StatsResponse>(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get daily usage data for charts
    static async getDailyUsage(days: number = 7): Promise<DailyUsageResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.DAILY_USAGE(days);
            const response = await apiClient.get<DailyUsageResponse>(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get phone search history
    static async getPhoneHistory(limit: number = 50): Promise<PhoneHistoryResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.PHONE_HISTORY(limit);
            const response = await apiClient.get<PhoneHistoryResponse>(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get service performance statistics
    static async getServiceStats(days: number = 30): Promise<ServiceStatsResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.SERVICE_STATS(days);
            const response = await apiClient.get<ServiceStatsResponse>(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get API request logs
    static async getRequestLogs(params?: {
        page?: number;
        limit?: number;
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<RequestLogsResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.REQUEST_LOGS(params);
            const response = await apiClient.get<RequestLogsResponse>(endpoint);
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get comprehensive dashboard data
    static async getDashboardComprehensive(): Promise<DashboardComprehensiveResponse> {
        try {
            // This would be a custom endpoint that combines multiple analytics
            // For now, we'll simulate it by combining multiple calls
            const [stats, dailyUsage, serviceStats] = await Promise.all([
                this.getStats(30),
                this.getDailyUsage(30),
                this.getServiceStats(30)
            ]);

            // Create a mock comprehensive response
            const mockResponse: DashboardComprehensiveResponse = {
                dashboard: {
                    lifetimeSearchCount: stats.stats.totalRequests,
                    freeLimit: {
                        used: stats.stats.totalRequests,
                        limit: 1000,
                        remaining: Math.max(0, 1000 - stats.stats.totalRequests)
                    },
                    paidLimit: {
                        used: 0,
                        limit: 5000,
                        remaining: 5000
                    },
                    todaysSearch: dailyUsage.dailyUsage[dailyUsage.dailyUsage.length - 1]?.requests || 0,
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    searchTrends: dailyUsage.dailyUsage.map(day => ({
                        date: day.date,
                        count: day.requests
                    })),
                    subscription: {
                        status: 'active',
                        plan: 'free',
                        isExpired: false,
                        daysUntilExpiry: 30,
                        autoRenew: false
                    }
                },
                user: {
                    id: '',
                    username: '',
                    email: '',
                    apiKey: '',
                    tier: 'free',
                    quota: {
                        daily: {
                            used: 0,
                            limit: 100,
                            remaining: 100
                        },
                        monthly: {
                            limit: 1000
                        },
                        tier: 'free'
                    },
                    profile: {
                        firstName: '',
                        lastName: '',
                        company: '',
                        phone: ''
                    }
                }
            };

            return mockResponse;
        } catch (error) {
            throw error;
        }
    }

    // Parse dashboard data for charts
    static parseDashboardForCharts(dashboard: DashboardComprehensiveResponse) {
        return {
            searchTrends: dashboard.dashboard.searchTrends,
            usageStats: {
                lifetime: dashboard.dashboard.lifetimeSearchCount,
                today: dashboard.dashboard.todaysSearch,
                freeUsed: dashboard.dashboard.freeLimit.used,
                freeRemaining: dashboard.dashboard.freeLimit.remaining
            },
            subscription: dashboard.dashboard.subscription
        };
    }

    // Parse service stats for charts
    static parseServiceStatsForCharts(stats: ServiceStatsResponse) {
        return {
            labels: ['Pathao', 'Steadfast', 'RedX', 'Gemini'],
            successData: [
                stats.serviceStats.pathaoSuccess,
                stats.serviceStats.steadfastSuccess,
                stats.serviceStats.redxSuccess,
                stats.serviceStats.geminiSuccess
            ],
            failedData: [
                stats.serviceStats.pathaoFailed,
                stats.serviceStats.steadfastFailed,
                stats.serviceStats.redxFailed,
                stats.serviceStats.geminiFailed
            ]
        };
    }

    // Parse daily usage for charts
    static parseDailyUsageForCharts(dailyUsage: DailyUsageResponse) {
        return {
            labels: dailyUsage.dailyUsage.map(day => day.date),
            requests: dailyUsage.dailyUsage.map(day => day.requests),
            successful: dailyUsage.dailyUsage.map(day => day.successful),
            failed: dailyUsage.dailyUsage.map(day => day.failed),
            cached: dailyUsage.dailyUsage.map(day => day.cached)
        };
    }

    // Get performance metrics
    static calculatePerformanceMetrics(stats: AnalyticsSummary) {
        const successRate = stats.totalRequests > 0
            ? (stats.successfulRequests / stats.totalRequests) * 100
            : 0;

        const cacheHitRate = stats.totalRequests > 0
            ? (stats.cachedRequests / stats.totalRequests) * 100
            : 0;

        return {
            successRate: Math.round(successRate * 100) / 100,
            cacheHitRate: Math.round(cacheHitRate * 100) / 100,
            avgResponseTime: stats.avgResponseTime,
            totalRequests: stats.totalRequests,
            uniquePhones: stats.uniquePhones
        };
    }

    // Format date for display
    static formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Format timestamp for display
    static formatTimestamp(timestamp: string): string {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Get status color for UI
    static getStatusColor(status: 'success' | 'error' | 'cached'): string {
        switch (status) {
            case 'success':
                return 'text-green-500';
            case 'error':
                return 'text-red-500';
            case 'cached':
                return 'text-blue-500';
            default:
                return 'text-gray-500';
        }
    }

    // Get status background color for UI
    static getStatusBgColor(status: 'success' | 'error' | 'cached'): string {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            case 'cached':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Calculate percentage
    static calculatePercentage(value: number, total: number): number {
        if (total === 0) return 0;
        return Math.round((value / total) * 100);
    }

    // Format number with commas
    static formatNumber(num: number): string {
        return num.toLocaleString();
    }

    // Get time ago string
    static getTimeAgo(timestamp: string): string {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

        return this.formatDate(timestamp);
    }
}

export default AnalyticsService;
