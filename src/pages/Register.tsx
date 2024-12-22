// Импорт необходимых зависимостей
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// Импорт компонентов Material-UI
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
// Импорт сервиса аутентификации
import { AuthService } from '../services/auth.service.ts';

const Register: React.FC = () => {
  // Хук для навигации
  const navigate = useNavigate();
  // Состояние формы с данными пользователя
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  // Состояния для ошибок валидации, серверных ошибок и загрузки
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Функция валидации формы
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Валидация имени
    if (formData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.mail)) {
      newErrors.mail = 'Введите корректный email адрес';
    }

    // Валидация пароля
    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    // Валидация подтверждения пароля
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    // Валидация телефона
    const phoneRegex = /^\+?[1-9]\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Обновление значения поля
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Очищаем ошибку поля при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    // Проверка валидации перед отправкой
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Подготовка данных для отправки
      const registerData = {
        mail: formData.mail,
        password: formData.password,
        name: formData.name,
        phone_number: formData.phone || undefined, // если телефон пустой, не отправляем его
      };
      
      // Отправка данных на сервер
      await AuthService.register(registerData);
      // Перенаправление на страницу входа после успешной регистрации
      navigate('/login', { 
        state: { message: 'Регистрация успешна. Пожалуйста, войдите в систему.' } 
      });
    } catch (err) {
      // Обработка ошибок
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('Произошла ошибка при регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Контейнер страницы
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

        {/* Карточка с формой регистрации */}
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Регистрация
          </Typography>

          {/* Отображение серверной ошибки */}
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          {/* Форма регистрации */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Поля ввода данных */}
            <TextField
              fullWidth
              label="Имя"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Email"
              name="mail"
              type="mail"
              value={formData.mail}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.mail}
              helperText={errors.mail}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Телефон"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={loading}
              placeholder="+79123456789"
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
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              required
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
            />

            {/* Кнопка отправки формы */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            {/* Ссылка на страницу входа */}
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                underline="hover"
              >
                Уже есть аккаунт? Войдите
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;