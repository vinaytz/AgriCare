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
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
        mode: 'cors',
      });

      clearTimeout(timeoutId);

      // Handle different response types
      if (!response.ok) {
        let errorMessage = 'An error occurred';
        
        try {
          // Try to parse JSON error response
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch {
          // If JSON parsing fails, try to get text
          try {
            const errorText = await response.text();
            if (errorText) {
              errorMessage = errorText;
            }
          } catch {
            // If all else fails, use status-based message
            switch (response.status) {
              case 400:
                errorMessage = 'Invalid request. Please check your input.';
                break;
              case 401:
                errorMessage = 'Authentication failed. Please try again.';
                break;
              case 404:
                errorMessage = 'Service not found. Please try again later.';
                break;
              case 500:
                errorMessage = 'Server error. Please try again later.';
                break;
              default:
                errorMessage = `Server error (${response.status}). Please try again.`;
            }
          }
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      console.error('API request failed:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your internet connection');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Unable to connect to server - please check your internet connection');
        }
        // Re-throw the error if it already has a meaningful message
        throw error;
      }
      
      throw new Error('An unexpected error occurred');
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

  async createJob(data: {
    title: string;
    description: string;
    number_of_labourers: number;
    required_skills?: string[];
    latitude: number;
    longitude: number;
    daily_wage: number;
    perks?: string[];
    start_date: string;
    end_date?: string;
  }) {
    return this.request('/api/job', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getNearbyJobs(latitude: number, longitude: number, k: number = 2) {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      k: k.toString(),
    });
    
    return this.request<any[]>(`/api/job?${params.toString()}`, {
      method: 'GET',
    });
  }
}

export const apiClient = ApiClient.getInstance();