import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const SearchTrends: React.FC = () => {
  const { t } = useLanguage();

  // Mock data for the chart
  const data = [
    80, 90, 50, 60, 55, 105, 85, 90, 115, 85, 65, 70, 30, 55, 120, 100, 95, 135, 102, 140, 105, 100, 85, 80, 115, 85, 65, 55, 50, 60
  ];

  const maxValue = Math.max(...data);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h3 className="text-xl font-semibold text-white mb-6">
        {t('dashboard.search_trends')}
      </h3>

      <div className="relative h-64">
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-slate-400">
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        <div className="ml-8 h-full flex items-end space-x-1">
          {data.map((value, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm hover:from-blue-500 hover:to-blue-300 transition-all duration-200 cursor-pointer"
              style={{
                height: `${(value / maxValue) * 100}%`,
                width: '100%',
                minHeight: '2px'
              }}
              title={`${t('dashboard.day')} ${index + 1}: ${value} ${t('dashboard.searches')}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchTrends;