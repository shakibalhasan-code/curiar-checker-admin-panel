// API Configuration
export const API_CONFIG = {
    // Base URL - can be overridden by environment variables
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

    // API Version
    VERSION: 'v1',

    // Timeout settings
    TIMEOUT: 30000, // 30 seconds

    // Retry settings
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    // Authentication
    AUTH: {
        REGISTER: `/auth/register`,
        LOGIN: `/auth/login`,
        PROFILE: `/auth/profile`,
        UPDATE_PROFILE: `/auth/profile`,
        REGENERATE_API_KEY: `/auth/regenerate-api-key`,
        CHANGE_PASSWORD: `/auth/change-password`,
    },

    // Phone Check API
    CHECK: {
        PHONE: (phone: string, lang?: string) =>
            `/check/${phone}${lang ? `?lang=${lang}` : ''}`,
        CALLER_ID: (phone: string) => `/callerId/${phone}`,
        FRAUD_REPORTS: '/steadfastUserAct',
    },

    // Analytics
    ANALYTICS: {
        DASHBOARD: (days?: number) =>
            `/analytics/dashboard${days ? `?days=${days}` : ''}`,
        DASHBOARD_COMPREHENSIVE: '/analytics/dashboard-comprehensive',
        STATS: (days?: number) =>
            `/analytics/stats${days ? `?days=${days}` : ''}`,
        PHONE_HISTORY: (limit?: number) =>
            `/analytics/phone-history${limit ? `?limit=${limit}` : ''}`,
        DAILY_USAGE: (days?: number) =>
            `/analytics/daily-usage${days ? `?days=${days}` : ''}`,
        SERVICE_STATS: (days?: number) =>
            `/analytics/service-stats${days ? `?days=${days}` : ''}`,
    },

    // Health Check
    HEALTH: '/health',
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
    LOCKED: 423,
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
} as const; 