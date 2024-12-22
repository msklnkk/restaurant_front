
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


instance.interceptors.request.use(
  (config) => {
      console.log('Request:', {
          url: config.url,
          method: config.method,
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
 * Настройка перехватчика ответов
 * Обрабатывает все ответы от сервера и ошибки
 * 
 *  response - успешный ответ от сервера
 *  error - объект ошибки при неуспешном запросе
 *  Error с сообщением об ошибке от сервера или сети
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
          data: error.response?.data
      });
      if (error.response) {
          throw new Error(error.response.data.detail || 'Произошла ошибка');
      }
      throw new Error('Ошибка сети');
  }
);
  
export default instance;
