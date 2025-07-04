const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://agricare-server-457727602811.asia-south1.run.app';

export class ApiClient {
  private static instance: ApiClient;
  private token: string | null = null;

  private constructor() {}

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        mode: 'cors', // Explicitly set CORS mode
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async signup(data: {
    name: string;
    email?: string;
    phone?: string;
    role: 'farmer' | 'labour';
  }) {
    return this.request('/api/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendEmailOTP(email: string) {
    return this.request('/api/login/email', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyEmailOTP(email: string, otp: string) {
    return this.request<{ token: string }>('/api/login/email/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async verifyPhoneOTP(idToken: string) {
    return this.request<{ token: string }>('/api/login/phone/verify', {
      method: 'POST',
      body: JSON.stringify({ id_token: idToken }),
    });
  }
}

export const apiClient = ApiClient.getInstance();