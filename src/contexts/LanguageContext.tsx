import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

// Translation dictionary
const translations = {
    bn: {
        // Login page
        'login.title': 'কুরিয়ার অর্ডার',
        'login.subtitle': 'আপনার অ্যাকাউন্টে লগইন করুন',
        'login.email': 'ইমেইল ঠিকানা',
        'login.email_placeholder': 'আপনার ইমেইল লিখুন',
        'login.password': 'পাসওয়ার্ড',
        'login.password_placeholder': 'আপনার পাসওয়ার্ড লিখুন',
        'login.login_button': 'লগইন করুন',
        'login.loading': 'লগইন করা হচ্ছে...',
        'login.verify_email': 'ইমেইল ভেরিফাই করুন',
        'login.no_account': 'অ্যাকাউন্ট নেই?',
        'login.signup': 'সাইনআপ করুন',
        'login.error': 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে',

        // Language switcher
        'language.bengali': 'বাংলা',
        'language.english': 'English',
        'language.select': 'ভাষা নির্বাচন করুন',

        // Sidebar
        'sidebar.title': 'কুরিয়ার অর্ডার',
        'sidebar.subtitle': 'রেট চেকার',
        'main_menu': 'মূল মেনু',
        'history_section': 'ইতিহাস',
        'system': 'সিস্টেম',

        // Header
        'header.search_title': 'কুরিয়ার অর্ডার ট্র্যাক করুন',
        'header.api_title': 'API কী ম্যানেজমেন্ট',
        'header.plans_title': 'আমাদের প্রাইসিং প্ল্যান',
        'header.activation_title': 'অ্যাকাউন্ট অ্যাক্টিভেশন',

        // Common
        'loading': 'লোড হচ্ছে...',
        'dashboard': 'ড্যাশবোর্ড',
        'search': 'এখনই খুঁজুন',
        'history': 'সার্চ হিস্টরি',
        'api': 'ডেভেলপার/API',
        'plans': 'প্রো প্ল্যান',
        'activation': 'অ্যাক্টিভেশন',
        'settings': 'সেটিংস',
        'profile': 'প্রোফাইল',
        'logout': 'লগআউট',

        // Dashboard
        'dashboard.lifetime_search': 'লাইফটাইম সার্চ কাউন্ট',
        'dashboard.free_limit': 'ফ্রি লিমিট',
        'dashboard.paid_limit': 'পেইড লিমিট',
        'dashboard.today_search': 'আজকের সার্চ',
        'dashboard.expiry_date': 'মেয়াদ উত্তীর্ণের তারিখ',

        // Search
        'search.customer_phone': 'Customer Phone',
        'search.search_button': 'Search',
        'search.searching': 'Searching...',
        'search.free_info': 'Free: View basic order info only.',
        'search.ai_suggestions': 'AI Suggestions',
        'search.ai_warning': 'এই নাম্বারটি আমার কাছে সন্দেহজনক। এই নম্বর থেকে অধিকাংশ অর্ডার অসফল/বাতিল। এই গ্রাহকের পূর্ববর্তী অর্ডার ইতিহাস যাচাই করে প্রয়োজনে ব্লক করার কথা বিবেচনা করুন।',
        'search.back_to_search': 'Back to Search',
        'search.total_orders': 'Total Orders',
        'search.successful': 'Successful',
        'search.cancelled': 'Cancelled',
        'search.success_rate': 'Success Rate',
        'search.courier_performance': 'Courier Performance',
        'search.delivery_status': 'Delivery Status',
        'search.no_data': 'No data to display',

        // Plans
        'plans.title': 'আমাদের প্রাইসিং প্ল্যান',
        'plans.subtitle': 'আপনার ব্যবসার আকারের সাথে সবচেয়ে ভালো ফিট প্ল্যান বেছে নিন। যেকোনো সময় আপগ্রেড বা ডাউনগ্রেড করুন।',
        'plans.monthly': 'মাসিক',
        'plans.yearly': 'বার্ষিক',
        'plans.discount': '২০% ছাড়',
        'plans.starter': 'স্টার্টার',
        'plans.pro': 'প্রো',
        'plans.enterprise': 'এন্টারপ্রাইজ',
        'plans.savings': '২০% সঞ্চয়',
        'plans.ai_features': 'AI সাজেশন ফিচার',
        'plans.ai_description': 'আমাদের AI সিস্টেম ইন্টারনেট থেকে ডেটা সংগ্রহ করে এবং কুরিয়ারদের পারফরম্যান্স বিশ্লেষণ করে সন্দেহজনক নম্বর সম্পর্কে সতর্কতা প্রদান করে।',
        'plans.real_time_analysis': 'রিয়েল-টাইম ডেটা অ্যানালাইসিস',
        'plans.suspicious_detection': 'সন্দেহজনক নম্বর সনাক্তকরণ',
        'plans.courier_reports': 'কুরিয়ার পারফরম্যান্স রিপোর্ট',
        'plans.free_package': 'আপনি ফ্রি প্যাকেজ ব্যবহার করছেন',
        'plans.upgrade_message': 'আরও নির্ভুল এবং শক্তিশালী ফলাফলের জন্য একটি পেইড প্ল্যানে আপগ্রেড করুন।',
        'plans.basic_search': 'বেসিক সার্চ: ১০ প্রতি দিন',
        'plans.limited_ai': 'সীমিত AI সাজেশন',
        'plans.community_support': 'কমিউনিটি সাপোর্ট',

        // API
        'api.key_management': 'API কী ম্যানেজমেন্ট',
        'api.key_description': 'আমাদের সার্ভিসের সাথে অথেন্টিকেশনের জন্য আপনার গোপন API কী',
        'api.copy': 'কপি',
        'api.copied': 'কপি হয়েছে!',
        'api.regenerate': 'পুনর্জন্ম',
        'api.ready_integrations': 'প্রস্তুত ইন্টিগ্রেশন',
        'api.integration_description': 'আপনার প্ল্যাটফর্ম বা ডিভাইসের সাথে তাৎক্ষণিক সংযোগ স্থাপন করুন।',
        'api.wordpress_plugin': 'WordPress Plugin',
        'api.wordpress_description': 'আপনার ওয়ার্ডপ্রেস সাইটের জন্য প্লাগইন',
        'api.android_app': 'Android App',
        'api.android_description': 'মোবাইল অ্যাপ্লিকেশনের জন্য',
        'api.chrome_extension': 'Chrome Extension',
        'api.chrome_description': 'ব্রাউজার এক্সটেনশন',
        'api.download': 'ডাউনলোড',
        'api.copy_link': 'লিংক কপি',

        // Activation
        'activation.title': 'অ্যাকাউন্ট অ্যাক্টিভেশন',
        'activation.status': 'স্ট্যাটাস',
        'activation.active': 'সক্রিয়',
        'activation.plan': 'প্ল্যান',
        'activation.free_basic': 'ফ্রি বেসিক',
        'activation.days_left': 'বাকি দিন',
        'activation.days_remaining': '১৩৪ দিন বাকি',
        'activation.methods': 'অ্যাক্টিভেশন পদ্ধতি',
        'activation.free_activation': 'ফ্রি অ্যাক্টিভেশন',
        'activation.free_description': 'আমাদের টিমের কাজের চাপের উপর নির্ভর করে, অ্যাক্টিভেশনে ১-৬ ঘন্টা সময় লাগতে পারে। নিশ্চিতকরণের জন্য অনুগ্রহ করে অপেক্ষা করুন।',
        'activation.instant_activation': 'তাৎক্ষণিক অ্যাক্টিভেশন',
        'activation.instant_description': 'তাৎক্ষণিক অ্যাক্টিভেট করতে ৫০ BDT প্রদান করুন।',
        'activation.pro_plan': 'প্রো প্ল্যান',
        'activation.view_pro_plan': 'প্রো প্ল্যান দেখুন',
        'activation.pro_description': 'এবং পেমেন্টের পর তাৎক্ষণিক অ্যাক্টিভেশনের জন্য সাবস্ক্রাইব করুন।',
        'activation.support_message': 'আপনি কোনো সমস্যার সম্মুখীন হলে, ফেসবুকে আমাদের মেসেজ করুন বা আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।',
        'activation.message_facebook': 'ফেসবুকে মেসেজ করুন',
        'activation.upgrade_plan': 'প্ল্যান আপগ্রেড করুন',
        'activation.contact_message': 'কোনো প্রশ্নের জন্য, অনুগ্রহ করে যোগাযোগ করুন',

        // Dashboard
        'dashboard.search_trends': 'সার্চ ট্রেন্ড - গত ৩০ দিন',
        'dashboard.day': 'দিন',
        'dashboard.searches': 'সার্চ',

        // Search
        'search.paid_service_message': 'সঠিক রিপোর্ট পেতে আমাদের পেইড সার্ভিস ব্যবহার করুন।',
        'search.check_packages': 'Check Packages',

        // Plans
        'plans.subscription_active': 'সাবস্ক্রিপশন সক্রিয়',
        'plans.monthly_buy': 'মাসিক কিনুন',
        'plans.most_popular': 'সবচেয়ে জনপ্রিয়',
        'plans.starter_search': 'দৈনিক সার্চ: ৫০ প্রতি দিন',
        'plans.basic_ai': 'বেসিক AI সাজেশন',
        'plans.email_support': 'ইমেইল সাপোর্ট',
        'plans.basic_api': 'বেসিক API অ্যাক্সেস',
        'plans.search_history_30': 'সার্চ হিস্টরি (৩০ দিন)',
        'plans.pro_search': 'দৈনিক সার্চ: ৫০০ প্রতি দিন',
        'plans.advanced_ai': 'এডভান্সড AI সাজেশন',
        'plans.priority_support': 'প্রায়োরিটি সাপোর্ট',
        'plans.full_api': 'ফুল API অ্যাক্সেস',
        'plans.search_history_90': 'সার্চ হিস্টরি (৯০ দিন)',
        'plans.export_reports': 'এক্সপোর্ট রিপোর্ট',
        'plans.custom_alerts': 'কাস্টম অ্যালার্ট',
        'plans.enterprise_search': 'দৈনিক সার্চ: ২০০০ প্রতি দিন',
        'plans.premium_ai': 'প্রিমিয়াম AI সাজেশন',
        'plans.support_24_7': '২৪/৭ সাপোর্ট',
        'plans.dedicated_api': 'ডেডিকেটেড API',
        'plans.search_history_1year': 'সার্চ হিস্টরি (১ বছর)',
        'plans.advanced_analytics': 'এডভান্সড অ্যানালিটিক্স',
        'plans.custom_integration': 'কাস্টম ইন্টিগ্রেশন',
        'plans.white_label': 'হোয়াইট লেবেল সলিউশন',
        'plans.real_time_description': 'রিয়েল-টাইম ডেটা অ্যানালাইসিসের মাধ্যমে সন্দেহজনক নম্বর সনাক্তকরণ',
        'plans.suspicious_description': 'সন্দেহজনক নম্বর সনাক্তকরণ এবং সতর্কতা প্রদান',
        'plans.courier_description': 'কুরিয়ার পারফরম্যান্স রিপোর্ট এবং বিশ্লেষণ',

        // Settings
        'settings.notifications': 'নোটিফিকেশন সেটিংস',
        'settings.email_notifications': 'ইমেইল নোটিফিকেশন',
        'settings.email_description': 'গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান',
        'settings.browser_notifications': 'ব্রাউজার নোটিফিকেশন',
        'settings.browser_description': 'ব্রাউজারে পুশ নোটিফিকেশন',
        'settings.sms_notifications': 'SMS নোটিফিকেশন',
        'settings.sms_description': 'জরুরি বিষয়ের জন্য SMS',
        'settings.language_settings': 'ভাষা সেটিংস',
        'settings.interface_language': 'ইন্টারফেস ভাষা',
        'settings.security_settings': 'নিরাপত্তা সেটিংস',
        'settings.current_password': 'বর্তমান পাসওয়ার্ড',
        'settings.current_password_placeholder': 'বর্তমান পাসওয়ার্ড লিখুন',
        'settings.new_password': 'নতুন পাসওয়ার্ড',
        'settings.new_password_placeholder': 'নতুন পাসওয়ার্ড লিখুন',
        'settings.confirm_password': 'পাসওয়ার্ড নিশ্চিত করুন',
        'settings.confirm_password_placeholder': 'নতুন পাসওয়ার্ড আবার লিখুন',
        'settings.change_password': 'পাসওয়ার্ড পরিবর্তন করুন',
        'settings.api_key': 'API কী',
    },
    en: {
        // Login page
        'login.title': 'Courier Order',
        'login.subtitle': 'Sign in to your account',
        'login.email': 'Email Address',
        'login.email_placeholder': 'Enter your email',
        'login.password': 'Password',
        'login.password_placeholder': 'Enter your password',
        'login.login_button': 'Sign In',
        'login.loading': 'Signing in...',
        'login.verify_email': 'Verify Email',
        'login.no_account': "Don't have an account?",
        'login.signup': 'Sign Up',
        'login.error': 'Invalid email or password',

        // Language switcher
        'language.bengali': 'বাংলা',
        'language.english': 'English',
        'language.select': 'Select Language',

        // Sidebar
        'sidebar.title': 'Courier Order',
        'sidebar.subtitle': 'Rate Checker',
        'main_menu': 'Main Menu',
        'history_section': 'History',
        'system': 'System',

        // Header
        'header.search_title': 'Track Courier Orders',
        'header.api_title': 'API Key Management',
        'header.plans_title': 'Our Pricing Plans',
        'header.activation_title': 'Account Activation',

        // Common
        'loading': 'Loading...',
        'dashboard': 'Dashboard',
        'search': 'Search Now',
        'history': 'Search History',
        'api': 'Developer/API',
        'plans': 'Pro Plans',
        'activation': 'Activation',
        'settings': 'Settings',
        'profile': 'Profile',
        'logout': 'Logout',

        // Dashboard
        'dashboard.lifetime_search': 'Lifetime Search Count',
        'dashboard.free_limit': 'Free Limit',
        'dashboard.paid_limit': 'Paid Limit',
        'dashboard.today_search': 'Today\'s Search',
        'dashboard.expiry_date': 'Expiry Date',

        // Search
        'search.customer_phone': 'Customer Phone',
        'search.search_button': 'Search',
        'search.searching': 'Searching...',
        'search.free_info': 'Free: View basic order info only.',
        'search.ai_suggestions': 'AI Suggestions',
        'search.ai_warning': 'This number seems suspicious to me. Most orders from this number are unsuccessful/cancelled. Consider verifying this customer\'s previous order history and blocking if necessary.',
        'search.back_to_search': 'Back to Search',
        'search.total_orders': 'Total Orders',
        'search.successful': 'Successful',
        'search.cancelled': 'Cancelled',
        'search.success_rate': 'Success Rate',
        'search.courier_performance': 'Courier Performance',
        'search.delivery_status': 'Delivery Status',
        'search.no_data': 'No data to display',

        // Plans
        'plans.title': 'Our Pricing Plans',
        'plans.subtitle': 'Choose the plan that best fits your business size. Upgrade or downgrade anytime.',
        'plans.monthly': 'Monthly',
        'plans.yearly': 'Yearly',
        'plans.discount': '20% OFF',
        'plans.starter': 'Starter',
        'plans.pro': 'Pro',
        'plans.enterprise': 'Enterprise',
        'plans.savings': '20% Savings',
        'plans.ai_features': 'AI Suggestion Features',
        'plans.ai_description': 'Our AI system collects data from the internet and analyzes courier performance to provide warnings about suspicious numbers.',
        'plans.real_time_analysis': 'Real-time Data Analysis',
        'plans.suspicious_detection': 'Suspicious Number Detection',
        'plans.courier_reports': 'Courier Performance Reports',
        'plans.free_package': 'You are using the free package',
        'plans.upgrade_message': 'Upgrade to a paid plan for more accurate and powerful results.',
        'plans.basic_search': 'Basic Search: 10 per day',
        'plans.limited_ai': 'Limited AI Suggestions',
        'plans.community_support': 'Community Support',

        // API
        'api.key_management': 'API Key Management',
        'api.key_description': 'Your secret API key for authentication with our service',
        'api.copy': 'Copy',
        'api.copied': 'Copied!',
        'api.regenerate': 'Regenerate',
        'api.ready_integrations': 'Ready Integrations',
        'api.integration_description': 'Connect instantly with your platform or device.',
        'api.wordpress_plugin': 'WordPress Plugin',
        'api.wordpress_description': 'Plugin for your WordPress site',
        'api.android_app': 'Android App',
        'api.android_description': 'For mobile applications',
        'api.chrome_extension': 'Chrome Extension',
        'api.chrome_description': 'Browser extension',
        'api.download': 'Download',
        'api.copy_link': 'Copy Link',

        // Activation
        'activation.title': 'Account Activation',
        'activation.status': 'Status',
        'activation.active': 'Active',
        'activation.plan': 'Plan',
        'activation.free_basic': 'Free Basic',
        'activation.days_left': 'Days Left',
        'activation.days_remaining': '134 days remaining',
        'activation.methods': 'Activation Methods',
        'activation.free_activation': 'Free Activation',
        'activation.free_description': 'Depending on our team\'s workload, activation may take 1-6 hours. Please wait for confirmation.',
        'activation.instant_activation': 'Instant Activation',
        'activation.instant_description': 'Pay 50 BDT for instant activation.',
        'activation.pro_plan': 'Pro Plan',
        'activation.view_pro_plan': 'View Pro Plan',
        'activation.pro_description': 'and subscribe for instant activation after payment.',
        'activation.support_message': 'If you face any issues, message us on Facebook or contact our support team.',
        'activation.message_facebook': 'Message on Facebook',
        'activation.upgrade_plan': 'Upgrade Plan',
        'activation.contact_message': 'For any questions, please contact',

        // Dashboard
        'dashboard.search_trends': 'Search Trends - Last 30 Days',
        'dashboard.day': 'Day',
        'dashboard.searches': 'Searches',

        // Search
        'search.paid_service_message': 'Use our paid service for accurate reports.',
        'search.check_packages': 'Check Packages',

        // Plans
        'plans.subscription_active': 'Subscription Active',
        'plans.monthly_buy': 'Buy Monthly',
        'plans.most_popular': 'Most Popular',
        'plans.starter_search': 'Daily Search: 50 per day',
        'plans.basic_ai': 'Basic AI Suggestions',
        'plans.email_support': 'Email Support',
        'plans.basic_api': 'Basic API Access',
        'plans.search_history_30': 'Search History (30 days)',
        'plans.pro_search': 'Daily Search: 500 per day',
        'plans.advanced_ai': 'Advanced AI Suggestions',
        'plans.priority_support': 'Priority Support',
        'plans.full_api': 'Full API Access',
        'plans.search_history_90': 'Search History (90 days)',
        'plans.export_reports': 'Export Reports',
        'plans.custom_alerts': 'Custom Alerts',
        'plans.enterprise_search': 'Daily Search: 2000 per day',
        'plans.premium_ai': 'Premium AI Suggestions',
        'plans.support_24_7': '24/7 Support',
        'plans.dedicated_api': 'Dedicated API',
        'plans.search_history_1year': 'Search History (1 year)',
        'plans.advanced_analytics': 'Advanced Analytics',
        'plans.custom_integration': 'Custom Integration',
        'plans.white_label': 'White Label Solution',
        'plans.real_time_description': 'Real-time data analysis for suspicious number detection',
        'plans.suspicious_description': 'Suspicious number detection and warning system',
        'plans.courier_description': 'Courier performance reports and analysis',

        // Settings
        'settings.notifications': 'Notification Settings',
        'settings.email_notifications': 'Email Notifications',
        'settings.email_description': 'Get emails for important updates',
        'settings.browser_notifications': 'Browser Notifications',
        'settings.browser_description': 'Push notifications in browser',
        'settings.sms_notifications': 'SMS Notifications',
        'settings.sms_description': 'SMS for urgent matters',
        'settings.language_settings': 'Language Settings',
        'settings.interface_language': 'Interface Language',
        'settings.security_settings': 'Security Settings',
        'settings.current_password': 'Current Password',
        'settings.current_password_placeholder': 'Enter current password',
        'settings.new_password': 'New Password',
        'settings.new_password_placeholder': 'Enter new password',
        'settings.confirm_password': 'Confirm Password',
        'settings.confirm_password_placeholder': 'Enter new password again',
        'settings.change_password': 'Change Password',
        'settings.api_key': 'API Key',
    }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('bn');

    useEffect(() => {
        // Load saved language preference
        const savedLanguage = localStorage.getItem('language') as Language;
        if (savedLanguage && (savedLanguage === 'bn' || savedLanguage === 'en')) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations[typeof language]] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}; 