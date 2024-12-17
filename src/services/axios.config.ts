import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8020/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        // Обработка ошибок от сервера
        throw new Error(error.response.data.detail || 'Произошла ошибка');
      }
      throw new Error('Ошибка сети');
    }
  );
  
  export default instance;