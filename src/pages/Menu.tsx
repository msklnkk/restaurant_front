import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Интерфейс для блюда
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

// Моковые данные для меню
const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Стейк Рибай',
    description: 'Сочный стейк из отборной говядины с гарниром',
    price: 2500,
    image: 'url_to_steak_image.jpg',
    category: 'Горячие блюда'
  },
  {
    id: 2,
    name: 'Цезарь с курицей',
    description: 'Классический салат с куриным филе и соусом Цезарь',
    price: 650,
    image: 'url_to_caesar_image.jpg',
    category: 'Салаты'
  },
  {
    id: 3,
    name: 'Борщ',
    description: 'Традиционный борщ со сметаной и чесночными пампушками',
    price: 450,
    image: 'url_to_borsch_image.jpg',
    category: 'Супы'
  },
];

// Получаем уникальные категории из меню
const categories: string[] = ['Все', ...Array.from(new Set(menuItems.map(item => item.category)))];

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [cartItems, setCartItems] = useState<MenuItem[]>([]);
  
    const filteredItems = selectedCategory === 'Все'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);
  
    const handleAddToCart = (item: MenuItem) => {
      setCartItems(prevItems => [...prevItems, item]);
    };
  
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
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
            <Chip
              icon={<ShoppingCartIcon />}
              label={`${cartItems.length} items | ${cartTotal} ₽`}
              color="primary"
              variant="outlined"
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
              <Card key={item.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
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