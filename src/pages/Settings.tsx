import React, { useState } from 'react';
import { Bell, Lock, Globe, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    browser: false,
    sms: true
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Notification Settings */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center">
          <Bell className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 text-blue-400" />
          {t('settings.notifications')}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium text-sm lg:text-base">{t('settings.email_notifications')}</h4>
              <p className="text-slate-400 text-xs lg:text-sm">{t('settings.email_description')}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              className={`relative inline-flex h-5 lg:h-6 w-9 lg:w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-blue-600' : 'bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-3 lg:h-4 w-3 lg:w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium text-sm lg:text-base">{t('settings.browser_notifications')}</h4>
              <p className="text-slate-400 text-xs lg:text-sm">{t('settings.browser_description')}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, browser: !prev.browser }))}
              className={`relative inline-flex h-5 lg:h-6 w-9 lg:w-11 items-center rounded-full transition-colors ${notifications.browser ? 'bg-blue-600' : 'bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-3 lg:h-4 w-3 lg:w-4 transform rounded-full bg-white transition-transform ${notifications.browser ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium text-sm lg:text-base">{t('settings.sms_notifications')}</h4>
              <p className="text-slate-400 text-xs lg:text-sm">{t('settings.sms_description')}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
              className={`relative inline-flex h-5 lg:h-6 w-9 lg:w-11 items-center rounded-full transition-colors ${notifications.sms ? 'bg-blue-600' : 'bg-slate-600'
                }`}
            >
              <span
                className={`inline-block h-3 lg:h-4 w-3 lg:w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-4 lg:translate-x-6' : 'translate-x-0.5 lg:translate-x-1'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center">
          <Globe className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 text-blue-400" />
          {t('settings.language_settings')}
        </h3>

        <div>
          <label htmlFor="language" className="block text-white font-medium mb-2 text-sm lg:text-base">
            {t('settings.interface_language')}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'bn' | 'en')}
            className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
          >
            <option value="bn">{t('language.bengali')}</option>
            <option value="en">{t('language.english')}</option>
          </select>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <h3 className="text-lg lg:text-xl font-semibold text-white mb-4 lg:mb-6 flex items-center">
          <Lock className="w-5 lg:w-6 h-5 lg:h-6 mr-2 lg:mr-3 text-blue-400" />
          {t('settings.security_settings')}
        </h3>

        <div className="space-y-4 lg:space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-white font-medium mb-2 text-sm lg:text-base">
              {t('settings.current_password')}
            </label>
            <input
              type="password"
              id="current-password"
              className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              placeholder={t('settings.current_password_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-white font-medium mb-2 text-sm lg:text-base">
              {t('settings.new_password')}
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              placeholder={t('settings.new_password_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-white font-medium mb-2 text-sm lg:text-base">
              {t('settings.confirm_password')}
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm lg:text-base"
              placeholder={t('settings.confirm_password_placeholder')}
            />
          </div>

          <button className="px-4 lg:px-6 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm lg:text-base">
            {t('settings.change_password')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;