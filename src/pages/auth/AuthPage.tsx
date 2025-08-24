import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import OTPVerification from './OTPVerification';
import ForgotPassword from './ForgotPassword';

type AuthState = 'login' | 'signup' | 'otp-verification' | 'forgot-password';

interface AuthPageProps {
    onAuthSuccess: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
    const [currentState, setCurrentState] = useState<AuthState>('login');
    const [signupEmail, setSignupEmail] = useState('');

    const handleSwitchToLogin = () => {
        setCurrentState('login');
    };

    const handleSwitchToSignup = () => {
        setCurrentState('signup');
    };

    const handleSwitchToForgotPassword = () => {
        setCurrentState('forgot-password');
    };

    const handleSignupSuccess = (email: string) => {
        setSignupEmail(email);
        setCurrentState('otp-verification');
    };

    const handleOTPVerificationSuccess = () => {
        onAuthSuccess();
    };

    const handleBackToSignup = () => {
        setCurrentState('signup');
    };

    const handleBackToLogin = () => {
        setCurrentState('login');
    };

    const renderCurrentState = () => {
        switch (currentState) {
            case 'login':
                return (
                    <Login
                        onSwitchToSignup={handleSwitchToSignup}
                        onSwitchToForgotPassword={handleSwitchToForgotPassword}
                        onAuthSuccess={onAuthSuccess}
                    />
                );
            case 'signup':
                return (
                    <Signup
                        onSwitchToLogin={handleSwitchToLogin}
                        onSignupSuccess={handleSignupSuccess}
                    />
                );
            case 'otp-verification':
                return (
                    <OTPVerification
                        email={signupEmail}
                        onBackToSignup={handleBackToSignup}
                        onVerificationSuccess={handleOTPVerificationSuccess}
                    />
                );
            case 'forgot-password':
                return (
                    <ForgotPassword
                        onBackToLogin={handleBackToLogin}
                    />
                );
            default:
                return (
                    <Login
                        onSwitchToSignup={handleSwitchToSignup}
                        onSwitchToForgotPassword={handleSwitchToForgotPassword}
                        onAuthSuccess={onAuthSuccess}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900">
            {renderCurrentState()}
        </div>
    );
};

export default AuthPage;
