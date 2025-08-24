import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface OTPVerificationProps {
    email: string;
    onBackToSignup: () => void;
    onVerificationSuccess: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
    email,
    onBackToSignup,
    onVerificationSuccess
}) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const { verifyOTP, resendOTP, isLoading } = useAuth();
    const { t } = useLanguage();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multiple characters

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter the complete 4-digit OTP');
            return;
        }

        try {
            await verifyOTP(email, otpString);
            onVerificationSuccess();
        } catch (err: any) {
            setError(err.message || 'OTP verification failed');
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;

        setIsResending(true);
        try {
            await resendOTP(email);
            setCountdown(30);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to resend OTP');
        } finally {
            setIsResending(false);
        }
    };

    const canResend = countdown === 0 && !isResending;

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="mb-6">
                    <button
                        onClick={onBackToSignup}
                        className="flex items-center text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Signup
                    </button>
                </div>

                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Verify Your Email</h1>
                    <p className="text-slate-400 mt-2">
                        We've sent a 4-digit code to
                    </p>
                    <p className="text-blue-400 font-medium">{email}</p>
                </div>

                {/* Form */}
                <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        {/* OTP Input */}
                        <div>
                            <label className="block text-white font-medium mb-4 text-center">
                                Enter the 4-digit code
                            </label>
                            <div className="flex justify-center space-x-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-bold bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="0"
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || otp.join('').length !== 4}
                            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : null}
                            <span>
                                {isLoading ? 'Verifying...' : 'Verify Email'}
                            </span>
                        </button>
                    </form>

                    {/* Resend OTP */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 mb-2">
                            Didn't receive the code?
                        </p>
                        <button
                            type="button"
                            onClick={handleResendOTP}
                            disabled={!canResend}
                            className={`text-sm font-medium transition-colors ${canResend
                                ? 'text-blue-400 hover:text-blue-300'
                                : 'text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            {isResending ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>Resending...</span>
                                </div>
                            ) : countdown > 0 ? (
                                `Resend in ${countdown}s`
                            ) : (
                                'Resend Code'
                            )}
                        </button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-500 text-sm">
                            Check your email inbox and spam folder for the verification code.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;
