import React, { useState } from 'react';
import { Search, AlertTriangle, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OrderData {
    totalOrders: number;
    successful: number;
    cancelled: number;
    successRate: number;
    courierPerformance: {
        name: string;
        total: number;
        success: number;
        cancel: number;
    }[];
}

const SearchNow: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState('12345678987');
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<OrderData | null>(null);
    const [showAIWarning, setShowAIWarning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const { t } = useLanguage();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setOrderData(null);
        setShowAIWarning(false);

        // Simulate API call with 2-3 second delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Mock data
        const mockData: OrderData = {
            totalOrders: 0,
            successful: 0,
            cancelled: 0,
            successRate: 0.0,
            courierPerformance: [
                { name: 'Pathao', total: 0, success: 0, cancel: 0 },
                { name: 'SteadFast', total: 0, success: 0, cancel: 0 },
                { name: 'Parceldex', total: 0, success: 0, cancel: 0 },
                { name: 'REDX', total: 0, success: 0, cancel: 0 },
                { name: 'Paperfly', total: 0, success: 0, cancel: 0 },
            ]
        };

        setOrderData(mockData);
        setShowAIWarning(true);
        setShowResults(true);
        setIsLoading(false);
    };

    const handleBack = () => {
        setShowResults(false);
        setOrderData(null);
        setShowAIWarning(false);
    };

    return (
        <div className="p-6">
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-blue-300">
                    {t('search.paid_service_message')}
                    <a href="#" className="ml-2 text-blue-400 underline hover:text-blue-300">
                        {t('search.check_packages')}
                    </a>
                </p>
            </div>

            {/* Search Section - Only show when not showing results */}
            {!showResults && (
                <>
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">Track Courier Orders</h2>
                        <p className="text-blue-100 mb-6">
                            Check courier order history & success rates by phone
                        </p>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div>
                                <label htmlFor="phone" className="block text-white font-medium mb-2">
                                    {t('search.customer_phone')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="phone"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="01XXXXXXXXX"
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                        required
                                    />
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full md:w-auto px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>{t('search.search_button')}</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                                <span>{isLoading ? t('search.searching') : ''}</span>
                            </button>
                        </form>
                    </div>

                    {/* Free Plan Info */}
                    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-6">
                        <p className="text-slate-300">
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

            {/* Order Details */}
            {orderData && !isLoading && showResults && (
                <div className="space-y-6">
                    {/* Back Button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>{t('search.back_to_search')}</span>
                        </button>
                        <div className="text-slate-400 text-sm">
                            Phone: {phoneNumber}
                        </div>
                    </div>

                    {/* AI Suggestions Section */}
                    {showAIWarning && (
                        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-6 h-6 text-red-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="flex items-center space-x-2 mb-2">
                                            <h3 className="text-red-400 font-semibold text-lg">{t('search.ai_suggestions')}</h3>
                                            <div className="relative group">
                                                <Info className="w-5 h-5 text-red-400 cursor-help" />
                                                <div className="absolute bottom-full left-0 mb-2 w-80 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-50 shadow-lg">
                                                    <p>AI ইন্টারনেট থেকে ডেটা সংগ্রহ করছে এবং কুরিয়ারদের শেষ পারফরম্যান্সও বিশ্লেষণ করছে।</p>
                                                    <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-red-300 text-sm">
                                            {t('search.ai_warning')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg p-6 border border-blue-200">
                            <h3 className="text-gray-600 text-sm font-medium">{t('search.total_orders')}</h3>
                            <p className="text-2xl font-bold text-blue-600">{orderData.totalOrders}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                            <h3 className="text-gray-600 text-sm font-medium">{t('search.successful')}</h3>
                            <p className="text-2xl font-bold text-green-600">{orderData.successful}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                            <h3 className="text-gray-600 text-sm font-medium">{t('search.cancelled')}</h3>
                            <p className="text-2xl font-bold text-red-600">{orderData.cancelled}</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                            <h3 className="text-gray-600 text-sm font-medium">{t('search.success_rate')}</h3>
                            <p className="text-2xl font-bold text-purple-600">{orderData.successRate.toFixed(2)}%</p>
                        </div>
                    </div>

                    {/* Courier Performance and Delivery Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Courier Performance Table */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-white font-semibold mb-4">{t('search.courier_performance')}</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-slate-400 border-b border-slate-700">
                                            <th className="text-left py-2">COURIER</th>
                                            <th className="text-right py-2">TOTAL</th>
                                            <th className="text-right py-2">SUCCESS</th>
                                            <th className="text-right py-2">CANCEL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderData.courierPerformance.map((courier, index) => (
                                            <tr key={index} className="border-b border-slate-700">
                                                <td className="py-2 text-white">{courier.name}</td>
                                                <td className="py-2 text-right text-white">{courier.total}</td>
                                                <td className="py-2 text-right text-green-400">{courier.success}</td>
                                                <td className="py-2 text-right text-red-400">{courier.cancel}</td>
                                            </tr>
                                        ))}
                                        <tr className="font-semibold">
                                            <td className="py-2 text-white">Total</td>
                                            <td className="py-2 text-right text-white">{orderData.totalOrders}</td>
                                            <td className="py-2 text-right text-green-400">{orderData.successful}</td>
                                            <td className="py-2 text-right text-red-400">{orderData.cancelled}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Delivery Status */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h3 className="text-white font-semibold mb-4">{t('search.delivery_status')}</h3>
                            <div className="flex items-center justify-center h-32">
                                <p className="text-slate-400">{t('search.no_data')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchNow; 