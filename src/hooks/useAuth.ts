
import { useState, useCallback, useMemo } from 'react';
import { AuthService } from '../services/auth.service.ts';
import { IRegisterRequest, IToken, IClientResponse } from '../types/auth.types.ts';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<IClientResponse | null>(null);

  const getCurrentUser = useCallback(async () => {
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  }, []);

  const getCurrentUserId = useCallback(() => {
    return AuthService.getCurrentUserId();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error('Не удалось определить ID пользователя');
      }
      const userData = await AuthService.getUserProfile(userId);
      setCurrentUser(userData);
      return userData;
    } catch (error: any) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUserId]);

  const login = useCallback(async (formData: URLSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      const response: IToken = await AuthService.login(formData);
      localStorage.setItem('access_token', response.access_token);
      await getCurrentUser();
      return response;
    } catch (err: any) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } 
      else if (err.response?.status === 401) {
        setError('Неверный email или пароль');
      }
      else if (err.request) {
        setError('Ошибка сети. Пожалуйста, проверьте подключение к интернету');
      }
      else {
        setError('Произошла неизвестная ошибка при входе');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [getCurrentUser]);

  const register = useCallback(async (userData: IRegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.register(userData);
      return response;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при регистрации');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
  }, []);

  const isAuthenticated = useMemo(() => {
    const token = getCurrentToken();
    return !!token;
  }, [getCurrentToken]);

  return { 
    login, 
    register, 
    getCurrentToken, 
    getCurrentUser,
    getCurrentUserId, 
    currentUser,
    logout,
    loadProfile,
    isAuthenticated,
    isLoading, 
    error 
  };
};
