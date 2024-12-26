import { decodeToken } from '../utils/jwt.ts';
import axios from './axios.config.ts';
import { IToken, IClientResponse, IRegisterRequest } from '../types/auth.types';

/**
 * Сервис для работы с аутентификацией
 * Предоставляет методы для регистрации, входа, выхода и работы с токеном
 */
export const AuthService = {
  /**
   * Регистрация нового пользователя
   *  userData - данные пользователя для регистрации
   *  Promise с ответом от сервера
   *  Error если регистрация не удалась
   */
  async register(userData: IRegisterRequest): Promise<IClientResponse> {
    try {
      // Логируем попытку регистрации
      console.log('Attempting registration with data:', userData);
      
      // Отправляем POST запрос на регистрацию
      const response = await axios.post<IClientResponse>('/register', userData);
      
      // Логируем успешную регистрацию
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      // Логируем ошибку регистрации
      console.error('Registration failed:', error.response?.data);
      // Выбрасываем ошибку с детальным описанием или дефолтным сообщением
      throw new Error(error.response?.data?.detail || 'Ошибка при регистрации');
    }
  },

  /**
   * Аутентификация пользователя
   *  data - данные для входа в формате URLSearchParams
   *  Promise с токеном доступа
   */
  async login(data: URLSearchParams): Promise<IToken> {
    // Отправляем POST запрос для получения токена
    try {
      const { data: responseData } = await axios.post<IToken>('/token', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        }
      });
      
      if (!responseData?.access_token) {
        throw new Error('Токен не получен от сервера');
      }
      
      localStorage.setItem('access_token', responseData.access_token);
      
      return responseData;
    } catch (error: any) {
      localStorage.removeItem('access_token');
      
      if (error.response?.status === 401) {
        throw new Error('Неверные учетные данные');
      }
      if (error.response?.data?.detail) {
        throw new Error(error.response.data.detail);
      }
      if (error.request) {
        throw new Error('Ошибка сети');
      }
      
      throw error;
    }
  },

  /**
   * Выход пользователя из системы
   * Удаляет токен доступа из localStorage
   */
  logout() {
    localStorage.removeItem('access_token');
  },

  /**
   * Получение текущего токена доступа
   *  текущий токен доступа или null, если токен отсутствует
   */
  getCurrentToken() {
    return localStorage.getItem('access_token');
  },


  /**
   * Получение данных текущего пользователя
   */
  async getCurrentUser(): Promise<IClientResponse> {
    try {
      const response = await axios.get<IClientResponse>('/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Ошибка получения данных пользователя');
    }
  },

  /**
   * Получение ID текущего пользователя из токена
   */
  async getCurrentUserId(): Promise<number | null> {
    try {
      const token = this.getCurrentToken();
      if (!token) return null;

      const decoded = decodeToken(token);
      const userEmail = decoded?.sub;
      if (!userEmail) return null;

      // Указываем тип ответа
      const response = await axios.get<IClientResponse>(`/user/by-mail/${userEmail}`);
      return response.data.clientid;
    } catch (error) {
      console.error('Error getting user ID:', error);
      return null;
    }
  },

  /**
   * Получение данных пользователя по ID
   */
  async getUserProfile(userId: number): Promise<IClientResponse> {
    try {
      const { data } = await axios.get<IClientResponse>(`/user/${userId}`);
      return data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Ошибка получения данных пользователя');
    }
  },

};
