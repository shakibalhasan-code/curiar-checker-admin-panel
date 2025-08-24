import apiClient from './apiClient';
import { API_ENDPOINTS, PHONE_VALIDATION, LANGUAGE_CODES } from '../config/api';
import {
    CallerIdResponse,
    CourierCheck,
} from '../types/api';
import AuthService from './authService';

export class PhoneCheckService {
    // Check phone number for fraud and delivery history
    static async checkPhone(
        phone: string,
        lang: 'bn' | 'en' | 'hi' | 'ur' = 'bn'
    ): Promise<unknown> {
        // Validate phone number format
        if (!this.validatePhoneNumber(phone)) {
            throw new Error('Invalid phone number format. Please use Bangladeshi format: 01XXXXXXXXX');
        }

        // Ensure API key is set from authenticated user
        const user = AuthService.getStoredUser();
        if (user?.apiKey) {
            apiClient.setApiKey(user.apiKey);
        }

        const endpoint = API_ENDPOINTS.CORE.CHECK_PHONE(phone, lang);
        const response = await apiClient.get<unknown>(endpoint);

        return response;
    }

    // Get caller ID information
    static async getCallerId(phone: string): Promise<CallerIdResponse> {
        // Validate phone number format
        if (!this.validatePhoneNumber(phone)) {
            throw new Error('Invalid phone number format. Please use Bangladeshi format: 01XXXXXXXXX');
        }

        // Ensure API key is set from authenticated user
        const user = AuthService.getStoredUser();
        if (user?.apiKey) {
            apiClient.setApiKey(user.apiKey);
        }

        const endpoint = API_ENDPOINTS.CORE.CALLER_ID(phone);
        const response = await apiClient.get<CallerIdResponse>(endpoint);

        return response;
    }

    // Validate Bangladeshi phone number format
    static validatePhoneNumber(phone: string): boolean {
        // Remove any spaces or special characters
        const cleanPhone = phone.replace(/[\s\-()]/g, '');

        // Check if it matches the regex pattern
        return PHONE_VALIDATION.REGEX.test(cleanPhone);
    }

    // Format phone number for display
    static formatPhoneNumber(phone: string): string {
        const cleanPhone = phone.replace(/[\s\-()]/g, '');

        if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
            return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
        }

        return phone;
    }

    // Get risk level based on fraud score
    static getRiskLevel(fraudScore: number): 'low' | 'medium' | 'high' {
        if (fraudScore >= 70) {
            return 'high';
        } else if (fraudScore >= 40) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    // Get risk color for UI
    static getRiskColor(riskLevel: 'low' | 'medium' | 'high'): string {
        switch (riskLevel) {
            case 'low':
                return 'text-green-500';
            case 'medium':
                return 'text-yellow-500';
            case 'high':
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    }

    // Get risk background color for UI
    static getRiskBgColor(riskLevel: 'low' | 'medium' | 'high'): string {
        switch (riskLevel) {
            case 'low':
                return 'bg-green-100 text-green-800';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'high':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Calculate success rate
    static calculateSuccessRate(stats: { success: number; cancel: number; total: number }): number {
        if (stats.total === 0) return 0;
        return Math.round((stats.success / stats.total) * 100);
    }

    // Get service status based on data availability
    static getServiceStatus(serviceData: Record<string, unknown>): 'available' | 'unavailable' | 'error' {
        if (!serviceData) return 'unavailable';
        if (serviceData.error) return 'error';
        return 'available';
    }

    // Get language display name
    static getLanguageName(code: string): string {
        switch (code) {
            case LANGUAGE_CODES.BENGALI:
                return 'বাংলা';
            case LANGUAGE_CODES.ENGLISH:
                return 'English';
            case LANGUAGE_CODES.HINDI:
                return 'हिंदी';
            case LANGUAGE_CODES.URDU:
                return 'اردو';
            default:
                return 'English';
        }
    }

    // Get service display name
    static getServiceName(service: string): string {
        switch (service.toLowerCase()) {
            case 'pathao':
                return 'Pathao';
            case 'steadfast':
                return 'Steadfast';
            case 'redx':
                return 'RedX';
            default:
                return service;
        }
    }

    // Get service icon
    static getServiceIcon(service: string): string {
        switch (service.toLowerCase()) {
            case 'pathao':
                return '🚚';
            case 'steadfast':
                return '📦';
            case 'redx':
                return '📮';
            default:
                return '📱';
        }
    }

    // Get service status color
    static getServiceStatusColor(status: 'fraudulent' | 'clean' | 'suspicious'): string {
        switch (status) {
            case 'fraudulent':
                return 'text-red-500';
            case 'clean':
                return 'text-green-500';
            case 'suspicious':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    }

    // Get service status background color
    static getServiceStatusBgColor(status: 'fraudulent' | 'clean' | 'suspicious'): string {
        switch (status) {
            case 'fraudulent':
                return 'bg-red-100 text-red-800';
            case 'clean':
                return 'bg-green-100 text-green-800';
            case 'suspicious':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // Get fraud status based on courier data
    static getFraudStatus(courierData: Record<string, unknown>): 'fraudulent' | 'clean' | 'suspicious' {
        // If there's a direct fraud field, check it
        if (courierData.fraud === true || (courierData.fraud && typeof courierData.fraud === 'object')) {
            return 'fraudulent';
        }

        // If there are stats, analyze them
        if (courierData.stats && typeof courierData.stats === 'object') {
            const stats = courierData.stats as Record<string, number>;
            const success = stats.success || 0;
            const cancel = stats.cancel || 0;
            const total = stats.total || 0;

            if (total > 0) {
                const successRate = success / total;
                const cancelRate = cancel / total;

                if (successRate < 0.5 || cancelRate > 0.5) {
                    return 'fraudulent';
                } else if (successRate < 0.8 || cancelRate > 0.3) {
                    return 'suspicious';
                }
            }
        }

        // Default to clean if no fraud indicators
        return 'clean';
    }

    // Parse phone check response for UI
    static parsePhoneCheckResponse(response: unknown) {
        const services = [];

        // Type guard to ensure response is an object
        if (!response || typeof response !== 'object') {
            throw new Error('Invalid response format');
        }

        const responseObj = response as Record<string, unknown>;

        // Handle the actual server response structure
        const courierChecks = (responseObj.courier_checks as Record<string, unknown>) || {};

        // Safely check if courier_checks exists
        if (courierChecks && typeof courierChecks === 'object') {
            if (courierChecks.pathao && typeof courierChecks.pathao === 'object') {
                const pathaoData = courierChecks.pathao as Record<string, unknown>;
                const fraudStatus = this.getFraudStatus(pathaoData);
                // Add fraudStatus to the courier data for easy access
                (pathaoData as Record<string, unknown>).fraudStatus = fraudStatus;
                services.push({
                    name: 'Pathao',
                    icon: '🚚',
                    data: pathaoData as CourierCheck,
                    status: this.getServiceStatus(pathaoData),
                    fraudStatus: fraudStatus,
                    statusColor: this.getServiceStatusColor(fraudStatus),
                    statusBgColor: this.getServiceStatusBgColor(fraudStatus)
                });
            }

            if (courierChecks.steadfast && typeof courierChecks.steadfast === 'object') {
                const steadfastData = courierChecks.steadfast as Record<string, unknown>;
                const fraudStatus = this.getFraudStatus(steadfastData);
                // Add fraudStatus to the courier data for easy access
                (steadfastData as Record<string, unknown>).fraudStatus = fraudStatus;
                services.push({
                    name: 'Steadfast',
                    icon: '📦',
                    data: steadfastData as CourierCheck,
                    status: this.getServiceStatus(steadfastData),
                    fraudStatus: fraudStatus,
                    statusColor: this.getServiceStatusColor(fraudStatus),
                    statusBgColor: this.getServiceStatusBgColor(fraudStatus)
                });
            }

            if (courierChecks.redx && typeof courierChecks.redx === 'object') {
                const redxData = courierChecks.redx as Record<string, unknown>;
                const fraudStatus = this.getFraudStatus(redxData);
                // Add fraudStatus to the courier data for easy access
                (redxData as Record<string, unknown>).fraudStatus = fraudStatus;
                services.push({
                    name: 'RedX',
                    icon: '🚛',
                    data: redxData as CourierCheck,
                    status: this.getServiceStatus(redxData),
                    fraudStatus: fraudStatus,
                    statusColor: this.getServiceStatusColor(fraudStatus),
                    statusBgColor: this.getServiceStatusBgColor(fraudStatus)
                });
            }
        }

        // Calculate fraud score from the actual data
        let fraudScore = 0;
        if (courierChecks) {
            let totalSuccess = 0;
            let totalCancel = 0;
            let totalParcels = 0;
            let hasFraudReport = false;



            if (courierChecks.pathao && typeof courierChecks.pathao === 'object') {
                const pathaoData = courierChecks.pathao as Record<string, unknown>;
                const stats = pathaoData.stats as Record<string, number> | undefined;
                if (stats) {
                    totalSuccess += stats.success || 0;
                    totalCancel += stats.cancel || 0;
                    totalParcels += stats.total || 0;
                }
                if (pathaoData.fraud) hasFraudReport = true;
            }

            if (courierChecks.steadfast && typeof courierChecks.steadfast === 'object') {
                const steadfastData = courierChecks.steadfast as Record<string, unknown>;
                const stats = steadfastData.stats as Record<string, number> | undefined;
                if (stats) {
                    totalSuccess += stats.success || 0;
                    totalCancel += stats.cancel || 0;
                    totalParcels += stats.total || 0;
                }
                if (steadfastData.fraud) hasFraudReport = true;
            }

            if (courierChecks.redx && typeof courierChecks.redx === 'object') {
                const redxData = courierChecks.redx as Record<string, unknown>;
                const stats = redxData.stats as Record<string, number> | undefined;
                if (stats) {
                    totalSuccess += stats.success || 0;
                    totalCancel += stats.cancel || 0;
                    totalParcels += stats.total || 0;
                }
                if (redxData.fraud) hasFraudReport = true;
            }

            // Calculate score based on success rate and fraud reports
            if (totalParcels > 0) {
                const successRate = totalSuccess / totalParcels;

                if (hasFraudReport) {
                    fraudScore += 50; // High penalty for fraud reports
                }

                if (successRate < 0.5) {
                    fraudScore += 40; // High penalty for low success rate
                } else if (successRate < 0.8) {
                    fraudScore += 20; // Medium penalty for moderate success rate
                }

                // Add penalty for high cancellation rate
                const cancelRate = totalCancel / totalParcels;
                if (cancelRate > 0.5) {
                    fraudScore += 30;
                } else if (cancelRate > 0.3) {
                    fraudScore += 15;
                }
            }
        }

        const riskLevel = this.getRiskLevel(fraudScore);
        const result = {
            services,
            courier_checks: courierChecks,
            aiAnalysis: responseObj.ai_analysis || {},
            riskLevel,
            riskColor: this.getRiskColor(riskLevel),
            riskBgColor: this.getRiskBgColor(riskLevel),
            fraudScore: fraudScore,
            analysis: (responseObj.ai_analysis as Record<string, unknown>)?.analysis || '',
            cached: responseObj.cached as boolean || false,
            timestamp: responseObj.timestamp as string || new Date().toISOString()
        };

        return result;
    }

    // Get fraud score color
    static getFraudScoreColor(score: number): string {
        if (score >= 70) return 'text-red-500';
        if (score >= 40) return 'text-yellow-500';
        return 'text-green-500';
    }

    // Get fraud score background color
    static getFraudScoreBgColor(score: number): string {
        if (score >= 70) return 'bg-red-100 text-red-800';
        if (score >= 40) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    }
}

export default PhoneCheckService;
