
import axios from 'axios';

/**
 * Настройка перехватчика запросов axios
 * Добавляет токен авторизации в заголовки запросов
 */
axios.interceptors.request.use(
  /**
   * Обработчик запроса перед отправкой
   *  config - конфигурация запроса
   *  измененная конфигурация запроса
   */
  (config: any) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('token');
    
    // Если токен существует и есть заголовки в конфигурации
    if (token && config.headers) {
      // Добавляем токен в заголовок Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },

  /**
   * Обработчик ошибок запроса
   *  error - объект ошибки
   *  отклоненный промис с ошибкой
   */
  (error) => {
    return Promise.reject(error);
  }
);

