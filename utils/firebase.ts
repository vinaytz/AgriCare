import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Phone authentication utilities
export class PhoneAuthService {
  private static recaptchaVerifier: RecaptchaVerifier | null = null;
  private static confirmationResult: ConfirmationResult | null = null;

  static initializeRecaptcha() {
    if (Platform.OS === 'web' && !this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
    }
  }

  static async sendOTP(phoneNumber: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        this.initializeRecaptcha();
        if (!this.recaptchaVerifier) {
          throw new Error('reCAPTCHA not initialized');
        }
        
        this.confirmationResult = await signInWithPhoneNumber(
          auth, 
          phoneNumber, 
          this.recaptchaVerifier
        );
      } else {
        // For mobile platforms, you would use @react-native-firebase/auth
        // But since we're in managed workflow, we'll handle this differently
        throw new Error('Phone authentication on mobile requires development build');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }

  static async verifyOTP(otp: string): Promise<string> {
    try {
      if (!this.confirmationResult) {
        throw new Error('No confirmation result available');
      }

      const result = await this.confirmationResult.confirm(otp);
      const idToken = await result.user.getIdToken();
      
      // Clear the confirmation result after successful verification
      this.confirmationResult = null;
      
      return idToken;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw new Error('Invalid OTP. Please try again.');
    }
  }

  static cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    this.confirmationResult = null;
  }
}