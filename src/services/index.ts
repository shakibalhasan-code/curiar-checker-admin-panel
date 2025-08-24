// Export all services
export { default as AuthService } from './authService';
export { default as PhoneCheckService } from './phoneCheckService';
export { default as AnalyticsService } from './analyticsService';
export { default as NotificationService } from './notificationService';
export { default as apiClient } from './apiClient';

// Export types
export type { Notification, NotificationType } from './notificationService';
export { ApiError } from './apiClient';

// Export API configuration
export { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, LANGUAGE_CODES, PHONE_VALIDATION } from '../config/api';

// Export API types
export type {
    User,
    AuthResponse,
    RegisterRequest,
    LoginRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    ProfileUpdateRequest,
    PhoneCheckResponse,
    CallerIdResponse,
    AnalyticsSummary,
    DailyUsage,
    ServiceStats,
    PhoneHistoryResponse,
    RequestLogsResponse,
    DashboardResponse,
    DashboardComprehensiveResponse,
    StatsResponse,
    PhoneHistoryResponse,
    DailyUsageResponse,
    ServiceStatsResponse,
    HealthResponse,
    ErrorResponse,
    RateLimitInfo,
} from '../types/api';
