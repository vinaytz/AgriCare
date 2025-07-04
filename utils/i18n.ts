import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

const i18n = new I18n({
  en: {
    // Common
    common: {
      continue: 'Continue',
      back: 'Back',
      submit: 'Submit',
      cancel: 'Cancel',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      otp: 'OTP',
      verify: 'Verify',
      resend: 'Resend',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
    },
    // Language Selector
    language: {
      title: 'Select Language',
      subtitle: 'Choose your preferred language',
      english: 'English',
      hindi: 'हिंदी',
      punjabi: 'ਪੰਜਾਬੀ',
      tamil: 'தமிழ்',
    },
    // Authentication
    auth: {
      roleSelection: 'I am a',
      farmer: 'Farmer',
      labour: 'Labour',
      signupTitle: 'Create Account',
      loginTitle: 'Welcome Back',
      enterName: 'Enter your name',
      enterEmail: 'Enter your email',
      enterPhone: 'Enter your phone number',
      useEmail: 'Use email instead',
      usePhone: 'Use phone instead',
      haveAccount: 'Already have an account?',
      noAccount: 'Don\'t have an account?',
      otpTitle: 'Enter OTP',
      otpSubtitle: 'We sent a code to',
      otpPlaceholder: 'Enter 6-digit code',
      resendOtp: 'Resend OTP',
    },
    // Dashboard
    dashboard: {
      welcome: 'Welcome',
      farmer: {
        home: 'Home',
        chats: 'Chats',
        labours: 'Labours',
        services: 'Services',
      },
      labour: {
        home: 'Home',
        jobs: 'Jobs',
        chats: 'Chats',
      },
    },
    // Profile
    profile: {
      title: 'Profile',
      changeLanguage: 'Change Language',
      role: 'Role',
    },
  },
  hi: {
    // Common
    common: {
      continue: 'जारी रखें',
      back: 'वापस',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      name: 'नाम',
      email: 'ईमेल',
      phone: 'फोन',
      otp: 'ओटीपी',
      verify: 'सत्यापित करें',
      resend: 'पुनः भेजें',
      login: 'लॉगिन',
      signup: 'साइन अप',
      logout: 'लॉगआउट',
    },
    // Language Selector
    language: {
      title: 'भाषा चुनें',
      subtitle: 'अपनी पसंदीदा भाषा चुनें',
      english: 'English',
      hindi: 'हिंदी',
      punjabi: 'ਪੰਜਾਬੀ',
      tamil: 'தமிழ்',
    },
    // Authentication
    auth: {
      roleSelection: 'मैं हूं',
      farmer: 'किसान',
      labour: 'मजदूर',
      signupTitle: 'खाता बनाएं',
      loginTitle: 'वापस आपका स्वागत है',
      enterName: 'अपना नाम दर्ज करें',
      enterEmail: 'अपना ईमेल दर्ज करें',
      enterPhone: 'अपना फोन नंबर दर्ज करें',
      useEmail: 'ईमेल का उपयोग करें',
      usePhone: 'फोन का उपयोग करें',
      haveAccount: 'पहले से खाता है?',
      noAccount: 'खाता नहीं है?',
      otpTitle: 'ओटीपी दर्ज करें',
      otpSubtitle: 'हमने कोड भेजा है',
      otpPlaceholder: '6-अंकीय कोड दर्ज करें',
      resendOtp: 'ओटीपी पुनः भेजें',
    },
    // Dashboard
    dashboard: {
      welcome: 'स्वागत',
      farmer: {
        home: 'होम',
        chats: 'चैट',
        labours: 'मजदूर',
        services: 'सेवाएं',
      },
      labour: {
        home: 'होम',
        jobs: 'काम',
        chats: 'चैट',
      },
    },
    // Profile
    profile: {
      title: 'प्रोफाइल',
      changeLanguage: 'भाषा बदलें',
      role: 'भूमिका',
    },
  },
});

// Set locale with fallback to 'en' if Localization.locale is undefined
const deviceLocale = Localization.locale || 'en';
i18n.locale = deviceLocale.startsWith('hi') ? 'hi' : 'en';
i18n.fallbacks = true;

export default i18n;