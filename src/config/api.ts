// API Configuration
export const API_CONFIG = {
    // Base URLs - can be overridden by environment variables
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://45.80.181.58:3000',

    // API Version
    VERSION: 'v1',

    // Timeout settings
    TIMEOUT: 30000, // 30 seconds

    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second

    // Rate limiting
    RATE_LIMIT: {
        GLOBAL_LIMIT: 50,
        GLOBAL_WINDOW: 15 * 60 * 1000, // 15 minutes
        USER_LIMIT: 100,
        USER_WINDOW: 15 * 60 * 1000, // 15 minutes
    }
} as const;

// API Endpoints - Organized by category
export const API_ENDPOINTS = {
    // Public endpoints
    PUBLIC: {
        HEALTH: '/health',
    },

    // Authentication endpoints
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        VERIFY_OTP: '/auth/verify-otp',
        RESEND_OTP: '/auth/resend-otp',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        CHANGE_PASSWORD: '/auth/change-password',
        PROFILE: '/auth/profile',
        UPDATE_PROFILE: '/auth/profile', // PUT method
    },

    // Core service endpoints
    CORE: {
        CHECK_PHONE: (phone: string, lang?: string) =>
            `/check/${phone}${lang ? `?lang=${lang}` : ''}`,
        CALLER_ID: (phone: string) => `/callerId/${phone}`,
    },

    // Analytics endpoints
    ANALYTICS: {
        STATS: (days?: number) =>
            `/analytics/stats${days ? `?days=${days}` : ''}`,
        DAILY_USAGE: (days?: number) =>
            `/analytics/daily-usage${days ? `?days=${days}` : ''}`,
        PHONE_HISTORY: (limit?: number) =>
            `/analytics/phone-history${limit ? `?limit=${limit}` : ''}`,
        SERVICE_STATS: (days?: number) =>
            `/analytics/service-stats${days ? `?days=${days}` : ''}`,
        REQUEST_LOGS: (params?: {
            page?: number;
            limit?: number;
            status?: string;
            startDate?: string;
            endDate?: string;
        }) => {
            const searchParams = new URLSearchParams();
            if (params?.page) searchParams.append('page', params.page.toString());
            if (params?.limit) searchParams.append('limit', params.limit.toString());
            if (params?.status) searchParams.append('status', params.status);
            if (params?.startDate) searchParams.append('startDate', params.startDate);
            if (params?.endDate) searchParams.append('endDate', params.endDate);

            const queryString = searchParams.toString();
            return `/analytics/request-logs${queryString ? `?${queryString}` : ''}`;
        },
    },
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error occurred. Please check your connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    UNAUTHORIZED: 'Authentication required. Please login again.',
    FORBIDDEN: 'Access denied. Insufficient permissions.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error occurred. Please try again later.',
    QUOTA_EXCEEDED: 'Daily quota exceeded. Please upgrade your plan.',
    ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later.',
    INVALID_PHONE: 'Invalid phone number format.',
    GENERIC_ERROR: 'An error occurred. Please try again.',
    EMAIL_NOT_VERIFIED: 'Email not verified. Please verify your email before logging in.',
    OTP_REQUIRED: 'OTP verification required.',
    INVALID_OTP: 'Invalid OTP provided.',
} as const;

// Language Codes
export const LANGUAGE_CODES = {
    BENGALI: 'bn',
    ENGLISH: 'en',
    HINDI: 'hi',
    URDU: 'ur',
} as const;

// Rate Limit Headers
export const RATE_LIMIT_HEADERS = {
    LIMIT: 'X-RateLimit-Limit',
    REMAINING: 'X-RateLimit-Remaining',
    RESET: 'X-RateLimit-Reset',
    RESET_TIME: 'X-RateLimit-ResetTime',
} as const;

// Phone Number Validation
export const PHONE_VALIDATION = {
    REGEX: /^01[3-9]\d{8}$/,
    FORMAT: '01XXXXXXXXX',
    EXAMPLE: '01712345678',
} as const;

// API Response Status
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    CACHED: 'cached',
} as const;
