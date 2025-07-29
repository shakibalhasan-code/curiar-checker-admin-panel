import React, { useState } from 'react';
import { Mail, ArrowLeft, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface EmailVerifyProps {
  onSwitchToLogin: () => void;
}

const EmailVerify: React.FC<EmailVerifyProps> = ({ onSwitchToLogin }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { verifyEmail, isLoading, user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await verifyEmail(verificationCode);
      setSuccess('ইমেইল সফলভাবে ভেরিফাই হয়েছে!');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError('ভেরিফিকেশন কোড ভুল হয়েছে');
    }
  };

  const resendEmail = () => {
    setSuccess('ভেরিফিকেশন ইমেইল পুনরায় পাঠানো হয়েছে');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">ইমেইল ভেরিফাই করুন</h1>
          <p className="text-slate-400 mt-2">
            আমরা আপনার ইমেইলে একটি ভেরিফিকেশন কোড পাঠিয়েছি
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          {/* Email sent info */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center text-blue-400">
              <Mail className="w-5 h-5 mr-2" />
              <span className="text-sm">
                ভেরিফিকেশন কোড পাঠানো হয়েছে: <strong>{user?.email}</strong>
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div>
              <label htmlFor="code" className="block text-white font-medium mb-2">
                ভেরিফিকেশন কোড
              </label>
              <input
                type="text"
                id="code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                placeholder="৬ ডিজিটের কোড লিখুন"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>{isLoading ? 'ভেরিফাই করা হচ্ছে...' : 'ভেরিফাই করুন'}</span>
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={resendEmail}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              কোড আবার পাঠান
            </button>

            <button
              onClick={onSwitchToLogin}
              className="flex items-center justify-center w-full text-slate-400 hover:text-white text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              লগইনে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;