import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Search, Building2, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupProps {
  onSwitchToLogin: () => void;
  onSignupSuccess: (email: string) => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin, onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signup form submitted with:', formData);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('পাসওয়ার্ড মিলছে না');
      return;
    }

    if (formData.password.length < 6) {
      setError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }

    try {
      console.log('Calling signup function...');
      await signup(
        formData.email, 
        formData.password, 
        `${formData.firstName} ${formData.lastName}`,
        formData.username,
        formData.firstName,
        formData.lastName,
        formData.company,
        formData.phone
      );
      console.log('Signup successful, calling onSignupSuccess');
      onSignupSuccess(formData.email);
    } catch (err) {
      console.error('Signup error in component:', err);
      setError('সাইনআপ করতে সমস্যা হয়েছে');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">কুরিয়ার অর্ডার</h1>
          <p className="text-slate-400 mt-2">নতুন অ্যাকাউন্ট তৈরি করুন</p>
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
              <label htmlFor="username" className="block text-white font-medium mb-2">
                ইউজারনেম
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                  placeholder="আপনার ইউজারনেম লিখুন"
                  required
                />
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-white font-medium mb-2">
                  নামের প্রথম অংশ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                    placeholder="প্রথম নাম"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-white font-medium mb-2">
                  নামের শেষ অংশ
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                    placeholder="শেষ নাম"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-white font-medium mb-2">
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                  placeholder="আপনার ইমেইল লিখুন"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-white font-medium mb-2">
                  কোম্পানি
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                    placeholder="কোম্পানির নাম (ঐচ্ছিক)"
                  />
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-white font-medium mb-2">
                  ফোন নম্বর
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
                    placeholder="ফোন নম্বর (উদা: 01712345678)"
                    required
                  />
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white font-medium mb-2">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 pr-12"
                  placeholder="পাসওয়ার্ড লিখুন"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12 pr-12"
                  placeholder="পাসওয়ার্ড আবার লিখুন"
                  required
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : null}
              <span>{isLoading ? 'সাইনআপ করা হচ্ছে...' : 'সাইনআপ করুন'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400">
              ইতিমধ্যে অ্যাকাউন্ট আছে?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                লগইন করুন
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;