import React, { useState } from 'react';
import { Check, Crown, Brain, Zap, Shield, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Plans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { t } = useLanguage();

  const plans = [
    {
      name: t('plans.starter'),
      price: { monthly: '৯৯', yearly: '৯৯০' },
      originalYearly: '১১৮৮',
      features: [
        t('plans.starter_search'),
        t('plans.basic_ai'),
        t('plans.email_support'),
        t('plans.basic_api'),
        t('plans.search_history_30')
      ],
      popular: false,
      buttonText: t('plans.monthly_buy'),
      icon: Zap
    },
    {
      name: t('plans.pro'),
      price: { monthly: '২৯৯', yearly: '২৯৯০' },
      originalYearly: '৩৫৮৮',
      features: [
        t('plans.pro_search'),
        t('plans.advanced_ai'),
        t('plans.priority_support'),
        t('plans.full_api'),
        t('plans.search_history_90'),
        t('plans.export_reports'),
        t('plans.custom_alerts')
      ],
      popular: true,
      buttonText: t('plans.monthly_buy'),
      icon: Brain
    },
    {
      name: t('plans.enterprise'),
      price: { monthly: '৭৯৯', yearly: '৭৯৯০' },
      originalYearly: '৯৫৮৮',
      features: [
        t('plans.enterprise_search'),
        t('plans.premium_ai'),
        t('plans.support_24_7'),
        t('plans.dedicated_api'),
        t('plans.search_history_1year'),
        t('plans.advanced_analytics'),
        t('plans.custom_integration'),
        t('plans.white_label')
      ],
      popular: false,
      buttonText: t('plans.monthly_buy'),
      icon: Shield
    }
  ];

  const getButtonText = (plan: any) => {
    if (billingCycle === 'monthly') {
      return `৳${plan.price.monthly}/${t('plans.monthly')}`;
    } else {
      return `৳${plan.price.yearly}/${t('plans.yearly')}`;
    }
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Active Subscription Alert */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 lg:mb-6">
        <div className="flex items-center text-green-400">
          <Check className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm lg:text-base">{t('plans.subscription_active')}</span>
        </div>
      </div>

      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">{t('plans.title')}</h2>
        <p className="text-slate-400 text-sm lg:text-lg mb-6">
          {t('plans.subtitle')}
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-6 lg:mb-8">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors text-sm lg:text-base ${billingCycle === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            {t('plans.monthly')}
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-lg font-medium transition-colors relative text-sm lg:text-base ${billingCycle === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
          >
            {t('plans.yearly')}
            {billingCycle === 'yearly' && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {t('plans.discount')}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <div
              key={index}
              className={`relative bg-slate-800 rounded-xl p-4 lg:p-6 border ${plan.popular
                  ? 'border-blue-500 bg-gradient-to-br from-slate-800 to-slate-700'
                  : 'border-slate-700'
                } flex flex-col h-full`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-1" />
                    {t('plans.most_popular')}
                  </div>
                </div>
              )}

              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-3">
                  <Icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg lg:text-xl font-bold text-white">{plan.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl lg:text-2xl font-bold text-white">
                      ৳{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                    </span>
                    <span className="text-slate-400 text-sm lg:text-base">
                      /{billingCycle === 'monthly' ? t('plans.monthly') : t('plans.yearly')}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-slate-400 line-through text-sm">
                        ৳{plan.originalYearly}
                      </span>
                      <span className="text-green-400 text-sm font-medium">
                        {t('plans.savings')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ul className="flex-1 space-y-2 lg:space-y-3 mb-4 lg:mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="w-4 lg:w-5 h-4 lg:h-5 text-green-400 mr-2 lg:mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300 text-xs lg:text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <button
                  className={`w-full py-2 lg:py-3 px-4 lg:px-6 rounded-lg font-medium transition-colors text-sm lg:text-base ${plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                >
                  {getButtonText(plan)}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Features Section */}
      <div className="mt-8 lg:mt-12 bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-4">{t('plans.ai_features')}</h3>
        <p className="text-slate-400 mb-4 lg:mb-6 text-sm lg:text-base">{t('plans.ai_description')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="bg-slate-700/50 rounded-lg p-3 lg:p-4">
            <h4 className="text-white font-medium mb-2 text-sm lg:text-base">{t('plans.real_time_analysis')}</h4>
            <p className="text-slate-400 text-xs lg:text-sm">{t('plans.real_time_description')}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 lg:p-4">
            <h4 className="text-white font-medium mb-2 text-sm lg:text-base">{t('plans.suspicious_detection')}</h4>
            <p className="text-slate-400 text-xs lg:text-sm">{t('plans.suspicious_description')}</p>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-3 lg:p-4">
            <h4 className="text-white font-medium mb-2 text-sm lg:text-base">{t('plans.courier_reports')}</h4>
            <p className="text-slate-400 text-xs lg:text-sm">{t('plans.courier_description')}</p>
          </div>
        </div>
      </div>

      {/* Free Package Info */}
      <div className="mt-6 lg:mt-8 bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <h3 className="text-base lg:text-lg font-semibold text-white mb-4">{t('plans.free_package')}</h3>
        <p className="text-slate-400 mb-4 text-sm lg:text-base">{t('plans.upgrade_message')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Check className="w-4 lg:w-5 h-4 lg:h-5 text-green-400" />
            <span className="text-slate-300 text-sm lg:text-base">{t('plans.basic_search')}</span>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Check className="w-4 lg:w-5 h-4 lg:h-5 text-green-400" />
            <span className="text-slate-300 text-sm lg:text-base">{t('plans.limited_ai')}</span>
          </div>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <Check className="w-4 lg:w-5 h-4 lg:h-5 text-green-400" />
            <span className="text-slate-300 text-sm lg:text-base">{t('plans.community_support')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plans;