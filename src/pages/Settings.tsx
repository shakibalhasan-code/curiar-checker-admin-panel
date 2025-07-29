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
    <div className="p-6 space-y-6">
      {/* Notification Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Bell className="w-6 h-6 mr-3 text-blue-400" />
          {t('settings.notifications')}
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t('settings.email_notifications')}</h4>
              <p className="text-slate-400 text-sm">{t('settings.email_description')}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.email ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t('settings.browser_notifications')}</h4>
              <p className="text-slate-400 text-sm">{t('settings.browser_description')}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, browser: !prev.browser }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.browser ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.browser ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">{t('settings.sms_notifications')}</h4>
              <p className="text-slate-400 text-sm">{t('settings.sms_description')}</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications.sms ? 'bg-blue-600' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications.sms ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Globe className="w-6 h-6 mr-3 text-blue-400" />
          {t('settings.language_settings')}
        </h3>
        
        <div>
          <label htmlFor="language" className="block text-white font-medium mb-2">
            {t('settings.interface_language')}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'bn' | 'en')}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="bn">{t('language.bengali')}</option>
            <option value="en">{t('language.english')}</option>
          </select>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Lock className="w-6 h-6 mr-3 text-blue-400" />
          {t('settings.security_settings')}
        </h3>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="current-password" className="block text-white font-medium mb-2">
              {t('settings.current_password')}
            </label>
            <input
              type="password"
              id="current-password"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('settings.current_password_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-white font-medium mb-2">
              {t('settings.new_password')}
            </label>
            <input
              type="password"
              id="new-password"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('settings.new_password_placeholder')}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-white font-medium mb-2">
              {t('settings.confirm_password')}
            </label>
            <input
              type="password"
              id="confirm-password"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('settings.confirm_password_placeholder')}
            />
          </div>

          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
            {t('settings.change_password')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;