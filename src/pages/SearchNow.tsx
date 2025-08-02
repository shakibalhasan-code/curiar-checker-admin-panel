import React, { useState } from 'react';
import { Search, AlertTriangle, ArrowRight, ArrowLeft, Info, Shield, User, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PhoneCheckService, NotificationService } from '../services';
import { PhoneCheckResponse, CallerIdResponse } from '../types/api';

interface ParsedPhoneData {
    services: Array<{
        name: string;
        icon: string;
        data: any;
        status: 'available' | 'unavailable' | 'error';
    }>;
    aiAnalysis: any;
    riskLevel: 'low' | 'medium' | 'high';
    riskColor: string;
    riskBgColor: string;
    cached: boolean;
}

const SearchNow: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [phoneData, setPhoneData] = useState<ParsedPhoneData | null>(null);
    const [callerIdData, setCallerIdData] = useState<CallerIdResponse | null>(null);
    const [showResults, setShowResults] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'bn' | 'hi' | 'ur'>('en');
    const { t } = useLanguage();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!phoneNumber.trim()) {
            NotificationService.error('Validation Error', 'Please enter a phone number');
            return;
        }

        setIsLoading(true);
        setPhoneData(null);
        setCallerIdData(null);

        try {
            // Fetch phone check data
            const result = await PhoneCheckService.checkPhone(phoneNumber, selectedLanguage);
            const parsed = PhoneCheckService.parsePhoneCheckResponse(result);

            // Fetch caller ID data
            let callerIdResult = null;
            try {
                callerIdResult = await PhoneCheckService.getCallerId(phoneNumber);
            } catch (error) {
                console.log('Caller ID not available for this number');
            }

            setPhoneData(parsed);
            setCallerIdData(callerIdResult);
            setShowResults(true);

            NotificationService.phoneCheckSuccess(phoneNumber);
        } catch (error: any) {
            console.error('Phone check error:', error);

            if (error.message?.includes('Invalid phone number')) {
                NotificationService.validationError('Phone Number', 'Please use Bangladeshi format: 01XXXXXXXXX');
            } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
                NotificationService.quotaExceeded(error.quota);
            } else if (error.code === 'NETWORK_ERROR') {
                NotificationService.networkError();
            } else {
                NotificationService.apiError(error, 'Phone Check Failed');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        setShowResults(false);
        setPhoneData(null);
    };

    const getRiskIcon = (riskLevel: string) => {
        switch (riskLevel) {
            case 'high':
                return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'medium':
                return <Shield className="w-5 h-5 text-yellow-500" />;
            case 'low':
                return <Shield className="w-5 h-5 text-green-500" />;
            default:
                return <Shield className="w-5 h-5 text-gray-500" />;
        }
    };

    const getLanguageName = (code: string) => {
        switch (code) {
            case 'bn': return 'বাংলা';
            case 'en': return 'English';
            case 'hi': return 'हिंदी';
            case 'ur': return 'اردو';
            default: return 'English';
        }
    };

    return (
        <div className="p-4 lg:p-6">
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4 lg:mb-6">
                <p className="text-blue-300 text-sm lg:text-base">
                    {t('search.paid_service_message')}
                    <a href="#" className="ml-2 text-blue-400 underline hover:text-blue-300">
                        {t('search.check_packages')}
                    </a>
                </p>
            </div>

            {/* Search Section - Only show when not showing results */}
            {!showResults && (
                <>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 lg:p-6 mb-4 lg:mb-6">
                        <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">Track Courier Orders</h2>
                        <p className="text-blue-100 mb-4 lg:mb-6 text-sm lg:text-base">
                            Check courier order history & success rates by phone
                        </p>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label htmlFor="phone" className="block text-white font-medium mb-2">
                                    {t('search.customer_phone')}
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="language" className="block text-white font-medium mb-2">
                                    Language
                                </label>
                                <select
                                    id="language"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value as any)}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="en">English</option>
                                    <option value="bn">বাংলা</option>
                                    <option value="hi">हिंदी</option>
                                    <option value="ur">اردو</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full lg:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{t('search.search_button')}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Free Plan Info */}
                    <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700 mb-4 lg:mb-6">
                        <p className="text-slate-300 text-sm lg:text-base">
                            {t('search.free_info')}
                        </p>
                    </div>
                </>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">{t('search.searching')}</p>
                </div>
            )}

            {/* Results */}
            {phoneData && !isLoading && showResults && (
                <div className="space-y-4 lg:space-y-6">
                    {/* Back Button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm lg:text-base">{t('search.back_to_search')}</span>
                        </button>
                        <div className="text-slate-400 text-sm">
                            Phone: {PhoneCheckService.formatPhoneNumber(phoneNumber)}
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    <div className={`${phoneData.riskBgColor} rounded-lg p-4 lg:p-6 border`}>
                        <div className="flex items-center space-x-3">
                            {getRiskIcon(phoneData.riskLevel)}
                            <div>
                                <h3 className="font-semibold text-lg">Risk Assessment</h3>
                                <p className="text-sm opacity-90">
                                    {phoneData.aiAnalysis.analysis}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fraud Report Section */}
                    {phoneData.services.some(service => service.data?.fraud) && (
                        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 lg:p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <h3 className="font-semibold text-lg text-red-400">Fraud Report</h3>
                            </div>
                            <div className="space-y-3">
                                {phoneData.services.map((service, index) => (
                                    service.data?.fraud && (
                                        <div key={index} className="bg-red-800/20 rounded-lg p-4 border border-red-500/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl">{service.icon}</span>
                                                    <span className="font-medium text-red-300">{service.name}</span>
                                                </div>
                                                <span className="text-xs text-red-400">
                                                    {new Date(service.data.fraud.time).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {service.data.fraud.name && (
                                                    <div>
                                                        <span className="text-sm font-medium text-red-300">Name: </span>
                                                        <span className="text-sm text-red-200">{service.data.fraud.name}</span>
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="text-sm font-medium text-red-300">Details: </span>
                                                    <p className="text-sm text-red-200 mt-1">{service.data.fraud.details}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI Analysis Summary */}
                    <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                        <h3 className="text-white font-semibold mb-4">AI Analysis Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Total Success</h4>
                                <p className="text-white font-bold text-xl">{phoneData.aiAnalysis.summary.totalSuccess}</p>
                            </div>
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Total Cancel</h4>
                                <p className="text-white font-bold text-xl">{phoneData.aiAnalysis.summary.totalCancel}</p>
                            </div>
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Total Parcels</h4>
                                <p className="text-white font-bold text-xl">{phoneData.aiAnalysis.summary.totalParcels}</p>
                            </div>
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Fraud Reports</h4>
                                <p className="text-white font-bold text-xl">
                                    {phoneData.aiAnalysis.summary.hasFraudReport ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Number Details */}
                    {callerIdData && callerIdData.success && (
                        <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                            <h3 className="text-white font-semibold mb-4">User Number Details</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* User Info */}
                                {callerIdData.userInfo && (
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <h4 className="text-slate-400 text-sm mb-3">User Information</h4>
                                        <div className="flex items-center space-x-4">
                                            {callerIdData.userInfo.image && (
                                                <img
                                                    src={callerIdData.userInfo.image}
                                                    alt="User"
                                                    className="w-16 h-16 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-white font-semibold text-lg">
                                                    {callerIdData.userInfo.name}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-slate-400 text-sm">Score:</span>
                                                    <span className="text-green-400 font-medium">
                                                        {Math.round(callerIdData.userInfo.score * 100)}%
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-slate-400 text-sm">Access:</span>
                                                    <span className="text-blue-400 font-medium">
                                                        {callerIdData.userInfo.access}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Carrier Info */}
                                <div className="bg-slate-700 rounded-lg p-4">
                                    <h4 className="text-slate-400 text-sm mb-3">Carrier Information</h4>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Carrier:</span>
                                            <span className="text-white font-medium">{callerIdData.carrierInfo.carrier}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Number Type:</span>
                                            <span className="text-white font-medium">{callerIdData.carrierInfo.numberType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Format:</span>
                                            <span className="text-white font-medium">{callerIdData.carrierInfo.nationalFormat}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Country:</span>
                                            <span className="text-white font-medium">{callerIdData.carrierInfo.countryCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Performance */}
                    <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                        <h3 className="text-white font-semibold mb-4">Service Performance</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {phoneData.services.map((service, index) => (
                                <div key={index} className="bg-slate-700 rounded-lg p-4">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className="text-2xl">{service.icon}</span>
                                        <div>
                                            <h4 className="text-white font-semibold">{service.name}</h4>
                                            <p className={`text-sm ${service.status === 'available' ? 'text-green-400' :
                                                service.status === 'error' ? 'text-red-400' : 'text-yellow-400'
                                                }`}>
                                                {service.status === 'available' ? 'Available' :
                                                    service.status === 'error' ? 'Error' : 'Unavailable'}
                                            </p>
                                        </div>
                                    </div>

                                    {service.status === 'available' && service.data && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Success:</span>
                                                <span className="text-green-400">{service.data.stats.success}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Cancel:</span>
                                                <span className="text-red-400">{service.data.stats.cancel}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Total:</span>
                                                <span className="text-white">{service.data.stats.total}</span>
                                            </div>
                                            {service.data.user.name && (
                                                <div className="pt-2 border-t border-slate-600">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        <span className="text-slate-300 text-sm">{service.data.user.name}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cache Status */}
                    {phoneData.cached && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                            <p className="text-blue-300 text-sm">
                                ℹ️ This data was retrieved from cache for faster response
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchNow; 