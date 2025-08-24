// Base API Response Interface
export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
    details?: string[];
    timestamp?: string;
}

// User Profile Interface
export interface UserProfile {
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
    country?: string;
}

// Quota Interface
export interface Quota {
    daily: {
        used: number;
        limit: number;
        remaining: number;
    };
    monthly: {
        limit: number;
    };
    tier: string;
    lifetimeUsed?: number;
}

// User Interface
export interface User {
    id: string;
    username: string;
    email: string;
    apiKey: string;
    tier: 'free' | 'premium' | 'enterprise';
    quota: Quota;
    profile: UserProfile;
    settings?: {
        notifications: {
            email: boolean;
            quota: boolean;
        };
        language: string;
    };
    lastLogin?: string;
    createdAt?: string;
    isEmailVerified?: boolean;
    avatar?: string;
    plan?: string;
    searchCount?: number;
    dailySearchLimit?: number;
}

// Authentication Interfaces
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company?: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface ResendOTPRequest {
    email: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
    requiresVerification?: boolean;
    email?: string;
}

export interface ProfileUpdateRequest {
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    country?: string;
}

// Phone Check Interfaces
export interface PhoneCheckRequest {
    phone: string;
    lang?: 'bn' | 'en' | 'hi' | 'ur';
}

export interface DeliveryUser {
    phone: string;
    name?: string;
    address?: string;
}

export interface DeliveryStats {
    success: number;
    cancel: number;
    total: number;
}

export interface CourierCheck {
    status?: 'fraudulent' | 'clean' | 'suspicious';
    details?: string;
    stats?: DeliveryStats;
    fraud?: boolean | null | {
        phone: string;
        name: string;
        details: string;
        time: string;
    };
    user?: {
        phone: string | null;
        name: string | null;
        address: string | null;
    };
    fraudStatus?: 'fraudulent' | 'clean' | 'suspicious';
}

export interface AIAnalysis {
    analysis: string;
    language: string;
    summary: {
        totalSuccess: number;
        totalCancel: number;
        totalParcels: number;
        hasFraudReport: boolean;
    };
}

export interface PhoneCheckResponse {
    phone: string;
    fraud_score: number;
    risk_level: 'low' | 'medium' | 'high';
    analysis: string;
    courier_checks: {
        pathao?: CourierCheck;
        steadfast?: CourierCheck;
        redx?: CourierCheck;
    };
    ai_analysis: AIAnalysis;
    timestamp: string;
    cached: boolean;
}

// Caller ID Interfaces
export interface CallerIdUserInfo {
    name: string;
    image: string;
    score: number;
    access: string;
}

export interface CarrierInfo {
    carrier: string;
    numberType: string;
    nationalFormat: string;
    dialingCode: number;
    countryCode: string;
}

export interface CallerIdResponse {
    success: boolean;
    phone: string;
    data: {
        userInfo?: CallerIdUserInfo;
        carrierInfo: CarrierInfo;
    };
    cached: boolean;
}

// Analytics Interfaces
export interface AnalyticsSummary {
    period: string;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    cachedRequests: number;
    uniquePhones: number;
    avgResponseTime: number;
    topPhones: string[];
    dailyAverage: number;
    peakUsage: {
        date: string;
        requests: number;
    };
}

export interface DailyUsage {
    date: string;
    requests: number;
    successful: number;
    failed: number;
    cached: number;
}

export interface ServiceStats {
    pathaoSuccess: number;
    pathaoFailed: number;
    steadfastSuccess: number;
    steadfastFailed: number;
    redxSuccess: number;
    redxFailed: number;
    geminiSuccess: number;
    geminiFailed: number;
}

export interface PhoneHistoryItem {
    phone: string;
    timestamp: string;
    status: 'success' | 'error' | 'cached';
    responseTime: number;
    cached: boolean;
}

export interface PhoneHistoryResponse {
    phoneHistory: PhoneHistoryItem[];
    total: number;
}

export interface RequestLog {
    id: string;
    phone: string;
    timestamp: string;
    status: 'success' | 'error' | 'cached';
    responseTime: number;
    cached: boolean;
    userAgent: string;
    ipAddress: string;
}

export interface RequestLogsResponse {
    logs: RequestLog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalLogs: number;
        limit: number;
    };
}

// Health Check Interface
export interface HealthResponse {
    status: string;
    timestamp: string;
    services: string[];
    database: {
        status: string;
        host: string;
        readyState: number;
    };
    mongodb_uri: string;
}

// Error Response Interface
export interface ErrorResponse {
    error: string;
    message: string;
    details?: string[];
    quota?: Quota;
    requiresVerification?: boolean;
    email?: string;
}

// Rate Limit Interface
export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
    resetTime?: string;
}

// API Request Options
export interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

// API Client Configuration
export interface ApiClientConfig {
    baseURL: string;
    timeout: number;
    maxRetries: number;
    retryDelay: number;
    defaultHeaders: Record<string, string>;
}

// Dashboard Response Interfaces
export interface DashboardResponse {
    summary: AnalyticsSummary;
    dailyUsage: DailyUsage[];
    serviceStats: ServiceStats;
    recentPhones: {
        phone: string;
        createdAt: string;
        statusCode: number;
        cached: boolean;
    }[];
}

export interface DashboardComprehensiveResponse {
    dashboard: {
        lifetimeSearchCount: number;
        freeLimit: {
            used: number;
            limit: number;
            remaining: number;
        };
        paidLimit: {
            used: number;
            limit: number;
            remaining: number;
        };
        todaysSearch: number;
        expiryDate: string;
        searchTrends: {
            date: string;
            count: number;
        }[];
        subscription: {
            status: string;
            plan: string;
            isExpired: boolean;
            daysUntilExpiry: number;
            autoRenew: boolean;
        };
    };
    user: User;
}

// Stats Response Interface
export interface StatsResponse {
    stats: AnalyticsSummary;
    period: string;
}

// Daily Usage Response Interface
export interface DailyUsageResponse {
    dailyUsage: DailyUsage[];
    period: string;
}

// Service Stats Response Interface
export interface ServiceStatsResponse {
    serviceStats: ServiceStats;
    period: string;
}
