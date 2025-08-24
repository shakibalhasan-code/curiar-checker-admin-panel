import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowLeft, Shield, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PhoneCheckService, NotificationService } from '../services';
import { CallerIdResponse, CourierCheck } from '../types/api';

interface ParsedPhoneData {
    services: Array<{
        name: string;
        icon: string;
        data: CourierCheck;
        status: 'available' | 'unavailable' | 'error';
        statusColor: string;
        statusBgColor: string;
    }>;
    courier_checks: {
        pathao?: CourierCheck;
        steadfast?: CourierCheck;
        redx?: CourierCheck;
    };
    aiAnalysis: {
        analysis?: string;
        language?: string;
        summary?: {
            totalSuccess: number;
            totalCancel: number;
            totalParcels: number;
            hasFraudReport: boolean;
        };
    };
    riskLevel: 'low' | 'medium' | 'high';
    riskColor: string;
    riskBgColor: string;
    fraudScore: number;
    analysis: string;
    cached: boolean;
    timestamp: string;
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
            NotificationService.validationError('Phone Number', 'Please enter a phone number');
            return;
        }

        if (!PhoneCheckService.validatePhoneNumber(phoneNumber)) {
            NotificationService.validationError('Phone Number', 'Please use Bangladeshi format: 01XXXXXXXXX');
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
            } catch {
                console.log('Caller ID not available for this number');
            }

            setPhoneData(parsed);
            setCallerIdData(callerIdResult);
            setShowResults(true);

            NotificationService.phoneCheckSuccess(phoneNumber);
        } catch (error: unknown) {
            console.error('Phone check error:', error);

            if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
                if (error.message.includes('Invalid phone number')) {
                    NotificationService.validationError('Phone Number', 'Please use Bangladeshi format: 01XXXXXXXXX');
                } else if ('code' in error && error.code === 'RATE_LIMIT_EXCEEDED' && 'quota' in error) {
                    NotificationService.quotaExceeded(error.quota);
                } else if ('code' in error && error.code === 'NETWORK_ERROR') {
                    NotificationService.networkError();
                } else {
                    NotificationService.apiError(error, 'Phone Check Failed');
                }
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





    // Get risk level and background color based on fraud score
    const getRiskAssessment = (fraudScore: number) => {
        if (fraudScore >= 70) {
            return {
                level: 'high',
                bgColor: 'bg-red-900/20 border-red-500/30 border',
                textColor: 'text-red-400',
                icon: <AlertTriangle className="w-5 h-5 text-red-500" />
            };
        } else if (fraudScore >= 40) {
            return {
                level: 'medium',
                bgColor: 'bg-yellow-900/20 border-yellow-500/30 border',
                textColor: 'text-yellow-400',
                icon: <Shield className="w-5 h-5 text-yellow-500" />
            };
        } else {
            return {
                level: 'low',
                bgColor: 'bg-green-900/20 border-green-500/30 border',
                textColor: 'text-green-400',
                icon: <Shield className="w-5 h-5 text-green-500" />
            };
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
                                    onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'bn' | 'hi' | 'ur')}
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
                                className="w-full lg:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
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

                    {/* Fraud Score */}
                    <div className={`${PhoneCheckService.getFraudScoreBgColor(phoneData.fraudScore)} rounded-lg p-4 lg:p-6 border`}>
                        <div className="flex items-center space-x-3">
                            <div className={`text-2xl font-bold ${PhoneCheckService.getFraudScoreColor(phoneData.fraudScore)}`}>
                                {phoneData.fraudScore}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Fraud Score</h3>
                                <p className="text-sm opacity-90">
                                    {phoneData.analysis}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Risk Assessment */}
                    {(() => {
                        const riskAssessment = getRiskAssessment(phoneData.fraudScore);
                        return (
                            <div className={`${riskAssessment.bgColor} rounded-lg p-4 lg:p-6`}>
                                <div className="flex items-center space-x-3">
                                    {riskAssessment.icon}
                                    <div>
                                        <h3 className={`font-semibold text-lg ${riskAssessment.textColor}`}>Risk Assessment</h3>
                                        <p className="text-sm opacity-90 text-white">
                                            {phoneData.aiAnalysis?.analysis || 'No analysis available'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* AI Analysis Summary */}
                    <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                        <h3 className="text-white font-semibold mb-4">AI Analysis Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Total Success</h4>
                                <p className="text-white font-bold text-xl">{phoneData.aiAnalysis?.summary?.totalSuccess || 0}</p>
                            </div>
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Total Cancel</h4>
                                <p className="text-white font-bold text-xl">{phoneData.aiAnalysis?.summary?.totalCancel || 0}</p>
                            </div>
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Total Parcels</h4>
                                <p className="text-white font-bold text-xl">{phoneData.aiAnalysis?.summary?.totalParcels || 0}</p>
                            </div>
                            <div className="bg-slate-700 rounded-lg p-4">
                                <h4 className="text-slate-400 text-sm">Fraud Reports</h4>
                                <p className="text-white font-bold text-xl">
                                    {phoneData.aiAnalysis?.summary?.hasFraudReport ? 'Yes' : 'No'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Fraud Report Details */}
                    {phoneData.aiAnalysis?.summary?.hasFraudReport && phoneData.courier_checks && (
                        <div className="bg-red-900/20 border-red-500/30 rounded-xl p-4 lg:p-6 border border-red-500/50">
                            <h3 className="text-red-400 font-semibold mb-4 flex items-center space-x-2">
                                <span>🚨</span>
                                <span>Fraud Report Details</span>
                            </h3>

                            {/* Courier Data Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-red-500/30">
                                            <th className="text-left text-red-300 font-medium pb-2">Courier</th>
                                            <th className="text-left text-red-300 font-medium pb-2">Status</th>
                                            <th className="text-left text-red-300 font-medium pb-2">Success</th>
                                            <th className="text-left text-red-300 font-medium pb-2">Cancel</th>
                                            <th className="text-left text-red-300 font-medium pb-2">Total</th>
                                            <th className="text-left text-red-300 font-medium pb-2">Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white">
                                        {/* Pathao */}
                                        {phoneData.courier_checks?.pathao && (
                                            <tr className="border-b border-red-500/20">
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-2xl">🚚</span>
                                                        <span className="font-medium">Pathao</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.pathao.fraudStatus || 'clean')}`}>
                                                        {phoneData.courier_checks.pathao.fraudStatus || 'clean'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-emerald-400 font-medium">{phoneData.courier_checks.pathao.stats?.success || 0}</td>
                                                <td className="py-3 text-red-400 font-medium">{phoneData.courier_checks.pathao.stats?.cancel || 0}</td>
                                                <td className="py-3 text-blue-400 font-medium">{phoneData.courier_checks.pathao.stats?.total || 0}</td>
                                                <td className="py-3 text-slate-300">
                                                    {phoneData.courier_checks.pathao.user?.phone || 'N/A'}
                                                </td>
                                            </tr>
                                        )}

                                        {/* Steadfast */}
                                        {phoneData.courier_checks?.steadfast && (
                                            <tr className="border-b border-red-500/20">
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-2xl">📦</span>
                                                        <span className="font-medium">Steadfast</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.steadfast.fraudStatus || 'clean')}`}>
                                                        {phoneData.courier_checks.steadfast.fraudStatus || 'clean'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-emerald-400 font-medium">{phoneData.courier_checks.steadfast.stats?.success || 0}</td>
                                                <td className="py-3 text-red-400 font-medium">{phoneData.courier_checks.steadfast.stats?.cancel || 0}</td>
                                                <td className="py-3 text-blue-400 font-medium">{phoneData.courier_checks.steadfast.stats?.total || 0}</td>
                                                <td className="py-3 text-slate-300">
                                                    {phoneData.courier_checks.steadfast.user?.phone || 'N/A'}
                                                </td>
                                            </tr>
                                        )}

                                        {/* RedX */}
                                        {phoneData.courier_checks?.redx && (
                                            <tr className="border-b border-red-500/20">
                                                <td className="py-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-2xl">🚛</span>
                                                        <span className="font-medium">RedX</span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.redx.fraudStatus || 'clean')}`}>
                                                        {phoneData.courier_checks.redx.fraudStatus || 'clean'}
                                                    </span>
                                                </td>
                                                <td className="py-3 text-emerald-400 font-medium">{phoneData.courier_checks.redx.stats?.success || 0}</td>
                                                <td className="py-3 text-red-400 font-medium">{phoneData.courier_checks.redx.stats?.cancel || 0}</td>
                                                <td className="py-3 text-blue-400 font-medium">{phoneData.courier_checks.redx.stats?.total || 0}</td>
                                                <td className="py-3 text-slate-300">
                                                    {phoneData.courier_checks.redx.user?.phone || 'N/A'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Fraud Details */}
                            {phoneData.courier_checks?.steadfast?.fraud && typeof phoneData.courier_checks.steadfast.fraud === 'object' && (
                                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                                    <h4 className="text-red-400 font-semibold mb-3 flex items-center space-x-2">
                                        <span>⚠️</span>
                                        <span>Fraud Details (Steadfast)</span>
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-red-300">Name:</span>
                                            <span className="text-white font-medium">{phoneData.courier_checks.steadfast.fraud.name || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-red-300">Phone:</span>
                                            <span className="text-white font-medium">{phoneData.courier_checks.steadfast.fraud.phone || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-red-300">Time:</span>
                                            <span className="text-white font-medium">
                                                {new Date(phoneData.courier_checks.steadfast.fraud.time).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <span className="text-red-300 block mb-2">Details:</span>
                                            <p className="text-white bg-red-500/20 p-3 rounded border border-red-500/30">
                                                {phoneData.courier_checks.steadfast.fraud.details || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Courier Service Information (when no fraud report) */}
                    {phoneData.courier_checks && !phoneData.aiAnalysis?.summary?.hasFraudReport && (
                        <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                            <h3 className="text-white font-semibold mb-4">Courier Service Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Pathao */}
                                {phoneData.courier_checks?.pathao && (
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="text-2xl">🚚</span>
                                            <div>
                                                <h4 className="text-white font-semibold">Pathao</h4>
                                                <div className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.pathao.fraudStatus || 'clean')}`}>
                                                    {phoneData.courier_checks.pathao.fraudStatus || 'clean'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Information */}
                                        {phoneData.courier_checks.pathao.stats && (
                                            <div className="mt-3 pt-3 border-t border-slate-600">
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div className="text-center">
                                                        <div className="text-emerald-400 font-semibold">{phoneData.courier_checks.pathao.stats.success || 0}</div>
                                                        <div className="text-slate-400 text-xs">Success</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-red-400 font-semibold">{phoneData.courier_checks.pathao.stats.cancel || 0}</div>
                                                        <div className="text-slate-400 text-xs">Cancel</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-blue-400 font-semibold">{phoneData.courier_checks.pathao.stats.total || 0}</div>
                                                        <div className="text-slate-400 text-xs">Total</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Steadfast */}
                                {phoneData.courier_checks?.steadfast && (
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="text-2xl">📦</span>
                                            <div>
                                                <h4 className="text-white font-semibold">Steadfast</h4>
                                                <div className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.steadfast.fraudStatus || 'clean')}`}>
                                                    {phoneData.courier_checks.steadfast.fraudStatus || 'clean'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Information */}
                                        {phoneData.courier_checks.steadfast.stats && (
                                            <div className="mt-3 pt-3 border-t border-slate-600">
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div className="text-center">
                                                        <div className="text-emerald-400 font-semibold">{phoneData.courier_checks.steadfast.stats.success || 0}</div>
                                                        <div className="text-slate-400 text-xs">Success</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-red-400 font-semibold">{phoneData.courier_checks.steadfast.stats.cancel || 0}</div>
                                                        <div className="text-slate-400 text-xs">Cancel</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-blue-400 font-semibold">{phoneData.courier_checks.steadfast.stats.total || 0}</div>
                                                        <div className="text-slate-400 text-xs">Total</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* RedX */}
                                {phoneData.courier_checks?.redx && (
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <span className="text-2xl">🚛</span>
                                            <div>
                                                <h4 className="text-white font-semibold">RedX</h4>
                                                <div className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.redx.fraudStatus || 'clean')}`}>
                                                    {phoneData.courier_checks.redx.fraudStatus || 'clean'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Information */}
                                        {phoneData.courier_checks.redx.stats && (
                                            <div className="mt-3 pt-3 border-t border-slate-600">
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div className="text-center">
                                                        <div className="text-emerald-400 font-semibold">{phoneData.courier_checks.redx.stats.success || 0}</div>
                                                        <div className="text-slate-400 text-xs">Success</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-red-400 font-semibold">{phoneData.courier_checks.redx.stats.cancel || 0}</div>
                                                        <div className="text-slate-400 text-xs">Cancel</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-blue-400 font-semibold">{phoneData.courier_checks.redx.stats.total || 0}</div>
                                                        <div className="text-slate-400 text-xs">Total</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* User Number Details */}
                    {callerIdData && callerIdData.success && (
                        <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                            <h3 className="text-white font-semibold mb-4">User Number Details</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* User Info */}
                                {callerIdData.data.userInfo && (
                                    <div className="bg-slate-700 rounded-lg p-4">
                                        <h4 className="text-slate-400 text-sm mb-3">User Information</h4>
                                        <div className="flex items-center space-x-4">
                                            {callerIdData.data.userInfo.image && (
                                                <img
                                                    src={callerIdData.data.userInfo.image}
                                                    alt="User"
                                                    className="w-16 h-16 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            )}
                                            <div className="flex-1">
                                                <p className="text-white font-semibold text-lg">
                                                    {callerIdData.data.userInfo.name}
                                                </p>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-slate-400 text-sm">Score:</span>
                                                    <span className="text-green-400 font-medium">
                                                        {Math.round(callerIdData.data.userInfo.score * 100)}%
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <span className="text-slate-400 text-sm">Access:</span>
                                                    <span className="text-blue-400 font-medium">
                                                        {callerIdData.data.userInfo.access}
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
                                            <span className="text-white font-medium">{callerIdData.data.carrierInfo.carrier}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Number Type:</span>
                                            <span className="text-white font-medium">{callerIdData.data.carrierInfo.numberType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Format:</span>
                                            <span className="text-white font-medium">{callerIdData.data.carrierInfo.nationalFormat}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 text-sm">Country:</span>
                                            <span className="text-white font-medium">{callerIdData.data.carrierInfo.countryCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Service Performance */}
                    <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
                        <h3 className="text-white font-semibold mb-4">Service Performance</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-600">
                                        <th className="text-left text-slate-300 font-medium pb-2">Courier</th>
                                        <th className="text-left text-slate-300 font-medium pb-2">Status</th>
                                        <th className="text-left text-slate-300 font-medium pb-2">Success</th>
                                        <th className="text-left text-slate-300 font-medium pb-2">Cancel</th>
                                        <th className="text-left text-slate-300 font-medium pb-2">Total</th>
                                        <th className="text-left text-slate-300 font-medium pb-2">Phone</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white">
                                    {/* Pathao */}
                                    {phoneData.courier_checks?.pathao && (
                                        <tr className="border-b border-slate-600">
                                            <td className="py-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl">🚚</span>
                                                    <span className="font-medium">Pathao</span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.pathao.fraudStatus || 'clean')}`}>
                                                    {phoneData.courier_checks.pathao.fraudStatus || 'clean'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-emerald-400 font-medium">{phoneData.courier_checks.pathao.stats?.success || 0}</td>
                                            <td className="py-3 text-red-400 font-medium">{phoneData.courier_checks.pathao.stats?.cancel || 0}</td>
                                            <td className="py-3 text-blue-400 font-medium">{phoneData.courier_checks.pathao.stats?.total || 0}</td>
                                            <td className="py-3 text-slate-300">
                                                {phoneData.courier_checks.pathao.user?.phone || 'N/A'}
                                            </td>
                                        </tr>
                                    )}

                                    {/* Steadfast */}
                                    {phoneData.courier_checks?.steadfast && (
                                        <tr className="border-b border-slate-600">
                                            <td className="py-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl">📦</span>
                                                    <span className="font-medium">Steadfast</span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.steadfast.fraudStatus || 'clean')}`}>
                                                    {phoneData.courier_checks.steadfast.fraudStatus || 'clean'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-emerald-400 font-medium">{phoneData.courier_checks.steadfast.stats?.success || 0}</td>
                                            <td className="py-3 text-red-400 font-medium">{phoneData.courier_checks.steadfast.stats?.cancel || 0}</td>
                                            <td className="py-3 text-blue-400 font-medium">{phoneData.courier_checks.steadfast.stats?.total || 0}</td>
                                            <td className="py-3 text-slate-300">
                                                {phoneData.courier_checks.steadfast.user?.phone || 'N/A'}
                                            </td>
                                        </tr>
                                    )}

                                    {/* RedX */}
                                    {phoneData.courier_checks?.redx && (
                                        <tr className="border-b border-slate-600">
                                            <td className="py-3">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-2xl">🚛</span>
                                                    <span className="font-medium">RedX</span>
                                                </div>
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${PhoneCheckService.getServiceStatusBgColor(phoneData.courier_checks.redx.fraudStatus || 'clean')}`}>
                                                    {phoneData.courier_checks.redx.fraudStatus || 'clean'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-emerald-400 font-medium">{phoneData.courier_checks.redx.stats?.success || 0}</td>
                                            <td className="py-3 text-red-400 font-medium">{phoneData.courier_checks.redx.stats?.cancel || 0}</td>
                                            <td className="py-3 text-blue-400 font-medium">{phoneData.courier_checks.redx.stats?.total || 0}</td>
                                            <td className="py-3 text-slate-300">
                                                {phoneData.courier_checks.redx.user?.phone || 'N/A'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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

                    {/* Timestamp */}
                    <div className="text-slate-400 text-xs text-center">
                        Last updated: {new Date(phoneData.timestamp).toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchNow; 