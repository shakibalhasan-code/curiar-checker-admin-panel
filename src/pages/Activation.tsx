import React from 'react';
import { CheckCircle, Clock, CreditCard, MessageCircle, ExternalLink } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Activation: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{t('activation.title')}</h2>
      </div>

      {/* Activation Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('activation.status')}</h3>
            <div className="flex items-center justify-center text-green-400">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">{t('activation.active')}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('activation.plan')}</h3>
            <p className="text-blue-400 font-medium">{t('activation.free_basic')}</p>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{t('activation.days_left')}</h3>
            <p className="text-yellow-400 font-medium">{t('activation.days_remaining')}</p>
          </div>
        </div>
      </div>

      {/* Activation Methods */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6">{t('activation.methods')}</h3>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-2">
                <span className="font-bold">{t('activation.free_activation')}:</span> {t('activation.free_description')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-2">
                <span className="font-bold">{t('activation.instant_activation')}:</span> {t('activation.instant_description')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-2">
                <span className="font-bold">{t('activation.pro_plan')}:</span>
                <a href="#" className="text-blue-400 hover:text-blue-300 underline ml-1">
                  {t('activation.view_pro_plan')}
                </a> {t('activation.pro_description')}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-white font-medium mb-2">
                {t('activation.support_message')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>{t('activation.message_facebook')}</span>
        </button>
        <button className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors">
          <ExternalLink className="w-5 h-5" />
          <span>{t('activation.upgrade_plan')}</span>
        </button>
      </div>

      {/* Support Contact */}
      <div className="text-center pt-6 border-t border-slate-700">
        <p className="text-slate-400">
          {t('activation.contact_message')}:
          <a href="mailto:support@bdcourier.com" className="text-blue-400 hover:text-blue-300 ml-1">
            support@bdcourier.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Activation;