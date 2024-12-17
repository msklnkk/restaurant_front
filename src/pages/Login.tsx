import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
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

interface LocationState {
  message?: string;
}

interface LoginFormData {
  mail: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [formData, setFormData] = useState<LoginFormData>({
    mail: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>(state?.message || '');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formUrlEncoded = new URLSearchParams();
      formUrlEncoded.append('username', formData.mail);
      formUrlEncoded.append('password', formData.password);
      formUrlEncoded.append('grant_type', 'password'); // добавляем grant_type

      const response = await AuthService.login(formUrlEncoded);
      
      if (response.access_token) {
        // Сохраняем токен в localStorage или в контекст
        localStorage.setItem('access_token', response.access_token);
        navigate('/?success=true');
      } else {
        setError('Не удалось получить токен доступа');
      }
    } catch (err: any) {
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
            Вход
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

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
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
            
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