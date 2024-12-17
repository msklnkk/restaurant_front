import { useState, useCallback } from 'react';
import { AuthService } from '../services/auth.service.ts';
import { IRegisterRequest } from '../types/auth.types.ts';


export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.login(username, password);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при входе');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: IRegisterRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await AuthService.register(userData);
      return response;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при регистрации');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { login, register, isLoading, error };
};