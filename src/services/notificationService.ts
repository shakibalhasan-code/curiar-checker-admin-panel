// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

// Notification interface
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

// Notification service class
export class NotificationService {
    private static listeners: ((notifications: Notification[]) => void)[] = [];
    private static notifications: Notification[] = [];

    // Subscribe to notification changes
    static subscribe(listener: (notifications: Notification[]) => void): () => void {
        this.listeners.push(listener);

        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners
    private static notifyListeners(): void {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    // Add notification
    private static addNotification(notification: Omit<Notification, 'id'>): string {
        const id = Math.random().toString(36).substr(2, 9);
        const newNotification: Notification = {
            id,
            duration: 5000, // 5 seconds default
            ...notification,
        };

        this.notifications.push(newNotification);
        this.notifyListeners();

        // Auto remove after duration
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(id);
            }, newNotification.duration);
        }

        return id;
    }

    // Remove notification
    static removeNotification(id: string): void {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.notifyListeners();
    }

    // Clear all notifications
    static clearAll(): void {
        this.notifications = [];
        this.notifyListeners();
    }

    // Success notification
    static success(title: string, message: string, duration?: number): string {
        return this.addNotification({
            type: 'success',
            title,
            message,
            duration,
        });
    }

    // Error notification
    static error(title: string, message: string, duration?: number): string {
        return this.addNotification({
            type: 'error',
            title,
            message,
            duration,
        });
    }

    // Warning notification
    static warning(title: string, message: string, duration?: number): string {
        return this.addNotification({
            type: 'warning',
            title,
            message,
            duration,
        });
    }

    // Info notification
    static info(title: string, message: string, duration?: number): string {
        return this.addNotification({
            type: 'info',
            title,
            message,
            duration,
        });
    }

    // API error notification
    static apiError(error: any, title?: string): string {
        let errorTitle = title || 'API Error';
        let errorMessage = 'An unexpected error occurred';

        if (error?.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        } else if (error?.error) {
            errorMessage = error.error;
        }

        return this.error(errorTitle, errorMessage, 8000); // Longer duration for errors
    }

    // Network error notification
    static networkError(): string {
        return this.error(
            'Network Error',
            'Please check your internet connection and try again.',
            8000
        );
    }

    // Quota exceeded notification
    static quotaExceeded(quota?: any): string {
        let message = 'Daily quota exceeded. Please upgrade your plan or try again tomorrow.';

        if (quota?.daily) {
            message = `Daily quota exceeded (${quota.daily.used}/${quota.daily.limit}). Please upgrade your plan or try again tomorrow.`;
        }

        return this.warning(
            'Quota Exceeded',
            message,
            10000
        );
    }

    // Authentication error notification
    static authError(): string {
        return this.error(
            'Authentication Error',
            'Please login again to continue.',
            5000
        );
    }

    // Validation error notification
    static validationError(field: string, message: string): string {
        return this.error(
            'Validation Error',
            `${field}: ${message}`,
            5000
        );
    }

    // Success operations
    static loginSuccess(): string {
        return this.success(
            'Login Successful',
            'Welcome back! You have been successfully logged in.',
            3000
        );
    }

    static logoutSuccess(): string {
        return this.success(
            'Logged Out',
            'You have been successfully logged out.',
            3000
        );
    }

    static profileUpdated(): string {
        return this.success(
            'Profile Updated',
            'Your profile has been successfully updated.',
            3000
        );
    }

    static passwordChanged(): string {
        return this.success(
            'Password Changed',
            'Your password has been successfully changed.',
            3000
        );
    }

    static apiKeyRegenerated(): string {
        return this.success(
            'API Key Regenerated',
            'Your API key has been successfully regenerated.',
            3000
        );
    }

    static phoneCheckSuccess(phone: string): string {
        return this.success(
            'Phone Check Complete',
            `Analysis completed for ${phone}`,
            4000
        );
    }

    // Get notification icon
    static getNotificationIcon(type: NotificationType): string {
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

    // Get notification color classes
    static getNotificationColors(type: NotificationType): {
        bg: string;
        border: string;
        text: string;
        icon: string;
    } {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-green-50',
                    border: 'border-green-200',
                    text: 'text-green-800',
                    icon: 'text-green-500'
                };
            case 'error':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-200',
                    text: 'text-red-800',
                    icon: 'text-red-500'
                };
            case 'warning':
                return {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-200',
                    text: 'text-yellow-800',
                    icon: 'text-yellow-500'
                };
            case 'info':
                return {
                    bg: 'bg-blue-50',
                    border: 'border-blue-200',
                    text: 'text-blue-800',
                    icon: 'text-blue-500'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    border: 'border-gray-200',
                    text: 'text-gray-800',
                    icon: 'text-gray-500'
                };
        }
    }
}

export default NotificationService; 