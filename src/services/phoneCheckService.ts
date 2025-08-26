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

                if (successRate < 0.3 || cancelRate > 0.7) {
                    return 'fraudulent';
                } else if (successRate < 0.6 || cancelRate > 0.4) {
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

        // Extract courier data directly from response (pathao, steadfast, redx)
        const courierChecks: Record<string, unknown> = {};

        // Handle Pathao data
        if (responseObj.pathao && typeof responseObj.pathao === 'object') {
            const pathaoData = responseObj.pathao as Record<string, unknown>;
            const fraudStatus = this.getFraudStatus(pathaoData);
            (pathaoData as Record<string, unknown>).fraudStatus = fraudStatus;
            courierChecks.pathao = pathaoData;
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

        // Handle Steadfast data
        if (responseObj.steadfast && typeof responseObj.steadfast === 'object') {
            const steadfastData = responseObj.steadfast as Record<string, unknown>;
            const fraudStatus = this.getFraudStatus(steadfastData);
            (steadfastData as Record<string, unknown>).fraudStatus = fraudStatus;
            courierChecks.steadfast = steadfastData;
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

        // Handle RedX data
        if (responseObj.redx && typeof responseObj.redx === 'object') {
            const redxData = responseObj.redx as Record<string, unknown>;
            const fraudStatus = this.getFraudStatus(redxData);
            (redxData as Record<string, unknown>).fraudStatus = fraudStatus;
            courierChecks.redx = redxData;
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

        // Get AI analysis data
        const aiAnalysis = (responseObj.ai_analysis as Record<string, unknown>) || {};

        // Calculate fraud score based on AI analysis summary if available
        let fraudScore = 0;
        let totalSuccess = 0;
        let totalCancel = 0;
        let totalParcels = 0;
        let hasFraudReport = false;

        // Use AI analysis summary if available
        if (aiAnalysis.summary && typeof aiAnalysis.summary === 'object') {
            const summary = aiAnalysis.summary as Record<string, unknown>;
            totalSuccess = (summary.totalSuccess as number) || 0;
            totalCancel = (summary.totalCancel as number) || 0;
            totalParcels = (summary.totalParcels as number) || 0;
            hasFraudReport = (summary.hasFraudReport as boolean) || false;
        } else {
            // Fallback: calculate from individual courier data
            [responseObj.pathao, responseObj.steadfast, responseObj.redx].forEach(courierData => {
                if (courierData && typeof courierData === 'object') {
                    const stats = (courierData as Record<string, unknown>).stats as Record<string, unknown> | undefined;
                    if (stats) {
                        // Handle both string and number values for stats
                        totalSuccess += parseInt(String(stats.success || 0), 10) || 0;
                        totalCancel += parseInt(String(stats.cancel || 0), 10) || 0;
                        totalParcels += parseInt(String(stats.total || 0), 10) || 0;
                    }
                    if ((courierData as Record<string, unknown>).fraud) {
                        hasFraudReport = true;
                    }
                }
            });
        }

        // Calculate fraud score based on data
        if (totalParcels > 0) {
            const successRate = totalSuccess / totalParcels;
            const cancelRate = totalCancel / totalParcels;

            // Base score on success rate (inverted)
            let baseScore = Math.max(0, (1 - successRate) * 50);
            
            // Add penalty for high cancellation rate
            if (cancelRate > 0.6) {
                baseScore += 30;
            } else if (cancelRate > 0.4) {
                baseScore += 20;
            } else if (cancelRate > 0.2) {
                baseScore += 10;
            }

            // Add penalty for fraud reports
            if (hasFraudReport) {
                baseScore += 40;
            }

            fraudScore = Math.min(100, Math.round(baseScore));
        } else if (hasFraudReport) {
            // If no parcel data but fraud reports exist
            fraudScore = 85;
        }

        // Ensure fraud score is at least 10 if there are any negative indicators
        if ((totalParcels > 0 && (totalSuccess / totalParcels) < 0.8) || hasFraudReport) {
            fraudScore = Math.max(10, fraudScore);
        }

        const riskLevel = this.getRiskLevel(fraudScore);
        const result = {
            services,
            courier_checks: courierChecks,
            aiAnalysis: aiAnalysis,
            riskLevel,
            riskColor: this.getRiskColor(riskLevel),
            riskBgColor: this.getRiskBgColor(riskLevel),
            fraudScore: fraudScore,
            analysis: (aiAnalysis.analysis as string) || 'No analysis available',
            cached: (responseObj.cached as boolean) || false,
            timestamp: (responseObj.timestamp as string) || new Date().toISOString()
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
