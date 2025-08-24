import React, { useState } from 'react';
import { Copy, Download, Link, Globe, Key, Code } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const API: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();
  const { user } = useAuth();

  // Get current site URL
  const currentSiteUrl = window.location.origin;

  // Get user's actual API key or show empty if not available
  const userApiKey = user?.apiKey || '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const integrations = [
    {
      name: 'WordPress Plugin',
      description: 'Integrate courier tracking into your WordPress site',
      icon: '🔌',
      downloadUrl: '#',
      copyUrl: '#'
    },
    {
      name: 'Android App',
      description: 'Mobile app for tracking courier orders',
      icon: '📱',
      downloadUrl: '#',
      copyUrl: '#'
    },
    {
      name: 'Chrome Extension',
      description: 'Browser extension for quick courier lookups',
      icon: '🌐',
      downloadUrl: '#',
      copyUrl: '#'
    }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:mb-6">


      {/* API Key Management */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Key className="w-6 h-6 text-blue-400" />
          <h2 className="text-lg lg:text-xl font-semibold text-white">API Key Management</h2>
        </div>
        <p className="text-slate-400 mb-4 lg:mb-6 text-sm lg:text-base">
          Your personal API key for integrating with our courier tracking services.
        </p>

        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-lg font-mono text-white text-sm lg:text-base break-all">
            {userApiKey || 'No API key available'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleCopy(userApiKey)}
              disabled={!userApiKey}
              className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm lg:text-base flex items-center space-x-2"
            >
              <Copy className="w-4 lg:w-5 h-4 lg:h-5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Site Information */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="w-6 h-6 text-green-400" />
          <h2 className="text-lg lg:text-xl font-semibold text-white">Site Information</h2>
        </div>
        <p className="text-slate-400 mb-4 lg:mb-6 text-sm lg:text-base">
          Current site URL and configuration details.
        </p>

        <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-slate-700 border border-slate-600 rounded-lg font-mono text-white text-sm lg:text-base break-all">
            {currentSiteUrl || 'Unknown'}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleCopy(currentSiteUrl)}
              className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm lg:text-base flex items-center space-x-2"
            >
              <Copy className="w-4 lg:w-5 h-4 lg:h-5" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ready Integrations */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Code className="w-6 h-6 text-purple-400" />
          <h2 className="text-lg lg:text-xl font-semibold text-white">Ready Integrations</h2>
        </div>
        <p className="text-slate-400 mb-4 lg:mb-6 text-sm lg:text-base">
          Available integrations for our courier tracking services.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {integrations.map((integration, index) => (
            <div key={index} className="bg-slate-700/50 rounded-lg p-4 lg:p-6 border border-slate-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl lg:text-3xl">{integration.icon}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm lg:text-base">{integration.name}</h3>
                    <p className="text-slate-400 text-xs lg:text-sm">{integration.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 lg:px-4 py-2 lg:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm lg:text-base flex items-center justify-center space-x-2">
                  <Download className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span>Download</span>
                </button>
                <button className="px-3 lg:px-4 py-2 lg:py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors text-sm lg:text-base flex items-center space-x-2">
                  <Link className="w-4 lg:w-5 h-4 lg:h-5" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Documentation */}
      <div className="bg-slate-800 rounded-xl p-4 lg:p-6 border border-slate-700">
        <div className="flex items-center space-x-3 mb-4">
          <Code className="w-6 h-6 text-orange-400" />
          <h2 className="text-lg lg:text-xl font-semibold text-white">API Documentation</h2>
        </div>
        <p className="text-slate-400 mb-4 lg:mb-6 text-sm lg:text-base">
          Complete API reference for integrating with our courier tracking services.
        </p>

        <div className="bg-slate-700/50 rounded-lg p-4 lg:p-6">
          <h3 className="text-white font-medium mb-3 text-sm lg:text-base">Base URL</h3>
          <code className="block bg-slate-800 px-3 lg:px-4 py-2 lg:py-3 rounded text-blue-400 text-sm lg:text-base font-mono">
            https://api.courierorder.com/v1
          </code>

          <h3 className="text-white font-medium mb-3 mt-4 lg:mt-6 text-sm lg:text-base">Authentication</h3>
          <p className="text-slate-400 text-xs lg:text-sm mb-3">
            Include your API key in the Authorization header:
          </p>
          <code className="block bg-slate-800 px-3 lg:px-4 py-2 lg:py-3 rounded text-blue-400 text-sm lg:text-base font-mono">
            Authorization: Bearer YOUR_API_KEY
          </code>

          <h3 className="text-white font-medium mb-3 mt-4 lg:mt-6 text-sm lg:text-base">Example Request</h3>
          <div className="bg-slate-800 rounded p-3 lg:p-4">
            <p className="text-slate-400 text-xs lg:text-sm mb-2">GET /search?phone=01XXXXXXXXX</p>
            <div className="text-xs lg:text-sm text-slate-300">
              <p>Response:</p>
              <pre className="mt-2 text-green-400">
                {`{
  "total_orders": 15,
  "successful": 12,
  "cancelled": 3,
  "success_rate": 80.0,
  "courier_performance": [...]
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default API;