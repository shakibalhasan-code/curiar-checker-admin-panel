import React, { useState, useEffect } from 'react';
import NotificationService, { Notification, NotificationType } from '../services/notificationService';

const NotificationToast: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const unsubscribe = NotificationService.subscribe(setNotifications);
        return unsubscribe;
    }, []);

    const handleRemove = (id: string) => {
        NotificationService.removeNotification(id);
    };

    const handleAction = (notification: Notification) => {
        if (notification.action) {
            notification.action.onClick();
            handleRemove(notification.id);
        }
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {notifications.map((notification) => {
                const colors = NotificationService.getNotificationColors(notification.type);
                const icon = NotificationService.getNotificationIcon(notification.type);

                return (
                    <div
                        key={notification.id}
                        className={`
              ${colors.bg} ${colors.border} ${colors.text}
              border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out
              transform translate-x-0 opacity-100
              hover:shadow-xl
            `}
                        style={{
                            animation: 'slideInRight 0.3s ease-out'
                        }}
                    >
                        <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className={`${colors.icon} text-lg font-bold flex-shrink-0`}>
                                {icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm leading-5">
                                            {notification.title}
                                        </h4>
                                        <p className="mt-1 text-sm leading-4 opacity-90">
                                            {notification.message}
                                        </p>
                                    </div>

                                    {/* Close button */}
                                    <button
                                        onClick={() => handleRemove(notification.id)}
                                        className={`
                      ${colors.icon} hover:opacity-70
                      ml-2 flex-shrink-0 p-1 rounded-full
                      transition-opacity duration-200
                    `}
                                        aria-label="Close notification"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Action button */}
                                {notification.action && (
                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleAction(notification)}
                                            className={`
                        ${colors.icon} hover:opacity-70
                        text-sm font-medium underline
                        transition-opacity duration-200
                      `}
                                        >
                                            {notification.action.label}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Progress bar for auto-dismiss */}
                        {notification.duration && notification.duration > 0 && (
                            <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${colors.icon.replace('text-', 'bg-')} transition-all duration-300 ease-linear`}
                                    style={{
                                        width: '100%',
                                        animation: `shrink ${notification.duration}ms linear forwards`
                                    }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}

            <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
        </div>
    );
};

export default NotificationToast; 