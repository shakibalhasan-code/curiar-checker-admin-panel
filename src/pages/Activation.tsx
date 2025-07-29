import React from 'react';
import { CheckCircle, Clock, MessageCircle, CreditCard } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Activation: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Status Card */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 lg:w-12 h-10 lg:h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 lg:w-7 h-6 lg:h-7 text-green-400" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-semibold text-white">{t('activation.title')}</h2>
              <p className="text-slate-400 text-sm lg:text-base">{t('activation.status')}: <span className="text-green-400 font-medium">{t('activation.active')}</span></p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-slate-700/50 rounded-lg p-3 lg:p-4">
            <h3 className="text-slate-400 text-xs lg:text-sm mb-1">{t('activation.plan')}</h3>
            <p className="text-white font-medium text-sm lg:text-base">{t('activation.free_basic')}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 lg:p-4">
            <h3 className="text-slate-400 text-xs lg:text-sm mb-1">{t('activation.days_left')}</h3>
            <p className="text-white font-medium text-sm lg:text-base">{t('activation.days_remaining')}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 lg:p-4">
            <h3 className="text-slate-400 text-xs lg:text-sm mb-1">Next Billing</h3>
            <p className="text-white font-medium text-sm lg:text-base">2025-12-11</p>
          </div>
        </div>
      </div>

      {/* Activation Methods */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6">{t('activation.methods')}</h3>

        <div className="space-y-4 lg:space-y-6">
          {/* Free Activation */}
          <div className="bg-slate-700/50 rounded-lg p-4 lg:p-6 border border-slate-600">
            <div className="flex items-start space-x-3 lg:space-x-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 lg:w-6 h-5 lg:h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm lg:text-base mb-2">{t('activation.free_activation')}</h4>
                <p className="text-slate-400 text-xs lg:text-sm mb-3 lg:mb-4">{t('activation.free_description')}</p>
                <button className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm lg:text-base">
                  Request Free Activation
                </button>
              </div>
            </div>
          </div>

          {/* Instant Activation */}
          <div className="bg-slate-700/50 rounded-lg p-4 lg:p-6 border border-slate-600">
            <div className="flex items-start space-x-3 lg:space-x-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 lg:w-6 h-5 lg:h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm lg:text-base mb-2">{t('activation.instant_activation')}</h4>
                <p className="text-slate-400 text-xs lg:text-sm mb-3 lg:mb-4">{t('activation.instant_description')}</p>
                <button className="px-4 lg:px-6 py-2 lg:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm lg:text-base">
                  Pay & Activate Now
                </button>
              </div>
            </div>
          </div>

          {/* Pro Plan Upgrade */}
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 lg:p-6 border border-purple-500/20">
            <div className="flex items-start space-x-3 lg:space-x-4">
              <div className="w-10 lg:w-12 h-10 lg:h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-5 lg:w-6 h-5 lg:h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm lg:text-base mb-2">{t('activation.pro_plan')}</h4>
                <p className="text-slate-400 text-xs lg:text-sm mb-3 lg:mb-4">{t('activation.pro_description')}</p>
                <button className="px-4 lg:px-6 py-2 lg:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm lg:text-base">
                  {t('activation.view_pro_plan')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-start space-x-3 lg:space-x-4">
          <div className="w-10 lg:w-12 h-10 lg:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 lg:w-6 h-5 lg:h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm lg:text-base mb-2">{t('activation.support_message')}</h3>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm lg:text-base flex items-center justify-center space-x-2">
                <MessageCircle className="w-4 lg:w-5 h-4 lg:h-5" />
                <span>{t('activation.message_facebook')}</span>
              </button>
              <button className="px-4 lg:px-6 py-2 lg:py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-colors text-sm lg:text-base">
                {t('activation.upgrade_plan')}
              </button>
            </div>
            <p className="text-slate-400 text-xs lg:text-sm mt-3 lg:mt-4">{t('activation.contact_message')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activation;