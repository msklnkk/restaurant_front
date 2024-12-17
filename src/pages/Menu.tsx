import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Dish } from '../types/database.types';
import {
  Container,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  Chip,
  IconButton,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface MenuDish extends Dish {
  price: number;
  image: string;
  category: string;
}

// Моковые данные для меню
const menuItems: MenuDish[] = [
  {
    dishid: 1,
    name: 'Медальоны из телятины',
    type: 'Горячие блюда',
    recipe: 'Рецепт медальонов из телятины',
    price: 1200,
    image: '/images/veal.jpg',
    category: 'Горячие блюда'
  },
  {
    dishid: 2,
    name: 'Фуа-гра',
    type: 'Закуски',
    recipe: 'Рецепт фуа-гра',
    price: 650,
    image: '/images/foie-gras.jpg',
    category: 'Закуски'
  },
  {
    dishid: 3,
    name: 'Шоколадный фондан',
    type: 'Десерты',
    recipe: 'Рецепт шоколадного фондана',
    price: 350,
    image: '/images/сhocolate.jpg',
    category: 'Десерты'
  },
];

const CartChip = styled(Chip)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  transition: 'all 0.3s ease',
}));

// Получаем уникальные категории из меню
const categories: string[] = ['Все', ...Array.from(new Set(menuItems.map(item => item.category)))];

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [cartItems, setCartItems] = useState<MenuDish[]>([]);

    const filteredItems = selectedCategory === 'Все'
      ? menuItems
      : menuItems.filter(item => item.type === selectedCategory);

    const handleAddToCart = (item: MenuDish) => {
      setCartItems(prevItems => [...prevItems, item]);
    };

    const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Добавляем обработчик для перехода в корзину
    const handleCartClick = () => {
      navigate('/cart', { state: { cartItems, cartTotal } });
    };

    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container>
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

          <Typography variant="h3" component="h1" gutterBottom textAlign="center" color="primary">
            Наше меню
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <CartChip
              icon={<ShoppingCartIcon />}
              label={`${cartItems.length} items | ${cartTotal} ₽`}
              color="primary"
              variant="outlined"
              onClick={handleCartClick}
              sx={{
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            />
          </Box>
  
          <Tabs
            value={selectedCategory}
            onChange={(_, newValue) => setSelectedCategory(newValue)}
            centered
            sx={{ mb: 4 }}
          >
            {categories.map((category) => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
  
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 4
          }}>
            {filteredItems.map((item) => (
              <Card key={item.dishid} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image || ''}
                  alt={item.name || ''}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                    {item.price} ₽
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleAddToCart(item)}
                    startIcon={<ShoppingCartIcon />}
                  >
                    В корзину
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>
    );
  };
  
  export default Menu;