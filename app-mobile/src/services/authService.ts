import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(async (config) => {
      const credentials = await Keychain.getInternetCredentials('healthcare_tokens');
      if (credentials && credentials.password) {
        const tokens = JSON.parse(credentials.password);
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          await this.refreshToken();
          return this.api.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    const { user, accessToken, refreshToken } = response.data;

    await Keychain.setInternetCredentials(
      'healthcare_tokens',
      'tokens',
      JSON.stringify({ accessToken, refreshToken })
    );

    return { user, accessToken, refreshToken };
  }

  async register(userData: any) {
    const response = await this.api.post('/auth/register', userData);
    const { user, accessToken, refreshToken } = response.data;

    await Keychain.setInternetCredentials(
      'healthcare_tokens',
      'tokens',
      JSON.stringify({ accessToken, refreshToken })
    );

    return { user, accessToken, refreshToken };
  }

  async logout() {
    await Keychain.resetInternetCredentials('healthcare_tokens');
  }

  private async refreshToken() {
    try {
      const credentials = await Keychain.getInternetCredentials('healthcare_tokens');
      if (credentials && credentials.password) {
        const tokens = JSON.parse(credentials.password);
        const response = await this.api.post('/auth/refresh', {
          refreshToken: tokens.refreshToken,
        });

        const { accessToken, refreshToken } = response.data;
        await Keychain.setInternetCredentials(
          'healthcare_tokens',
          'tokens',
          JSON.stringify({ accessToken, refreshToken })
        );
      }
    } catch (error) {
      await this.logout();
      throw error;
    }
  }
}

export const authService = new AuthService();