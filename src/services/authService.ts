import apiClient from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import {
    RegisterRequest,
    LoginRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    ProfileUpdateRequest,
    AuthResponse,
    User,
    ErrorResponse
} from '../types/api';

export class AuthService {
    // User registration
    static async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.REGISTER,
                userData
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    // User login
    static async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.LOGIN,
                credentials
            );

            // Set the auth token in the API client
            if (response.token) {
                apiClient.setAuthToken(response.token);
                localStorage.setItem('authToken', response.token);
            }

            // Store user data
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Verify OTP
    static async verifyOTP(otpData: VerifyOTPRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>(
                API_ENDPOINTS.AUTH.VERIFY_OTP,
                otpData
            );

            // Set the auth token in the API client
            if (response.token) {
                apiClient.setAuthToken(response.token);
                localStorage.setItem('authToken', response.token);
            }

            // Store user data
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Resend OTP
    static async resendOTP(email: string): Promise<{ message: string; email: string }> {
        try {
            const response = await apiClient.post<{ message: string; email: string }>(
                API_ENDPOINTS.AUTH.RESEND_OTP,
                { email }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Forgot password
    static async forgotPassword(email: string): Promise<{ message: string; email: string }> {
        try {
            const response = await apiClient.post<{ message: string; email: string }>(
                API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
                { email }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Reset password
    static async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.post<{ message: string }>(
                API_ENDPOINTS.AUTH.RESET_PASSWORD,
                { token, newPassword }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Change password
    static async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
        try {
            const response = await apiClient.post<{ message: string }>(
                API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
                { currentPassword, newPassword }
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get user profile
    static async getProfile(): Promise<{ user: User }> {
        try {
            const response = await apiClient.get<{ user: User }>(
                API_ENDPOINTS.AUTH.PROFILE
            );
            return response;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    static async updateProfile(profileData: ProfileUpdateRequest): Promise<{ message: string; user: User }> {
        try {
            const response = await apiClient.put<{ message: string; user: User }>(
                API_ENDPOINTS.AUTH.UPDATE_PROFILE,
                profileData
            );

            // Update stored user data
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Logout
    static logout(): void {
        // Clear API client authentication
        apiClient.clearAuth();

        // Clear local storage
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    // Get stored user data
    static getStoredUser(): User | null {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                console.error('Failed to parse stored user data:', error);
                return null;
            }
        }
        return null;
    }

    // Get stored auth token
    static getStoredToken(): string | null {
        return localStorage.getItem('authToken');
    }

    // Initialize authentication from storage
    static initializeAuth(): void {
        const token = this.getStoredToken();
        const user = this.getStoredUser();

        if (token && user) {
            apiClient.setAuthToken(token);
            apiClient.setApiKey(user.apiKey);
        }
    }

    // Refresh user data from server
    static async refreshUserData(): Promise<User | null> {
        try {
            const response = await this.getProfile();
            if (response.user) {
                localStorage.setItem('userData', JSON.stringify(response.user));
                return response.user;
            }
            return null;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            return null;
        }
    }

    // Check if token is expired (basic check)
    static isTokenExpired(): boolean {
        const token = localStorage.getItem('authToken');
        if (!token) return true;

        try {
            // Basic JWT expiration check (payload is base64 encoded)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;

            return payload.exp < currentTime;
        } catch (error) {
            console.error('Failed to parse token:', error);
            return true;
        }
    }

    // Auto-refresh token if needed
    static async ensureValidToken(): Promise<boolean> {
        if (this.isTokenExpired()) {
            try {
                await this.refreshUserData();
                return true;
            } catch (error) {
                this.logout();
                return false;
            }
        }
        return true;
    }
}

export default AuthService;
