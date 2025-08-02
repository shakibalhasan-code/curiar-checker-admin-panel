import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS, ERROR_MESSAGES, RATE_LIMIT_HEADERS } from '../config/api';
import {
    ApiResponse,
    ErrorResponse,
    RateLimitInfo,
    ApiRequestOptions,
    ApiClientConfig
} from '../types/api';

// Custom API Error Class
export class ApiError extends Error {
    public status: number;
    public code: string;
    public details?: string[];
    public quota?: any;

    constructor(message: string, status: number, code: string, details?: string[], quota?: any) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
        this.quota = quota;
    }
}

// API Client Class
export class ApiClient {
    private config: ApiClientConfig;
    private authToken: string | null = null;
    private apiKey: string | null = null;
    private rateLimitInfo: RateLimitInfo | null = null;

    constructor(config?: Partial<ApiClientConfig>) {
        this.config = {
            baseURL: API_CONFIG.BASE_URL,
            timeout: API_CONFIG.TIMEOUT,
            maxRetries: API_CONFIG.MAX_RETRIES,
            retryDelay: API_CONFIG.RETRY_DELAY,
            defaultHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            ...config,
        };
    }

    // Set authentication token
    setAuthToken(token: string | null): void {
        this.authToken = token;
    }

    // Set API key
    setApiKey(apiKey: string | null): void {
        this.apiKey = apiKey;
    }

    // Get rate limit info
    getRateLimitInfo(): RateLimitInfo | null {
        return this.rateLimitInfo;
    }

    // Clear authentication
    clearAuth(): void {
        this.authToken = null;
        this.apiKey = null;
    }

    // Build request headers
    private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
        const headers = { ...this.config.defaultHeaders, ...customHeaders };

        // Add authentication headers
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        if (this.apiKey) {
            headers['X-API-Key'] = this.apiKey;
        }

        return headers;
    }

    // Parse rate limit headers
    private parseRateLimitHeaders(response: Response): void {
        const limit = response.headers.get(RATE_LIMIT_HEADERS.LIMIT);
        const remaining = response.headers.get(RATE_LIMIT_HEADERS.REMAINING);
        const reset = response.headers.get(RATE_LIMIT_HEADERS.RESET);

        if (limit && remaining && reset) {
            this.rateLimitInfo = {
                limit: parseInt(limit),
                remaining: parseInt(remaining),
                reset: parseInt(reset),
            };
        }
    }

    // Handle API errors
    private handleError(response: Response, data: any): never {
        const errorData = data as ErrorResponse;

        switch (response.status) {
            case HTTP_STATUS.UNAUTHORIZED:
                throw new ApiError(
                    ERROR_MESSAGES.UNAUTHORIZED,
                    response.status,
                    'UNAUTHORIZED'
                );

            case HTTP_STATUS.FORBIDDEN:
                throw new ApiError(
                    ERROR_MESSAGES.FORBIDDEN,
                    response.status,
                    'FORBIDDEN'
                );

            case HTTP_STATUS.NOT_FOUND:
                throw new ApiError(
                    ERROR_MESSAGES.NOT_FOUND,
                    response.status,
                    'NOT_FOUND'
                );

            case HTTP_STATUS.TOO_MANY_REQUESTS:
                throw new ApiError(
                    ERROR_MESSAGES.QUOTA_EXCEEDED,
                    response.status,
                    'RATE_LIMIT_EXCEEDED',
                    errorData.details,
                    errorData.quota
                );

            case HTTP_STATUS.LOCKED:
                throw new ApiError(
                    ERROR_MESSAGES.ACCOUNT_LOCKED,
                    response.status,
                    'ACCOUNT_LOCKED'
                );

            case HTTP_STATUS.BAD_REQUEST:
                throw new ApiError(
                    errorData.message || ERROR_MESSAGES.GENERIC_ERROR,
                    response.status,
                    'BAD_REQUEST',
                    errorData.details
                );

            default:
                throw new ApiError(
                    errorData.message || ERROR_MESSAGES.SERVER_ERROR,
                    response.status,
                    'SERVER_ERROR',
                    errorData.details
                );
        }
    }

    // Retry logic
    private async retryRequest<T>(
        requestFn: () => Promise<T>,
        retries: number,
        delay: number
    ): Promise<T> {
        try {
            return await requestFn();
        } catch (error) {
            if (retries > 0 && error instanceof ApiError && error.status >= 500) {
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.retryRequest(requestFn, retries - 1, delay * 2);
            }
            throw error;
        }
    }

    // Main request method
    async request<T = any>(
        endpoint: string,
        options: ApiRequestOptions = {}
    ): Promise<T> {
        const {
            method = 'GET',
            headers = {},
            body,
            timeout = this.config.timeout,
            retries = this.config.maxRetries,
            retryDelay = this.config.retryDelay,
        } = options;

        const url = `${this.config.baseURL}${endpoint}`;
        const requestHeaders = this.buildHeaders(headers);

        const requestFn = async (): Promise<T> => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const requestOptions: RequestInit = {
                    method,
                    headers: requestHeaders,
                    signal: controller.signal,
                };

                if (body && method !== 'GET') {
                    requestOptions.body = JSON.stringify(body);
                }

                const response = await fetch(url, requestOptions);
                clearTimeout(timeoutId);

                // Parse rate limit headers
                this.parseRateLimitHeaders(response);

                // Handle non-2xx responses
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    this.handleError(response, errorData);
                }

                // Parse response
                const data = await response.json();
                return data as T;
            } catch (error) {
                clearTimeout(timeoutId);

                if (error instanceof ApiError) {
                    throw error;
                }

                if (error.name === 'AbortError') {
                    throw new ApiError(
                        ERROR_MESSAGES.TIMEOUT_ERROR,
                        408,
                        'TIMEOUT'
                    );
                }

                // Check if it's a network error (server not reachable)
                if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
                    throw new ApiError(
                        `Server not reachable at ${this.config.baseURL}. Please check if the backend server is running.`,
                        0,
                        'NETWORK_ERROR'
                    );
                }

                throw new ApiError(
                    ERROR_MESSAGES.NETWORK_ERROR,
                    0,
                    'NETWORK_ERROR'
                );
            }
        };

        return this.retryRequest(requestFn, retries, retryDelay);
    }

    // Convenience methods
    async get<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', headers });
    }

    async post<T = any>(
        endpoint: string,
        body?: any,
        headers?: Record<string, string>
    ): Promise<T> {
        return this.request<T>(endpoint, { method: 'POST', body, headers });
    }

    async put<T = any>(
        endpoint: string,
        body?: any,
        headers?: Record<string, string>
    ): Promise<T> {
        return this.request<T>(endpoint, { method: 'PUT', body, headers });
    }

    async delete<T = any>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE', headers });
    }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export for use in other modules
export default apiClient; 