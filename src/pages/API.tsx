import React, { useState } from 'react';
import { Key, Copy, RefreshCw, Download, ExternalLink, Globe, Smartphone, Puzzle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const API: React.FC = () => {
  const [apiKey] = useState('GMEMdF0JG6iMY9d1XrJMK2zVAMNuQP6BAHQ7yfnFKmMqmqD48ewKZ11gChqK');
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const integrations = [
    {
      name: t('api.wordpress_plugin'),
      description: t('api.wordpress_description'),
      icon: Globe,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      name: t('api.android_app'),
      description: t('api.android_description'),
      icon: Smartphone,
      color: 'text-green-400 bg-green-500/10'
    },
    {
      name: t('api.chrome_extension'),
      description: t('api.chrome_description'),
      icon: Puzzle,
      color: 'text-yellow-400 bg-yellow-500/10'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* API Key Management */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
          <Key className="w-6 h-6 mr-3 text-blue-400" />
          {t('api.key_management')}
        </h2>
        <p className="text-slate-400 mb-6">{t('api.key_description')}</p>

        <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <div className="flex items-center justify-between">
            <code className="text-purple-300 font-mono text-sm break-all">{apiKey}</code>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center space-x-2 transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? t('api.copied') : t('api.copy')}</span>
              </button>
              <button className="px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm flex items-center space-x-2 transition-colors">
                <RefreshCw className="w-4 h-4" />
                <span>{t('api.regenerate')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ready Integrations */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center">
          <Puzzle className="w-6 h-6 mr-3 text-blue-400" />
          {t('api.ready_integrations')}
        </h2>
        <p className="text-slate-400 mb-6">{t('api.integration_description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const Icon = integration.icon;
            return (
              <div key={integration.name} className="bg-slate-700/50 rounded-lg p-6 border border-slate-600 hover:border-slate-500 transition-colors">
                <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{integration.name}</h3>
                <p className="text-slate-400 text-sm mb-6">{integration.description}</p>

                <div className="flex space-x-3">
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center justify-center space-x-2 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>{t('api.download')}</span>
                  </button>
                  <button className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg text-sm flex items-center justify-center transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>{t('api.copy_link')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default API;