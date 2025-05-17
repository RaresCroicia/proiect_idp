import { authApi } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await authApi.post<AuthResponse>('/auth/login', credentials);
      console.log('Login successful, token received');
      this.setToken(response.data.access_token);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<User> {
    try {
      const response = await authApi.post<User>('/auth/register', data);
      console.log('Registration successful');
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await authApi.get<User>('/auth/profile');
      console.log('User profile fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      throw error;
    }
  }

  logout(): void {
    console.log('Logging out user');
    this.removeToken();
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    console.log('Authentication status:', isAuth);
    return isAuth;
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Dispatch storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: this.TOKEN_KEY,
      newValue: token,
      storageArea: localStorage
    }));
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    // Dispatch storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: this.TOKEN_KEY,
      newValue: null,
      storageArea: localStorage
    }));
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}

export const authService = new AuthService(); 