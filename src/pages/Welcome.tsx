import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Paper,
  ImageList,
  ImageListItem,
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
    img: 'url_to_food_image_1.jpg',
    title: 'Фирменное блюдо 1',
  },
  {
    img: 'url_to_food_image_2.jpg',
    title: 'Фирменное блюдо 2',
  },
  {
    img: 'url_to_food_image_3.jpg',
    title: 'Фирменное блюдо 3',
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
              Добро пожаловать в Restaurant Name
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ maxWidth: '600px', mx: 'auto', mb: 4 }}
            >
              Изысканная кухня для истинных ценителей
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
          <Typography variant="h6" color="text.secondary" component="p">
            Откройте для себя мир великолепных вкусов и незабываемых впечатлений
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
          <Typography variant="h4" gutterBottom textAlign="center" color="primary">
            Наши фирменные блюда
          </Typography>
          <ImageList
            sx={{ width: '100%', height: 450 }}
            variant="quilted"
            cols={4}
            rowHeight={200}
          >
            {foodImages.map((item) => (
              <ImageListItem key={item.img} cols={item.img === foodImages[0].img ? 2 : 1} rows={item.img === foodImages[0].img ? 2 : 1}>
                <img
                  src={item.img}
                  alt={item.title}
                  loading="lazy"
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>

        {/* Призыв к действию */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 2,
            mb: 8
          }}
        >
          <Typography variant="h4" gutterBottom>
            Готовы попробовать?
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            Забронируйте столик прямо сейчас и получите комплимент от шефа!
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/reservation')}
            sx={{ 
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100',
              }
            }}
          >
            Забронировать столик
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Welcome;