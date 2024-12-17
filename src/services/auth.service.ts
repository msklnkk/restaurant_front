import axios from './axios.config.ts';
import { IToken, IClientResponse, IRegisterRequest } from '../types/auth.types';

const API_URL = 'http://localhost:8020';

export const AuthService = {
  async register(userData: IRegisterRequest): Promise<IClientResponse> {
    try {
      console.log('Attempting registration with data:', userData);
      const response = await axios.post<IClientResponse>('/auth/register', userData);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data);
      throw new Error(error.response?.data?.detail || 'Ошибка при регистрации');
    }
  },

  async login(data: URLSearchParams): Promise<IToken> {
    const { data: responseData } = await axios.post<IToken>('/auth/token', data, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      }
    });
    
    // Сохраняем токен
    if (responseData.access_token) {
      localStorage.setItem('access_token', responseData.access_token);
    }
    
    return responseData;
  },

  logout() {
    localStorage.removeItem('access_token');
  },

  getCurrentToken() {
    return localStorage.getItem('access_token');
  }
};