import React from 'react';
import { Clock, Phone, CheckCircle, XCircle } from 'lucide-react';

const History: React.FC = () => {
  const searchHistory = [
    {
      id: 1,
      phone: '01712345678',
      timestamp: '২০২৫-০১-২৯ ১৪:৩০',
      status: 'success',
      ordersFound: 5
    },
    {
      id: 2,
      phone: '01987654321',
      timestamp: '২০২৫-০১-২৯ ১২:১৫',
      status: 'success',
      ordersFound: 2
    },
    {
      id: 3,
      phone: '01555666777',
      timestamp: '২০২৫-০১-২৯ ১০:৪৫',
      status: 'failed',
      ordersFound: 0
    },
    {
      id: 4,
      phone: '01333444555',
      timestamp: '২০২৫-০১-২৮ ১৬:২০',
      status: 'success',
      ordersFound: 8
    },
  ];

  return (
    <div className="p-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-400" />
            সার্চ হিস্টরি
          </h2>
          <p className="text-slate-400 mt-2">আপনার সর্বশেষ সার্চের ইতিহাস</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">ফোন নম্বর</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">সময়</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">স্ট্যাটাস</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">অর্ডার পাওয়া গেছে</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {searchHistory.map((search) => (
                <tr key={search.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-white font-mono">{search.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{search.timestamp}</td>
                  <td className="px-6 py-4">
                    {search.status === 'success' ? (
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        সফল
                      </div>
                    ) : (
                      <div className="flex items-center text-red-400">
                        <XCircle className="w-4 h-4 mr-2" />
                        ব্যর্থ
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                      {search.ordersFound} টি অর্ডার
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;