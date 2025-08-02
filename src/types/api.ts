// Base API Response Interface
export interface ApiResponse<T = any> {
    success?: boolean;
    message?: string;
    data?: T;
    error?: string;
    details?: string[];
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

export interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

export interface ProfileUpdateRequest {
    firstName?: string;
    lastName?: string;
    company?: string;
    phone?: string;
    country?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
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

export interface FraudReport {
    phone: string;
    name: string;
    details: string;
    time: string;
}

export interface ServiceData {
    user: DeliveryUser;
    stats: DeliveryStats;
    fraud?: FraudReport;
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
    pathao?: ServiceData;
    steadfast?: ServiceData;
    redx?: ServiceData;
    ai_analysis: AIAnalysis;
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
    userInfo?: CallerIdUserInfo;
    carrierInfo: CarrierInfo;
    cached: boolean;
}

// Fraud Reports Interface
export interface FraudReportsResponse {
    data: FraudReport[];
    next?: string;
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
}

export interface DailyUsage {
    _id: string;
    requests: number;
    successful: number;
    cached: number;
    avgResponseTime: number;
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

export interface StatsResponse {
    stats: {
        totalRequests: number;
        successfulRequests: number;
        failedRequests: number;
        cachedRequests: number;
        uniquePhones: number;
        avgResponseTime: number;
        totalResponseTime: number;
    };
    period: string;
}

export interface PhoneHistoryResponse {
    phoneHistory: {
        phone: string;
        createdAt: string;
        statusCode: number;
        cached: boolean;
    }[];
    total: number;
}

export interface DailyUsageResponse {
    dailyUsage: DailyUsage[];
    period: string;
}

export interface ServiceStatsResponse {
    serviceStats: ServiceStats;
    period: string;
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
}

// Rate Limit Interface
export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
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