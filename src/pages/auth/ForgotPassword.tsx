import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ForgotPasswordProps {
    onBackToLogin: () => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword, isLoading } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset instructions');
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={onBackToLogin}
                            className="flex items-center text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Login
                        </button>
                    </div>

                    {/* Success Message */}
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">Check Your Email</h1>
                        <p className="text-slate-400 mb-6">
                            We've sent password reset instructions to:
                        </p>
                        <p className="text-blue-400 font-medium mb-6">{email}</p>
                        <p className="text-slate-400 text-sm mb-8">
                            If you don't see the email, check your spam folder. The link will expire in 1 hour.
                        </p>
                        <button
                            onClick={onBackToLogin}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={onBackToLogin}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Login
                    </button>
                </div>

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Reset Password</h1>
                    <p className="text-slate-400 mt-2">
                        Enter your email address and we'll send you instructions to reset your password.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-white font-medium mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                                    placeholder="Enter your email address"
                                    required
                                />
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !email.trim()}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : null}
                            <span>
                                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
                            </span>
                        </button>
                    </form>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Remember your password?{' '}
                            <button
                                onClick={onBackToLogin}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                Sign in here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
