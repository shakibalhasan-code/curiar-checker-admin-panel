import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
    DashboardResponse,
    DashboardComprehensiveResponse,
    StatsResponse,
    PhoneHistoryResponse,
    DailyUsageResponse,
    ServiceStatsResponse,
} from '../types/api';

export class AnalyticsService {
    // Get dashboard summary
    static async getDashboard(days: number = 7): Promise<DashboardResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.DASHBOARD(days);
            const response = await apiClient.get<DashboardResponse>(endpoint);

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get comprehensive dashboard data
    static async getDashboardComprehensive(): Promise<DashboardComprehensiveResponse> {
        try {
            const response = await apiClient.get<DashboardComprehensiveResponse>(
                API_ENDPOINTS.ANALYTICS.DASHBOARD_COMPREHENSIVE
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

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

    // Get phone search history
    static async getPhoneHistory(limit: number = 20): Promise<PhoneHistoryResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.PHONE_HISTORY(limit);
            const response = await apiClient.get<PhoneHistoryResponse>(endpoint);

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get daily usage chart data
    static async getDailyUsage(days: number = 7): Promise<DailyUsageResponse> {
        try {
            const endpoint = API_ENDPOINTS.ANALYTICS.DAILY_USAGE(days);
            const response = await apiClient.get<DailyUsageResponse>(endpoint);

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

    // Calculate cache hit rate
    static calculateCacheHitRate(summary: any): number {
        if (summary.totalRequests === 0) return 0;
        return Math.round((summary.cachedRequests / summary.totalRequests) * 100);
    }

    // Calculate success rate
    static calculateSuccessRate(summary: any): number {
        if (summary.totalRequests === 0) return 0;
        return Math.round((summary.successfulRequests / summary.totalRequests) * 100);
    }

    // Format response time for display
    static formatResponseTime(ms: number): string {
        if (ms < 1000) {
            return `${ms}ms`;
        } else {
            return `${(ms / 1000).toFixed(1)}s`;
        }
    }

    // Get status color based on success rate
    static getStatusColor(successRate: number): string {
        if (successRate >= 90) return 'text-green-500';
        if (successRate >= 70) return 'text-yellow-500';
        return 'text-red-500';
    }

    // Get status background color
    static getStatusBgColor(successRate: number): string {
        if (successRate >= 90) return 'bg-green-100 text-green-800';
        if (successRate >= 70) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    }

    // Format date for display
    static formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format relative time
    static formatRelativeTime(dateString: string): string {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        }
    }

    // Parse dashboard data for charts
    static parseDashboardForCharts(dashboard: DashboardComprehensiveResponse) {
        const { dashboard: data, user } = dashboard;

        // Parse search trends for chart
        const searchTrends = data.searchTrends.map(trend => ({
            date: trend.date,
            count: trend.count
        }));

        // Parse daily usage for chart
        const dailyUsage = data.searchTrends.map(trend => ({
            date: trend.date,
            searches: trend.count
        }));

        // Calculate total statistics
        const totalStats = {
            lifetimeSearches: data.lifetimeSearchCount,
            todaysSearches: data.todaysSearch,
            freeLimitUsed: data.freeLimit.used,
            freeLimitRemaining: data.freeLimit.remaining,
            paidLimitUsed: data.paidLimit.used,
            paidLimitRemaining: data.paidLimit.remaining,
            daysUntilExpiry: data.subscription.daysUntilExpiry,
            isExpired: data.subscription.isExpired,
            autoRenew: data.subscription.autoRenew
        };

        return {
            searchTrends,
            dailyUsage,
            totalStats,
            user
        };
    }

    // Parse service stats for charts
    static parseServiceStatsForCharts(stats: any) {
        const services = [
            { name: 'Pathao', success: stats.pathaoSuccess, failed: stats.pathaoFailed },
            { name: 'Steadfast', success: stats.steadfastSuccess, failed: stats.steadfastFailed },
            { name: 'RedX', success: stats.redxSuccess, failed: stats.redxFailed },
            { name: 'Gemini', success: stats.geminiSuccess, failed: stats.geminiFailed }
        ];

        return services.map(service => ({
            name: service.name,
            success: service.success,
            failed: service.failed,
            total: service.success + service.failed,
            successRate: service.total > 0 ? Math.round((service.success / service.total) * 100) : 0
        }));
    }

    // Get quota status
    static getQuotaStatus(quota: any): 'good' | 'warning' | 'critical' {
        const usagePercentage = (quota.daily.used / quota.daily.limit) * 100;

        if (usagePercentage >= 90) return 'critical';
        if (usagePercentage >= 70) return 'warning';
        return 'good';
    }

    // Get quota color
    static getQuotaColor(status: 'good' | 'warning' | 'critical'): string {
        switch (status) {
            case 'good':
                return 'text-green-500';
            case 'warning':
                return 'text-yellow-500';
            case 'critical':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }

    // Get quota background color
    static getQuotaBgColor(status: 'good' | 'warning' | 'critical'): string {
        switch (status) {
            case 'good':
                return 'bg-green-100 text-green-800';
            case 'warning':
                return 'bg-yellow-100 text-yellow-800';
            case 'critical':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Calculate remaining days
    static calculateRemainingDays(expiryDate: string): number {
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diffTime = expiry.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Get subscription status
    static getSubscriptionStatus(subscription: any): 'active' | 'expired' | 'expiring' {
        if (subscription.isExpired) return 'expired';
        if (subscription.daysUntilExpiry <= 7) return 'expiring';
        return 'active';
    }

    // Get subscription color
    static getSubscriptionColor(status: 'active' | 'expired' | 'expiring'): string {
        switch (status) {
            case 'active':
                return 'text-green-500';
            case 'expiring':
                return 'text-yellow-500';
            case 'expired':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }
}

export default AnalyticsService; 