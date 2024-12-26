
import axios from 'axios';

/**
 * Конфигурация Axios для взаимодействия с API
 * Создает настроенный экземпляр axios с базовыми параметрами и перехватчиками
 */

/**
 * Создание экземпляра axios с базовой конфигурацией
 *  baseURL - базовый URL для всех запросов
 *  headers - стандартные заголовки для запросов
 *  withCredentials - флаг для отправки куки с запросами
 */
const instance = axios.create({
  baseURL: 'http://localhost:8020/', // Базовый URL API
  headers: {
    'Content-Type': 'application/json', // Указываем, что работаем с JSON
  },
  withCredentials: true // Разрешаем отправку куки в кросс-доменных запросах
});

/**
 * Перехватчик запросов
 * Добавляет токен авторизации и логирует запросы
 */
instance.interceptors.request.use(
  (config) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('access_token');
    
    // Если есть токен, добавляем его в заголовки
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    // Логируем информацию о запросе
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers, // Добавляем логирование заголовков
      data: config.data
    });

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Перехватчик ответов
 * Обрабатывает все ответы от сервера и ошибки
 * 
 * @param response - успешный ответ от сервера
 * @param error - объект ошибки при неуспешном запросе
 * @throws Error с сообщением об ошибке от сервера или сети
 */
instance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers // Добавляем логирование заголовков
    });

    // Обработка ошибки авторизации
    if (error.response?.status === 401) {
      console.error('Authorization error');
      // Можно добавить редирект на страницу логина
      // window.location.href = '/login';
    }

    if (error.response) {
      throw new Error(error.response.data.detail || 'Произошла ошибка сервера');
    }
    
    throw new Error('Ошибка сети');
  }
);

export default instance;
