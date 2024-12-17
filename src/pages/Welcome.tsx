import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';
import { 
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Paper,
  CircularProgress,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

// Loading компонент
const Loading = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default'
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );

// Добавляем массив с изображениями блюд
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

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Имитация загрузки данных
  useEffect(() => {
    const loadData = async () => {
      try {
        // Имитация задержки загрузки
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Показываем Loading пока идет загрузка
  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* AppBar с кнопками авторизации */}
      <AppBar 
        position="absolute" 
        color="transparent" 
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/login')}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Войти
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              Регистрация
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: 'url(your_hero_image.jpg)',
          minHeight: '500px',
        }}
      >
        {/* Overlay */}
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
        
        {/* Hero content */}
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
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/reservation')}
                sx={{ 
                  fontSize: '1.2rem', 
                  px: 4,
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Забронировать стол
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>

      <Container>
        {/* Преимущества */}
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
            
            <Box sx={{ 
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