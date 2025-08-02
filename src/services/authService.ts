import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
    RegisterRequest,
    LoginRequest,
    AuthResponse,
    User,
    ProfileUpdateRequest,
    ChangePasswordRequest,
} from '../types/api';

export class AuthService {
    // Register new user
    static async register(data: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.REGISTER,
                data
            );

            // Set auth token for future requests
            if (response.token) {
                apiClient.setAuthToken(response.token);
                localStorage.setItem('authToken', response.token);
            }

            // Store user data and set API key
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));

                // Set API key for future requests
                if (response.user.apiKey) {
                    apiClient.setApiKey(response.user.apiKey);
                }
            }

            return response;
        } catch (error) {
            console.error('AuthService.register error:', error);
            throw error;
        }
    }

    // Login user
    static async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.LOGIN,
                data
            );

            // Set auth token for future requests
            if (response.token) {
                apiClient.setAuthToken(response.token);
                localStorage.setItem('authToken', response.token);
            }

            // Store user data and set API key
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));

                // Set API key for future requests
                if (response.user.apiKey) {
                    apiClient.setApiKey(response.user.apiKey);
                }
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get user profile
    static async getProfile(): Promise<User> {
        try {
            const response = await apiClient.get<{ user: User }>(
                API_ENDPOINTS.AUTH.PROFILE
            );

            // Update stored user data
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            return response.user;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    static async updateProfile(data: ProfileUpdateRequest): Promise<{ message: string; user: User }> {
        try {
            const response = await apiClient.put<{ message: string; user: User }>(
                API_ENDPOINTS.AUTH.UPDATE_PROFILE,
                data
            );

            // Update stored user data
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Regenerate API key
    static async regenerateApiKey(): Promise<{ message: string; apiKey: string }> {
        try {
            const response = await apiClient.post<{ message: string; apiKey: string }>(
                API_ENDPOINTS.AUTH.REGENERATE_API_KEY
            );

            // Update stored user data with new API key
            const storedUser = localStorage.getItem('user');
            if (storedUser && response.apiKey) {
                const user = JSON.parse(storedUser);
                user.apiKey = response.apiKey;
                localStorage.setItem('user', JSON.stringify(user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    static async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
        try {
            const response = await apiClient.post<{ message: string }>(
                API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
                data
            );

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    static logout(): void {
        // Clear authentication
        apiClient.clearAuth();

        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    // Get stored user data
    static getStoredUser(): User | null {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Error parsing stored user data:', error);
                return null;
            }
        }
        return null;
    }

    // Get stored auth token
    static getStoredToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Initialize authentication from stored data
    static initializeAuth(): void {
        const token = this.getStoredToken();
        const user = this.getStoredUser();

        if (token && user) {
            apiClient.setAuthToken(token);
            apiClient.setApiKey(user.apiKey);
        }
    }

    // Refresh user data
    static async refreshUserData(): Promise<User | null> {
        try {
            if (this.isAuthenticated()) {
                return await this.getProfile();
            }
            return null;
        } catch (error) {
            // If refresh fails, clear auth and return null
            this.logout();
            return null;
        }
    }

    // Validate phone number format (Bangladeshi)
    static validatePhoneNumber(phone: string): boolean {
        // Bangladeshi phone number format: 01XXXXXXXXX (11 digits)
        const phoneRegex = /^01[3-9]\d{8}$/;
        return phoneRegex.test(phone);
    }

    // Validate email format
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    static validatePassword(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }

        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export default AuthService; 