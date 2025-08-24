import { ApiError } from './apiClient';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
    timestamp: number;
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

class NotificationServiceClass {
    private subscribers: Set<(notifications: Notification[]) => void> = new Set();
    private notifications: Notification[] = [];
    private nextId = 1;

    // Subscribe to notifications
    subscribe(callback: (notifications: Notification[]) => void): () => void {
        this.subscribers.add(callback);
        callback(this.notifications);

        return () => {
            this.subscribers.delete(callback);
        };
    }

    // Add notification
    addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): string {
        // Check for duplicate notifications (same title and message) within last 2 seconds
        const now = Date.now();
        const isDuplicate = this.notifications.some(n =>
            n.title === notification.title &&
            n.message === notification.message &&
            (now - n.timestamp) < 2000
        );

        if (isDuplicate) {
            // Return existing notification ID instead of creating duplicate
            const existing = this.notifications.find(n =>
                n.title === notification.title &&
                n.message === notification.message
            );
            return existing?.id || '';
        }

        const id = `notification-${this.nextId++}`;
        const fullNotification: Notification = {
            ...notification,
            id,
            timestamp: Date.now()
        };

        this.notifications.unshift(fullNotification);
        this.notifySubscribers();

        // Auto-remove after duration
        if (notification.duration && notification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, notification.duration);
        }

        return id;
    }

    // Remove notification
    removeNotification(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifySubscribers();
    }

    // Clear all notifications
    clearAll(): void {
        this.notifications = [];
        this.notifySubscribers();
    }

    // Get all notifications
    getNotifications(): Notification[] {
        return [...this.notifications];
    }

    // Get notification colors for UI
    getNotificationColors(type: NotificationType) {
        switch (type) {
            case 'success':
                return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', icon: 'text-green-500' };
            case 'error':
                return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: 'text-red-500' };
            case 'warning':
                return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800', icon: 'text-yellow-500' };
            case 'info':
                return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'text-blue-500' };
            default:
                return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-800', icon: 'text-gray-500' };
        }
    }

    // Get notification icon for UI
    getNotificationIcon(type: NotificationType) {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return '•';
        }
    }

    // Notify subscribers
    private notifySubscribers(): void {
        this.subscribers.forEach(callback => {
            callback([...this.notifications]);
        });
    }

    // Convenience methods for different notification types
    success(title: string, message: string, duration?: number, action?: { label: string; onClick: () => void }): string {
        return this.addNotification({
            title,
            message,
            type: 'success',
            duration: duration || 5000,
            action
        });
    }

    error(title: string, message: string, duration?: number, action?: { label: string; onClick: () => void }): string {
        return this.addNotification({
            title,
            message,
            type: 'error',
            duration: duration || 8000,
            action
        });
    }

    warning(title: string, message: string, duration?: number, action?: { label: string; onClick: () => void }): string {
        return this.addNotification({
            title,
            message,
            type: 'warning',
            duration: duration || 6000,
            action
        });
    }

    info(title: string, message: string, duration?: number, action?: { label: string; onClick: () => void }): string {
        return this.addNotification({
            title,
            message,
            type: 'info',
            duration: duration || 4000,
            action
        });
    }

    // Phone check specific notifications
    phoneCheckSuccess(phone: string): string {
        return this.success(
            'Phone Check Successful',
            `Successfully checked phone number: ${phone}`,
            4000
        );
    }

    validationError(field: string, message: string): string {
        return this.error(
            'Validation Error',
            `${field}: ${message}`,
            6000
        );
    }

    quotaExceeded(quota?: any): string {
        const message = quota
            ? `Daily quota exceeded. Used: ${quota.used}/${quota.limit}`
            : 'Daily quota exceeded. Please upgrade your plan.';

        return this.warning(
            'Quota Exceeded',
            message,
            8000,
            {
                label: 'Upgrade Plan',
                onClick: () => {
                    // Navigate to plans page
                    window.location.hash = '#/plans';
                }
            }
        );
    }

    networkError(): string {
        return this.error(
            'Network Error',
            'Unable to connect to the server. Please check your internet connection.',
            8000
        );
    }

    apiError(error: any, context: string): string {
        let message = 'An unexpected error occurred.';

        if (error instanceof ApiError) {
            message = error.message;
        } else if (error.message) {
            message = error.message;
        }

        return this.error(
            `${context} Failed`,
            message,
            8000
        );
    }

    // Authentication specific notifications
    loginSuccess(username: string): string {
        return this.success(
            'Login Successful',
            `Welcome back, ${username}!`,
            4000
        );
    }

    loginFailed(reason: string): string {
        return this.error(
            'Login Failed',
            reason,
            6000
        );
    }

    registrationSuccess(email: string): string {
        return this.success(
            'Registration Successful',
            `Account created for ${email}. Please check your email for verification.`,
            6000
        );
    }

    registrationFailed(reason: string): string {
        return this.error(
            'Registration Failed',
            reason,
            6000
        );
    }

    otpRequired(email: string): string {
        return this.warning(
            'Email Verification Required',
            `Please check your email (${email}) for the OTP to complete registration.`,
            8000,
            {
                label: 'Resend OTP',
                onClick: () => {
                    // This would trigger OTP resend
                    console.log('Resend OTP clicked');
                }
            }
        );
    }

    otpVerified(): string {
        return this.success(
            'Email Verified',
            'Your email has been successfully verified. You can now log in.',
            5000
        );
    }

    otpInvalid(): string {
        return this.error(
            'Invalid OTP',
            'The OTP you entered is invalid. Please try again.',
            6000
        );
    }

    profileUpdated(): string {
        return this.success(
            'Profile Updated',
            'Your profile has been successfully updated.',
            4000
        );
    }

    passwordChanged(): string {
        return this.success(
            'Password Changed',
            'Your password has been successfully changed.',
            5000
        );
    }

    // Analytics specific notifications
    analyticsLoaded(): string {
        return this.success(
            'Analytics Loaded',
            'Analytics data has been successfully loaded.',
            3000
        );
    }

    analyticsFailed(reason: string): string {
        return this.error(
            'Analytics Failed',
            `Failed to load analytics: ${reason}`,
            6000
        );
    }

    // Service status notifications
    serviceAvailable(service: string): string {
        return this.success(
            'Service Available',
            `${service} service is now available.`,
            4000
        );
    }

    serviceUnavailable(service: string): string {
        return this.warning(
            'Service Unavailable',
            `${service} service is currently unavailable.`,
            6000
        );
    }

    // Rate limiting notifications
    rateLimitWarning(remaining: number, resetTime?: string): string {
        const message = resetTime
            ? `You have ${remaining} requests remaining. Resets at ${new Date(parseInt(resetTime) * 1000).toLocaleTimeString()}`
            : `You have ${remaining} requests remaining.`;

        return this.warning(
            'Rate Limit Warning',
            message,
            6000
        );
    }

    // Cache notifications
    cacheHit(): string {
        return this.info(
            'Cached Result',
            'This result was retrieved from cache for faster response.',
            3000
        );
    }

    cacheMiss(): string {
        return this.info(
            'Fresh Data',
            'This result was fetched fresh from the server.',
            3000
        );
    }

    // Error handling for different scenarios
    handleApiError(error: any, context: string): string {
        if (error instanceof ApiError) {
            switch (error.code) {
                case 'RATE_LIMIT_EXCEEDED':
                    return this.quotaExceeded(error.quota);
                case 'UNAUTHORIZED':
                    return this.error(
                        'Authentication Required',
                        'Please log in to continue.',
                        6000,
                        {
                            label: 'Login',
                            onClick: () => {
                                window.location.hash = '#/login';
                            }
                        }
                    );
                case 'EMAIL_NOT_VERIFIED':
                    return this.otpRequired(error.email || '');
                case 'NETWORK_ERROR':
                    return this.networkError();
                default:
                    return this.apiError(error, context);
            }
        }

        return this.apiError(error, context);
    }
}

// Create singleton instance
const NotificationService = new NotificationServiceClass();

export default NotificationService;
