// Импорты необходимых компонентов и иконок из Material-UI
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';
import { useAuth } from '../hooks/useAuth.ts';
import { 
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { AuthService } from '../services/auth.service.ts';


// Массив данных для галереи блюд
const foodImages = [
  {
    img: '/images/veal.jpg',
    title: 'Медальоны из телятины',
  },
  {
    img: '/images/foie-gras.jpg',
    title: 'Фуа-гра',
  },
  {
    img: '/images/сhocolate.jpg',
    title: 'Шоколадный фондан',
  },
];

// Основной компонент Welcome
const Welcome: React.FC = () => {
  // Хуки для навигации и получения параметров URL
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentToken } = useAuth();

  // Состояния для управления загрузкой и отображением уведомления
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Эффект для имитации загрузки данных и обработки параметра success в URL
  useEffect(() => {
    const loadData = async () => {
      try {
        // Имитация задержки загрузки
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);

        // Проверяем URL параметр success
        const params = new URLSearchParams(location.search);
        if (params.get('success') === 'true') {
          setShowSuccess(true);
          // Очищаем URL через 3 секунды
          setTimeout(() => {
            navigate('/', { replace: true });
            setShowSuccess(false);
          }, 3000);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [location, navigate]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Сообщение об успешном входе */}
        {showSuccess && (
            <Box
                sx={{ /* стили для анимированного уведомления */ 
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 2000,
                    backgroundColor: 'success.main',
                    color: 'white',
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: 3,
                    animation: 'slideIn 0.3s ease-out',
                    '& @keyframes slideIn': {
                        from: {
                            transform: 'translateX(100%)',
                            opacity: 0,
                        },
                        to: {
                            transform: 'translateX(0)',
                            opacity: 1,
                        },
                    },
                }}
            >
                <Typography>
                    Вы успешно вошли в систему!
                </Typography>
            </Box>
        )}

        {/* AppBar с кнопками авторизации */}
        <AppBar position="static" color="transparent" elevation={0}>
          <Container>
            <Toolbar>
              
              {/* Если пользователь авторизован */}
              {getCurrentToken() ? (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    component={Link} 
                    to="/profile" 
                    variant="text" 
                    color="primary"
                    startIcon={<PersonIcon />}
                  >
                    Профиль
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => {
                      AuthService.logout();
                      window.location.reload();
                    }}
                  >
                    Выйти
                  </Button>
                </Box>
              ) : (
                // Если пользователь не авторизован
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    component={Link} 
                    to="/login" 
                    variant="outlined" 
                    color="primary"
                  >
                    Войти
                  </Button>
                  <Button 
                    component={Link} 
                    to="/register" 
                    variant="contained" 
                    color="primary"
                  >
                    Регистрация
                  </Button>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      {/* Hero секция с фоновым изображением */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          minHeight: '500px',
        }}
      >
        {/* Затемняющий оверлей */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
          }}
        />
        
        {/* Контент hero секции */}
        <Container sx={{ position: 'relative', pt: 8, pb: 6 }}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,.5)'
              }}
            >
              Добро пожаловать в L'ESSENCE
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
            >
              
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/menu')}
                sx={{ fontSize: '1.2rem', px: 4 }}
              >
                Посмотреть меню
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container>
        {/* Заголовок секции преимуществ */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Почему выбирают нас
          </Typography>
        </Box>

        {/* Карточки с преимуществами */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)'
          },
          gap: 4,
          mb: 8
        }}>
          <Card elevation={3}>
            <CardContent sx={{textAlign: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Авторская кухня
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Блюда от лучших шеф-поваров, созданные с любовью и вниманием к деталям
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Быстрая доставка
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Доставим ваш заказ в течение часа в любую точку города
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center' }}>
              <LoyaltyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Программа лояльности
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Накапливайте баллы и получайте скидки на любимые блюда
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Галерея блюд */}
        <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom textAlign="center" color="primary" sx={{ mb: 4 }}>
                Наши фирменные блюда
            </Typography>
            
            <Box sx={{ /* Маппинг массива foodImages для отображения карточек блюд */
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                justifyContent: 'center'
            }}>
                {foodImages.map((item) => (
                <Box 
                    key={item.img}
                    sx={{
                    width: 350, // фиксированная ширина карточки
                    transition: 'transform 0.2s',
                    '&:hover': {
                        transform: 'scale(1.02)',
                    }
                    }}
                >
                    <Box sx={{
                    width: '100%',
                    height: 300, // фиксированная высота для изображения
                    overflow: 'hidden',
                    borderRadius: 2,
                    mb: 2
                    }}>
                    <img
                        src={item.img}
                        alt={item.title}
                        style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s',
                        }}
                    />
                    </Box>
                    
                    <Box sx={{ textAlign: 'center' }}>
                    <Typography 
                        variant="h6" 
                        sx={{ 
                        fontWeight: 'bold',
                        mb: 1
                        }}
                    >
                        {item.title}
                    </Typography>
                    </Box>
                </Box>
                ))}
            </Box>
            </Box>
      </Container>
    </Box>
  );
};

export default Welcome;