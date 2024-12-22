
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice.ts';
import type { RootState } from '../store/store.ts';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Dish, Price, DishWithQuantity } from '../types/database.types';
import { formatPrice } from '../utils/price.utils.ts';
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
    CircularProgress,
    Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Стилизованный компонент для отображения корзины
const CartChip = styled(Chip)(({ theme }) => ({
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    transition: 'all 0.3s ease',
}));

const Menu: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [prices, setPrices] = useState<{ [key: number]: Price }>({});
    const [selectedCategory, setSelectedCategory] = useState<string>('Все');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Загрузка данных при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dishesResponse, pricesResponse] = await Promise.all([
                    axios.get<Dish[]>('http://localhost:8020/all_dishes'),
                    axios.get<Price[]>('http://localhost:8020/all_prices')
                ]);

                setDishes(dishesResponse.data);
                
                // Создаем мапу цен для быстрого доступа
                const pricesMap = pricesResponse.data.reduce<{ [key: number]: Price }>((acc, price) => {
                    acc[price.dishid] = price;
                    return acc;
                }, {});
                setPrices(pricesMap);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Получаем уникальные категории из блюд
    const categories = ['Все', ...Array.from(new Set(dishes.map(dish => dish.type).filter(Boolean)))];

    // Фильтрация блюд по выбранной категории
    const filteredItems = selectedCategory === 'Все'
        ? dishes
        : dishes.filter(dish => dish.type === selectedCategory);

    // Обработчик добавления блюда в корзину
    const handleAddToCart = (dish: Dish) => {
        const price = prices[dish.dishid];
        if (price && price.price !== null) {
            dispatch(addToCart({
                dish,
                price,
                quantity: 1
            }));
        } else {
            // Можно показать сообщение об ошибке, что цена недоступна
            console.error(`Price not available for dish ${dish.dishid}`);
        }
    };

    // Безопасное получение цены
    const getFormattedPrice = (dishId: number): string => {
        const price = prices[dishId];
        return price && price.price !== null ? `${price.price} ₽` : 'Цена не указана';
    };

    // Обработчик перехода в корзину
    const handleCartClick = () => {
        navigate('/cart');
    };

    // Подсчет общей стоимости корзины (можно вынести в селектор Redux)
    const calculateCartTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = item.price.price ?? 0;
            return sum + (price * item.quantity);
        }, 0);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" p={3}>
                <Alert 
                    severity="error"
                    action={
                        <Button color="inherit" size="small" onClick={() => window.location.reload()}>
                            Повторить
                        </Button>
                    }
                >
                    {error}
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
            <Container>
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

                {/* Заголовок страницы */}
                <Typography variant="h3" component="h1" gutterBottom textAlign="center" color="primary">
                    Наше меню
                </Typography>

                {/* Отображение информации о корзине */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <CartChip
                        icon={<ShoppingCartIcon />}
                        label={`${cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт. | ${calculateCartTotal()} ₽`}
                        color="primary"
                        variant="outlined"
                        onClick={handleCartClick}
                        sx={{
                            '&:hover': {
                                transform: 'scale(1.05)',
                                backgroundColor: theme => theme.palette.primary.main,
                                color: 'white',
                            },
                        }}
                    />
                </Box>

                {/* Табы для фильтрации по категориям */}
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

            {/* Сетка с карточками блюд */}
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
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2">
                                {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.type}
                            </Typography>
                            <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                 {getFormattedPrice(item.dishid)}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button 
                                size="small" 
                                variant="contained" 
                                fullWidth
                                onClick={() => handleAddToCart(item)}
                                startIcon={<ShoppingCartIcon />}
                                disabled={!prices[item.dishid]?.price}
                            >
                                {(() => {
                                    const cartItem = cartItems.find(
                                        cartItem => cartItem.dish.dishid === item.dishid
                                    );
                                    return `В корзину${cartItem ? ` (${cartItem.quantity})` : ''}`;
                                })()}
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
