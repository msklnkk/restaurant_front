// Импорт необходимых зависимостей
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
// Импорт компонентов из Material-UI
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { AuthService } from '../services/auth.service.ts';

// Интерфейс для типизации состояния локации
interface LocationState {
  message?: string;
}

// Интерфейс для данных формы входа
interface LoginFormData {
  mail: string;
  password: string;
}

// Основной компонент Login
const Login: React.FC = () => {
  // Хуки для навигации и получения состояния локации
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const message = location.state?.message;

   // Состояния компонента
  const [formData, setFormData] = useState<LoginFormData>({
    mail: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>(state?.message || '');
  const [loading, setLoading] = useState(false);

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Сбрасываем ошибки при изменении полей
    setError('');
    setSuccess('');
  };

  // Функция валидации формы
  const validateForm = (): boolean => {
    if (!formData.mail) {
      setError('Введите email');
      return false;
    }
    if (!formData.password) {
      setError('Введите пароль');
      return false;
    }
    return true;
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
       // Формирование данных для отправки
      const formUrlEncoded = new URLSearchParams();
      formUrlEncoded.append('username', formData.mail);
      formUrlEncoded.append('password', formData.password);
      formUrlEncoded.append('grant_type', 'password'); // добавляем grant_type

      // Отправка запроса на авторизацию
      const response = await AuthService.login(formUrlEncoded);
      
      if (response.access_token) {
        // Сохранение токена и редирект
        localStorage.setItem('access_token', response.access_token);
        navigate('/?success=true');
      } else {
        setError('Не удалось получить токен доступа');
      }
    } catch (err: any) {
      // Обработка различных типов ошибок
      console.error('Login error:', err);
      
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } 
      else if (err.response?.status === 401) {
        setError('Неверный email или пароль');
      }
      else if (err.request) {
        setError('Ошибка сети. Пожалуйста, проверьте подключение к интернету');
      }
      else if (err instanceof Error) {
        setError(err.message);
      } 
      else {
        setError('Произошла неизвестная ошибка при входе');
      }
    } finally {
      setLoading(false);
    }
  };

  // Разметка компонента
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
        {/* Кнопка возврата на главную */}
        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        {/* Карточка с формой */}
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Вход
          </Typography>

          {/* Сообщение о необходимости авторизации */}
          {message && (
            <Alert severity="info" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          {/* Отображение ошибок */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Форма входа */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="mail"
              type="email"
              value={formData.mail}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={!!error && error.includes('email')}
              helperText={error && error.includes('email') ? error : ''}
            />
            
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              disabled={loading}
              error={!!error && error.includes('пароль')}
              helperText={error && error.includes('пароль') ? error : ''}
            />
            
            {/* Кнопка отправки формы */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
            
            {/* Ссылка на регистрацию */}
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/register" 
                variant="body2"
                underline="hover"
              >
                Нет аккаунта? Зарегистрируйтесь
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;