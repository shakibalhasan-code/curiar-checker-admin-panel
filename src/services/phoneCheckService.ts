import apiClient from './apiClient';
import { API_ENDPOINTS, LANGUAGE_CODES } from '../config/api';
import {
    PhoneCheckResponse,
    CallerIdResponse,
    FraudReportsResponse,
} from '../types/api';
import AuthService from './authService';

export class PhoneCheckService {
    // Check phone number for fraud and delivery history
    static async checkPhone(
        phone: string,
        lang: 'bn' | 'en' | 'hi' | 'ur' = 'en'
    ): Promise<PhoneCheckResponse> {
        try {
            // Validate phone number format
            if (!this.validatePhoneNumber(phone)) {
                throw new Error('Invalid phone number format. Please use Bangladeshi format: 01XXXXXXXXX');
            }

            // Ensure API key is set from authenticated user
            const user = AuthService.getStoredUser();
            if (user?.apiKey) {
                apiClient.setApiKey(user.apiKey);
            }

            const endpoint = API_ENDPOINTS.CHECK.PHONE(phone, lang);
            const response = await apiClient.get<PhoneCheckResponse>(endpoint);

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get caller ID information
    static async getCallerId(phone: string): Promise<CallerIdResponse> {
        try {
            // Validate phone number format
            if (!this.validatePhoneNumber(phone)) {
                throw new Error('Invalid phone number format. Please use Bangladeshi format: 01XXXXXXXXX');
            }

            // Ensure API key is set from authenticated user
            const user = AuthService.getStoredUser();
            if (user?.apiKey) {
                apiClient.setApiKey(user.apiKey);
            }

            const endpoint = API_ENDPOINTS.CHECK.CALLER_ID(phone);
            const response = await apiClient.get<CallerIdResponse>(endpoint);

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Get recent fraud reports
    static async getFraudReports(next?: string): Promise<FraudReportsResponse> {
        try {
            // Ensure API key is set from authenticated user
            const user = AuthService.getStoredUser();
            if (user?.apiKey) {
                apiClient.setApiKey(user.apiKey);
            }

            let endpoint = API_ENDPOINTS.CHECK.FRAUD_REPORTS;
            if (next) {
                endpoint += `?next=${next}`;
            }

            const response = await apiClient.get<FraudReportsResponse>(endpoint);

            return response;
        } catch (error) {
            throw error;
        }
    }

    // Validate Bangladeshi phone number format
    static validatePhoneNumber(phone: string): boolean {
        // Remove any spaces or special characters
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

        // Bangladeshi phone number format: 01XXXXXXXXX (11 digits)
        const phoneRegex = /^01[3-9]\d{8}$/;
        return phoneRegex.test(cleanPhone);
    }

    // Format phone number for display
    static formatPhoneNumber(phone: string): string {
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

        if (cleanPhone.length === 11 && cleanPhone.startsWith('01')) {
            return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`;
        }

        return phone;
    }

    // Get risk level based on analysis
    static getRiskLevel(analysis: string): 'low' | 'medium' | 'high' {
        const lowerAnalysis = analysis.toLowerCase();

        if (lowerAnalysis.includes('high risk') || lowerAnalysis.includes('fraud')) {
            return 'high';
        } else if (lowerAnalysis.includes('moderate risk') || lowerAnalysis.includes('suspicious')) {
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
    static getServiceStatus(serviceData: any): 'available' | 'unavailable' | 'error' {
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

    // Parse phone check response for UI
    static parsePhoneCheckResponse(response: PhoneCheckResponse) {
        const services = [];

        if (response.pathao) {
            services.push({
                name: 'Pathao',
                icon: '🚚',
                data: response.pathao,
                status: this.getServiceStatus(response.pathao)
            });
        }

        if (response.steadfast) {
            services.push({
                name: 'Steadfast',
                icon: '📦',
                data: response.steadfast,
                status: this.getServiceStatus(response.steadfast)
            });
        }

        if (response.redx) {
            services.push({
                name: 'RedX',
                icon: '📮',
                data: response.redx,
                status: this.getServiceStatus(response.redx)
            });
        }

        const riskLevel = this.getRiskLevel(response.ai_analysis.analysis);

        return {
            services,
            aiAnalysis: response.ai_analysis,
            riskLevel,
            riskColor: this.getRiskColor(riskLevel),
            riskBgColor: this.getRiskBgColor(riskLevel),
            cached: response.cached
        };
    }
}

export default PhoneCheckService; 