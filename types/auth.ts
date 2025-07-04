export interface User {
  name: string;
  email?: string;
  phone?: string;
  role: 'farmer' | 'labour';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  hasSeenLanguageSelector: boolean;
}

export interface SignupRequest {
  name: string;
  email?: string;
  phone?: string;
  role: 'farmer' | 'labour';
}

export interface LoginResponse {
  token: string;
}

export interface OTPVerificationRequest {
  email?: string;
  otp?: string;
  id_token?: string;
}