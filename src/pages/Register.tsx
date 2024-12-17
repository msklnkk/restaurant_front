import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    mail: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState<string>('');
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    // Очищаем ошибку поля при изменении
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        mail: formData.mail,
        password: formData.password,
        name: formData.name,
        phone_number: formData.phone || undefined, // если телефон пустой, не отправляем его
      };
      
      // После успешной регистрации перенаправляем на страницу входа
      await AuthService.register(registerData);
      navigate('/login', { 
        state: { message: 'Регистрация успешна. Пожалуйста, войдите в систему.' } 
      });
    } catch (err) {
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
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container maxWidth="sm">
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

        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Регистрация
          </Typography>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

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